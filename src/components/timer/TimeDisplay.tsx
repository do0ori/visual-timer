import { useEffect, useState } from 'react';

interface TimeDisplayProps {
    currentTime: string;
    timerDisplayRef?: React.RefObject<SVGCircleElement>;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({ currentTime, timerDisplayRef }) => {
    if (!timerDisplayRef) {
        return <div className="text-3xl">{currentTime}</div>;
    }

    const [position, setPosition] = useState<number | null>(null);

    const updatePosition = () => {
        if (timerDisplayRef.current) {
            const rect = timerDisplayRef.current.getBoundingClientRect();
            setPosition(rect.top / 2);
        }
    };

    useEffect(() => {
        updatePosition();

        // 화면 크기 변경 또는 회전 시 위치 업데이트
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

    if (position === null) {
        return null;
    }

    return (
        <div
            className="absolute text-3xl"
            style={{
                top: `${position}px`,
            }}
        >
            {currentTime}
        </div>
    );
};

export default TimeDisplay;
