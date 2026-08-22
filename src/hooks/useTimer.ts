import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useBoolean, useCounter, useInterval } from 'usehooks-ts';
import { timerUnits, Unit } from '../config/timer/units';
import { BaseTimerData, RoutineTimerItem } from '../store/types/timer';
import { convertMsToMmSs } from '../utils/timeUtils';
import { getRemainingCount } from '../utils/timerDeadline';
import { cancelTimerNotification, scheduleTimerNotification } from '../services/timerNotificationService';
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

    const endAtRef = useRef<number | null>(null);
    const [isDocumentVisible, setIsDocumentVisible] = useState(() => document.visibilityState === 'visible');

    // Calculate maximum possible count value if maxTime is given
    const maxCountStart = maxTime ? maxTime * currentUnit.multiple : undefined;

    // Manage count state with useCounter, which provides decrement and setCount functions
    const { count, setCount } = useCounter(countStart);

    // Manage the running state of the timer
    const { value: isRunning, setTrue: startCountdown, setFalse: stopCountdown } = useBoolean(false);

    const postServiceWorkerMessage = useCallback((message: Record<string, unknown>) => {
        navigator.serviceWorker.controller?.postMessage(message);
    }, []);

    const scheduleBackgroundNotification = useCallback(
        (visibleUntil: number | null) => {
            if (!endAtRef.current) return;

            void scheduleTimerNotification({
                timerId: timer.id,
                endAt: endAtRef.current,
                title: timer.title || 'Timer',
                deepLink: '/visual-timer/',
                visibleUntil,
            }).catch((error) => console.debug('Unable to schedule background timer alert:', error));
        },
        [timer.id, timer.title]
    );

    // Resets the countdown to the initial value and stops it
    const resetCountdown = useCallback(() => {
        stopCountdown();
        finishTriggeredRef.current = false;
        endAtRef.current = null;
        void cancelTimerNotification(timer.id);
        postServiceWorkerMessage({ command: 'clear-running-status', timerId: timer.id });
        setCount(countStart);
        setIsInitialized(true);
    }, [countStart, postServiceWorkerMessage, setCount, stopCountdown, timer.id]);

    // The callback for the countdown logic
    const countdownCallback = useCallback(() => {
        if (!endAtRef.current) return;

        const remainingCount = getRemainingCount(endAtRef.current, intervalMs);
        setCount(remainingCount);

        if (remainingCount === 0 && onFinish && !finishTriggeredRef.current) {
            finishTriggeredRef.current = true;
            stopCountdown();
            void cancelTimerNotification(timer.id);
            postServiceWorkerMessage({ command: 'clear-running-status', timerId: timer.id });
            onFinish(resetCountdown);
        }
    }, [intervalMs, onFinish, postServiceWorkerMessage, resetCountdown, setCount, stopCountdown, timer.id]);

    // useInterval hook triggers the countdown logic when the timer is running
    useInterval(countdownCallback, isRunning ? intervalMs : null);

    // Function to start the countdown and mark as initialized
    const start = useCallback(() => {
        endAtRef.current = Date.now() + count * intervalMs;
        startCountdown();
        setIsInitialized(false);
        scheduleBackgroundNotification(isDocumentVisible ? Date.now() + 15_000 : null);
    }, [count, intervalMs, isDocumentVisible, scheduleBackgroundNotification, startCountdown]);

    // Sets a new time for the countdown and resets it
    const handleSetTime = useCallback(
        (newTime: number) => {
            const validatedTime = maxTime ? Math.min(newTime, maxTime) : newTime;
            const newCountStart = validatedTime * currentUnit.multiple;
            setTime(validatedTime);
            setCount(newCountStart);
            endAtRef.current = null;
            void cancelTimerNotification(timer.id);
            postServiceWorkerMessage({ command: 'clear-running-status', timerId: timer.id });
            setIsInitialized(true);
            stopCountdown();
        },
        [currentUnit.multiple, maxTime, postServiceWorkerMessage, setCount, stopCountdown, timer.id]
    );

    // Toggles between minutes and seconds mode
    const toggleUnit = useCallback(() => {
        const newCountStart = time * (isMinutes ? timerUnits.seconds.multiple : timerUnits.minutes.multiple);
        toggleIsMinutes();
        setCount(newCountStart);
        endAtRef.current = null;
        void cancelTimerNotification(timer.id);
        postServiceWorkerMessage({ command: 'clear-running-status', timerId: timer.id });
        setIsInitialized(true);
        stopCountdown();
    }, [isMinutes, postServiceWorkerMessage, setCount, stopCountdown, time, timer.id]);

    // Function to add a specific time to the current count
    const add = useCallback(
        (time: number) => {
            let newCountStart = count + time * currentUnit.multiple;
            if (maxCountStart) {
                newCountStart = Math.min(newCountStart, maxCountStart);
            }
            newCountStart = Math.max(newCountStart, 0);
            setCount(newCountStart);
            if (endAtRef.current) {
                endAtRef.current = Date.now() + newCountStart * intervalMs;
                scheduleBackgroundNotification(isDocumentVisible ? Date.now() + 15_000 : null);
            }
        },
        [
            count,
            currentUnit.multiple,
            intervalMs,
            isDocumentVisible,
            maxCountStart,
            scheduleBackgroundNotification,
            setCount,
        ]
    );

    const currentTime = useMemo(() => {
        const remainingMs = count * intervalMs;
        return convertMsToMmSs(remainingMs);
    }, [count]);

    const progress = Math.max(0, count / currentUnit.denominator);

    if (autoStart && isInitialized) start();

    useWakeLock(isRunning);

    // Visibility change handling
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                setIsDocumentVisible(false);
                if (isRunning) {
                    scheduleBackgroundNotification(null);
                    postServiceWorkerMessage({
                        command: 'show-running-status',
                        timerId: timer.id,
                        title: timer.title || 'Timer',
                        endAt: endAtRef.current,
                    });
                }
            } else if (document.visibilityState === 'visible') {
                setIsDocumentVisible(true);
                postServiceWorkerMessage({ command: 'clear-running-status', timerId: timer.id });
                countdownCallback();
                if (isRunning) {
                    scheduleBackgroundNotification(Date.now() + 15_000);
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [countdownCallback, isRunning, postServiceWorkerMessage, scheduleBackgroundNotification, timer.id, timer.title]);

    useInterval(
        () => scheduleBackgroundNotification(Date.now() + 15_000),
        isRunning && isDocumentVisible ? 5_000 : null
    );

    // Reset timer with new input data
    useEffect(() => {
        setTime(initialTime);
        setIsMinutes(unit === 'minutes');
        setCount(initialTime * currentUnit.multiple);
        endAtRef.current = null;
        void cancelTimerNotification(timer.id);
    }, [initialTime, unit, currentUnit.multiple, setCount]);

    const stop = useCallback(() => {
        stopCountdown();
        endAtRef.current = null;
        void cancelTimerNotification(timer.id);
        postServiceWorkerMessage({ command: 'clear-running-status', timerId: timer.id });
    }, [postServiceWorkerMessage, stopCountdown, timer.id]);

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
        stop,
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
