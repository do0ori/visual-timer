import { useCallback, useEffect, useRef } from 'react';
import { useAudio } from '../../../hooks/useAudio';
import { useTheme } from '../../../hooks/useTheme';
import { useTimerBase } from '../../../hooks/useTimer';
import { useSelectedTimerStore } from '../../../store/selectedTimerStore';
import { BaseTimerData } from '../../../store/types/timer';
import { handleDragEvent, handleFinish } from '../../../utils/timerHandler';
import ControlButtons from '../shared/controls/ControlButtons';
import HomeButton from '../shared/controls/HomeButton';
import UnitSwitch from '../shared/controls/UnitSwitch';
import TimeDisplay from '../shared/displays/TimeDisplay';
import TimerDisplay from '../shared/displays/TimerDisplay';
import TimerContent, { TimerContentProps } from '../shared/TimerContent';

const BaseTimer: React.FC<{ timer: BaseTimerData }> = ({ timer }) => {
    const { defaultTimer, selectDefaultTimer, updateDefaultTimer } = useSelectedTimerStore();
    const audio = useAudio();
    const timerDisplayRef = useRef<SVGCircleElement>(null);

    const { time: storedTime, isMinutes: storedIsMinutes, pointColorIndex, title } = timer;

    const { currentTheme } = useTheme(pointColorIndex, title);

    const onFinish = useCallback(
        (reset: () => void) => {
            handleFinish(timer, audio, currentTheme.color.point, reset);
        },
        [timer, audio, currentTheme]
    );

    const {
        totalTime,
        progress,
        currentTime,
        isRunning,
        isMinutes,
        isInitialized,
        start,
        stop,
        reset,
        toggleUnit,
        setTime,
        add,
    } = useTimerBase({
        timer,
        initialTime: storedTime,
        isMinutes: storedIsMinutes,
        onFinish,
    });

    useEffect(() => {
        if (timer.id === defaultTimer.id) {
            updateDefaultTimer({ time: totalTime });
        }
    }, [totalTime, updateDefaultTimer]);

    useEffect(() => {
        if (timer.id === defaultTimer.id) {
            updateDefaultTimer({ isMinutes });
        }
    }, [isMinutes, updateDefaultTimer]);

    const handleDragOrClick = (e: React.MouseEvent | React.TouchEvent) => {
        if (timer.id === defaultTimer.id) {
            handleDragEvent(e, setTime);
        }
    };

    const content: TimerContentProps = {
        top: {
            leftChildren: <HomeButton isVisible={timer.id !== defaultTimer.id} onClick={selectDefaultTimer} />,
            rightChildren: (
                <UnitSwitch
                    onClick={toggleUnit}
                    isMinutes={isMinutes}
                    isRunning={timer.id === defaultTimer.id ? isRunning : true}
                    currentTheme={currentTheme}
                />
            ),
        },
        bottom: (
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
        timerInfo: <TimeDisplay currentTime={currentTime} className="my-3" />,
        timer: (
            <TimerDisplay
                ref={timerDisplayRef}
                progress={progress}
                currentTheme={currentTheme}
                handleDragEvent={handleDragOrClick}
            />
        ),
    };

    return <TimerContent {...content} />;
};

export default BaseTimer;
