import HamburgerMenu from '../components/HamburgerMenu';
import Timer from '../components/Timer';
import TimerList from '../components/TimerList';
import { useMainTimerStore } from '../store/mainTimerStore';

const MainPage: React.FC = () => {
    const { selectedTimerId, getTimer } = useMainTimerStore();
    const timer = getTimer(selectedTimerId);
    console.log(selectedTimerId, timer);

    return (
        <div className="flex h-screen flex-col">
            <div className="flex items-center justify-between p-5">
                <HamburgerMenu isRunning={timer.isRunning} />
                <TimerList isRunning={timer.isRunning} />
            </div>
            <div className="mb-10 flex grow">
                <Timer timer={timer} />
            </div>
        </div>
    );
};

export default MainPage;
