import BaseTimer from '../components/timer/BaseTimer';
import RoutineTimer from '../components/timer/RoutineTimer';
import { useBaseTimerStore } from '../store/baseTimerStore';
import { useRoutineTimerStore } from '../store/routineTimerStore';
import { useSelectedTimerStore } from '../store/selectedTimerStore';
import { TIMER_TYPE } from '../store/types/timer';

const MainPage: React.FC = () => {
    const { selectedTimerId, defaultTimer } = useSelectedTimerStore();
    const getBaseTimer = useBaseTimerStore((state) => state.getTimer);
    const getRoutineTimer = useRoutineTimerStore((state) => state.getTimer);

    const timer =
        selectedTimerId === 'default'
            ? defaultTimer
            : getBaseTimer(selectedTimerId) || getRoutineTimer(selectedTimerId);

    if (!timer) return null;

    if (timer.type === TIMER_TYPE.BASE) {
        return <BaseTimer timer={timer} />;
    }

    if (timer.type === TIMER_TYPE.ROUTINE) {
        return <RoutineTimer timer={timer} />;
    }

    return null;
};

export default MainPage;
