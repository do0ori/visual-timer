import { useState } from "react";
import { themes } from "../config/timer/themes";
import { useTimer } from "../hooks/useTimer";
import {
    IoAdd,
    IoPlay,
    IoPause,
    IoRefresh,
    IoSwapVertical,
} from "react-icons/io5";

const Timer: React.FC = () => {
    const {
        count,
        currentUnit,
        isRunning,
        isMinutes,
        isInitialized,
        start,
        stop,
        reset,
        toggleUnit,
        setTime,
        add,
    } = useTimer({
        initialTime: 10,
        unit: "minutes",
        onFinish: () => {
            window.alert("Finish!");
        },
    });

    const [theme, setTheme] = useState<string>("classic");
    const currentTheme = themes[theme];

    const baseRadius = 45;
    const progressRadius = 20;
    const fullProgress = 2 * Math.PI * progressRadius;

    const progress = count / currentUnit.denominator;

    const minuteMarkers = Array.from({ length: 60 }, (_, i) => i);
    const numbers = Array.from({ length: 12 }, (_, i) => ({
        value: i * 5,
        angle: i * 30,
    }));

    const [isDragging, setIsDragging] = useState<boolean>(false);

    const handleMouseEvent = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const radians = Math.atan2(y, x);
        let degrees = radians * (180 / Math.PI) + 90;
        if (degrees < 0) degrees += 360;

        const roundedDegrees = Math.round(degrees / 6) * 6;
        const newTime = roundedDegrees / 6;
        setTime(newTime);
    };

    return (
        <div
            className={`flex flex-col items-center justify-center min-h-screen ${currentTheme.bg.main}`}
        >
            {/* Unit Toggle Button */}
            <div className="mt-4 flex space-x-4">
                <button
                    onClick={toggleUnit}
                    className={`text-white p-2 w-20 marker:rounded-full ${
                        currentTheme.bg.point
                    } border-2 border-white active:translate-y-1 ${
                        isRunning ? "invisible" : "visible"
                    }`}
                >
                    <div className={"flex items-center justify-center"}>
                        <IoSwapVertical size={20} />
                        <span className={"ml-1 text-lg"}>
                            {isMinutes ? "min" : "sec"}
                        </span>
                    </div>
                </button>
            </div>

            {/* Timer */}
            <div
                className="relative w-96 h-96"
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onMouseMove={(e) => isDragging && handleMouseEvent(e)}
                onClick={handleMouseEvent}
            >
                <svg className="w-full h-full" viewBox="-50 -50 100 100">
                    {/* Timer Background */}
                    <circle
                        cx={0}
                        cy={0}
                        r={baseRadius}
                        fill="#FBFBFB"
                        stroke="#FBFBFB"
                        strokeWidth={2}
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
                                stroke={currentTheme.color.point}
                                strokeWidth={0.3}
                                transform={`rotate(${6 * marker})`}
                            />
                        ) : (
                            <line
                                key={marker}
                                x1={0}
                                y1={-45}
                                x2={0}
                                y2={-42}
                                stroke={currentTheme.color.point}
                                strokeWidth={0.5}
                                transform={`rotate(${(30 * marker) / 5})`}
                            />
                        )
                    )}
                    {/* 5-Minute Interval Clock Numbers */}
                    {numbers.map(({ value, angle }) => {
                        const radians = (angle * Math.PI) / 180;
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
                                fill={currentTheme.color.point}
                                className={"select-none"}
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
                        strokeDasharray={`${
                            progress * fullProgress
                        } ${fullProgress}`}
                        strokeDashoffset="0"
                        transform="rotate(-90)"
                    />
                    {/* Center Knob Shape */}
                    <g transform={`rotate(${360 * progress})`}>
                        <circle
                            cx={0}
                            cy={0}
                            r={6}
                            fill={currentTheme.color.sub}
                        />
                        <rect
                            width={1.5}
                            height={4.5}
                            x={-1.5 / 2}
                            y={-5}
                            rx={1}
                            ry={1}
                            fill={currentTheme.color.sub}
                            className="filter brightness-90 saturate-200"
                        />
                    </g>
                </svg>

                {/* Quote */}
                <div className="absolute bottom-24 left-0 w-full text-center">
                    <p
                        className={`text-sm font-bold ${currentTheme.text.point}`}
                    >
                        {currentTheme.quote.split("\n").map((line, index) => (
                            <span key={index} className={"select-none"}>
                                {line}
                                <br />
                            </span>
                        ))}
                    </p>
                </div>
            </div>

            <div className="mt-4 flex space-x-4">
                {/* Add 1 Button */}
                <button
                    onClick={() => add(isMinutes ? 1 : 10)}
                    aria-label="Add one"
                    className={`text-white p-2 w-16 h-16 rounded-full flex items-center justify-center ${
                        currentTheme.bg.point
                    } border-2 border-white active:translate-y-1 ${
                        isInitialized ? "invisible" : "visible"
                    }`}
                >
                    <div className={"flex items-center justify-center"}>
                        <IoAdd size={20} />
                        <span className={"text-lg"}>{isMinutes ? 1 : 10}</span>
                    </div>
                </button>

                {/* Stop/Start Button */}
                <button
                    onClick={isRunning ? stop : start}
                    aria-label={isRunning ? "Pause Timer" : "Start Timer"}
                    className={`text-white p-2 w-16 h-16 rounded-full flex items-center justify-center ${currentTheme.bg.point} border-2 border-white active:translate-y-1`}
                >
                    {isRunning ? <IoPause size={25} /> : <IoPlay size={25} />}
                </button>

                {/* Reset Button */}
                <button
                    onClick={reset}
                    aria-label="Reset Timer"
                    className={`text-white p-2 w-16 h-16 rounded-full flex items-center justify-center ${
                        currentTheme.bg.point
                    } border-2 border-white active:translate-y-1 ${
                        isInitialized ? "invisible" : "visible"
                    }`}
                >
                    <IoRefresh size={25} className="transform scale-x-[-1]" />
                </button>
            </div>

            {/* Theme Switch Button */}
            <div className="mt-6 flex space-x-4">
                {Object.entries(themes).map(([key, theme]) => (
                    <button
                        key={key}
                        onClick={() => setTheme(key)}
                        className={`text-black p-2 w-20 ${theme.bg.main} rounded-full border-2 border-white shadow-[4px_4px_10px_rgba(0,0,0,0.2)]`}
                    >
                        {theme.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Timer;
