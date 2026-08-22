import { base64UrlToUint8Array, getNotificationSupport } from './timerNotificationService';

describe('timer notification service', () => {
    it('converts a URL-safe VAPID key into subscription bytes', () => {
        expect(Array.from(base64UrlToUint8Array('AQI'))).toEqual([1, 2]);
    });

    it('reports unavailable when Push APIs are missing', () => {
        expect(getNotificationSupport({} as Navigator)).toBe(false);
    });
});
