import { Disclosure, DisclosureButton, DisclosurePanel, Transition } from '@headlessui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MdExpandMore } from 'react-icons/md';
import { Theme } from '../../config/theme/themes';

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

    const handleScrollToSelected = useCallback(() => {
        if (!selectedItemRef.current || !panelRef.current) return;

        const panel = panelRef.current;
        const selectedItem = selectedItemRef.current;
        const panelHeight = panel.clientHeight;
        const itemHeight = selectedItem.clientHeight;
        const scrollTo = selectedItem.offsetTop - panelHeight / 2 + itemHeight / 2;

        panel.scrollTo({
            top: Math.max(0, scrollTo),
            behavior: 'smooth',
        });
    }, []);

    useEffect(() => {
        if (isOpen) {
            setTimeout(handleScrollToSelected, 100);
        }
    }, [isOpen, handleScrollToSelected]);

    return (
        <Disclosure>
            {({ open }) => {
                useEffect(() => {
                    setIsOpen(open);
                }, [open]);

                return (
                    <div className="relative">
                        <DisclosureButton
                            className={`${buttonBorderColor ? 'border' : ''} flex w-full items-center rounded-lg bg-white/5 px-4 py-2`}
                            style={{ borderColor: buttonBorderColor }}
                        >
                            {customHeader ?? (
                                <div className="flex w-full items-center justify-between">
                                    <span>
                                        {options.find((option) => option.value === selectedValue)?.label || placeholder}
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
                                        className={`flex w-full items-center justify-between px-4 py-2 text-black transition-colors ${
                                            option.value === selectedValue ? 'bg-black/20' : 'hover:bg-black/10'
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`size-2 rounded-full ${
                                                    option.value === selectedValue ? 'opacity-100' : 'opacity-0'
                                                }`}
                                                style={{ backgroundColor: currentTheme.color.point }}
                                            />
                                            {option.prefix && <span>{option.prefix}</span>}
                                            <span>{option.label}</span>
                                        </div>
                                        {option.subLabel && <span className="text-sm">{option.subLabel}</span>}
                                    </button>
                                ))}
                            </DisclosurePanel>
                        </Transition>
                    </div>
                );
            }}
        </Disclosure>
    );
};

export default Dropdown;
