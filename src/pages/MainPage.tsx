import { useMemo } from 'react';
import BaseTimer from '../components/timers/base-timer/BaseTimer';
import RoutineTimer from '../components/timers/routine-timer/RoutineTimer';
import { TIMER_TYPE } from '../config/timer/type';
import { useBaseTimerStore } from '../store/baseTimerStore';
import { useRoutineTimerStore } from '../store/routineTimerStore';
import { useSelectedTimerStore } from '../store/selectedTimerStore';

const MainPage: React.FC = () => {
    const { defaultTimer, selectedTimerId } = useSelectedTimerStore();
    const { timers: baseTimers, getTimer: getBaseTimer } = useBaseTimerStore();
    const { timers: routineTimers, getTimer: getRoutineTimer } = useRoutineTimerStore();

    const timer = useMemo(() => {
        if (selectedTimerId === defaultTimer.id) return defaultTimer;
        return getBaseTimer(selectedTimerId) || getRoutineTimer(selectedTimerId) || defaultTimer;
    }, [selectedTimerId, defaultTimer, baseTimers, routineTimers]);

    if (timer.type === TIMER_TYPE.BASE) {
        return <BaseTimer timer={timer} />;
    }

    if (timer.type === TIMER_TYPE.ROUTINE) {
        return <RoutineTimer timer={timer} />;
    }

    return null;
};

export default MainPage;
