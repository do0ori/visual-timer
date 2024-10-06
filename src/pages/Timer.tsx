import { useEffect } from 'react';
import { themes } from '../config/timer/themes';
import { useTimer } from '../hooks/useTimer';
import { useLocalStorage } from 'usehooks-ts';
import UnitToggleButton from '../components/Button/UnitToggleButton';
import TimerDisplay from '../components/Display/TimerDisplay';
import QuoteDisplay from '../components/Display/QuoteDisplay';
import ControlButtons from '../components/Button/ControlButtons';
import ThemeSwitchButtons from '../components/Button/ThemeSwitchButtons';
import alarmSound from '../assets/alarmSound.mp3';

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
        onFinish: () => {
            handleFinish();
        },
    });

    const handleFinish = () => {
        const audio = new Audio(alarmSound);
        audio
            .play()
            .then(() => {
                setTimeout(() => {
                    window.alert('Timer finished!');
                    audio.pause();
                    audio.currentTime = 0;
                }, 0);
            })
            .catch((error) => {
                console.error('Failed to play the sound:', error);
            });
    };

    const progress = count / currentUnit.denominator;

    const handleMouseEvent = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const radians = Math.atan2(y, x);
        let degrees = radians * (180 / Math.PI) + 90;
        if (degrees < 0) degrees += 360;

        const roundedDegrees = Math.round(degrees / 6) * 6;
        const newTime = roundedDegrees / 6;
        setTime(newTime);
    };

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
            <TimerDisplay progress={progress} currentTheme={currentTheme} handleMouseEvent={handleMouseEvent}>
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
