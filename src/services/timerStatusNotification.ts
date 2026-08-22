import { postServiceWorkerMessage } from './serviceWorkerMessages';

type PostMessage = (message: Record<string, unknown>) => Promise<boolean>;

const TEST_TIMER_ID = 'background-alert-test';

export const showRunningTimerStatus = async (
    timerId: string,
    title: string,
    endAt: number,
    postMessage: PostMessage = postServiceWorkerMessage,
    permission: NotificationPermission = Notification.permission
) => {
    if (permission !== 'granted') return false;

    return postMessage({ command: 'show-running-status', timerId, title, endAt });
};

export const clearRunningTimerStatus = async (timerId: string, postMessage: PostMessage = postServiceWorkerMessage) => {
    return postMessage({ command: 'clear-running-status', timerId });
};

export const showTestRunningTimerStatus = (
    postMessage: PostMessage = postServiceWorkerMessage,
    permission: NotificationPermission = Notification.permission,
    now = Date.now()
) => showRunningTimerStatus(TEST_TIMER_ID, 'Mellow Visual Timer', now + 10 * 60 * 1_000, postMessage, permission);
