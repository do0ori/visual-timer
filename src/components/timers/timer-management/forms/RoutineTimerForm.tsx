import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { useEffect, useState } from 'react';
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
    const { selectedThemeCopy, defaultPointColorIndex } = useTheme();
    const { selectedTheme } = useThemeStore();
    const { addTimer, updateTimer } = useRoutineTimerStore();

    const { register, handleSubmit, watch, setValue } = useForm<RoutineTimerFormData>({
        defaultValues: {
            title: initialData?.title || '',
            pointColorIndex: initialData?.pointColorIndex ?? defaultPointColorIndex,
            items: initialData?.items || [],
        },
        mode: 'onChange',
    });

    const { pointColorIndex, items } = watch();

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
            title: data.title.trim() || `Routine-${data.items.length}`,
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

        // Return if dropped outside or at the same position
        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
            return;
        }

        const currentItems = watch('items');
        const itemsCopy = Array.from(currentItems);
        const [movedItem] = itemsCopy.splice(source.index, 1);
        itemsCopy.splice(destination.index, 0, movedItem);

        setValue('items', itemsCopy);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex grow flex-col justify-between gap-5 p-5">
            <div className="flex max-h-[calc(100vh-156px)] flex-col space-y-7 overflow-y-auto no-scrollbar">
                {mode === 'add' && <TimerTypeSelector selectedType={timerType} onTypeSelect={setTimerType} />}

                <div className="flex items-center gap-8"></div>
                <div className="flex items-center gap-8">
                    <MdTextFields size={30} className="shrink-0" />
                    <input
                        {...register('title')}
                        type="text"
                        placeholder="New Routine Timer"
                        className="w-full rounded border px-2 py-1 text-black"
                    />
                </div>

                <div className="flex items-center gap-8">
                    <MdOutlinePalette size={30} className="shrink-0" />
                    <PointColorSelector
                        colors={selectedThemeCopy.color.pointOptions}
                        selectedIndex={pointColorIndex ?? defaultPointColorIndex}
                        onSelect={(index) => setValue('pointColorIndex', index)}
                    />
                </div>

                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="timer-items">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col gap-7">
                                {items.map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps}>
                                                <RoutineTimerItemForm
                                                    index={index}
                                                    mode={mode}
                                                    currentTheme={selectedThemeCopy}
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

                <Button
                    onClick={() => {
                        const items = watch('items');
                        setValue('items', [
                            ...items,
                            {
                                id: crypto.randomUUID(),
                                title: '',
                                time: 5,
                                isMinutes: false,
                                pointColorIndex: defaultPointColorIndex,
                                interval: 0,
                                type: TIMER_TYPE.BASE,
                            },
                        ]);
                    }}
                    aria-label="Add Timer Item"
                    className="h-10 w-full rounded-2xl border-2"
                    style={{ borderColor: selectedTheme.color.point }}
                >
                    <IoMdAdd size={30} />
                </Button>
            </div>

            <Button currentTheme={selectedTheme} type="submit" aria-label="Save" className="h-10 w-full rounded-2xl">
                <IoMdCheckmark size={30} />
            </Button>
        </form>
    );
};

RoutineTimerForm.displayName = 'BaseTimerForm';

export default RoutineTimerForm;
