export const base64UrlToUint8Array = (value: string): Uint8Array => {
    const paddedValue = value.padEnd(value.length + ((4 - (value.length % 4)) % 4), '=');
    const binary = atob(paddedValue.replace(/-/g, '+').replace(/_/g, '/'));
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
};

export const getNotificationSupport = (navigatorValue: Navigator = navigator) => {
    return 'serviceWorker' in navigatorValue && typeof PushManager !== 'undefined' && 'Notification' in window;
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
