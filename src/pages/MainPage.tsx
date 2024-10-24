import Timer from '../components/Timer';
import { useTimerStore } from '../store/timerStore';

const MainPage: React.FC = () => {
    const { mainTimer } = useTimerStore();
    return <Timer timer={mainTimer} type="main" />;
};

export default MainPage;
