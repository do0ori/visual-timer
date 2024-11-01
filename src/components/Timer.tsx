import { useEffect } from 'react';
import { useTimer } from '../hooks/useTimer';
import { MainTimerData, useMainTimerStore } from '../store/mainTimerStore';
import { useThemeStore } from '../store/themeStore';
import { handleFinish, handleDragEvent } from '../utils/timerHandler';
import UnitToggleButton from '../components/Button/UnitToggleButton';
import TimerDisplay from '../components/Display/TimerDisplay';
import ControlButtons from '../components/Button/ControlButtons';
import { deepCopy } from '../utils/deepCopy';

const Timer: React.FC<{ timer: MainTimerData }> = ({ timer }) => {
    const { selectTimer, updateTimer } = useMainTimerStore();
    const { themes, globalThemeKey } = useThemeStore();

    const { time: storedTime, isMinutes: storedIsMinutes, pointColor, title } = timer;
    const currentTheme = deepCopy(themes[globalThemeKey]);
    if (pointColor) currentTheme.color.point = pointColor;
    if (title) currentTheme.text = title;

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
        console.log('timer 내부', isRunning);
        updateTimer(timer.id, { isRunning });
    }, [isRunning, updateTimer]);

    useEffect(() => {
        if (timer.id === 'default') {
            updateTimer(timer.id, { time: totalTime });
        }
    }, [totalTime, updateTimer]);

    useEffect(() => {
        if (timer.id === 'default') {
            updateTimer(timer.id, { isMinutes });
        }
    }, [isMinutes, updateTimer]);

    const handleDragOrClick = (e: React.MouseEvent | React.TouchEvent) => {
        if (timer.id === 'default') {
            handleDragEvent(e, setTime);
        } else {
            selectTimer('default');
        }
    };

    return (
        <div className="flex w-full flex-col justify-between">
            <div className="flex self-end pr-5">
                <UnitToggleButton
                    onClick={toggleUnit}
                    isMinutes={isMinutes}
                    isRunning={timer.id === 'default' ? isRunning : true}
                    currentTheme={currentTheme}
                />
            </div>

            <div className="flex grow items-center justify-center">
                <TimerDisplay progress={progress} currentTheme={currentTheme} handleDragEvent={handleDragOrClick} />
            </div>

            <div className="w-full self-center">
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
