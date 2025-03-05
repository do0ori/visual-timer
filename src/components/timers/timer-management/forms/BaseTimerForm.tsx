import { forwardRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { IoMdCheckmark } from 'react-icons/io';
import { MdOutlinePalette, MdOutlineTimer, MdTextFields } from 'react-icons/md';
import { TIMER_TYPE, TimerType } from '../../../../config/timer/type';
import { useTheme } from '../../../../hooks/useTheme';
import { useBaseTimerStore } from '../../../../store/baseTimerStore';
import { useThemeStore } from '../../../../store/themeStore';
import { BaseTimerData } from '../../../../store/types/timer';
import Button from '../../../common/Button';
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
    save: () => void;
};

const BaseTimerForm = forwardRef<HTMLFormElement, BaseTimerFormProps>(
    ({ initialData, mode, timerType, setTimerType, close, save }, ref) => {
        const { selectedTheme } = useThemeStore();
        const { defaultPointColorIndex } = useTheme();
        const { addTimer, updateTimer } = useBaseTimerStore();
        const { register, handleSubmit, watch, setValue, reset } = useForm<BaseTimerFormData>({
            defaultValues: {
                title: initialData?.title || '',
                pointColorIndex: initialData?.pointColorIndex ?? defaultPointColorIndex,
                isMinutes: initialData?.isMinutes || false,
                time: initialData?.time || 5,
            },
        });
        const { pointColorIndex, time, isMinutes } = watch();
        const { selectedThemeCopy } = useTheme(pointColorIndex);

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
            <form
                ref={ref}
                id="timer-form"
                onSubmit={handleSubmit(onSubmit)}
                className="flex grow flex-col justify-between gap-5 p-5"
            >
                <div className="flex max-h-[calc(100vh-156px)] flex-col gap-7 overflow-y-auto no-scrollbar">
                    {mode === 'add' && <TimerTypeSelector selectedType={timerType} onTypeSelect={setTimerType} />}

                    <div className="flex items-center gap-8">
                        <MdTextFields size={30} className="shrink-0" />
                        <input
                            {...register('title')}
                            type="text"
                            placeholder="New Basic Timer"
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

                    <div className="flex items-center gap-8">
                        <MdOutlineTimer size={30} className="shrink-0" />
                        <div className="flex gap-5">
                            <TimeDisplay
                                className="pointer-events-none w-10 text-center text-xl"
                                currentTime={time.toString()}
                            />
                            <div className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="timeUnit"
                                    onChange={() => setValue('isMinutes', true)}
                                    checked={isMinutes}
                                    className="form-radio"
                                    style={{ accentColor: selectedThemeCopy.color.point }}
                                />
                                <span>Min</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="timeUnit"
                                    onChange={() => setValue('isMinutes', false)}
                                    checked={!isMinutes}
                                    className="form-radio"
                                    style={{ accentColor: selectedThemeCopy.color.point }}
                                />
                                <span>Sec</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex grow items-center justify-center">
                        <TimeSelector
                            time={time}
                            currentTheme={selectedThemeCopy}
                            setTime={(newTime) => setValue('time', newTime)}
                        />
                    </div>
                </div>

                <Button
                    currentTheme={selectedTheme}
                    onClick={save}
                    aria-label="Save"
                    className="h-10 w-full rounded-2xl"
                >
                    <IoMdCheckmark size={30} />
                </Button>
            </form>
        );
    }
);

BaseTimerForm.displayName = 'BaseTimerForm';

export default BaseTimerForm;
