import {
    base64UrlToUint8Array,
    cancelTimerNotification,
    createScheduleCredentials,
    configureTimerNotificationApiUrl,
    getBackgroundAlertStatus,
    getNotificationSupport,
    getTimerNotificationApiUrl,
    requestBackgroundAlertsIfNeeded,
} from './timerNotificationService';

describe('timer notification service', () => {
    const originalFetch = global.fetch;

    afterEach(() => {
        localStorage.clear();
        configureTimerNotificationApiUrl(undefined);
        global.fetch = originalFetch;
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

    it('cancels a background schedule and forgets its credentials', async () => {
        configureTimerNotificationApiUrl('https://worker.example');
        createScheduleCredentials('timer-1', () => 'generated-token');
        const fetchMock = jest.fn().mockResolvedValue({ ok: true } as Response);
        global.fetch = fetchMock as unknown as typeof fetch;

        await cancelTimerNotification('timer-1');

        expect(fetchMock).toHaveBeenCalledWith('https://worker.example/v1/schedules/timer-1', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ capability: 'generated-token' }),
        });
        expect(localStorage.getItem('timer-notification:timer-1')).toBeNull();
    });

    it('keeps credentials and stays quiet when cancelling fails offline', async () => {
        configureTimerNotificationApiUrl('https://worker.example');
        createScheduleCredentials('timer-1', () => 'generated-token');
        const fetchMock = jest.fn().mockRejectedValue(new TypeError('Failed to fetch'));
        global.fetch = fetchMock as unknown as typeof fetch;

        await expect(cancelTimerNotification('timer-1')).resolves.toBeUndefined();

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(localStorage.getItem('timer-notification:timer-1')).toContain('generated-token');
    });
});
