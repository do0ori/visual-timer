export type PushSubscriptionData = {
    endpoint: string;
    keys: {
        auth: string;
        p256dh: string;
    };
};

export type ScheduleInput = {
    capability: string;
    endAt: number;
    title: string;
    deepLink: string;
    subscription: PushSubscriptionData;
    visibleUntil: number | null;
};

export type ScheduleState = ScheduleInput & {
    status: 'scheduled' | 'delivered' | 'cancelled';
};

const MAX_SCHEDULE_DELAY_MS = 24 * 60 * 60 * 1000;

export const createScheduleState = (input: ScheduleInput, now = Date.now()): ScheduleState => {
    if (input.endAt <= now) {
        throw new Error('endAt must be in the future');
    }

    if (input.endAt - now > MAX_SCHEDULE_DELAY_MS) {
        throw new Error('endAt must be within 24 hours');
    }

    if (!input.capability || !input.title || !input.deepLink || !input.subscription.endpoint) {
        throw new Error('schedule is missing required fields');
    }

    return { ...input, status: 'scheduled' };
};

export const shouldDeferAlarm = (schedule: ScheduleState, now = Date.now()) => {
    return schedule.status === 'scheduled' && (schedule.visibleUntil ?? 0) > now;
};
