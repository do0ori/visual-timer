import { createRunningStatusNotification } from '../utils/timerNotificationPayload';

type RegistrationSource = ServiceWorkerRegistration | Promise<ServiceWorkerRegistration>;

const getReadyRegistration = () => navigator.serviceWorker.ready;

export const showRunningTimerStatus = async (
    timerId: string,
    title: string,
    endAt: number,
    registrationSource: RegistrationSource = getReadyRegistration(),
    permission: NotificationPermission = Notification.permission
) => {
    if (permission !== 'granted') return false;

    const registration = await registrationSource;
    const notification = createRunningStatusNotification(timerId, title, endAt);
    await registration.showNotification(notification.title, notification.options);
    return true;
};

export const clearRunningTimerStatus = async (
    timerId: string,
    registrationSource: RegistrationSource = getReadyRegistration()
) => {
    const registration = await registrationSource;
    const notifications = await registration.getNotifications({ tag: `running-${timerId}` });
    notifications.forEach((notification) => notification.close());
};
