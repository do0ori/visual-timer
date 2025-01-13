import { useCallback, useEffect, useRef, useState } from 'react';
import { HiMiniHome } from 'react-icons/hi2';
import { useAspectRatio } from '../../hooks/useAspectRatio';
import { useAudio } from '../../hooks/useAudio';
import { useTimer } from '../../hooks/useTimer';
import { useSelectedTimerStore } from '../../store/selectedTimerStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useThemeStore } from '../../store/themeStore';
import { RoutineTimerData } from '../../store/types/timer';
import { deepCopy } from '../../utils/deepCopy';
import { getTimerPointColor } from '../../utils/themeUtils';
import { handleFinish } from '../../utils/timerHandler';
import HorizontalLayout from '../layout/HorizontalLayout';
import VerticalLayout from '../layout/VerticalLayout';
import ControlButtons from './controls/ControlButtons';
import RepeatSwitch from './controls/RepeatSwitch';
import TimeDisplay from './display/TimeDisplay';
import TimerDisplay from './display/TimerDisplay';
import TimerItemsList from './list/TimerItemsList';

const RoutineTimer: React.FC<{ timer: RoutineTimerData }> = ({ timer }) => {
    const aspectRatio = useAspectRatio();
    const { themes, globalThemeKey } = useThemeStore();

    const { selectTimer } = useSelectedTimerStore();
    const { volume } = useSettingsStore();
    const audioRef = useAudio(volume);
    const timerDisplayRef = useRef<SVGCircleElement>(null);

    const [currentItemIndex, setCurrentItemIndex] = useState<number>(0);
    const [repeat, setRepeat] = useState<boolean>(false);
    const [isRunning, setIsRunning] = useState<boolean>(false);

    useEffect(() => {
        setCurrentItemIndex(0);
    }, [timer.id]);

    const { title, items } = timer;
    const currentItem = items[currentItemIndex];

    const currentTheme = deepCopy(themes[globalThemeKey]);
    if (currentItem.pointColorIndex) {
        currentTheme.color.point = getTimerPointColor(currentTheme, currentItem.pointColorIndex);
    }
    if (currentItem.title) currentTheme.text = currentItem.title;

    const moveToNextItem = useCallback(() => {
        const nextIndex = (currentItemIndex + 1) % items.length;
        const isFirstItemAfterComplete = nextIndex === 0;
        const shouldAutoStart = isFirstItemAfterComplete ? repeat : true;

        setCurrentItemIndex(nextIndex);
        setIsRunning(shouldAutoStart);
    }, [currentItemIndex, items.length, repeat, timer.id]);

    const onFinish = useCallback(
        (reset: () => void) => {
            handleFinish(currentItem, audioRef, currentTheme.color.point, () => {
                reset();
                moveToNextItem();
            });
        },
        [volume, currentItem, audioRef, currentTheme, moveToNextItem]
    );

    const {
        count,
        currentTime,
        currentUnit,
        isRunning: isItemRunning,
        isMinutes,
        isInitialized,
        start,
        stop,
        reset,
        add,
    } = useTimer({
        id: currentItem.id,
        initialTime: currentItem.time,
        unit: currentItem.isMinutes ? 'minutes' : 'seconds',
        maxTime: 60,
        onFinish,
        autoStart: isRunning,
    });

    const progress = Math.max(0, count / currentUnit.denominator);

    const resetRoutine = () => {
        reset();
        setCurrentItemIndex(0);
        setIsRunning(false);
    };

    const toggleRepeat = () => {
        setRepeat(!repeat);
    };

    const setToDefault = () => selectTimer('default');

    const handleItemChange = (index: number) => {
        reset();
        setCurrentItemIndex(index);
    };

    const commonContent = {
        top: (
            <div className="mt-[5%] flex items-center justify-between px-[5%]">
                <button
                    onClick={setToDefault}
                    aria-label="Back to Default Timer"
                    className={`${timer.id !== 'default' ? 'visible' : 'invisible'}`}
                >
                    <HiMiniHome size={30} />
                </button>
                <RepeatSwitch onClick={toggleRepeat} repeat={repeat} currentTheme={currentTheme} />
            </div>
        ),
        bottom: (
            <div className="mb-[5%] w-full self-center px-[5%]">
                <ControlButtons
                    isMinutes={isMinutes}
                    isRunning={isItemRunning}
                    isInitialized={isInitialized}
                    currentTheme={currentTheme}
                    start={start}
                    stop={stop}
                    reset={resetRoutine}
                    add={add}
                />
            </div>
        ),
        timerInfo: (
            <>
                <div className="my-3 text-balance px-[5%] text-center text-2xl">{title}</div>
                <div className="w-full px-[5%]">
                    <TimerItemsList
                        items={items}
                        currentItemIndex={currentItemIndex}
                        onChange={handleItemChange}
                        currentTime={currentTime}
                        currentTheme={currentTheme}
                    />
                </div>
            </>
        ),
        timeDisplaySimple: <TimeDisplay currentTime={currentTime} />,
        timerDisplay: <TimerDisplay ref={timerDisplayRef} progress={progress} currentTheme={currentTheme} />,
    };

    return aspectRatio > 1 ? (
        <HorizontalLayout
            className="h-screen w-screen"
            leftChildren={commonContent.timerDisplay}
            rightChildren={
                <div className="flex size-full flex-col justify-between">
                    {commonContent.top}
                    <div className="flex flex-col items-center justify-center">{commonContent.timerInfo}</div>
                    {commonContent.bottom}
                </div>
            }
        />
    ) : (
        <VerticalLayout className="h-screen w-screen">
            <div className="flex size-full flex-col justify-between">
                {commonContent.top}
                <div className="flex flex-col items-center justify-center">{commonContent.timerInfo}</div>
                <div className="flex grow items-center justify-center">{commonContent.timerDisplay}</div>
                {commonContent.bottom}
            </div>
        </VerticalLayout>
    );
};

export default RoutineTimer;
