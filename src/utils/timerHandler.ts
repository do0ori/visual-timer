import Swal from 'sweetalert2';
import { BaseTimerData, RoutineTimerItem } from '../store/types/timer';

type IntervalState = {
    lastUpdateTime: number;
    remainingTime: number;
};

type TimeoutId = NodeJS.Timeout | null;

interface IntervalTimer {
    id: TimeoutId;
    state: IntervalState;
}

const intervalTimers: Record<string, IntervalTimer> = {};

export const handleFinish = (
    timer: BaseTimerData | RoutineTimerItem,
    audioRef: React.RefObject<HTMLAudioElement>,
    pointColor: string,
    onSuccess: () => void
) => {
    const audio = audioRef.current;
    if (!audio) {
        console.error('Audio not initialized');
        return;
    }

    const resetAudio = () => {
        audio.pause();
        audio.currentTime = 0;
    };

    const handleOnSuccess = () => {
        resetAudio();
        onSuccess();
    };

    const getNotificationConfig = () => {
        const isLandscape = window.innerWidth > window.innerHeight;
        const leftSideWidth = isLandscape ? window.innerWidth / 2 : window.innerWidth;

        return {
            title: `📢 ${timer.title ? `"${timer.title}"` : 'Timer'} Finished!`,
            text: `Your ${timer.time} ${timer.isMinutes ? 'min' : 'sec'} timer has completed. ⏱️`,
            confirmButtonColor: pointColor,
            width: isLandscape ? `${leftSideWidth * 0.95}px` : '95%',
            position: isLandscape ? ('center-start' as const) : ('center' as const),
        };
    };

    const handleRoutineTimer = (timer: RoutineTimerItem) => {
        if (timer.interval <= 0) {
            handleOnSuccess();
            return;
        }

        const getRemainingTime = () => {
            if (intervalTimers[timer.id]) {
                const { id, state } = intervalTimers[timer.id];
                const elapsedTime = Date.now() - state.lastUpdateTime;
                if (id) clearTimeout(id);
                return Math.max(0, state.remainingTime - elapsedTime);
            } else {
                return timer.interval * 1000;
            }
        };

        const setCurrentState = (id: TimeoutId, remainingTime: number) => {
            console.log(`Remaining time: ${remainingTime}.`);
            intervalTimers[timer.id] = {
                id,
                state: {
                    lastUpdateTime: Date.now(),
                    remainingTime,
                },
            };
        };

        if (document.visibilityState == 'hidden') {
            const remainingTime = getRemainingTime();
            setCurrentState(
                setTimeout(() => {
                    if (document.visibilityState !== 'visible') {
                        handleOnSuccess();
                        delete intervalTimers[timer.id];
                        console.log('Interval finished in background.');
                    }
                }, remainingTime),
                remainingTime
            );
        } else if (document.visibilityState === 'visible') {
            const remainingTime = getRemainingTime();
            setCurrentState(null, remainingTime);

            Swal.fire({
                ...getNotificationConfig(),
                timer: remainingTime,
                timerProgressBar: true,
                showConfirmButton: false,
            }).then(() => {
                handleOnSuccess();
                delete intervalTimers[timer.id];
            });
        }
    };

    const handleBasicTimer = () => {
        if (document.visibilityState === 'visible') {
            Swal.fire(getNotificationConfig()).then((result) => {
                if (!result.isDenied) {
                    handleOnSuccess();
                }
            });
        }
    };

    if (audio.paused) {
        audio
            .play()
            .then(() => console.log('Play audio'))
            .catch((error) => console.error('Audio play error:', error));
    }

    if ('interval' in timer) {
        handleRoutineTimer(timer);
    } else {
        handleBasicTimer();
    }
};

export const handleDragEvent = (e: React.MouseEvent | React.TouchEvent, setTime: (time: number) => void) => {
    const rect = e.currentTarget.getBoundingClientRect();

    // Get the coordinates of the mouse or touch event
    const clientX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
    const clientY = 'clientY' in e ? e.clientY : e.touches[0].clientY;

    // Calculate the center coordinates of the SVG
    const x = clientX - rect.left - rect.width / 2;
    const y = clientY - rect.top - rect.height / 2;

    // Calculate the radius of the circle
    const radius = rect.width / 2;
    const distanceFromCenter = Math.sqrt(x ** 2 + y ** 2);

    // Ignore the event if the event occurs outside the circle
    if (distanceFromCenter > radius) return;

    // Calculate the angle (in degrees)
    const radians = Math.atan2(y, x);
    let degrees = radians * (180 / Math.PI) + 90;
    if (degrees < 0) degrees += 360;

    // Round the angle to the nearest 6 degrees
    const roundedDegrees = Math.round(degrees / 6) * 6;
    const newTime = roundedDegrees / 6;

    setTime(newTime);
};
