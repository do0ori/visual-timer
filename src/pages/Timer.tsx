import { useEffect } from 'react';
import { themes } from '../config/timer/themes';
import { useTimer } from '../hooks/useTimer';
import { useLocalStorage } from 'usehooks-ts';
import { handleFinish, handleMouseEvent } from '../utils/timerHandler';
import UnitToggleButton from '../components/Button/UnitToggleButton';
import TimerDisplay from '../components/Display/TimerDisplay';
import QuoteDisplay from '../components/Display/QuoteDisplay';
import ControlButtons from '../components/Button/ControlButtons';
import ThemeSwitchButtons from '../components/Button/ThemeSwitchButtons';

const Timer: React.FC = () => {
    const [theme, setTheme] = useLocalStorage<string>('theme', 'classic');
    const [storedTime, setStoredTime] = useLocalStorage<number>('time', 10);
    const [storedIsMinutes, setStoredIsMinutes] = useLocalStorage<boolean>('isMinutes', true);

    const currentTheme = themes[theme];

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
        setStoredTime(totalTime);
    }, [totalTime]);

    useEffect(() => {
        setStoredIsMinutes(isMinutes);
    }, [isMinutes]);

    return (
        <div className={`flex min-h-screen flex-col items-center justify-center ${currentTheme.bg.main}`}>
            <UnitToggleButton
                onClick={toggleUnit}
                isMinutes={isMinutes}
                isRunning={isRunning}
                currentTheme={currentTheme}
            />
            <TimerDisplay
                progress={progress}
                currentTheme={currentTheme}
                handleMouseEvent={(e) => handleMouseEvent(e, setTime)}
            >
                <QuoteDisplay currentTheme={currentTheme} />
            </TimerDisplay>
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
            <ThemeSwitchButtons setTheme={setTheme} />
        </div>
    );
};

export default Timer;
