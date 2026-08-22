import {
    base64UrlToUint8Array,
    createScheduleCredentials,
    getBackgroundAlertStatus,
    getNotificationSupport,
} from './timerNotificationService';

describe('timer notification service', () => {
    afterEach(() => {
        localStorage.clear();
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
});
