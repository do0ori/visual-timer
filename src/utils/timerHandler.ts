import { isMobile } from 'react-device-detect';
import alarmSound from '../assets/alarmSound.mp3';

export const handleFinish = () => {
    const audio = new Audio(alarmSound);
    audio.loop = true;

    // Play audio
    audio.play().catch((error) => console.error('Audio play error:', error));

    // Send notification
    if ('Notification' in window && !isMobile) {
        const notification = new Notification('📢 Timer Finished!', {
            body: 'Your timer has completed. ⏱️',
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
        alert('📢 Timer Finished! Your timer has completed. ⏱️');
        audio.pause(); // Stop the audio
        audio.currentTime = 0; // Reset audio
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
