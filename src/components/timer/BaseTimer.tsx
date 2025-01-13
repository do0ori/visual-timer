import { useCallback, useEffect, useRef } from 'react';
import { HiMiniHome } from 'react-icons/hi2';
import { useAspectRatio } from '../../hooks/useAspectRatio';
import { useAudio } from '../../hooks/useAudio';
import { useTheme } from '../../hooks/useTheme';
import { useTimerBase } from '../../hooks/useTimerBase';
import { useSelectedTimerStore } from '../../store/selectedTimerStore';
import { BaseTimerData } from '../../store/types/timer';
import { handleDragEvent, handleFinish } from '../../utils/timerHandler';
import HorizontalLayout from '../layout/HorizontalLayout';
import VerticalLayout from '../layout/VerticalLayout';
import ControlButtons from './controls/ControlButtons';
import UnitSwitch from './controls/UnitSwitch';
import TimeDisplay from './display/TimeDisplay';
import TimerDisplay from './display/TimerDisplay';

const BaseTimer: React.FC<{ timer: BaseTimerData }> = ({ timer }) => {
    const aspectRatio = useAspectRatio();

    const { defaultTimer, selectDefaultTimer, updateDefaultTimer } = useSelectedTimerStore();
    const audioRef = useAudio();
    const timerDisplayRef = useRef<SVGCircleElement>(null);

    const { time: storedTime, isMinutes: storedIsMinutes, pointColorIndex, title } = timer;

    const { currentTheme } = useTheme(pointColorIndex, title);

    const onFinish = useCallback(
        (reset: () => void) => {
            handleFinish(timer, audioRef, currentTheme.color.point, reset);
        },
        [timer, audioRef, currentTheme]
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
        id: timer.id,
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

    const commonContent = {
        top: (
            <div className="mt-[5%] flex items-center justify-between px-[5%]">
                <button
                    onClick={selectDefaultTimer}
                    aria-label="Back to Default Timer"
                    className={`${timer.id !== defaultTimer.id ? 'visible' : 'invisible'}`}
                >
                    <HiMiniHome size={30} />
                </button>
                <UnitSwitch
                    onClick={toggleUnit}
                    isMinutes={isMinutes}
                    isRunning={timer.id === defaultTimer.id ? isRunning : true}
                    currentTheme={currentTheme}
                />
            </div>
        ),
        bottom: (
            <div className="mb-[5%] w-full self-center px-[5%]">
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
                <div className="flex size-full flex-col justify-between">
                    {commonContent.top}
                    <div className="flex flex-col items-center justify-center">{commonContent.timeDisplaySimple}</div>
                    {commonContent.bottom}
                </div>
            }
        />
    ) : (
        <VerticalLayout className="h-screen w-screen">
            <div className="flex size-full flex-col justify-between">
                {commonContent.top}
                <div className="flex grow items-center justify-center">
                    {commonContent.timeDisplayRelative}
                    {commonContent.timerDisplay}
                </div>
                {commonContent.bottom}
            </div>
        </VerticalLayout>
    );
};

export default BaseTimer;
