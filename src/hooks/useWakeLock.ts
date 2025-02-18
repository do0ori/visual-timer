import { useEffect, useRef } from 'react';

export const useWakeLock = (enabled = true) => {
    const wakeLockRef = useRef<WakeLockSentinel | null>(null);

    const requestWakeLock = async () => {
        if (document.visibilityState !== 'visible') {
            console.debug('Document is not visible; skipping wake lock request.');
            return;
        }

        if (!wakeLockRef.current) {
            try {
                if ('wakeLock' in navigator) {
                    wakeLockRef.current = await navigator.wakeLock.request('screen');
                    console.debug('Wake Lock activated');
                    wakeLockRef.current.addEventListener('release', () => {
                        console.debug('Wake Lock released');
                    });
                }
            } catch (err) {
                console.error('Failed to activate Wake Lock:', err);
            }
        }
    };

    const releaseWakeLock = async () => {
        if (wakeLockRef.current) {
            try {
                await wakeLockRef.current.release();
            } catch (err) {
                console.error('Failed to release Wake Lock:', err);
            } finally {
                wakeLockRef.current = null;
            }
        }
    };

    useEffect(() => {
        const manageWakeLock = async () => {
            console.debug('manageWakeLock');
            if (enabled) {
                if (document.visibilityState === 'visible' && wakeLockRef.current === null) {
                    await requestWakeLock();
                }
            } else {
                await releaseWakeLock();
            }
        };

        const handleVisibilityChange = async () => {
            console.debug('handleVisibilityChange');
            if (document.visibilityState === 'visible' && enabled) {
                await manageWakeLock();
            } else if (document.visibilityState !== 'visible') {
                await releaseWakeLock();
            }
        };

        // Initial setup
        if (document.visibilityState === 'visible') {
            manageWakeLock();
        } else {
            console.debug('Document is hidden on mount. Not requesting wake lock.');
        }

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            releaseWakeLock(); // Cleanup Wake Lock on unmount
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [enabled]);
};
