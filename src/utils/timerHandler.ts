import { isMobile } from 'react-device-detect';
import Swal from 'sweetalert2';
import alarmSound from '../assets/alarmSound.mp3';
import { MainTimerData } from '../store/mainTimerStore';

export const handleFinish = (timer: MainTimerData, volume: number, pointColor: string) => {
    const audio = new Audio(alarmSound);
    audio.loop = true;
    audio.volume = volume;

    // Play audio
    audio.play().catch((error) => console.error('Audio play error:', error));

    const title = `📢 ${timer.title ? `"${timer.title}"` : 'Timer'} Finished!`;
    const body = `Your ${timer.time} ${timer.isMinutes ? 'min' : 'sec'} timer has completed. ⏱️`;

    // Send notification
    if ('Notification' in window && !isMobile) {
        const notification = new Notification(title, {
            body,
            icon: 'logo500.png',
            tag: 'timer-finished', // Unique identifier for the notification
            requireInteraction: true, // Keep notification until user interacts
        });

        // Handle notification event
        notification.onclick = () => notification.close();
        notification.onclose = () => {
            if (document.visibilityState !== 'visible') {
                window.focus(); // Focus the app
            }
            audio.pause(); // Stop the audio
            audio.currentTime = 0; // Reset audio
        };
    } else {
        // Fallback to alert
        // TODO: sweetalert2의 A message with auto close timer를 참고해 설정 페이지에서 정한 시간만큼 울리도록 하는 기능도 추가
        Swal.fire({
            title,
            text: body,
            confirmButtonColor: pointColor,
        }).then((result) => {
            if (!result.isDenied) {
                audio.pause(); // Stop the audio
                audio.currentTime = 0; // Reset audio
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
