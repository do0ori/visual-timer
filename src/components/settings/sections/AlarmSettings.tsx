import { useState } from 'react';
import AlarmSelector from '../fields/AlarmSelector';
import VolumeSelector from '../fields/VolumeSelector';
import {
    enableBackgroundAlerts,
    getBackgroundAlertStatus,
    getTimerNotificationApiUrl,
    type BackgroundAlertStatus,
} from '../../../services/timerNotificationService';

const alertStatusCopy: Record<BackgroundAlertStatus, string> = {
    unsupported: 'Background alerts are not supported in this browser.',
    'needs-permission': 'Enable alerts to be notified when a timer ends in the background.',
    enabled: 'Background completion alerts are enabled.',
    denied: 'Alerts are blocked. Enable them in this browser or device settings.',
};

const AlarmSettings: React.FC = () => {
    const [alertStatus, setAlertStatus] = useState(() => getBackgroundAlertStatus());
    const [isEnabling, setIsEnabling] = useState(false);
    const isTimerNotificationApiConfigured = Boolean(getTimerNotificationApiUrl());

    const handleEnableAlerts = async () => {
        setIsEnabling(true);
        try {
            await enableBackgroundAlerts();
        } catch (error) {
            console.debug('Unable to enable background alerts:', error);
        } finally {
            setAlertStatus(getBackgroundAlertStatus());
            setIsEnabling(false);
        }
    };

    return (
        <div className="space-y-8">
            <VolumeSelector />
            <AlarmSelector />
            <section className="rounded-2xl border border-white/30 bg-white/40 p-4 shadow-soft backdrop-blur-md dark:bg-black/20">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h4 className="font-semibold">Background alerts</h4>
                        <p className="mt-1 text-xs opacity-70">{alertStatusCopy[alertStatus]}</p>
                    </div>
                    {alertStatus === 'needs-permission' && (
                        <button
                            type="button"
                            onClick={handleEnableAlerts}
                            disabled={isEnabling}
                            className="btn-tactile rounded-xl bg-zinc-900 px-3 py-2 text-xs font-semibold text-white shadow-soft transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-zinc-900"
                        >
                            {isEnabling ? 'Enabling…' : 'Enable alerts'}
                        </button>
                    )}
                </div>
                {!isTimerNotificationApiConfigured && (
                    <p className="mt-3 text-xs opacity-60">
                        Completion alerts are not configured in this development build. Running-status alerts still work
                        after notification permission is granted.
                    </p>
                )}
                <p className="mt-3 text-xs opacity-60">
                    On iPhone and iPad, install the app to the Home Screen before enabling alerts. Custom uploaded audio
                    plays only while the app is open.
                </p>
            </section>
        </div>
    );
};

export default AlarmSettings;
