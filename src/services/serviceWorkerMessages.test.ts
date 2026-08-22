import { postServiceWorkerMessage } from './serviceWorkerMessages';

describe('service worker messages', () => {
    it('uses the active registration when the page is not yet controlled', async () => {
        const postMessage = jest.fn();
        const serviceWorker = {
            controller: null,
            ready: Promise.resolve({ active: { postMessage } }),
        } as unknown as ServiceWorkerContainer;

        await expect(postServiceWorkerMessage({ command: 'show-running-status' }, serviceWorker)).resolves.toBe(true);
        expect(postMessage).toHaveBeenCalledWith({ command: 'show-running-status' });
    });

    it('uses the current controller without waiting for registration', async () => {
        const postMessage = jest.fn();
        const serviceWorker = {
            controller: { postMessage },
            ready: Promise.resolve({ active: null }),
        } as unknown as ServiceWorkerContainer;

        await postServiceWorkerMessage({ command: 'clear-running-status' }, serviceWorker);

        expect(postMessage).toHaveBeenCalledWith({ command: 'clear-running-status' });
    });
});
