import { useCallback, useEffect, useRef, useState } from 'react';
import { useBoolean } from 'usehooks-ts';
import { useAudio } from '../../../hooks/useAudio';
import { useTheme } from '../../../hooks/useTheme';
import { useTimerBase } from '../../../hooks/useTimer';
import { useSelectedTimerStore } from '../../../store/selectedTimerStore';
import { RoutineTimerData } from '../../../store/types/timer';
import { handleFinish } from '../../../utils/timerHandler';
import ControlButtons from '../shared/controls/ControlButtons';
import HomeButton from '../shared/controls/HomeButton';
import RepeatSwitch from '../shared/controls/RepeatSwitch';
import TimerDisplay from '../shared/displays/TimerDisplay';
import TimerContent, { TimerContentProps } from '../shared/TimerContent';
import TimerList from './TimerList';

const RoutineTimer: React.FC<{ timer: RoutineTimerData }> = ({ timer }) => {
    const { defaultTimer, selectDefaultTimer } = useSelectedTimerStore();
    const audioRef = useAudio();
    const timerDisplayRef = useRef<SVGCircleElement>(null);

    const [currentItemIndex, setCurrentItemIndex] = useState<number>(0);
    const { value: repeat, toggle: toggleRepeat } = useBoolean(false);
    const [isRunning, setIsRunning] = useState<boolean>(false);

    useEffect(() => {
        setCurrentItemIndex(0);
    }, [timer.id]);

    const { title, items } = timer;
    const currentItem = items[currentItemIndex];

    const { currentTheme } = useTheme(currentItem.pointColorIndex, currentItem.title);

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
        [currentItem, audioRef, currentTheme, moveToNextItem]
    );

    const {
        progress,
        currentTime,
        isRunning: isItemRunning,
        isMinutes,
        isInitialized,
        start,
        stop,
        reset,
        add,
    } = useTimerBase({
        id: currentItem.id,
        initialTime: currentItem.time,
        isMinutes: currentItem.isMinutes,
        onFinish,
        autoStart: isRunning,
    });

    const resetRoutine = () => {
        reset();
        setCurrentItemIndex(0);
        setIsRunning(false);
    };

    const handleItemChange = (index: number) => {
        reset();
        setCurrentItemIndex(index);
    };

    const content: TimerContentProps = {
        top: {
            leftChildren: <HomeButton isVisible={timer.id !== defaultTimer.id} onClick={selectDefaultTimer} />,
            rightChildren: <RepeatSwitch onClick={toggleRepeat} repeat={repeat} currentTheme={currentTheme} />,
        },
        bottom: (
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
        ),
        timerInfo: (
            <>
                <div className="my-3 text-balance px-[5%] text-center text-2xl">{title}</div>
                <div className="w-full px-[5%]">
                    <TimerList
                        items={items}
                        currentItemIndex={currentItemIndex}
                        onChange={handleItemChange}
                        currentTime={currentTime}
                        currentTheme={currentTheme}
                    />
                </div>
            </>
        ),
        timer: <TimerDisplay ref={timerDisplayRef} progress={progress} currentTheme={currentTheme} />,
    };

    return <TimerContent {...content} />;
};

export default RoutineTimer;
