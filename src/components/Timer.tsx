import { useEffect } from 'react';
import { useTimer } from '../hooks/useTimer';
import { TimerData, TimerType, useTimerStore } from '../store/timerStore';
import { useThemeStore } from '../store/themeStore';
import { handleFinish, handleDragEvent } from '../utils/timerHandler';
import UnitToggleButton from '../components/Button/UnitToggleButton';
import TimerDisplay from '../components/Display/TimerDisplay';
import QuoteDisplay from '../components/Display/QuoteDisplay';
import ControlButtons from '../components/Button/ControlButtons';
import HamburgerMenu from './HamburgerMenu';

const Timer: React.FC<{ timer: TimerData; type: TimerType }> = ({ timer, type }) => {
    const { updateTimer } = useTimerStore();
    const { themes, globalThemeKey } = useThemeStore();

    const { time: storedTime, isMinutes: storedIsMinutes, pointColor } = timer;
    const currentTheme = themes[globalThemeKey];
    if (pointColor) currentTheme.color.point = pointColor;

    const {
        totalTime,
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
        initialTime: storedTime,
        unit: storedIsMinutes ? 'minutes' : 'seconds',
        maxTime: 60,
        onFinish: () => handleFinish(),
    });

    const progress = count / currentUnit.denominator;

    useEffect(() => {
        updateTimer(timer.id, { time: totalTime }, type);
    }, [totalTime, timer.id, updateTimer, type]);

    useEffect(() => {
        updateTimer(timer.id, { isMinutes }, type);
    }, [isMinutes, timer.id, updateTimer, type]);

    return (
        <div className="flex h-screen w-screen flex-col justify-between">
            <div className="flex w-full items-center justify-between p-5">
                <HamburgerMenu isRunning={isRunning} />
                <UnitToggleButton
                    onClick={toggleUnit}
                    isMinutes={isMinutes}
                    isRunning={isRunning}
                    currentTheme={currentTheme}
                />
            </div>

            <div className="flex grow items-center justify-center">
                <TimerDisplay
                    progress={progress}
                    currentTheme={currentTheme}
                    handleDragEvent={(e) => handleDragEvent(e, setTime)}
                >
                    <QuoteDisplay currentTheme={currentTheme} />
                </TimerDisplay>
            </div>

            <div className="mb-10 w-screen self-center">
                <ControlButtons
                    isMinutes={isMinutes}
                    isRunning={isRunning}
                    isInitialized={isInitialized}
                    currentTheme={currentTheme}
                    start={start}
                    stop={stop}
                    reset={reset}
                    add={add}
                />
            </div>
        </div>
    );
};

export default Timer;
