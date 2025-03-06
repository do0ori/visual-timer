import { Theme } from '../../../../store/types/theme';
import TimerFace from '../../../common/TimerFace';

type TimerDisplayProps = {
    progress: number;
    currentTheme: Theme;
    handleDragEvent?: (e: React.MouseEvent | React.TouchEvent) => void;
    text?: string;
};

const TimerDisplay: React.FC<TimerDisplayProps> = ({ progress, currentTheme, handleDragEvent, text }) => {
    return <TimerFace progress={progress} currentTheme={currentTheme} handleDragEvent={handleDragEvent} text={text} />;
};

TimerDisplay.displayName = 'TimerDisplay';

export default TimerDisplay;
