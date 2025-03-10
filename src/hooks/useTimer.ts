import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useBoolean, useCounter, useInterval } from 'usehooks-ts';
import { timerUnits, Unit } from '../config/timer/units';
import { BaseTimerData, RoutineTimerItem } from '../store/types/timer';
import { convertMsToMmSs } from '../utils/timeUtils';
import { useWakeLock } from './useWakeLock';

type TimerOptions = {
    /** Timer data. */
    timer: BaseTimerData | RoutineTimerItem;
    /** Initial time for the timer. */
    initialTime: number;
    /** Unit of the timer, either "minutes" or "seconds". Defaults to "minutes". */
    unit?: 'minutes' | 'seconds';
    /** If true, the timer will increment instead of decrement. */
    isIncrement?: boolean;
    /** Maximum possible time for the timer. */
    maxTime?: number;
    /** Callback function triggered when the timer reaches the countStop. */
    onFinish: (reset: () => void) => void;
    /** If true, the timer will start automatically. */
    autoStart?: boolean;
};

type TimerControllers = {
    /** Total time value. */
    totalTime: number;
    /** Current countdown value. */
    count: number;
    /** Current progress value between 0 and 1. */
    progress: number;
    /** Current time in mm:ss format. */
    currentTime: string;
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
    timer,
    initialTime,
    unit = 'minutes',
    maxTime = undefined,
    onFinish,
    autoStart = false,
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
    const { value: isMinutes, setValue: setIsMinutes, toggle: toggleIsMinutes } = useBoolean(unit === 'minutes');

    // Manage the initialized state of the timer
    const [isInitialized, setIsInitialized] = useState<boolean>(true);

    // Get current unit details (intervalMs and multiple for minutes/seconds)
    const currentUnit = timerUnits[isMinutes ? 'minutes' : 'seconds'];
    const countStart = time * currentUnit.multiple;
    const intervalMs = currentUnit.interval;

    // State to prevent duplicated onFinish execution
    const finishTriggeredRef = useRef(false);

    // State to handle tab visibility change event
    const lastUpdateTimeRef = useRef<number>(Date.now());
    const wasRunningRef = useRef<boolean>(false);

    // Calculate maximum possible count value if maxTime is given
    const maxCountStart = maxTime ? maxTime * currentUnit.multiple : undefined;

    // Manage count state with useCounter, which provides decrement and setCount functions
    const { count, decrement, setCount } = useCounter(countStart);

    // Manage the running state of the timer
    const { value: isRunning, setTrue: startCountdown, setFalse: stopCountdown } = useBoolean(false);

    // Resets the countdown to the initial value and stops it
    const resetCountdown = useCallback(() => {
        stopCountdown();
        finishTriggeredRef.current = false;
        wasRunningRef.current = false;
        setCount(countStart);
        setIsInitialized(true);
    }, [stopCountdown, setCount, countStart]);

    // The callback for the countdown logic
    const countdownCallback = useCallback(() => {
        if (count === 0 && onFinish && !finishTriggeredRef.current) {
            finishTriggeredRef.current = true;
            onFinish(resetCountdown);
        }

        decrement();
        lastUpdateTimeRef.current = Date.now();
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
        toggleIsMinutes();
        setCount(newCountStart);
        setIsInitialized(true);
        stopCountdown();
    }, [setCount, stopCountdown, time, isMinutes]);

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

    const currentTime = useMemo(() => {
        const remainingMs = count * intervalMs;
        return convertMsToMmSs(remainingMs);
    }, [count]);

    const progress = Math.max(0, count / currentUnit.denominator);

    if (autoStart && isInitialized) start();

    useWakeLock(isRunning);

    // Handle the case where the timer is assigned in the background
    useEffect(() => {
        if (document.visibilityState === 'hidden' && isRunning) {
            const endTime = Date.now() + count * intervalMs;
            navigator.serviceWorker.controller?.postMessage({
                command: 'start-timer',
                timer,
                endTime,
            });
        }
    }, [timer.id]);

    useEffect(() => {
        const handleServiceWorkerMessage = (event: MessageEvent) => {
            const { command, id: messageId } = event.data;

            if (command === 'finished' && messageId === timer.id) {
                console.debug('Timer finished in background.');
                setCount(0);
                startCountdown();
            }
        };

        navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);

        return () => {
            navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
        };
    }, [setCount, startCountdown]);

    // Visibility change handling
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                wasRunningRef.current = isRunning;
                if (isRunning) {
                    lastUpdateTimeRef.current = Date.now();
                    stopCountdown();

                    // Send remaining time to service worker
                    if (count > 0) {
                        const endTime = Date.now() + count * intervalMs;
                        navigator.serviceWorker.controller?.postMessage({
                            command: 'start-timer',
                            timer,
                            endTime,
                        });
                    }
                }
            } else if (document.visibilityState === 'visible') {
                if (wasRunningRef.current) {
                    // Restore timer based on remaining time when the tab becomes active
                    const elapsedMs = Date.now() - lastUpdateTimeRef.current;
                    const elapsedCount = Math.floor(elapsedMs / intervalMs);
                    const newCountStart = count - elapsedCount;

                    if (count > 0) {
                        setCount(Math.max(0, newCountStart));
                    } else {
                        setCount(newCountStart);
                    }

                    startCountdown();

                    navigator.serviceWorker.controller?.postMessage({
                        command: 'clear-timer',
                        timer,
                    });
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [count, isRunning, intervalMs, startCountdown, stopCountdown, setCount]);

    // Reset timer with new input data
    useEffect(() => {
        setTime(initialTime);
        setIsMinutes(unit === 'minutes');
        setCount(initialTime * currentUnit.multiple);
    }, [initialTime, unit, currentUnit.multiple, setCount]);

    return {
        totalTime: time,
        count,
        progress,
        currentTime,
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

type UseTimerBaseProps = {
    timer: BaseTimerData | RoutineTimerItem;
    initialTime: number;
    isMinutes: boolean;
    onFinish: (reset: () => void) => void;
    autoStart?: boolean;
};

export const useTimerBase = ({ timer, initialTime, isMinutes, onFinish, autoStart }: UseTimerBaseProps) => {
    return useTimer({
        timer,
        initialTime,
        unit: isMinutes ? 'minutes' : 'seconds',
        maxTime: 60,
        onFinish,
        autoStart,
    });
};
