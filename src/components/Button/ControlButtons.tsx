import React from 'react';
import { IoAdd, IoPlay, IoPause, IoRefresh } from 'react-icons/io5';
import ControlButton from './ControlButton';
import { Theme } from '../../config/timer/themes';

type ControlButtonsProps = {
    isMinutes: boolean;
    isRunning: boolean;
    isInitialized: boolean;
    currentTheme: Theme;
    start: () => void;
    stop: () => void;
    reset: () => void;
    add: (time: number) => void;
};

const ControlButtons: React.FC<ControlButtonsProps> = ({
    isMinutes,
    isRunning,
    isInitialized,
    currentTheme,
    start,
    stop,
    reset,
    add,
}) => {
    return (
        <div className="mt-4 flex space-x-4">
            {/* Add Button */}
            <ControlButton
                onClick={() => add(isMinutes ? 1 : 10)}
                aria-label="Add one"
                currentTheme={currentTheme}
                visible={!isInitialized}
            >
                <div className="flex items-center justify-center">
                    <IoAdd size={20} />
                    <span className="text-lg">{isMinutes ? 1 : 10}</span>
                </div>
            </ControlButton>

            {/* Stop/Start Button */}
            <ControlButton
                onClick={isRunning ? stop : start}
                aria-label={isRunning ? 'Pause Timer' : 'Start Timer'}
                currentTheme={currentTheme}
            >
                {isRunning ? <IoPause size={25} /> : <IoPlay size={25} />}
            </ControlButton>

            {/* Reset Button */}
            <ControlButton
                onClick={reset}
                aria-label="Reset Timer"
                currentTheme={currentTheme}
                visible={!isInitialized}
            >
                <IoRefresh size={25} className="scale-x-[-1] transform" />
            </ControlButton>
        </div>
    );
};

export default ControlButtons;
