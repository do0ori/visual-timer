import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoMdAdd, IoMdCheckmark, IoMdFlash } from 'react-icons/io';
import { MdOutlinePalette, MdTextFields } from 'react-icons/md';
import { TIMER_TYPE, TimerType } from '../../../../config/timer/type';
import { useTheme } from '../../../../hooks/useTheme';
import { useRoutineTimerStore } from '../../../../store/routineTimerStore';
import { useThemeStore } from '../../../../store/themeStore';
import { RoutineTimerData } from '../../../../store/types/timer';
import Button from '../../../common/Button';
import PointColorSelector from '../fields/PointColorSelector';
import TimerTypeSelector from '../fields/TimerTypeSelector';
import RoutineTimerItemForm from './RoutineTimerItemForm';

export type RoutineTimerFormData = Omit<RoutineTimerData, 'id' | 'type'>;

type RoutineTimerFormProps = {
  initialData?: RoutineTimerData | null;
  mode: 'add' | 'edit';
  timerType: TimerType;
  setTimerType: React.Dispatch<React.SetStateAction<TimerType>>;
  close: () => void;
};

const RoutineTimerForm: React.FC<RoutineTimerFormProps> = ({ initialData, mode, timerType, setTimerType, close }) => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { selectedThemeCopy, defaultPointColorIndex } = useTheme();
  const { selectedTheme } = useThemeStore();
  const { addTimer, updateTimer } = useRoutineTimerStore();

  const { register, handleSubmit, watch, setValue } = useForm<RoutineTimerFormData>({
    defaultValues: {
      title: initialData?.title || '',
      pointColorIndex: initialData?.pointColorIndex ?? defaultPointColorIndex,
      items: initialData?.items || [
        { id: `step_1_${Date.now()}`, type: TIMER_TYPE.BASE, title: 'Focus 1', time: 25, isMinutes: true, pointColorIndex: 7, interval: 5 },
        { id: `step_2_${Date.now()}`, type: TIMER_TYPE.BASE, title: 'Break', time: 5, isMinutes: true, pointColorIndex: 3, interval: 5 },
      ],
    },
    mode: 'onChange',
  });

  const { pointColorIndex, items } = watch();

  useEffect(() => {
    if (!items || items.length === 0) {
      setErrorMessage('At least one routine step is required.');
    } else {
      setErrorMessage('');
    }
  }, [items]);

  const totalMinutes = (items || []).reduce(
    (sum, item) => sum + (item.isMinutes ? item.time : Math.round(item.time / 60)),
    0
  );

  const onSubmit = (data: RoutineTimerFormData) => {
    if (!items || items.length === 0) {
      setErrorMessage('At least one routine step is required.');
      return;
    }
    const timerData: RoutineTimerData = {
      ...data,
      id: initialData?.id || `routine_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: data.title.trim() || `Routine (${data.items.length} steps)`,
      type: TIMER_TYPE.ROUTINE,
    };

    if (mode === 'add') {
      addTimer(timerData);
    } else {
      updateTimer(timerData.id, timerData);
    }
    close();
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    const currentItems = watch('items');
    const itemsCopy = Array.from(currentItems);
    const [movedItem] = itemsCopy.splice(source.index, 1);
    itemsCopy.splice(destination.index, 0, movedItem);

    setValue('items', itemsCopy);
  };

  const handleApplyPomodoroPreset = () => {
    setValue('title', '🍅 Pomodoro Routine');
    setValue('items', [
      { id: `p1_${Date.now()}`, type: TIMER_TYPE.BASE, title: 'Focus 1', time: 25, isMinutes: true, pointColorIndex: 7, interval: 5 },
      { id: `b1_${Date.now()}`, type: TIMER_TYPE.BASE, title: 'Short Break', time: 5, isMinutes: true, pointColorIndex: 3, interval: 5 },
      { id: `p2_${Date.now()}`, type: TIMER_TYPE.BASE, title: 'Focus 2', time: 25, isMinutes: true, pointColorIndex: 7, interval: 5 },
      { id: `b2_${Date.now()}`, type: TIMER_TYPE.BASE, title: 'Short Break', time: 5, isMinutes: true, pointColorIndex: 3, interval: 5 },
      { id: `p3_${Date.now()}`, type: TIMER_TYPE.BASE, title: 'Focus 3', time: 25, isMinutes: true, pointColorIndex: 7, interval: 5 },
      { id: `lb_${Date.now()}`, type: TIMER_TYPE.BASE, title: 'Long Break', time: 20, isMinutes: true, pointColorIndex: 2, interval: 5 },
    ]);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full space-y-6">
      {mode === 'add' && (
        <div className="max-w-md mx-auto w-full">
          <TimerTypeSelector selectedType={timerType} onTypeSelect={setTimerType} />
        </div>
      )}

      {/* Routine Metadata & Summary Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white/40 dark:bg-black/20 backdrop-blur-md border border-white/30 shadow-soft space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          {/* Title Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider opacity-75 flex items-center gap-1.5">
              <MdTextFields className="text-base" /> Routine Name
            </label>
            <input
              {...register('title')}
              type="text"
              placeholder="e.g. Pomodoro 25/5, Workout HIIT, Study Block"
              className="w-full px-4 py-2.5 rounded-xl bg-white/70 dark:bg-black/30 border border-black/10 dark:border-white/10 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:text-white"
            />
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center justify-between sm:justify-end gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-black/5 dark:bg-white/10 text-center">
              <div className="text-xs opacity-70 font-semibold">Total Steps</div>
              <div className="text-base font-bold font-display">{items?.length || 0}</div>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-black/5 dark:bg-white/10 text-center">
              <div className="text-xs opacity-70 font-semibold">Total Duration</div>
              <div className="text-base font-bold font-display">~{totalMinutes} mins</div>
            </div>
            <button
              type="button"
              onClick={handleApplyPomodoroPreset}
              className="btn-tactile px-3 py-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-300 font-bold text-xs flex items-center gap-1 border border-red-500/20"
            >
              <IoMdFlash /> Fill Pomodoro
            </button>
          </div>
        </div>

        {/* Theme Point Color */}
        <div className="space-y-1.5 pt-2 border-t border-black/5 dark:border-white/5">
          <label className="text-xs font-bold uppercase tracking-wider opacity-75 flex items-center gap-1.5">
            <MdOutlinePalette className="text-base" /> Routine Highlight Color
          </label>
          <PointColorSelector
            colors={selectedThemeCopy.color.pointOptions}
            selectedIndex={pointColorIndex ?? defaultPointColorIndex}
            onSelect={(index) => setValue('pointColorIndex', index)}
          />
        </div>
      </div>

      {/* Routine Steps List with Drag and Drop */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider opacity-80">
            Routine Steps ({items?.length || 0}) • Drag to reorder
          </span>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="timer-items">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                {items?.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(providedDraggable) => (
                      <div ref={providedDraggable.innerRef} {...providedDraggable.draggableProps}>
                        <RoutineTimerItemForm
                          index={index}
                          mode={mode}
                          currentTheme={selectedThemeCopy}
                          dragHandleProps={providedDraggable.dragHandleProps ?? undefined}
                          register={register}
                          setValue={setValue}
                          watch={watch}
                          onDelete={() => {
                            const newItems = items.filter((_, i) => i !== index);
                            setValue('items', newItems);
                          }}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {errorMessage && <div className="text-xs text-red-500 font-bold px-1">{errorMessage}</div>}

        {/* Add Step Button */}
        <button
          type="button"
          onClick={() => {
            const current = watch('items') || [];
            setValue('items', [
              ...current,
              {
                id: `step_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
                title: `Step ${current.length + 1}`,
                time: 10,
                isMinutes: true,
                pointColorIndex: defaultPointColorIndex,
                interval: 5,
                type: TIMER_TYPE.BASE,
              },
            ]);
          }}
          className="btn-tactile w-full py-3.5 rounded-2xl border-2 border-dashed font-bold text-sm flex items-center justify-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          style={{ borderColor: selectedTheme.color.point, color: selectedTheme.color.point }}
        >
          <IoMdAdd size={20} />
          <span>Add Next Routine Step</span>
        </button>
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-black/5 dark:border-white/5">
        <Button
          currentTheme={selectedTheme}
          type="submit"
          aria-label="Save Routine"
          className="h-12 w-full rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-float"
        >
          <IoMdCheckmark size={22} />
          <span>Save Routine</span>
        </Button>
      </div>
    </form>
  );
};

RoutineTimerForm.displayName = 'RoutineTimerForm';

export default RoutineTimerForm;
