import { createFinishedNotification } from './timerNotificationPayload';

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
});
