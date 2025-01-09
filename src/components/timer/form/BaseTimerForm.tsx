import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { MdOutlinePalette, MdOutlineTimer, MdTextFields } from 'react-icons/md';
import { useThemeStore } from '../../../store/themeStore';
import { deepCopy } from '../../../utils/deepCopy';
import { getTimerPointColor } from '../../../utils/themeUtils';
import TimeSelector from '../../selector/TimeSelector';
import TimeDisplay from '../display/TimeDisplay';
import { BaseTimerFormData, baseTimerSchema } from './BaseTimerSchema';
import { TIMER_TYPE } from '../../../config/timer/type';

type BaseTimerFormProps = {
    initialData?: Partial<BaseTimerFormData>;
    onSubmit: (data: BaseTimerFormData) => void;
};

const BaseTimerForm = ({ initialData, onSubmit }: BaseTimerFormProps) => {
    const { themes, globalThemeKey } = useThemeStore();
    const currentTheme = deepCopy(themes[globalThemeKey]);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<BaseTimerFormData>({
        resolver: zodResolver(baseTimerSchema),
        defaultValues: {
            title: '',
            time: 5,
            isMinutes: false,
            pointColorIndex: 0,
            type: TIMER_TYPE.BASE,
            ...initialData,
        },
    });

    const time = watch('time');
    const isMinutes = watch('isMinutes');
    const pointColorIndex = watch('pointColorIndex');

    currentTheme.color.point = getTimerPointColor(currentTheme, pointColorIndex);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <label className="flex items-center gap-8">
                <MdTextFields size={30} />
                <input
                    {...register('title')}
                    type="text"
                    placeholder="New Timer"
                    className="w-full rounded border px-2 py-1 text-black"
                />
            </label>

            <label className="flex items-center gap-8">
                <MdOutlinePalette size={30} />
                <div className="flex flex-wrap gap-3">
                    {currentTheme.color.pointOptions.map((color, index) => (
                        <button
                            key={index}
                            type="button"
                            className={`size-10 rounded-full border-2 transition-all ${
                                pointColorIndex === index
                                    ? 'scale-110 border-white'
                                    : 'border-transparent hover:scale-105'
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => setValue('pointColorIndex', index)}
                        />
                    ))}
                </div>
            </label>

            <label className="flex items-center gap-8">
                <MdOutlineTimer size={30} />
                <div className="flex gap-5">
                    <TimeDisplay
                        className="pointer-events-none w-10 text-center text-xl"
                        currentTime={time.toString()}
                    />
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="timeUnit"
                            checked={isMinutes}
                            onChange={() => setValue('isMinutes', true)}
                            className="form-radio"
                            style={{ accentColor: currentTheme.color.point }}
                        />
                        <span>Min</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="timeUnit"
                            checked={!isMinutes}
                            onChange={() => setValue('isMinutes', false)}
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

            {errors.time && <span className="text-sm text-red-500">{errors.time.message}</span>}
        </form>
    );
};

export default BaseTimerForm;
