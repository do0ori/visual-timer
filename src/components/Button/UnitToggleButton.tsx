import React from 'react';
import { IoSwapVertical } from 'react-icons/io5';
import { Theme } from '../../config/timer/themes';

type UnitToggleButtonProps = {
    onClick: () => void;
    isMinutes: boolean;
    isRunning: boolean;
    currentTheme: Theme;
};

const UnitToggleButton: React.FC<UnitToggleButtonProps> = ({ onClick, isMinutes, isRunning, currentTheme }) => {
    return (
        <button
            onClick={onClick}
            className={`w-20 rounded-full p-2 text-white ${currentTheme.bg.point} border-2 border-white active:brightness-90 ${
                isRunning ? 'invisible' : 'visible'
            }`}
        >
            <div className="flex items-center justify-center">
                <IoSwapVertical size={20} />
                <span className="ml-1 text-lg">{isMinutes ? 'min' : 'sec'}</span>
            </div>
        </button>
    );
};

export default UnitToggleButton;
