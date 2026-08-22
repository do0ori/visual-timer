import type { PushSubscriptionData, ScheduleInput, ScheduleState } from './schedule-state';

export type { PushSubscriptionData, ScheduleInput, ScheduleState };

export type TimerScheduleEnv = {
    VAPID_PUBLIC_KEY: string;
    VAPID_PRIVATE_KEY: string;
    VAPID_SUBJECT: string;
};

export type WorkerEnv = TimerScheduleEnv & {
    TIMER_SCHEDULE: DurableObjectNamespace;
};
