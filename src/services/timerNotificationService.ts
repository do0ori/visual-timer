export const base64UrlToUint8Array = (value: string): Uint8Array => {
    const paddedValue = value.padEnd(value.length + ((4 - (value.length % 4)) % 4), '=');
    const binary = atob(paddedValue.replace(/-/g, '+').replace(/_/g, '/'));
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
};

export const getNotificationSupport = (navigatorValue: Navigator = navigator) => {
    return 'serviceWorker' in navigatorValue && typeof PushManager !== 'undefined' && 'Notification' in window;
};

type ScheduleCredentials = {
    scheduleId: string;
    capability: string;
};

type ScheduleRequest = {
    timerId: string;
    endAt: number;
    title: string;
    deepLink: string;
    visibleUntil: number | null;
};

const scheduleCredentialsKey = (timerId: string) => `timer-notification:${timerId}`;

export const createScheduleCredentials = (
    timerId: string,
    createToken = () => crypto.randomUUID()
): ScheduleCredentials => {
    const existing = sessionStorage.getItem(scheduleCredentialsKey(timerId));
    if (existing) return JSON.parse(existing) as ScheduleCredentials;

    const credentials = { scheduleId: timerId, capability: createToken() };
    sessionStorage.setItem(scheduleCredentialsKey(timerId), JSON.stringify(credentials));
    return credentials;
};

const getApiBaseUrl = () => {
    return typeof __TIMER_NOTIFICATION_API_URL__ === 'string' && __TIMER_NOTIFICATION_API_URL__
        ? __TIMER_NOTIFICATION_API_URL__
        : undefined;
};

const getActiveSubscription = async () => {
    if (!getNotificationSupport() || Notification.permission !== 'granted') return null;
    const registration = await navigator.serviceWorker.ready;
    return registration.pushManager.getSubscription();
};

export const scheduleTimerNotification = async (request: ScheduleRequest) => {
    const apiBaseUrl = getApiBaseUrl();
    const subscription = await getActiveSubscription();
    if (!apiBaseUrl || !subscription) return false;

    const credentials = createScheduleCredentials(request.timerId);
    const response = await fetch(`${apiBaseUrl}/v1/schedules/${encodeURIComponent(credentials.scheduleId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            capability: credentials.capability,
            endAt: request.endAt,
            title: request.title,
            deepLink: request.deepLink,
            subscription: subscription.toJSON(),
            visibleUntil: request.visibleUntil,
        }),
    });
    return response.ok;
};

export const cancelTimerNotification = async (timerId: string) => {
    const apiBaseUrl = getApiBaseUrl();
    const storedCredentials = sessionStorage.getItem(scheduleCredentialsKey(timerId));
    if (!apiBaseUrl || !storedCredentials) return;

    const credentials = JSON.parse(storedCredentials) as ScheduleCredentials;
    await fetch(`${apiBaseUrl}/v1/schedules/${encodeURIComponent(credentials.scheduleId)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ capability: credentials.capability }),
    });
    sessionStorage.removeItem(scheduleCredentialsKey(timerId));
};

export const requestPushSubscription = async (apiBaseUrl: string) => {
    if (!getNotificationSupport()) return null;

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return null;

    const registration = await navigator.serviceWorker.ready;
    const { publicKey } = await fetch(`${apiBaseUrl}/v1/push/public-key`).then((response) => response.json());
    const applicationServerKey = base64UrlToUint8Array(publicKey);
    return registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey.buffer as ArrayBuffer,
    });
};
declare const __TIMER_NOTIFICATION_API_URL__: string | undefined;
