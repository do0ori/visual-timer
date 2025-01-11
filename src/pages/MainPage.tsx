import { useMemo } from 'react';
import BaseTimer from '../components/timer/BaseTimer';
import RoutineTimer from '../components/timer/RoutineTimer';
import { TIMER_TYPE } from '../config/timer/type';
import { useBaseTimerStore } from '../store/baseTimerStore';
import { useRoutineTimerStore } from '../store/routineTimerStore';
import { useSelectedTimerStore } from '../store/selectedTimerStore';

const MainPage: React.FC = () => {
    const { selectedTimerId, defaultTimer } = useSelectedTimerStore();
    const { timers: baseTimers, getTimer: getBaseTimer } = useBaseTimerStore();
    const { timers: routineTimers, getTimer: getRoutineTimer } = useRoutineTimerStore();

    const timer = useMemo(() => {
        if (selectedTimerId === 'default') return defaultTimer;
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
