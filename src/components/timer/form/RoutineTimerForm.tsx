import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { forwardRef, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdTextFields } from 'react-icons/md';
import { TIMER_TYPE, TimerType } from '../../../config/timer/type';
import { useRoutineTimerStore } from '../../../store/routineTimerStore';
import { useThemeStore } from '../../../store/themeStore';
import { RoutineTimerData, RoutineTimerItem } from '../../../store/types/timer';
import { deepCopy } from '../../../utils/deepCopy';
import TimerTypeSelector from '../../selector/TimerTypeSelector';
import RoutineTimerItemForm from './RoutineTimertemForm';

export type RoutineTimerFormData = {
    title?: string | undefined;
    items: RoutineTimerItem[];
};

type RoutineTimerFormProps = {
    initialData?: RoutineTimerData | null;
    mode: 'add' | 'edit';
    timerType: TimerType;
    setTimerType: React.Dispatch<React.SetStateAction<TimerType>>;
    close: () => void;
};

const RoutineTimerForm = forwardRef<HTMLFormElement, RoutineTimerFormProps>(
    ({ initialData, mode, timerType, setTimerType, close }, ref) => {
        const [errorMessage, setErrorMessage] = useState<string>('');
        const { themes, globalThemeKey } = useThemeStore();
        const currentTheme = deepCopy(themes[globalThemeKey]);

        const { addTimer, updateTimer } = useRoutineTimerStore();
        const { register, handleSubmit, watch, setValue, reset } = useForm<RoutineTimerFormData>({
            defaultValues: {
                title: initialData?.title || '',
                items: initialData?.items || [],
            },
            mode: 'onChange',
        });

        const { items } = watch();

        useEffect(() => {
            if (initialData) {
                reset({
                    title: initialData.title,
                    items: initialData.items,
                });
            }
        }, [initialData, reset]);

        useEffect(() => {
            if (items.length === 0) {
                setErrorMessage('At least one timer item is required');
            } else {
                setErrorMessage('');
            }
        }, [items]);

        const onSubmit = (data: RoutineTimerFormData) => {
            if (items.length === 0) {
                setErrorMessage('At least one timer item is required');
                return;
            }
            const timerData: RoutineTimerData = {
                ...data,
                id: initialData?.id || crypto.randomUUID(),
                title: data.title?.trim() || `Routine-${data.items.length}`,
                type: TIMER_TYPE.ROUTINE,
            };

            if (mode === 'add') {
                addTimer(timerData);
            } else {
                updateTimer(timerData.id, timerData);
            }
            reset();
            close();
        };

        const handleDragEnd = (result: DropResult) => {
            const { destination, source } = result;

            // Return if dropped outside or at the same position
            if (
                !destination ||
                (destination.droppableId === source.droppableId && destination.index === source.index)
            ) {
                return;
            }

            const currentItems = watch('items');
            const itemsCopy = Array.from(currentItems);
            const [movedItem] = itemsCopy.splice(source.index, 1);
            itemsCopy.splice(destination.index, 0, movedItem);

            setValue('items', itemsCopy);
        };

        return (
            <form ref={ref} id="routine-timer-form" onSubmit={handleSubmit(onSubmit)} className="w-full p-5 pt-20">
                <div className="flex h-full max-h-[calc(100vh-6.25rem)] flex-col space-y-7 overflow-y-auto no-scrollbar">
                    {mode === 'add' && <TimerTypeSelector selectedType={timerType} onTypeSelect={setTimerType} />}

                    <label className="flex items-center gap-8">
                        <MdTextFields size={30} className="shrink-0" />
                        <input
                            {...register('title')}
                            type="text"
                            placeholder="New Routine Timer"
                            className="w-full rounded border px-2 py-1 text-black"
                        />
                    </label>

                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="timer-items">
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="flex flex-col gap-4"
                                >
                                    {items.map((item, index) => (
                                        <Draggable key={item.id} draggableId={item.id} index={index}>
                                            {(provided) => (
                                                <div ref={provided.innerRef} {...provided.draggableProps}>
                                                    <RoutineTimerItemForm
                                                        index={index}
                                                        mode={mode}
                                                        currentTheme={currentTheme}
                                                        dragHandleProps={provided.dragHandleProps ?? undefined}
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

                    {errorMessage && <div className="text-red-500">{errorMessage}</div>}

                    <button
                        type="button"
                        onClick={() => {
                            const items = watch('items');
                            setValue('items', [
                                ...items,
                                {
                                    id: crypto.randomUUID(),
                                    title: '',
                                    time: 5,
                                    isMinutes: false,
                                    pointColorIndex: 0,
                                    interval: 0,
                                    type: TIMER_TYPE.BASE,
                                },
                            ]);
                        }}
                        className="mt-2 rounded px-4 py-2 text-white shadow-md"
                        style={{ backgroundColor: currentTheme.color.point }}
                    >
                        Add Timer
                    </button>
                </div>
            </form>
        );
    }
);

RoutineTimerForm.displayName = 'BaseTimerForm';

export default RoutineTimerForm;
