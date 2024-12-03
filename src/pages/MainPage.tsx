import Timer from '../components/timer/Timer';
import { useMainTimerStore } from '../store/mainTimerStore';

const MainPage: React.FC = () => {
    const { selectedTimerId, getTimer } = useMainTimerStore();
    const timer = getTimer(selectedTimerId);

    return <Timer timer={timer} />;
};

export default MainPage;
