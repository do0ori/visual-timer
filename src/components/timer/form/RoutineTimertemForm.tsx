import { Disclosure, DisclosureButton, DisclosurePanel, Transition } from '@headlessui/react';
import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';
import { useEffect } from 'react';
import { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import {
    MdDeleteOutline,
    MdDragIndicator,
    MdExpandMore,
    MdOutlineHourglassEmpty,
    MdOutlinePalette,
    MdOutlineTimer,
} from 'react-icons/md';
import { Theme } from '../../../config/theme/themes';
import { getTimerPointColor } from '../../../utils/themeUtils';
import { BaseTimerIcon } from '../../icons';
import TimeSelector from '../../selector/TimeSelector';
import TimeDisplay from '../display/TimeDisplay';
import { RoutineTimerFormData } from './RoutineTimerForm';

interface RoutineTimerItemFormProps {
    index: number;
    mode: 'add' | 'edit';
    currentTheme: Theme;
    dragHandleProps?: DraggableProvidedDragHandleProps;
    register: UseFormRegister<RoutineTimerFormData>;
    setValue: UseFormSetValue<RoutineTimerFormData>;
    watch: UseFormWatch<RoutineTimerFormData>;
    onDelete: () => void;
}

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
    const itemTitle = watch(`items.${index}.title`);

    useEffect(() => {
        if (!itemTitle?.trim()) {
            setValue(`items.${index}.title`, `Timer ${index + 1}`);
        }
    }, [itemTitle, index, setValue]);

    currentTheme.color.point = getTimerPointColor(currentTheme, item.pointColorIndex);

    return (
        <div className="rounded-lg border border-gray-500 p-4">
            <Disclosure defaultOpen={mode === 'add'}>
                {({ open }) => (
                    <>
                        <DisclosureButton className="flex w-full items-center justify-between">
                            <div className="flex items-center gap-8">
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
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                <MdDeleteOutline
                                    size={24}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete();
                                    }}
                                    className="shrink-0 rounded"
                                />
                                <MdExpandMore
                                    size={24}
                                    className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
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
                            <DisclosurePanel className="flex flex-col gap-4 pl-14 pt-6">
                                <label className="flex items-center gap-4">
                                    <MdOutlinePalette size={20} className="shrink-0" />
                                    <div className="flex flex-wrap gap-2">
                                        {currentTheme.color.pointOptions.map((color, colorIndex) => (
                                            <button
                                                key={colorIndex}
                                                type="button"
                                                className={`size-10 rounded-full border-2 transition-all ${
                                                    item.pointColorIndex === colorIndex
                                                        ? 'scale-110 border-white'
                                                        : 'border-transparent hover:scale-105'
                                                }`}
                                                style={{ backgroundColor: color }}
                                                onClick={() => setValue(`items.${index}.pointColorIndex`, colorIndex)}
                                            />
                                        ))}
                                    </div>
                                </label>

                                <div className="flex items-center gap-4">
                                    <MdOutlineTimer size={20} className="shrink-0" />
                                    <TimeSelector
                                        time={item.time}
                                        currentTheme={currentTheme}
                                        setTime={(newTime) => setValue(`items.${index}.time`, newTime)}
                                    />
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

                                <label className="flex items-center gap-4">
                                    <MdOutlineHourglassEmpty size={20} className="shrink-0" />
                                    <input
                                        type="number"
                                        min="0"
                                        {...register(`items.${index}.interval`, { valueAsNumber: true })}
                                        className="w-20 rounded border px-2 py-1 text-black"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <span>seconds interval before next timer</span>
                                </label>
                            </DisclosurePanel>
                        </Transition>
                    </>
                )}
            </Disclosure>
        </div>
    );
};

export default RoutineTimerItemForm;
