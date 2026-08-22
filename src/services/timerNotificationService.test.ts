import {
    base64UrlToUint8Array,
    createScheduleCredentials,
    configureTimerNotificationApiUrl,
    getBackgroundAlertStatus,
    getNotificationSupport,
    getTimerNotificationApiUrl,
    requestBackgroundAlertsIfNeeded,
} from './timerNotificationService';

describe('timer notification service', () => {
    afterEach(() => {
        localStorage.clear();
        configureTimerNotificationApiUrl(undefined);
    });

    it('converts a URL-safe VAPID key into subscription bytes', () => {
        expect(Array.from(base64UrlToUint8Array('AQI'))).toEqual([1, 2]);
    });

    it('reports unavailable when Push APIs are missing', () => {
        expect(getNotificationSupport({} as Navigator)).toBe(false);
    });

    it('creates persistent credentials for one timer schedule', () => {
        const credentials = createScheduleCredentials('timer-1', () => 'generated-token');

        expect(credentials).toEqual({ scheduleId: 'timer-1', capability: 'generated-token' });
        expect(localStorage.getItem('timer-notification:timer-1')).toContain('generated-token');
    });

    it('reports when a supported browser still needs notification permission', () => {
        expect(getBackgroundAlertStatus(true, 'default')).toBe('needs-permission');
        expect(getBackgroundAlertStatus(true, 'granted')).toBe('enabled');
        expect(getBackgroundAlertStatus(true, 'denied')).toBe('denied');
    });

    it('recognizes an unconfigured timer notification API', () => {
        expect(getTimerNotificationApiUrl('')).toBeUndefined();
        expect(getTimerNotificationApiUrl('https://worker.example')).toBe('https://worker.example');
    });

    it('uses the Vite-provided API URL configured during app startup', () => {
        configureTimerNotificationApiUrl('https://worker.example');

        expect(getTimerNotificationApiUrl()).toBe('https://worker.example');
    });

    it('requests alerts when permission has not been decided', async () => {
        const requestAlerts = jest.fn().mockResolvedValue('subscribed');

        await expect(requestBackgroundAlertsIfNeeded('needs-permission', requestAlerts)).resolves.toBe('subscribed');
        await expect(requestBackgroundAlertsIfNeeded('denied', requestAlerts)).resolves.toBeNull();

        expect(requestAlerts).toHaveBeenCalledTimes(1);
    });

    it('subscribes when notification permission was granted before Push was enabled', async () => {
        const requestAlerts = jest.fn().mockResolvedValue('subscribed');
        const getSubscription = jest.fn().mockResolvedValue(null);

        await expect(requestBackgroundAlertsIfNeeded('enabled', requestAlerts, getSubscription)).resolves.toBe(
            'subscribed'
        );

        expect(getSubscription).toHaveBeenCalledTimes(1);
        expect(requestAlerts).toHaveBeenCalledTimes(1);
    });

    it('does not replace an existing Push subscription', async () => {
        const requestAlerts = jest.fn();
        const getSubscription = jest.fn().mockResolvedValue({} as PushSubscription);

        await expect(requestBackgroundAlertsIfNeeded('enabled', requestAlerts, getSubscription)).resolves.toBeNull();

        expect(requestAlerts).not.toHaveBeenCalled();
    });
});
