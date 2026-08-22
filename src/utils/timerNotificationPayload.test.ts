import { createFinishedNotification, createRunningStatusNotification } from './timerNotificationPayload';

describe('timer notification payload', () => {
    it('creates a tagged completion notification', () => {
        expect(
            createFinishedNotification({
                timerId: 'timer-1',
                title: 'Focus',
                deepLink: '/visual-timer/',
                endAt: 1000,
            })
        ).toMatchObject({ title: 'Focus complete', options: { tag: 'timer-1', data: { deepLink: '/visual-timer/' } } });
    });

    it('creates one silent running-status notification with an end time', () => {
        expect(createRunningStatusNotification('timer-1', 'Focus', Date.UTC(2026, 7, 22, 15, 42))).toMatchObject({
            title: 'Focus running',
            options: { tag: 'running-timer-1', silent: true },
        });
    });
});
