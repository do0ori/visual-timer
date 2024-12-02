/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';
import { Theme } from '../../config/timer/themes';

type DropdownOption = {
    label: string;
    value: any;
};

type DropdownProps = {
    options: DropdownOption[];
    selectedValue: any;
    currentTheme: Theme;
    onChange: (value: any) => void;
    placeholder?: string;
};

const Dropdown: React.FC<DropdownProps> = ({
    options,
    selectedValue,
    currentTheme,
    onChange,
    placeholder = 'Select an option',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleOptionClick = (value: any) => {
        onChange(value);
        setIsOpen(false);
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {/* Selected Value Button */}
            <button
                className={`flex w-full cursor-pointer items-center justify-between rounded border px-4 py-2 text-left text-lg`}
                style={{ borderColor: currentTheme.color.point }}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{options.find((option) => option.value === selectedValue)?.label || placeholder}</span>
                {isOpen ? (
                    <BiChevronUp className="size-5" style={{ color: currentTheme.color.point }} />
                ) : (
                    <BiChevronDown className="size-5" style={{ color: currentTheme.color.point }} />
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <ul
                    className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded border bg-white"
                    style={{ borderColor: currentTheme.color.point }}
                >
                    {options.map((option) => (
                        <li
                            key={option.value}
                            className={`cursor-pointer border-b border-gray-300 px-4 py-2 text-lg text-black last:border-none hover:bg-gray-100`}
                            style={{
                                backgroundColor:
                                    option.value === selectedValue ? `${currentTheme.color.point}55` : 'white',
                            }}
                            onClick={() => handleOptionClick(option.value)}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dropdown;
