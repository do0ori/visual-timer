import { clearRunningTimerStatus, showRunningTimerStatus, showTestRunningTimerStatus } from './timerStatusNotification';

describe('timer status notifications', () => {
    it('asks the service worker to show the running status', async () => {
        const postMessage = jest.fn().mockResolvedValue(true);

        await expect(showRunningTimerStatus('timer-1', 'Focus', 10_000, postMessage, 'granted')).resolves.toBe(true);

        expect(postMessage).toHaveBeenCalledWith({
            command: 'show-running-status',
            timerId: 'timer-1',
            title: 'Focus',
            endAt: 10_000,
        });
    });

    it('does not show a status notification before permission is granted', async () => {
        const postMessage = jest.fn();

        await expect(showRunningTimerStatus('timer-1', 'Focus', 10_000, postMessage, 'default')).resolves.toBe(false);
        expect(postMessage).not.toHaveBeenCalled();
    });

    it('clears the matching running status notification', async () => {
        const postMessage = jest.fn().mockResolvedValue(true);

        await clearRunningTimerStatus('timer-1', postMessage);

        expect(postMessage).toHaveBeenCalledWith({ command: 'clear-running-status', timerId: 'timer-1' });
    });

    it('uses the same service worker path for a test alert', async () => {
        const postMessage = jest.fn().mockResolvedValue(true);

        await expect(showTestRunningTimerStatus(postMessage, 'granted', 10_000)).resolves.toBe(true);

        expect(postMessage).toHaveBeenCalledWith(
            expect.objectContaining({ command: 'show-running-status', timerId: 'background-alert-test' })
        );
    });
});
