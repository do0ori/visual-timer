import React from 'react';
import { useForm } from 'react-hook-form';
import { IoMdCheckmark } from 'react-icons/io';
import { MdOutlinePalette, MdOutlineTimer, MdTextFields } from 'react-icons/md';
import { TIMER_TYPE } from '../../../../config/timer/type';
import { useTheme } from '../../../../hooks/useTheme';
import { useBaseTimerStore } from '../../../../store/baseTimerStore';
import { useThemeStore } from '../../../../store/themeStore';
import { BaseTimerData } from '../../../../store/types/timer';
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full space-y-6">
      {/* 2-Column Responsive Form Layout on Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center flex-1">
        {/* Left Column: Interactive Visual Dial Preview */}
        <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-white/40 dark:bg-black/20 backdrop-blur-md border border-white/30 shadow-soft min-h-[300px]">
          <span className="text-xs font-bold uppercase tracking-wider opacity-70 mb-2">
            Interactive Dial Preview (Drag or Click)
          </span>
          <div className="size-64 sm:size-72 flex items-center justify-center">
            <TimeSelector
              time={time}
              currentTheme={selectedThemeCopy}
              setTime={(newTime) => setValue('time', newTime)}
              text={title || `${time} ${isMinutes ? 'min' : 'sec'}`}
            />
          </div>
          <div className="mt-3 text-center">
            <span className="text-2xl font-bold font-display">
              {time} {isMinutes ? 'Minutes' : 'Seconds'}
            </span>
          </div>
        </div>

        {/* Right Column: Form Controls */}
        <div className="space-y-6 flex flex-col justify-center">
          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider opacity-75 flex items-center gap-1.5">
              <MdTextFields className="text-base" /> Timer Name
            </label>
            <input
              {...register('title')}
              type="text"
              placeholder="e.g. Morning Coffee, Stretching, Reading"
              className="w-full px-4 py-3 rounded-2xl bg-white/70 dark:bg-black/30 border border-black/10 dark:border-white/10 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:text-white"
            />
          </div>

          {/* Unit Toggle & Quick Presets */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider opacity-75 flex items-center gap-1.5">
              <MdOutlineTimer className="text-base" /> Time Duration & Unit
            </label>
            <TimerUnitSelector isMinutes={isMinutes} onChange={(nextIsMinutes) => setValue('isMinutes', nextIsMinutes)} />

            {/* Quick time chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {quickTimes.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setValue('time', q)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                    time === q
                      ? 'bg-black/80 text-white dark:bg-white dark:text-black border-transparent shadow-sm'
                      : 'bg-white/50 dark:bg-black/20 border-black/10 dark:border-white/10 opacity-80 hover:opacity-100'
                  }`}
                >
                  {q}{isMinutes ? 'm' : 's'}
                </button>
              ))}
            </div>
          </div>

          {/* Point Color Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider opacity-75 flex items-center gap-1.5">
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
      <div className="pt-4 border-t border-black/5 dark:border-white/5">
        <Button
          currentTheme={selectedTheme}
          type="submit"
          aria-label="Save Timer"
          className="h-12 w-full rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-float"
        >
          <IoMdCheckmark size={22} />
          <span>Save Timer</span>
        </Button>
      </div>
    </form>
  );
};

export default BaseTimerForm;
