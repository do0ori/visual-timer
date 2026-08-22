/** @jest-environment node */

import { createScheduleState, shouldDeferAlarm } from './schedule-state';

describe('timer schedule state', () => {
    const now = Date.UTC(2026, 7, 22, 12, 0, 0);

    it('accepts an upcoming schedule and preserves its delivery details', () => {
        const schedule = createScheduleState(
            {
                capability: 'capability-token',
                endAt: now + 60_000,
                title: 'Focus',
                deepLink: '/visual-timer/',
                subscription: {
                    endpoint: 'https://push.example.test/subscription',
                    keys: { auth: 'auth-key', p256dh: 'public-key' },
                },
                visibleUntil: now + 15_000,
            },
            now
        );

        expect(schedule.status).toBe('scheduled');
        expect(schedule.endAt).toBe(now + 60_000);
        expect(shouldDeferAlarm(schedule, now + 10_000)).toBe(true);
    });

    it('rejects schedules outside the supported time window', () => {
        expect(() =>
            createScheduleState(
                {
                    capability: 'capability-token',
                    endAt: now - 1,
                    title: 'Focus',
                    deepLink: '/visual-timer/',
                    subscription: {
                        endpoint: 'https://push.example.test/subscription',
                        keys: { auth: 'auth-key', p256dh: 'public-key' },
                    },
                    visibleUntil: null,
                },
                now
            )
        ).toThrow('endAt must be in the future');
    });
});
