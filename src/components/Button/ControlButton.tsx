import React from 'react';
import { Theme } from '../../config/timer/themes'; // 테마 타입 import

type ControlButtonProps = {
    onClick: () => void;
    'aria-label': string;
    currentTheme: Theme;
    visible?: boolean;
    children: React.ReactNode; // 버튼 내부 요소를 위한 children prop
};

const ControlButton: React.FC<ControlButtonProps> = ({
    onClick,
    'aria-label': ariaLabel,
    currentTheme,
    visible = true,
    children,
}) => {
    return (
        <button
            onClick={onClick}
            aria-label={ariaLabel}
            className={`flex h-16 w-16 items-center justify-center rounded-full p-2 text-white ${
                currentTheme.bg.point
            } border-2 border-white active:brightness-90 ${visible ? 'visible' : 'invisible'}`}
        >
            {children}
        </button>
    );
};

export default ControlButton;
