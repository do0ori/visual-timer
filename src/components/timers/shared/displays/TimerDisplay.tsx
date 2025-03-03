import { forwardRef, useState } from 'react';
import { Theme } from '../../../../config/theme/themes';
import { useSettingsStore } from '../../../../store/settingsStore';
import TimerTextDisplay from './TimerTextDisplay';

type TimerDisplayProps = {
    progress: number;
    currentTheme: Theme;
    handleDragEvent?: (e: React.MouseEvent | React.TouchEvent) => void;
};

const TimerDisplay = forwardRef<SVGCircleElement, TimerDisplayProps>(
    ({ progress, currentTheme, handleDragEvent }, ref) => {
        const { isClockwise } = useSettingsStore();
        const [isDragging, setIsDragging] = useState<boolean>(false);

        const baseRadius = 45;
        const progressRadius = 20;
        const fullProgress = 2 * Math.PI * progressRadius;

        const minuteMarkers = Array.from({ length: 60 }, (_, i) => i);
        const numbers = Array.from({ length: 12 }, (_, i) => ({
            value: i * 5,
            angle: i * 30,
        }));

        return (
            <div className="h-full">
                <svg className="size-full" viewBox="-50 -50 100 100">
                    {/* Timer Background */}
                    <circle
                        ref={ref}
                        cx={0}
                        cy={0}
                        r={baseRadius}
                        fill="#FBFBFB"
                        stroke="#FBFBFB"
                        strokeWidth={2}
                        onMouseDown={() => setIsDragging(true)}
                        onMouseUp={() => setIsDragging(false)}
                        onMouseMove={(e) => isDragging && handleDragEvent && handleDragEvent(e)}
                        onTouchStart={() => setIsDragging(true)}
                        onTouchEnd={() => setIsDragging(false)}
                        onTouchMove={(e) => isDragging && handleDragEvent && handleDragEvent(e)}
                        onClick={handleDragEvent}
                        style={{ pointerEvents: 'visiblePainted' }}
                        className="relative"
                    />
                    {/* Clock Ticks */}
                    {minuteMarkers.map((marker) =>
                        marker % 5 ? (
                            <line
                                key={marker}
                                x1={0}
                                y1={-45}
                                x2={0}
                                y2={-43}
                                stroke="rgba(0, 0, 0, 0.4)"
                                strokeWidth={0.3}
                                transform={`rotate(${6 * marker})`}
                                className="pointer-events-none"
                            />
                        ) : (
                            <line
                                key={marker}
                                x1={0}
                                y1={-45}
                                x2={0}
                                y2={-42}
                                stroke="rgba(0, 0, 0, 0.6)"
                                strokeWidth={0.5}
                                transform={`rotate(${(30 * marker) / 5})`}
                                className="pointer-events-none"
                            />
                        )
                    )}
                    {/* 5-Minute Interval Clock Numbers */}
                    {numbers.map(({ value, angle }) => {
                        const radians = ((isClockwise ? angle : -angle) * Math.PI) / 180;
                        const textRadius = baseRadius - 6;
                        const x = textRadius * Math.sin(radians);
                        const y = -textRadius * Math.cos(radians);
                        return (
                            <text
                                key={value}
                                x={x.toFixed(2)}
                                y={y.toFixed(2)}
                                textAnchor="middle"
                                alignmentBaseline="central"
                                dominantBaseline="central"
                                fontSize={3}
                                fontWeight={1000}
                                fill="rgba(0, 0, 0, 0.6)"
                                className="pointer-events-none"
                            >
                                {value}
                            </text>
                        );
                    })}

                    {/* Progress */}
                    <circle
                        cx={0}
                        cy={0}
                        r={20}
                        fill="none"
                        stroke={currentTheme.color.point}
                        strokeWidth="30%"
                        strokeDasharray={`${progress * fullProgress} ${fullProgress}`}
                        strokeDashoffset="0"
                        transform={`rotate(-90) ${!isClockwise ? 'scale(1, -1)' : ''}`}
                        className="pointer-events-none"
                    />
                    {/* Center Knob Shape */}
                    <g
                        transform={`rotate(${isClockwise ? 360 * progress : -360 * progress})`}
                        className="pointer-events-none"
                    >
                        <circle cx={0} cy={0} r={6} fill={currentTheme.color.sub} />
                        <rect
                            width={1.5}
                            height={4.5}
                            x={-1.5 / 2}
                            y={-5}
                            rx={1}
                            ry={1}
                            fill={currentTheme.color.sub}
                            className="brightness-90 saturate-200"
                        />
                    </g>
                </svg>
                <TimerTextDisplay
                    timerDisplayRef={ref as React.RefObject<SVGCircleElement>}
                    currentTheme={currentTheme}
                    className="font-bold"
                />
            </div>
        );
    }
);

TimerDisplay.displayName = 'TimerDisplay';

export default TimerDisplay;
