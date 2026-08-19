import { Disclosure, DisclosureButton, DisclosurePanel, Transition } from '@headlessui/react';
import React, { useEffect, useRef, useState } from 'react';
import { MdExpandMore } from 'react-icons/md';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import { useScrollToSelected } from '../../hooks/useScrollToSelected';
import { Theme } from '../../store/types/theme';

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
  onToggle?: (isOpen: boolean) => void;
};

const Dropdown = <T,>({
  options,
  selectedValue,
  currentTheme,
  onChange,
  customHeader,
  placeholder = 'Select an option',
  buttonBorderColor,
  onToggle,
}: DropdownProps<T>) => {
  const selectedItemRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useAutoScroll<HTMLDivElement>(isOpen);
  useScrollToSelected(panelRef, selectedItemRef, isOpen);

  return (
    <div ref={dropdownRef} className="relative">
      <Disclosure>
        {({ open }) => {
          useEffect(() => {
            setIsOpen(open);
            if (onToggle) onToggle(open);
          }, [open]);

          return (
            <>
              <DisclosureButton
                className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 transition-colors border shadow-xs ${
                  open ? 'ring-2' : ''
                }`}
                style={{
                  backgroundColor: `${currentTheme.color.sub}25`,
                  borderColor: buttonBorderColor || `${currentTheme.color.point}60`,
                }}
              >
                {customHeader ?? (
                  <span className="font-semibold text-sm">
                    {options.find((option) => option.value === selectedValue)?.label || placeholder}
                  </span>
                )}
                <MdExpandMore
                  className={`${open ? 'rotate-180' : ''} size-5 transition-transform duration-200 opacity-75`}
                  style={{ color: currentTheme.color.point }}
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
                  className="absolute inset-x-0 top-full z-30 mt-2 max-h-[calc(35vh)] overflow-y-auto rounded-2xl bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/15 shadow-2xl no-scrollbar p-1.5 space-y-1"
                >
                  {options.map((option) => (
                    <button
                      key={`${option.value}`}
                      ref={option.value === selectedValue ? selectedItemRef : null}
                      onClick={() => onChange(option.value)}
                      className={`flex w-full items-center justify-between gap-4 px-3.5 py-2.5 rounded-xl text-zinc-900 dark:text-zinc-100 transition-colors text-sm ${
                        option.value === selectedValue
                          ? 'bg-black/5 dark:bg-white/10 font-bold'
                          : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-2.5 shrink-0 rounded-full ${
                            option.value === selectedValue ? 'opacity-100' : 'opacity-0'
                          }`}
                          style={{ backgroundColor: currentTheme.color.point }}
                        />
                        {option.prefix && <span className="shrink-0">{option.prefix}</span>}
                        <span className="text-left">{option.label}</span>
                      </div>
                      {option.subLabel && (
                        <span className="shrink-0 text-xs opacity-60 font-normal">{option.subLabel}</span>
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
