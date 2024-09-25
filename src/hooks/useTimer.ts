import { useCallback, useState } from 'react';
import { useBoolean, useCounter, useInterval } from 'usehooks-ts';
import { timerUnits, Unit } from '../config/timer/units';

type TimerOptions = {
    /** Initial time for the timer. */
    initialTime: number;
    /** Unit of the timer, either "minutes" or "seconds". Defaults to "minutes". */
    unit?: "minutes" | "seconds";
    /** If true, the timer will increment instead of decrement. */
    isIncrement?: boolean;
    /** The value at which the countdown should stop. */
    countStop?: number;
    /** Callback function triggered when the timer reaches the countStop. */
    onFinish?: () => void;
}

type TimerControllers = {
    /** Current countdown value. */
    count: number;
    /** If true, the timer is currently running. */
    isRunning: boolean;
    /** True if the timer is in minutes mode, false if in seconds mode. */
    isMinutes: boolean;
    /** The current unit details (interval and multiple values). */
    currentUnit: Unit;
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
}

export function useTimer({
    initialTime,
    unit = "minutes",
    countStop = 0,
    isIncrement = false,
    onFinish,
}: TimerOptions): TimerControllers {
    // State to track the current time in minutes or seconds
    const [time, setTime] = useState<number>(initialTime);
    const [isMinutes, setIsMinutes] = useState(unit === "minutes");

    // Get current unit details (intervalMs and multiple for minutes/seconds)
    const currentUnit = timerUnits[isMinutes ? "minutes" : "seconds"];
    const countStart = time * currentUnit.multiple;
    const intervalMs = currentUnit.interval;

    // Manage count state with useCounter, which provides increment, decrement, and setCount functions
    const {
        count,
        increment,
        decrement,
        setCount
    } = useCounter(countStart);

    // Manage the running state of the timer
    const {
        value: isRunning,
        setTrue: startCountdown,
        setFalse: stopCountdown,
    } = useBoolean(false);

    // Resets the countdown to the initial value and stops it
    const resetCountdown = useCallback(() => {
        stopCountdown(); // Stop the timer
        setCount(countStart); // Reset the count to the initial value
    }, [stopCountdown, setCount, countStart]);

    // The callback for the countdown logic (either increment or decrement)
    const countdownCallback = useCallback(() => {
        if (count === countStop) {
            resetCountdown(); // Reset if we reach the stop value
            if (onFinish) onFinish(); // Trigger onFinish callback if provided
            return;
        }

        // Increment or decrement based on the isIncrement flag
        isIncrement ? increment() : decrement();
    }, [count, countStop, decrement, increment, isIncrement, resetCountdown, onFinish]);

    // useInterval hook triggers the countdown logic when the timer is running
    useInterval(countdownCallback, isRunning ? intervalMs : null);

    // Sets a new time for the countdown and resets it
    const handleSetTime = useCallback(
        (newTime: number) => {
            setTime(newTime); // Update the time state
            const newCountStart = newTime * currentUnit.multiple; // Calculate the new count start value
            setCount(newCountStart); // Update the count state
            stopCountdown(); // Stop the countdown after setting the new time
        },
        [setCount, stopCountdown, currentUnit.multiple]
    );

    // Toggles between minutes and seconds mode
    const toggleUnit = useCallback(() => {
        setIsMinutes((prev) => !prev); // Toggle isMinutes state
        const newCountStart = time * (isMinutes ? timerUnits.seconds.multiple : timerUnits.minutes.multiple); // Calculate the new count start value
        setCount(newCountStart); // Update the count with the new unit
        stopCountdown(); // Stop the countdown when switching units
    }, [isMinutes, setCount, time, stopCountdown]);

    return {
        count,
        isRunning,
        isMinutes,
        currentUnit,
        start: startCountdown,
        stop: stopCountdown,
        reset: resetCountdown,
        toggleUnit,
        setTime: handleSetTime,
    };
}
