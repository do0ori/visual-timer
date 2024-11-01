import HamburgerMenu from '../components/Navigation/HamburgerMenu';
import Timer from '../components/Timer/Timer';
import TimerSidePanel from '../components/Timer/TimerSidePanel';
import { useMainTimerStore } from '../store/mainTimerStore';

const MainPage: React.FC = () => {
    const { selectedTimerId, getTimer } = useMainTimerStore();
    const timer = getTimer(selectedTimerId);

    return (
        <div className="flex h-screen flex-col">
            <div className="flex items-center justify-between p-5">
                <HamburgerMenu isRunning={timer.isRunning} />
                <TimerSidePanel isRunning={timer.isRunning} />
            </div>
            <div className="mb-10 flex grow">
                <Timer timer={timer} />
            </div>
        </div>
    );
};

export default MainPage;
