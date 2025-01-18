import { Disclosure, DisclosureButton, DisclosurePanel, Transition } from '@headlessui/react';
import { useEffect, useRef, useState } from 'react';
import { MdExpandMore } from 'react-icons/md';
import { Theme } from '../../config/theme/themes';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import { useScrollToSelected } from '../../hooks/useScrollToSelected';

type DropdownOption<T> = {
    label: string;
    value: T;
    prefix?: string;
    subLabel?: string;
};

type DropdownProps<T> = {
    options: DropdownOption<T>[];
    selectedValue: T;
    currentTheme: Theme;
    onChange: (value: T) => void;
    customHeader?: React.ReactNode;
    placeholder?: string;
    buttonBorderColor?: string;
};

const Dropdown = <T,>({
    options,
    selectedValue,
    currentTheme,
    onChange,
    customHeader,
    placeholder = 'Select an option',
    buttonBorderColor,
}: DropdownProps<T>) => {
    const selectedItemRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    // Auto-scroll the entire Dropdown component into view
    const dropdownRef = useAutoScroll<HTMLDivElement>(isOpen);

    // Auto-scroll to selected item inside the panel
    useScrollToSelected(panelRef, selectedItemRef, isOpen);

    return (
        <div ref={dropdownRef} className="relative">
            <Disclosure>
                {({ open }) => {
                    useEffect(() => {
                        setIsOpen(open);
                    }, [open]);

                    return (
                        <>
                            <DisclosureButton
                                className={`${buttonBorderColor ? 'border' : ''} flex w-full items-center rounded-lg bg-white/5 px-4 py-2`}
                                style={{ borderColor: buttonBorderColor }}
                            >
                                {customHeader ?? (
                                    <div className="flex w-full items-center justify-between">
                                        <span>
                                            {options.find((option) => option.value === selectedValue)?.label ||
                                                placeholder}
                                        </span>
                                    </div>
                                )}
                                <MdExpandMore
                                    className={`${open ? 'rotate-180' : ''} size-5 transition-transform duration-200`}
                                />
                            </DisclosureButton>

                            <Transition
                                enter="transition duration-100 ease-out"
                                enterFrom="transform scale-95 opacity-0"
                                enterTo="transform scale-100 opacity-100"
                                leave="transition duration-75 ease-out"
                                leaveFrom="transform scale-100 opacity-100"
                                leaveTo="transform scale-95 opacity-0"
                            >
                                <DisclosurePanel
                                    ref={panelRef}
                                    className="absolute inset-x-0 top-full z-10 mt-2 max-h-[calc(30vh)] overflow-y-auto rounded-lg bg-white no-scrollbar"
                                >
                                    {options.map((option) => (
                                        <button
                                            key={`${option.value}`}
                                            ref={option.value === selectedValue ? selectedItemRef : null}
                                            onClick={() => onChange(option.value)}
                                            className={`flex w-full items-center justify-between gap-4 px-4 py-2 text-black transition-colors ${
                                                option.value === selectedValue ? 'bg-black/20' : 'hover:bg-black/10'
                                            }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className={`size-2 shrink-0 rounded-full ${
                                                        option.value === selectedValue ? 'opacity-100' : 'opacity-0'
                                                    }`}
                                                    style={{ backgroundColor: currentTheme.color.point }}
                                                />
                                                {option.prefix && <span className="shrink-0">{option.prefix}</span>}
                                                <span className="text-balance text-left">{option.label}</span>
                                            </div>
                                            {option.subLabel && (
                                                <span className="shrink-0 text-sm">{option.subLabel}</span>
                                            )}
                                        </button>
                                    ))}
                                </DisclosurePanel>
                            </Transition>
                        </>
                    );
                }}
            </Disclosure>
        </div>
    );
};

export default Dropdown;
