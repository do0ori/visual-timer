import { IoAdd, IoList, IoPause, IoPlay, IoRefresh, IoSettingsSharp } from 'react-icons/io5';
import { Theme } from '../../../config/theme/themes';
import Button from '../../common/Button';
import SettingsOverlay from '../overlay/SettingsOverlay';
import TimerListOverlay from '../overlay/TimerListOverlay';

type ControlButtonsProps = {
    isMinutes: boolean;
    isRunning: boolean;
    isInitialized: boolean;
    currentTheme: Theme;
    start: () => void;
    stop: () => void;
    reset: () => void;
    add: (time: number) => void;
};

const ControlButtons: React.FC<ControlButtonsProps> = ({
    isMinutes,
    isRunning,
    isInitialized,
    currentTheme,
    start,
    stop,
    reset,
    add,
}) => {
    const startWithPermissionCheck = async () => {
        if (!('Notification' in window)) {
            alert('Your browser does not support notifications.');
            return;
        }

        if (Notification.permission === 'denied') {
            alert('Notifications are blocked. Please enable notifications in your browser settings to use the timer.');
            return;
        }

        if (Notification.permission === 'default') {
            try {
                const permission = await Notification.requestPermission();
                if (permission !== 'granted') {
                    alert('You need to allow notifications to use the timer.');
                    return;
                }
            } catch (error) {
                console.error('Notification request failed:', error);
                alert('Failed to request notification permissions. Please try again.');
                return;
            }
        }

        start(); // If permission is granted, start the timer
    };

    return (
        <div className="flex justify-around">
            {isInitialized ? (
                <>
                    {/* Timer List Button */}
                    <Button onClick={() => (window.location.hash = 'timer-list')} aria-label="Timer List">
                        <IoList size={30} />
                    </Button>
                    <TimerListOverlay />
                </>
            ) : (
                /* Add Button */
                <Button onClick={() => add(isMinutes ? 1 : 10)} aria-label="Add one" currentTheme={currentTheme}>
                    <div className="flex items-center justify-center">
                        <IoAdd size={20} />
                        <span className="text-lg">{isMinutes ? 1 : 10}</span>
                    </div>
                </Button>
            )}

            {/* Stop/Start Button */}
            <Button
                onClick={isRunning ? stop : startWithPermissionCheck}
                aria-label={isRunning ? 'Pause Timer' : 'Start Timer'}
                currentTheme={currentTheme}
            >
                {isRunning ? <IoPause size={25} /> : <IoPlay size={25} />}
            </Button>

            {isInitialized ? (
                <>
                    {/* Settings Button */}
                    <Button onClick={() => (window.location.hash = 'settings')} aria-label="Settings">
                        <IoSettingsSharp size={30} />
                    </Button>
                    <SettingsOverlay />
                </>
            ) : (
                /* Reset Button */
                <Button onClick={reset} aria-label="Reset Timer" currentTheme={currentTheme}>
                    <IoRefresh size={25} className="-scale-x-100" />
                </Button>
            )}
        </div>
    );
};

export default ControlButtons;
