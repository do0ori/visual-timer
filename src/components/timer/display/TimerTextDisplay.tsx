import { useEffect, useState } from 'react';
import { Theme } from '../../../config/theme/themes';

interface TimerTextDisplayProps {
    className?: string;
    currentTheme: Theme;
    timerDisplayRef: React.RefObject<SVGCircleElement>;
}

const TimerTextDisplay: React.FC<TimerTextDisplayProps> = ({ className, currentTheme, timerDisplayRef }) => {
    const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

    const updatePosition = () => {
        if (timerDisplayRef.current) {
            const rect = timerDisplayRef.current.getBoundingClientRect();
            setPosition({
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height * (3 / 4),
            });
        }
    };

    useEffect(() => {
        updatePosition();

        // Update position on resize or orientation change
        const handleResizeOrOrientationChange = () => {
            updatePosition();
        };

        window.addEventListener('resize', handleResizeOrOrientationChange);
        window.addEventListener('orientationchange', handleResizeOrOrientationChange);

        return () => {
            window.removeEventListener('resize', handleResizeOrOrientationChange);
            window.removeEventListener('orientationchange', handleResizeOrOrientationChange);
        };
    }, [timerDisplayRef]);

    if (!position) return null;

    return (
        <div
            className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-center brightness-150 ${className || ''}`}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                color: currentTheme.color.point,
            }}
        >
            {currentTheme.text.split('\n').map((line, index) => (
                <div key={index}>{line}</div>
            ))}
        </div>
    );
};

export default TimerTextDisplay;
