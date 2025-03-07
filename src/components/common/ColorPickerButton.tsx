import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { Fragment, useCallback, useState } from 'react';
import { HexColorPicker } from 'react-colorful';

type ColorPickerButtonProps = {
    color: string;
    onChange: (color: string) => void;
    onClick?: () => void;
    className?: string;
};

const ColorPickerButton: React.FC<ColorPickerButtonProps> = ({ color, onChange, onClick, className = '' }) => {
    const [hexInput, setHexInput] = useState(color.replace('#', ''));

    const handleColorChange = useCallback(
        (newColor: string) => {
            setHexInput(newColor.replace('#', ''));
            onChange(newColor);
        },
        [onChange]
    );

    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace('#', '');
        setHexInput(value);
        if (/^[0-9A-Fa-f]{6}$/.test(value)) {
            onChange('#' + value);
        }
    };

    return (
        <Popover className="relative">
            {({ open }) => (
                <Fragment>
                    <PopoverButton
                        className={`size-10 rounded-full border border-gray-400 will-change-[background-color] ${className}`}
                        style={{ backgroundColor: color }}
                        onClick={onClick}
                    />
                    {open && (
                        <PopoverPanel static className="fixed right-4 top-4 z-50">
                            <div className="flex flex-col gap-3 rounded-lg border border-gray-400 bg-white p-5 shadow-lg">
                                <HexColorPicker color={color} onChange={handleColorChange} />
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-sm font-medium">HEX</span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-sm text-gray-500">#</span>
                                        <input
                                            type="text"
                                            value={hexInput}
                                            onChange={handleHexChange}
                                            className="w-24 rounded border px-2 py-1 text-center text-sm uppercase"
                                            maxLength={6}
                                            placeholder="000000"
                                            spellCheck={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        </PopoverPanel>
                    )}
                </Fragment>
            )}
        </Popover>
    );
};

export default ColorPickerButton;
