import Swal from 'sweetalert2';
import { BaseTimerData, RoutineTimerItem } from '../store/types/timer';

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

    // Play audio
    audio.play().catch((error) => console.error('Audio play error:', error));

    const isLandscape = window.innerWidth > window.innerHeight;
    const leftSideWidth = isLandscape ? window.innerWidth / 2 : window.innerWidth;

    // Configure notification
    const swalConfig = {
        title: `📢 ${timer.title ? `"${timer.title}"` : 'Timer'} Finished!`,
        text: `Your ${timer.time} ${timer.isMinutes ? 'min' : 'sec'} timer has completed. ⏱️`,
        confirmButtonColor: pointColor,
        width: isLandscape ? `${leftSideWidth * 0.95}px` : '95%',
        position: 'center' as const,
        customClass: {
            container: isLandscape ? 'landscape-alert' : '',
        },
    };

    if ('interval' in timer) {
        if (timer.interval > 0) {
            // With interval > 0: auto-close after interval
            Swal.fire({
                ...swalConfig,
                timer: timer.interval * 1000,
                timerProgressBar: true,
                showConfirmButton: false,
            }).then(() => {
                audio.pause();
                audio.currentTime = 0;
                onSuccess();
            });
        } else {
            // With interval = 0: direct success without notification
            audio.pause();
            audio.currentTime = 0;
            onSuccess();
        }
    } else {
        // Without interval: show notification with confirm button
        Swal.fire(swalConfig).then((result) => {
            if (!result.isDenied) {
                audio.pause();
                audio.currentTime = 0;
                onSuccess();
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
