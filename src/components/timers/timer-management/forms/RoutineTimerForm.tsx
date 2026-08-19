import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoMdAdd, IoMdCheckmark } from 'react-icons/io';
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
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);
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

  const handleAddStep = () => {
    const current = watch('items') || [];
    const id = `step_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;

    setValue('items', [
      ...current,
      {
        id,
        title: `Step ${current.length + 1}`,
        time: 10,
        isMinutes: true,
        pointColorIndex: defaultPointColorIndex,
        interval: 5,
        type: TIMER_TYPE.BASE,
      },
    ]);
    setExpandedStepId(id);
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
        <div className="space-y-4">
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
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-black/5 px-3.5 py-2.5 text-center dark:bg-white/10">
              <div className="text-xs font-semibold opacity-70">Timers</div>
              <div className="text-lg font-bold font-display">{items?.length || 0}</div>
            </div>
            <div className="rounded-xl bg-black/5 px-3.5 py-2.5 text-center dark:bg-white/10">
              <div className="text-xs font-semibold opacity-70">Duration</div>
              <div className="text-lg font-bold font-display">~{totalMinutes} mins</div>
            </div>
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
            <div>
              <span className="text-xs font-bold uppercase tracking-wider opacity-80">Timers in this routine</span>
              <p className="mt-0.5 text-xs opacity-60">Each timer starts after the previous one ends.</p>
            </div>
            <span className="sr-only">
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
                          currentTheme={selectedThemeCopy}
                          dragHandleProps={providedDraggable.dragHandleProps ?? undefined}
                          register={register}
                          setValue={setValue}
                          watch={watch}
                          isOpen={expandedStepId === item.id}
                          onToggle={() => setExpandedStepId(expandedStepId === item.id ? null : item.id)}
                          onDelete={() => {
                            const newItems = items.filter((_, i) => i !== index);
                            setValue('items', newItems);
                            if (expandedStepId === item.id) setExpandedStepId(null);
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
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleAddStep}
            className="btn-tactile w-full py-3.5 rounded-2xl border-2 border-dashed font-bold text-sm flex items-center justify-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            style={{ borderColor: selectedTheme.color.point, color: selectedTheme.color.point }}
          >
            <IoMdAdd size={20} />
            <span>Add Timer to Routine</span>
          </button>
        </div>
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
