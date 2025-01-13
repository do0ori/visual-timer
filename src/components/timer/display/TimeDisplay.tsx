import { useEffect, useState } from 'react';

interface TimeDisplayProps {
    currentTime: string;
    className?: string;
    timerDisplayRef?: React.RefObject<SVGCircleElement>;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({ currentTime, className, timerDisplayRef }) => {
    if (!timerDisplayRef) {
        return <div className={`text-3xl ${className || ''}`}>{currentTime}</div>;
    }

    const [isCentered, setIsCentered] = useState(false);
    const [position, setPosition] = useState<number | null>(null);

    const checkPosition = () => {
        if (timerDisplayRef.current) {
            const rect = timerDisplayRef.current.getBoundingClientRect();
            const windowCenter = window.innerWidth / 2;
            const timerCenter = rect.left + rect.width / 2;

            setIsCentered(Math.abs(windowCenter - timerCenter) < 1);
            setPosition(rect.top / 2 - 40);
        }
    };

    useEffect(() => {
        checkPosition();
        window.addEventListener('resize', checkPosition);
        window.addEventListener('orientationchange', checkPosition);

        return () => {
            window.removeEventListener('resize', checkPosition);
            window.removeEventListener('orientationchange', checkPosition);
        };
    }, [timerDisplayRef]);

    if (!isCentered || position === null) {
        return <div className={`text-3xl ${className || ''}`}>{currentTime}</div>;
    }

    return (
        <div
            className={`text-3xl ${className || ''}`}
            style={{
                marginTop: `${position}px`,
            }}
        >
            {currentTime}
        </div>
    );
};

export default TimeDisplay;
