import Swal, { SweetAlertOptions } from 'sweetalert2';
import { AudioControllers } from '../hooks/useAudio';
import { BaseTimerData, RoutineTimerItem } from '../store/types/timer';

const getNotificationConfig = (timer: BaseTimerData | RoutineTimerItem, pointColor: string) => {
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

export const handleFinish = (
    timer: BaseTimerData | RoutineTimerItem,
    audio: AudioControllers,
    pointColor: string,
    onSuccess: () => void
) => {
    const resetAudio = () => {
        audio.pause();
        audio.reset();
    };

    const handleOnSuccess = () => {
        resetAudio();
        onSuccess();
        navigator.serviceWorker.controller?.postMessage({
            command: 'clear-timer',
            timer,
        });
    };

    if ('interval' in timer && timer.interval <= 0) {
        handleOnSuccess();
        return;
    }

    resetAudio();
    audio.play();

    const swalConfig: SweetAlertOptions = {
        ...getNotificationConfig(timer, pointColor),
    };

    if ('interval' in timer) {
        swalConfig.timer = timer.interval * 1000;
        swalConfig.timerProgressBar = true;
        swalConfig.showConfirmButton = false;

        Swal.fire(swalConfig).then(() => {
            handleOnSuccess();
        });
    } else {
        Swal.fire(swalConfig).then((result) => {
            if (!result.isDenied) {
                handleOnSuccess();
            }
        });
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
