import { clearRunningTimerStatus, showRunningTimerStatus } from './timerStatusNotification';

describe('timer status notifications', () => {
    it('shows the running status directly through the ready service worker registration', async () => {
        const showNotification = jest.fn().mockResolvedValue(undefined);
        const registration = { showNotification } as unknown as ServiceWorkerRegistration;

        await expect(showRunningTimerStatus('timer-1', 'Focus', 10_000, registration, 'granted')).resolves.toBe(true);

        expect(showNotification).toHaveBeenCalledWith(
            'Focus running',
            expect.objectContaining({ body: expect.stringContaining('Ends at'), tag: 'running-timer-1' })
        );
    });

    it('does not show a status notification before permission is granted', async () => {
        const showNotification = jest.fn();
        const registration = { showNotification } as unknown as ServiceWorkerRegistration;

        await expect(showRunningTimerStatus('timer-1', 'Focus', 10_000, registration, 'default')).resolves.toBe(false);
        expect(showNotification).not.toHaveBeenCalled();
    });

    it('clears the matching running status notification', async () => {
        const close = jest.fn();
        const registration = {
            getNotifications: jest.fn().mockResolvedValue([{ close }]),
        } as unknown as ServiceWorkerRegistration;

        await clearRunningTimerStatus('timer-1', registration);

        expect(registration.getNotifications).toHaveBeenCalledWith({ tag: 'running-timer-1' });
        expect(close).toHaveBeenCalled();
    });
});
