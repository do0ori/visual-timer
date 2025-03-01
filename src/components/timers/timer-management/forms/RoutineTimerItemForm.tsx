import { Disclosure, DisclosureButton, DisclosurePanel, Transition } from '@headlessui/react';
import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';
import { useEffect, useState } from 'react';
import { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import {
    MdDeleteOutline,
    MdDragIndicator,
    MdExpandMore,
    MdOutlineHourglassEmpty,
    MdOutlinePalette,
    MdOutlineTimer,
} from 'react-icons/md';
import { Theme } from '../../../../config/theme/themes';
import { useAutoScroll } from '../../../../hooks/useAutoScroll';
import { getTimerPointColor } from '../../../../utils/themeUtils';
import { BaseTimerIcon } from '../../../icons';
import TimeDisplay from '../../shared/displays/TimeDisplay';
import PointColorSelector from '../fields/PointColorSelector';
import TimeSelector from '../fields/TimeSelector';
import { RoutineTimerFormData } from './RoutineTimerForm';

type RoutineTimerItemFormProps = {
    index: number;
    mode: 'add' | 'edit';
    currentTheme: Theme;
    dragHandleProps?: DraggableProvidedDragHandleProps;
    register: UseFormRegister<RoutineTimerFormData>;
    setValue: UseFormSetValue<RoutineTimerFormData>;
    watch: UseFormWatch<RoutineTimerFormData>;
    onDelete: () => void;
};

const RoutineTimerItemForm = ({
    index,
    mode,
    currentTheme,
    dragHandleProps,
    register,
    setValue,
    watch,
    onDelete,
}: RoutineTimerItemFormProps) => {
    const item = watch(`items.${index}`);
    const [isOpen, setIsOpen] = useState(false);

    currentTheme.color.point = getTimerPointColor(currentTheme, item.pointColorIndex);

    const containerRef = useAutoScroll<HTMLDivElement>(isOpen);

    return (
        <div ref={containerRef}>
            <div className="rounded-lg border border-gray-500 p-4">
                <Disclosure defaultOpen={mode === 'add'}>
                    {({ open }) => {
                        useEffect(() => {
                            setIsOpen(open);
                        }, [open]);
                        return (
                            <>
                                <DisclosureButton className="flex w-full items-center justify-between gap-8">
                                    <div className="flex items-center gap-4">
                                        <div {...dragHandleProps}>
                                            <MdDragIndicator size={24} className="cursor-move" />
                                        </div>
                                        <BaseTimerIcon
                                            size={24}
                                            time={item.time}
                                            stroke={getTimerPointColor(currentTheme, item.pointColorIndex)}
                                            className="shrink-0"
                                        />
                                        <input
                                            {...register(`items.${index}.title`)}
                                            placeholder={`Timer ${index + 1}`}
                                            className="w-full rounded border px-2 py-1 text-black"
                                            onClick={(e) => e.stopPropagation()}
                                            onKeyDown={(e) => e.stopPropagation()}
                                            onBlur={(e) => {
                                                const trimmedValue = e.target.value.trim();
                                                setValue(`items.${index}.title`, trimmedValue);
                                            }}
                                        />
                                        {!isOpen && (
                                            <span className="shrink-0">{`${item.time} ${item.isMinutes ? 'min' : 'sec'}`}</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <MdExpandMore
                                            size={24}
                                            className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                                        />
                                        <MdDeleteOutline
                                            size={24}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete();
                                            }}
                                            className="shrink-0 rounded"
                                        />
                                    </div>
                                </DisclosureButton>
                                <Transition
                                    enter="transition duration-100 ease-out"
                                    enterFrom="transform scale-95 opacity-0"
                                    enterTo="transform scale-100 opacity-100"
                                    leave="transition duration-75 ease-out"
                                    leaveFrom="transform scale-100 opacity-100"
                                    leaveTo="transform scale-95 opacity-0"
                                >
                                    <DisclosurePanel className="flex flex-col gap-4 pl-11 pt-6">
                                        <label className="flex items-center gap-4">
                                            <MdOutlinePalette size={20} className="shrink-0" />
                                            <PointColorSelector
                                                colors={currentTheme.color.pointOptions}
                                                selectedIndex={item.pointColorIndex}
                                                onSelect={(colorIndex) =>
                                                    setValue(`items.${index}.pointColorIndex`, colorIndex)
                                                }
                                            />
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <MdOutlineTimer size={20} className="shrink-0" />
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center justify-center gap-4">
                                                    <TimeDisplay
                                                        className="pointer-events-none w-10 text-center text-xl"
                                                        currentTime={item.time.toString()}
                                                    />
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            name={`timeUnit-${index}`}
                                                            onChange={() => setValue(`items.${index}.isMinutes`, true)}
                                                            checked={item.isMinutes}
                                                            className="form-radio"
                                                            style={{ accentColor: currentTheme.color.point }}
                                                        />
                                                        <span>Min</span>
                                                    </label>
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            name={`timeUnit-${index}`}
                                                            onChange={() => setValue(`items.${index}.isMinutes`, false)}
                                                            checked={!item.isMinutes}
                                                            className="form-radio"
                                                            style={{ accentColor: currentTheme.color.point }}
                                                        />
                                                        <span>Sec</span>
                                                    </label>
                                                </div>
                                                <TimeSelector
                                                    time={item.time}
                                                    currentTheme={currentTheme}
                                                    setTime={(newTime) => setValue(`items.${index}.time`, newTime)}
                                                />
                                            </div>
                                        </div>
                                        <label className="flex items-center gap-4">
                                            <MdOutlineHourglassEmpty size={20} className="shrink-0" />
                                            <span>Alarm for</span>
                                            <input
                                                type="number"
                                                min="0"
                                                {...register(`items.${index}.interval`, { valueAsNumber: true })}
                                                className="w-16 rounded border px-2 py-1 text-black"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <span>seconds</span>
                                        </label>
                                    </DisclosurePanel>
                                </Transition>
                            </>
                        );
                    }}
                </Disclosure>
            </div>

            <div className="relative">
                {!isOpen && (
                    <div className="pointer-events-none absolute left-[calc(50%-10px)] top-0 flex items-center text-gray-400">
                        <HiOutlineDotsVertical size={20} className="mr-2" />
                        <span>{item.interval > 0 ? `${item.interval} sec Alarm` : 'No Alarm'}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoutineTimerItemForm;
