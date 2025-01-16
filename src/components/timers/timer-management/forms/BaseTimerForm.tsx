import { forwardRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { MdOutlinePalette, MdOutlineTimer, MdTextFields } from 'react-icons/md';
import { TIMER_TYPE, TimerType } from '../../../../config/timer/type';
import { useTheme } from '../../../../hooks/useTheme';
import { useBaseTimerStore } from '../../../../store/baseTimerStore';
import { BaseTimerData } from '../../../../store/types/timer';
import TimeDisplay from '../../shared/displays/TimeDisplay';
import PointColorSelector from '../fields/PointColorSelector';
import TimerTypeSelector from '../fields/TimerTypeSelector';
import TimeSelector from '../fields/TimeSelector';

type BaseTimerFormData = Omit<BaseTimerData, 'id' | 'type'>;

type BaseTimerFormProps = {
    initialData?: BaseTimerData | null;
    mode: 'add' | 'edit';
    timerType: TimerType;
    setTimerType: React.Dispatch<React.SetStateAction<TimerType>>;
    close: () => void;
};

const BaseTimerForm = forwardRef<HTMLFormElement, BaseTimerFormProps>(
    ({ initialData, mode, timerType, setTimerType, close }, ref) => {
        const { addTimer, updateTimer } = useBaseTimerStore();
        const { register, handleSubmit, watch, setValue, reset } = useForm<BaseTimerFormData>({
            defaultValues: {
                title: initialData?.title || '',
                pointColorIndex: initialData?.pointColorIndex || 0,
                isMinutes: initialData?.isMinutes || false,
                time: initialData?.time || 5,
            },
        });
        const { pointColorIndex, time, isMinutes } = watch();
        const { currentTheme } = useTheme(pointColorIndex);

        useEffect(() => {
            if (initialData) {
                reset({
                    title: initialData.title,
                    time: initialData.time,
                    isMinutes: initialData.isMinutes,
                    pointColorIndex: initialData.pointColorIndex,
                });
            }
        }, [initialData, reset]);

        const onSubmit = (data: BaseTimerFormData) => {
            const timerData: BaseTimerData = {
                ...data,
                id: initialData?.id || crypto.randomUUID(),
                title: data.title?.trim() || `Timer-${data.time}`,
                type: TIMER_TYPE.BASE,
            };

            if (mode === 'add') {
                addTimer(timerData);
            } else {
                updateTimer(timerData.id, timerData);
            }
            reset();
            close();
        };

        return (
            <form ref={ref} id="timer-form" onSubmit={handleSubmit(onSubmit)} className="w-full p-5 pt-20">
                <div className="flex h-full max-h-[calc(100vh-6.25rem)] flex-col space-y-7 overflow-y-auto no-scrollbar">
                    {mode === 'add' && <TimerTypeSelector selectedType={timerType} onTypeSelect={setTimerType} />}

                    <label className="flex items-center gap-8">
                        <MdTextFields size={30} className="shrink-0" />
                        <input
                            {...register('title')}
                            type="text"
                            placeholder="New Basic Timer"
                            className="w-full rounded border px-2 py-1 text-black"
                        />
                    </label>

                    <label className="flex items-center gap-8">
                        <MdOutlinePalette size={30} className="shrink-0" />
                        <PointColorSelector
                            colors={currentTheme.color.pointOptions}
                            selectedIndex={pointColorIndex || 0}
                            onSelect={(index) => setValue('pointColorIndex', index)}
                        />
                    </label>

                    <label className="flex items-center gap-8">
                        <MdOutlineTimer size={30} className="shrink-0" />
                        <div className="flex gap-5">
                            <TimeDisplay
                                className="pointer-events-none w-10 text-center text-xl"
                                currentTime={time.toString()}
                            />
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="timeUnit"
                                    onChange={() => setValue('isMinutes', true)}
                                    checked={isMinutes}
                                    className="form-radio"
                                    style={{ accentColor: currentTheme.color.point }}
                                />
                                <span>Min</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="timeUnit"
                                    onChange={() => setValue('isMinutes', false)}
                                    checked={!isMinutes}
                                    className="form-radio"
                                    style={{ accentColor: currentTheme.color.point }}
                                />
                                <span>Sec</span>
                            </label>
                        </div>
                    </label>

                    <label className="flex grow items-center justify-center">
                        <TimeSelector
                            time={time}
                            currentTheme={currentTheme}
                            setTime={(newTime) => setValue('time', newTime)}
                        />
                    </label>
                </div>
            </form>
        );
    }
);

BaseTimerForm.displayName = 'BaseTimerForm';

export default BaseTimerForm;
