import { useCallback, useEffect, useRef } from 'react';
import { useTimer } from '../../hooks/useTimer';
import { MainTimerData, useMainTimerStore } from '../../store/mainTimerStore';
import { useThemeStore } from '../../store/themeStore';
import { useSettingsStore } from '../../store/settingsStore';
import { handleFinish, handleDragEvent } from '../../utils/timerHandler';
import { deepCopy } from '../../utils/deepCopy';
import UnitToggleButton from './UnitToggleButton';
import TimeDisplay from './TimeDisplay';
import TimerDisplay from './TimerDisplay';
import ControlButtons from './ControlButtons';
import { useAudio } from '../../hooks/useAudio';

const Timer: React.FC<{ timer: MainTimerData }> = ({ timer }) => {
    const { selectTimer, updateTimer } = useMainTimerStore();
    const { themes, globalThemeKey } = useThemeStore();
    const { volume } = useSettingsStore();
    const audioRef = useAudio(volume);
    const timerDisplayRef = useRef<SVGCircleElement>(null);

    const { time: storedTime, isMinutes: storedIsMinutes, pointColor, title } = timer;
    const currentTheme = deepCopy(themes[globalThemeKey]);
    if (pointColor) currentTheme.color.point = pointColor;
    if (title) currentTheme.text = title;

    const onFinish = useCallback(
        (reset: () => void) => {
            handleFinish(timer, audioRef, currentTheme.color.point, reset);
        },
        [volume, currentTheme, timer]
    );

    const {
        totalTime,
        count,
        currentTime,
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
        id: timer.id,
        initialTime: storedTime,
        unit: storedIsMinutes ? 'minutes' : 'seconds',
        maxTime: 60,
        onFinish,
    });

    const progress = Math.max(0, count / currentUnit.denominator);

    useEffect(() => {
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
                <TimeDisplay currentTime={currentTime} timerDisplayRef={timerDisplayRef} currentTheme={currentTheme} />
                <TimerDisplay
                    ref={timerDisplayRef}
                    progress={progress}
                    currentTheme={currentTheme}
                    handleDragEvent={handleDragOrClick}
                />
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
