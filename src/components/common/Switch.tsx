import { ReactNode } from 'react';

type SwitchOption = {
    value: string;
    label: string | ReactNode;
};

type SwitchProps = {
    options: [SwitchOption, SwitchOption];
    value: string;
    onChange: (value: string) => void;
    backgroundColor: string;
    isVisible?: boolean;
};

const Switch: React.FC<SwitchProps> = ({ options, value, onChange, backgroundColor, isVisible = true }) => {
    const isFirstSelected = value === options[0].value;

    return (
        <button
            onClick={() => onChange(isFirstSelected ? options[1].value : options[0].value)}
            className={`relative flex h-10 w-24 items-center justify-center rounded-full p-1 text-white transition-all duration-200 active:brightness-90 ${
                isVisible ? 'visible' : 'invisible'
            }`}
            style={{ backgroundColor }}
        >
            <div
                className={`absolute left-1 h-8 w-11 rounded-full bg-white/20 transition-all duration-200 ${
                    !isFirstSelected ? 'translate-x-11' : 'translate-x-0'
                }`}
            />
            <span
                className={`z-10 flex w-1/2 items-center justify-center text-center text-xl ${isFirstSelected ? 'font-bold' : 'font-normal'}`}
            >
                {options[0].label}
            </span>
            <span
                className={`z-10 flex w-1/2 items-center justify-center text-center text-xl ${!isFirstSelected ? 'font-bold' : 'font-normal'}`}
            >
                {options[1].label}
            </span>
        </button>
    );
};

export default Switch;
