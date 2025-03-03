import { forwardRef } from 'react';
import { Theme } from '../../../../config/theme/themes';
import TimerFace from '../../../common/TimerFace';
import TimerTextDisplay from './TimerTextDisplay';

type TimerDisplayProps = {
    progress: number;
    currentTheme: Theme;
    handleDragEvent?: (e: React.MouseEvent | React.TouchEvent) => void;
};

const TimerDisplay = forwardRef<SVGCircleElement, TimerDisplayProps>(
    ({ progress, currentTheme, handleDragEvent }, ref) => {
        return (
            <TimerFace ref={ref} progress={progress} currentTheme={currentTheme} handleDragEvent={handleDragEvent}>
                <TimerTextDisplay
                    timerDisplayRef={ref as React.RefObject<SVGCircleElement>}
                    currentTheme={currentTheme}
                    className="font-bold"
                />
            </TimerFace>
        );
    }
);

TimerDisplay.displayName = 'TimerDisplay';

export default TimerDisplay;
