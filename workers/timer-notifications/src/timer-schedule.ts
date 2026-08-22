import webpush from 'web-push';
import { DurableObject } from 'cloudflare:workers';
import { createScheduleState, shouldDeferAlarm } from './schedule-state';
import type { ScheduleState, TimerScheduleEnv } from './types';

const SCHEDULE_STORAGE_KEY = 'schedule';
const VISIBLE_GRACE_MS = 5_000;

const json = (body: unknown, status = 200) => {
    return Response.json(body, { status });
};

export class TimerSchedule extends DurableObject<TimerScheduleEnv> {
    async fetch(request: Request) {
        if (request.method === 'PUT') {
            return this.replace(request);
        }

        if (request.method === 'PATCH') {
            return this.refreshVisibleLease(request);
        }

        if (request.method === 'DELETE') {
            return this.cancel(request);
        }

        return json({ error: 'Method not allowed' }, 405);
    }

    async alarm() {
        const schedule = await this.ctx.storage.get<ScheduleState>(SCHEDULE_STORAGE_KEY);
        if (!schedule || schedule.status !== 'scheduled') return;

        if (shouldDeferAlarm(schedule)) {
            await this.ctx.storage.setAlarm(Date.now() + VISIBLE_GRACE_MS);
            return;
        }

        await this.ctx.storage.put(SCHEDULE_STORAGE_KEY, { ...schedule, status: 'delivered' });

        webpush.setVapidDetails(this.env.VAPID_SUBJECT, this.env.VAPID_PUBLIC_KEY, this.env.VAPID_PRIVATE_KEY);

        try {
            await webpush.sendNotification(
                schedule.subscription,
                JSON.stringify({
                    type: 'timer-finished',
                    timerId: this.ctx.id.toString(),
                    title: schedule.title,
                    deepLink: schedule.deepLink,
                    endAt: schedule.endAt,
                }),
                { TTL: 60, urgency: 'high' }
            );
        } catch (error) {
            const statusCode = error instanceof webpush.WebPushError ? error.statusCode : undefined;
            if (statusCode === 404 || statusCode === 410) {
                await this.ctx.storage.delete(SCHEDULE_STORAGE_KEY);
                return;
            }

            throw error;
        }
    }

    private async replace(request: Request) {
        try {
            const input = await request.json<Parameters<typeof createScheduleState>[0]>();
            const schedule = createScheduleState(input);
            await this.ctx.storage.put(SCHEDULE_STORAGE_KEY, schedule);
            await this.ctx.storage.setAlarm(schedule.endAt);
            return json({ status: schedule.status, endAt: schedule.endAt }, 201);
        } catch (error) {
            return json({ error: error instanceof Error ? error.message : 'Invalid schedule' }, 400);
        }
    }

    private async refreshVisibleLease(request: Request) {
        const schedule = await this.ctx.storage.get<ScheduleState>(SCHEDULE_STORAGE_KEY);
        if (!schedule || schedule.status !== 'scheduled') {
            return json({ error: 'Schedule not found' }, 404);
        }

        const { capability, visibleUntil } = await request.json<{ capability?: string; visibleUntil?: number }>();
        if (capability !== schedule.capability || !Number.isFinite(visibleUntil)) {
            return json({ error: 'Unauthorized' }, 401);
        }

        await this.ctx.storage.put(SCHEDULE_STORAGE_KEY, { ...schedule, visibleUntil: Number(visibleUntil) });
        return json({ status: 'scheduled', visibleUntil });
    }

    private async cancel(request: Request) {
        const schedule = await this.ctx.storage.get<ScheduleState>(SCHEDULE_STORAGE_KEY);
        if (!schedule) return new Response(null, { status: 204 });

        const { capability } = await request.json<{ capability?: string }>();
        if (capability !== schedule.capability) {
            return json({ error: 'Unauthorized' }, 401);
        }

        await this.ctx.storage.deleteAll();
        await this.ctx.storage.deleteAlarm();
        return new Response(null, { status: 204 });
    }
}
