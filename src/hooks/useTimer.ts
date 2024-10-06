import { useCallback, useState } from 'react';
import { useBoolean, useCounter, useInterval } from 'usehooks-ts';
import { timerUnits, Unit } from '../config/timer/units';

type TimerOptions = {
    /** Initial time for the timer. */
    initialTime: number;
    /** Unit of the timer, either "minutes" or "seconds". Defaults to "minutes". */
    unit?: 'minutes' | 'seconds';
    /** If true, the timer will increment instead of decrement. */
    isIncrement?: boolean;
    /** Maximum possible time for the timer. */
    maxTime?: number;
    /** Callback function triggered when the timer reaches the countStop. */
    onFinish?: () => void;
};

type TimerControllers = {
    /** Total time value. */
    totalTime: number;
    /** Current countdown value. */
    count: number;
    /** The current unit details (interval and multiple values). */
    currentUnit: Unit;
    /** If true, the timer is currently running. */
    isRunning: boolean;
    /** True if the timer is in minutes mode, false if in seconds mode. */
    isMinutes: boolean;
    /** If true, the timer is initialized. */
    isInitialized: boolean;
    /** Starts the countdown. */
    start: () => void;
    /** Stops the countdown. */
    stop: () => void;
    /** Resets the countdown to the initial value. */
    reset: () => void;
    /** Toggles between minutes and seconds mode. */
    toggleUnit: () => void;
    /** Sets a new time for the countdown. */
    setTime: (time: number) => void;
    /** Adds a time to current value. */
    add: (time: number) => void;
};

export function useTimer({
    initialTime,
    unit = 'minutes',
    maxTime = undefined,
    onFinish,
}: TimerOptions): TimerControllers {
    // Validation check for initialTime and maxTime
    if (initialTime < 0) {
        throw new Error('initialTime cannot be negative');
    }
    if (maxTime !== undefined && maxTime < initialTime) {
        throw new Error('maxTime cannot be less than initialTime');
    }

    // State to track the current time in minutes or seconds
    const [time, setTime] = useState<number>(initialTime);
    const [isMinutes, setIsMinutes] = useState<boolean>(unit === 'minutes');

    // Manage the initialized state of the timer
    const [isInitialized, setIsInitialized] = useState<boolean>(true);

    // Get current unit details (intervalMs and multiple for minutes/seconds)
    const currentUnit = timerUnits[isMinutes ? 'minutes' : 'seconds'];
    const countStart = time * currentUnit.multiple;
    const intervalMs = currentUnit.interval;

    // Calculate maximum possible count value if maxTime is given
    const maxCountStart = maxTime ? maxTime * currentUnit.multiple : undefined;

    // Manage count state with useCounter, which provides decrement and setCount functions
    const { count, decrement, setCount } = useCounter(countStart);

    // Manage the running state of the timer
    const { value: isRunning, setTrue: startCountdown, setFalse: stopCountdown } = useBoolean(false);

    // Resets the countdown to the initial value and stops it
    const resetCountdown = useCallback(() => {
        stopCountdown();
        setCount(countStart);
        setIsInitialized(true);
    }, [stopCountdown, setCount, countStart]);

    // The callback for the countdown logic
    const countdownCallback = useCallback(() => {
        if (count === 0) {
            resetCountdown();
            if (onFinish) onFinish();
            return;
        }
        decrement();
    }, [count, decrement, resetCountdown, onFinish]);

    // useInterval hook triggers the countdown logic when the timer is running
    useInterval(countdownCallback, isRunning ? intervalMs : null);

    // Function to start the countdown and mark as initialized
    const start = useCallback(() => {
        startCountdown();
        setIsInitialized(false);
    }, [startCountdown]);

    // Sets a new time for the countdown and resets it
    const handleSetTime = useCallback(
        (newTime: number) => {
            const validatedTime = maxTime ? Math.min(newTime, maxTime) : newTime;
            const newCountStart = validatedTime * currentUnit.multiple;
            setTime(validatedTime);
            setCount(newCountStart);
            setIsInitialized(true);
            stopCountdown();
        },
        [setCount, stopCountdown, currentUnit.multiple, maxTime]
    );

    // Toggles between minutes and seconds mode
    const toggleUnit = useCallback(() => {
        const newCountStart = time * (isMinutes ? timerUnits.seconds.multiple : timerUnits.minutes.multiple);
        setIsMinutes(!isMinutes);
        setCount(newCountStart);
        setIsInitialized(true);
        stopCountdown();
    }, [isMinutes, setCount, time, stopCountdown]);

    // Function to add a specific time to the current count
    const add = useCallback(
        (time: number) => {
            let newCountStart = count + time * currentUnit.multiple;
            if (maxCountStart) {
                newCountStart = Math.min(newCountStart, maxCountStart);
            }
            newCountStart = Math.max(newCountStart, 0);
            setCount(newCountStart);
        },
        [count, maxCountStart, currentUnit.multiple, setCount]
    );

    return {
        totalTime: time,
        count,
        currentUnit,
        isRunning,
        isMinutes,
        isInitialized,
        start,
        stop: stopCountdown,
        reset: resetCountdown,
        toggleUnit,
        setTime: handleSetTime,
        add,
    };
}
