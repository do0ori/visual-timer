import alarmSound from '../assets/alarmSound.mp3';

export const handleFinish = () => {
    const audio = new Audio(alarmSound);
    audio
        .play()
        .then(() => {
            setTimeout(() => {
                window.alert('Timer finished!');
                audio.pause();
                audio.currentTime = 0;
            }, 0);
        })
        .catch((error) => {
            console.error('Failed to play the sound:', error);
        });
};

export const handleDragEvent = (e: React.MouseEvent | React.TouchEvent, setTime: (time: number) => void) => {
    const isTouchEvent = e.type.startsWith('touch');
    const clientX = isTouchEvent ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = isTouchEvent ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;

    const rect = (e.currentTarget as Element).getBoundingClientRect();
    const x = clientX - rect.left - rect.width / 2;
    const y = clientY - rect.top - rect.height / 2;
    const radians = Math.atan2(y, x);
    let degrees = radians * (180 / Math.PI) + 90;
    if (degrees < 0) degrees += 360;

    const roundedDegrees = Math.round(degrees / 6) * 6;
    const newTime = roundedDegrees / 6;
    setTime(newTime);
};
