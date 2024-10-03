import React from 'react';
import { themes } from '../../config/timer/themes';

type ThemeSwitchButtonsProps = {
    setTheme: (theme: string) => void;
};

const ThemeSwitchButtons: React.FC<ThemeSwitchButtonsProps> = ({ setTheme }) => {
    return (
        <div className="mt-6 flex space-x-4">
            {Object.entries(themes).map(([key, theme]) => (
                <button
                    key={key}
                    onClick={() => setTheme(key)}
                    className={`${key !== 'black' ? 'text-black' : 'text-white'} w-20 p-2 ${
                        theme.bg.main
                    } rounded-full border-2 border-white shadow-[4px_4px_10px_rgba(0,0,0,0.2)]`}
                >
                    {theme.name}
                </button>
            ))}
        </div>
    );
};

export default ThemeSwitchButtons;
