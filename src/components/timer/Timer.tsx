import { useCallback, useEffect, useRef } from 'react';
import { HiMiniHome } from 'react-icons/hi2';
import { useAspectRatio } from '../../hooks/useAspectRatio';
import { useAudio } from '../../hooks/useAudio';
import { useTimer } from '../../hooks/useTimer';
import { TimerData, useMainTimerStore } from '../../store/mainTimerStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useThemeStore } from '../../store/themeStore';
import { deepCopy } from '../../utils/deepCopy';
import { getTimerPointColor } from '../../utils/themeUtils';
import { handleDragEvent, handleFinish } from '../../utils/timerHandler';
import Button from '../common/Button';
import HorizontalLayout from '../layout/HorizontalLayout';
import VerticalLayout from '../layout/VerticalLayout';
import ControlButtons from './controls/ControlButtons';
import UnitSwitch from './controls/UnitSwitch';
import TimeDisplay from './display/TimeDisplay';
import TimerDisplay from './display/TimerDisplay';

const Timer: React.FC<{ timer: TimerData }> = ({ timer }) => {
    const aspectRatio = useAspectRatio();
    const { selectTimer, updateTimer } = useMainTimerStore();
    const { themes, globalThemeKey } = useThemeStore();
    const { volume } = useSettingsStore();
    const audioRef = useAudio(volume);
    const timerDisplayRef = useRef<SVGCircleElement>(null);

    const { time: storedTime, isMinutes: storedIsMinutes, pointColorIndex, title } = timer;
    const currentTheme = deepCopy(themes[globalThemeKey]);
    if (pointColorIndex) currentTheme.color.point = getTimerPointColor(currentTheme, pointColorIndex);
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
        }
    };

    const setToDefault = () => selectTimer('default');

    const commonContent = {
        top: (
            <div className="mt-[5%] flex items-center justify-between px-[5%]">
                <Button onClick={setToDefault} aria-label="Back to Default Timer" visible={timer.id !== 'default'}>
                    <HiMiniHome size={30} />
                </Button>
                <UnitSwitch
                    onClick={toggleUnit}
                    isMinutes={isMinutes}
                    isRunning={timer.id === 'default' ? isRunning : true}
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

export default Timer;
