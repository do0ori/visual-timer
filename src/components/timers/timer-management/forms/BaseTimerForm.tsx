import React from 'react';
import { useForm } from 'react-hook-form';
import { IoMdCheckmark } from 'react-icons/io';
import { MdOutlinePalette, MdOutlineTimer, MdTextFields } from 'react-icons/md';
import { TIMER_TYPE } from '../../../../config/timer/type';
import { useTheme } from '../../../../hooks/useTheme';
import { useBaseTimerStore } from '../../../../store/baseTimerStore';
import { useThemeStore } from '../../../../store/themeStore';
import { BaseTimerData } from '../../../../store/types/timer';
import { editorDialContainerClassName } from '../../../../utils/editorDialStyles';
import Button from '../../../common/Button';
import PointColorSelector from '../fields/PointColorSelector';
import TimerUnitSelector from '../fields/TimerUnitSelector';
import TimeSelector from '../fields/TimeSelector';

type BaseTimerFormData = Omit<BaseTimerData, 'id' | 'type'>;

type BaseTimerFormProps = {
    initialData?: BaseTimerData | null;
    mode: 'add' | 'edit';
    close: () => void;
};

const BaseTimerForm: React.FC<BaseTimerFormProps> = ({ initialData, mode, close }) => {
    const { selectedTheme } = useThemeStore();
    const { defaultPointColorIndex } = useTheme();
    const { addTimer, updateTimer } = useBaseTimerStore();

    const { register, handleSubmit, watch, setValue } = useForm<BaseTimerFormData>({
        defaultValues: {
            title: initialData?.title || '',
            pointColorIndex: initialData?.pointColorIndex ?? defaultPointColorIndex,
            isMinutes: initialData?.isMinutes ?? true,
            time: initialData?.time || 15,
        },
    });

    const { title, pointColorIndex, time, isMinutes } = watch();
    const { selectedThemeCopy } = useTheme(pointColorIndex);

    const onSubmit = (data: BaseTimerFormData) => {
        const timerData: BaseTimerData = {
            ...data,
            id: initialData?.id || `base_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            title: data.title?.trim() || `${data.time} ${data.isMinutes ? 'Min' : 'Sec'} Timer`,
            type: TIMER_TYPE.BASE,
        };

        if (mode === 'add') {
            addTimer(timerData);
        } else {
            updateTimer(timerData.id, timerData);
        }
        close();
    };

    const quickTimes = isMinutes ? [5, 10, 15, 20, 25, 30, 45, 50, 60] : [10, 15, 20, 30, 45, 60];

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex h-full flex-col space-y-6">
            {/* 2-Column Responsive Form Layout on Desktop */}
            <div className="grid flex-1 grid-cols-1 items-center gap-8 md:grid-cols-2">
                {/* Left Column: Interactive Visual Dial Preview */}
                <div className={`${editorDialContainerClassName} min-h-[300px]`}>
                    <span className="mb-2 text-xs font-bold uppercase tracking-wider opacity-70">
                        Interactive Dial Preview (Drag or Click)
                    </span>
                    <div className="flex size-64 items-center justify-center sm:size-72">
                        <TimeSelector
                            time={time}
                            currentTheme={selectedThemeCopy}
                            setTime={(newTime) => setValue('time', newTime)}
                            text={title || `${time} ${isMinutes ? 'min' : 'sec'}`}
                        />
                    </div>
                    <div className="mt-3 text-center">
                        <span className="font-display text-2xl font-bold">
                            {time} {isMinutes ? 'Minutes' : 'Seconds'}
                        </span>
                    </div>
                </div>

                {/* Right Column: Form Controls */}
                <div className="flex flex-col justify-center space-y-6">
                    {/* Title Input */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider opacity-75">
                            <MdTextFields className="text-base" /> Timer Name
                        </label>
                        <input
                            {...register('title')}
                            type="text"
                            placeholder="e.g. Morning Coffee, Stretching, Reading"
                            className="w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/20 dark:border-white/10 dark:bg-black/30 dark:text-white"
                        />
                    </div>

                    {/* Unit Toggle & Quick Presets */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider opacity-75">
                            <MdOutlineTimer className="text-base" /> Time Duration & Unit
                        </label>
                        <TimerUnitSelector
                            isMinutes={isMinutes}
                            onChange={(nextIsMinutes) => setValue('isMinutes', nextIsMinutes)}
                        />

                        {/* Quick time chips */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {quickTimes.map((q) => (
                                <button
                                    key={q}
                                    type="button"
                                    onClick={() => setValue('time', q)}
                                    className={`rounded-xl border px-3 py-1 text-xs font-semibold transition-all ${
                                        time === q
                                            ? 'border-transparent bg-black/80 text-white shadow-sm dark:bg-white dark:text-black'
                                            : 'border-black/10 bg-white/50 opacity-80 hover:opacity-100 dark:border-white/10 dark:bg-black/20'
                                    }`}
                                >
                                    {q}
                                    {isMinutes ? 'm' : 's'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Point Color Selector */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider opacity-75">
                            <MdOutlinePalette className="text-base" /> Dial Color
                        </label>
                        <PointColorSelector
                            colors={selectedThemeCopy.color.pointOptions}
                            selectedIndex={pointColorIndex ?? defaultPointColorIndex}
                            onSelect={(index) => setValue('pointColorIndex', index)}
                        />
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="border-t border-black/5 pt-4 dark:border-white/5">
                <Button
                    currentTheme={selectedTheme}
                    type="submit"
                    aria-label="Save Timer"
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-base font-bold shadow-float"
                >
                    <IoMdCheckmark size={22} />
                    <span>Save Timer</span>
                </Button>
            </div>
        </form>
    );
};

export default BaseTimerForm;
