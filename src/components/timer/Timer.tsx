import { useCallback, useEffect, useRef } from 'react';
import { useAspectRatio } from '../../hooks/useAspectRatio';
import { useAudio } from '../../hooks/useAudio';
import { useTimer } from '../../hooks/useTimer';
import { TimerData, useMainTimerStore } from '../../store/mainTimerStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useThemeStore } from '../../store/themeStore';
import { deepCopy } from '../../utils/deepCopy';
import { handleDragEvent, handleFinish } from '../../utils/timerHandler';
import HorizontalLayout from '../layout/HorizontalLayout';
import VerticalLayout from '../layout/VerticalLayout';
import ControlButtons from './ControlButtons';
import TimeDisplay from './TimeDisplay';
import TimerDisplay from './TimerDisplay';
import UnitToggleButton from './UnitToggleButton';

const Timer: React.FC<{ timer: TimerData }> = ({ timer }) => {
    const aspectRatio = useAspectRatio();
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

    const commonContent = {
        unitToggleButton: (
            <UnitToggleButton
                onClick={toggleUnit}
                isMinutes={isMinutes}
                isRunning={timer.id === 'default' ? isRunning : true}
                currentTheme={currentTheme}
            />
        ),
        controlButtons: (
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
        ),
        timeDisplaySimple: <TimeDisplay currentTime={currentTime} />,
        timeDisplayRelative: <TimeDisplay currentTime={currentTime} timerDisplayRef={timerDisplayRef} />,
        timerDisplay: (
            <TimerDisplay
                ref={timerDisplayRef}
                progress={progress}
                currentTheme={currentTheme}
                handleDragEvent={handleDragOrClick}
            />
        ),
    };

    return aspectRatio > 1 ? (
        <HorizontalLayout
            className="h-screen w-screen"
            leftChildren={commonContent.timerDisplay}
            rightChildren={
                <div className="flex size-full flex-col justify-around">
                    <div className="flex self-end pr-5">{commonContent.unitToggleButton}</div>
                    <div className="flex flex-col items-center justify-center">{commonContent.timeDisplaySimple}</div>
                    <div className="w-full self-center">{commonContent.controlButtons}</div>
                </div>
            }
        />
    ) : (
        <VerticalLayout className="h-screen w-screen">
            <div className="flex size-full flex-col justify-between">
                <div className="flex self-end pr-5 pt-5">{commonContent.unitToggleButton}</div>
                <div className="flex grow items-center justify-center">
                    {commonContent.timeDisplayRelative}
                    {commonContent.timerDisplay}
                </div>
                <div className="mb-5 w-full self-center">{commonContent.controlButtons}</div>
            </div>
        </VerticalLayout>
    );
};

export default Timer;
