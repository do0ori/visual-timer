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

export const createRunningStatusNotification = (timerId: string, title: string, endAt: number) => ({
    title: `${title} running`,
    options: {
        body: `Ends at ${new Date(endAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`,
        icon: '/visual-timer/logo512.png',
        tag: `running-${timerId}`,
        silent: true,
        timestamp: endAt,
    },
});
