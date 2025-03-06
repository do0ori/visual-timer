import { Theme } from '../../../../store/types/theme';
import { handleDragEvent } from '../../../../utils/timerHandler';
import TimerFace from '../../../common/TimerFace';

type TimeSelectorProps = {
    time: number;
    currentTheme: Theme;
    setTime: (value: number) => void;
    text?: string;
};

const TimeSelector: React.FC<TimeSelectorProps> = ({ time, currentTheme, setTime, text }) => {
    const progress = time / 60;

    const handleTimerDrag = (e: React.MouseEvent | React.TouchEvent) => {
        handleDragEvent(e, setTime);
    };

    return <TimerFace progress={progress} currentTheme={currentTheme} handleDragEvent={handleTimerDrag} text={text} />;
};

TimeSelector.displayName = 'TimeSelector';

export default TimeSelector;
