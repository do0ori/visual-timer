import { Theme } from '../../../../store/types/theme';
import { handleDragEvent } from '../../../../utils/timerHandler';
import TimerFace from '../../../common/TimerFace';

type TimeSelectorProps = {
    time: number;
    currentTheme: Theme;
    setTime: (value: number) => void;
};

const TimeSelector: React.FC<TimeSelectorProps> = ({ time, currentTheme, setTime }) => {
    const progress = time / 60;

    const handleTimerDrag = (e: React.MouseEvent | React.TouchEvent) => {
        handleDragEvent(e, setTime);
    };

    return <TimerFace progress={progress} currentTheme={currentTheme} handleDragEvent={handleTimerDrag} />;
};

export default TimeSelector;
