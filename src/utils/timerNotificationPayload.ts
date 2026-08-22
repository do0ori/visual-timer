export type TimerFinishedPayload = {
    timerId: string;
    title: string;
    deepLink: string;
    endAt: number;
};

export const createFinishedNotification = (payload: TimerFinishedPayload) => ({
    title: `${payload.title} complete`,
    options: {
        body: 'Your timer has finished.',
        icon: '/visual-timer/logo512.png',
        tag: payload.timerId,
        renotify: true,
        timestamp: payload.endAt,
        data: { deepLink: payload.deepLink },
    },
});
