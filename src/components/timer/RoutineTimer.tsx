import { RoutineTimerData } from '../../store/types/timer';

const RoutineTimer: React.FC<{ timer: RoutineTimerData }> = ({ timer }) => {
    return <div>{JSON.stringify(timer, null, 2)}</div>;
};

export default RoutineTimer;
