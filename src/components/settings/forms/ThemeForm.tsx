import { useState } from 'react';
import { Path, useForm } from 'react-hook-form';
import { BiPieChart } from 'react-icons/bi';
import { GiRoundKnob } from 'react-icons/gi';
import { IoMdCheckmark } from 'react-icons/io';
import { MdBrush, MdFormatColorFill, MdFormatQuote, MdOutlinePalette, MdTextFields } from 'react-icons/md';
import { useThemeStore } from '../../../store/themeStore';
import { Theme } from '../../../store/types/theme';
import Button from '../../common/Button';
import ColorPickerButton from '../../common/ColorPickerButton';
import TimeSelector from '../../timers/timer-management/fields/TimeSelector';

type ThemeFormData = Omit<Theme, 'id'>;

type ThemeFormProps = {
    initialData: Theme | null;
    mode: 'add' | 'edit';
    close: () => void;
};

const ThemeForm: React.FC<ThemeFormProps> = ({ initialData, mode, close }) => {
    const { selectedTheme, addTheme, updateTheme } = useThemeStore();
    const [time, setTime] = useState<number>(10);
    const [previewPointColor, setPreviewPointColor] = useState<string | null>(null);

    const { register, handleSubmit, watch, setValue } = useForm<ThemeFormData>({
        defaultValues: {
            title: initialData?.title || '',
            color: {
                main: initialData?.color.main || selectedTheme.color.main,
                point: initialData?.color.point || selectedTheme.color.point,
                sub: initialData?.color.sub || selectedTheme.color.sub,
                pointOptions: initialData?.color.pointOptions || selectedTheme.color.pointOptions,
            },
            text: initialData?.text || 'See how glowing\nyou are.',
        },
    });

    const formValues = watch();

    const handleColorChange = (
        field: Path<ThemeFormData> | `color.pointOptions.${number}`,
        color: string,
        isPoint = false
    ) => {
        setValue(field, color, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
        });

        if (isPoint) {
            setPreviewPointColor(color);
        }
    };

    const previewTheme = {
        ...formValues,
        color: {
            ...formValues.color,
            point: previewPointColor || formValues.color.point,
        },
        id: 'preview',
    };

    const onSubmit = (data: ThemeFormData) => {
        const themeData: Theme = {
            ...data,
            id: initialData?.id || `custom-${crypto.randomUUID()}`,
            title: data.title?.trim() || 'Custom Theme',
        };

        if (mode === 'add') {
            addTheme(themeData);
        } else {
            updateTheme(themeData.id, themeData);
        }
        close();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex grow flex-col justify-between gap-5 p-5">
            <div className="flex max-h-[calc(100vh-156px)] flex-col gap-7 overflow-y-auto no-scrollbar">
                <div className="flex items-center gap-8">
                    <MdTextFields size={30} className="shrink-0" />
                    <input
                        {...register('title')}
                        type="text"
                        placeholder="New Theme"
                        className="w-full rounded border px-2 py-1 text-black"
                    />
                </div>

                <div className="flex items-center gap-8">
                    <MdFormatQuote size={30} className="shrink-0" />
                    <textarea
                        {...register('text')}
                        rows={2}
                        className="w-full resize-none rounded border px-2 py-1 text-black"
                        placeholder="Enter text you want to display"
                    />
                </div>

                <div className="flex items-center gap-8">
                    <MdBrush size={30} className="shrink-0" />
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex flex-col items-center gap-4">
                            <MdFormatColorFill size={30} className="shrink-0" />
                            <ColorPickerButton
                                color={formValues.color.main}
                                onChange={(color) => handleColorChange('color.main', color)}
                            />
                        </div>
                        <div className="flex flex-col items-center gap-4">
                            <BiPieChart size={30} className="shrink-0" />
                            <ColorPickerButton
                                color={formValues.color.point}
                                onChange={(color) => handleColorChange('color.point', color, true)}
                                onClick={() => setPreviewPointColor(formValues.color.point)}
                            />
                        </div>
                        <div className="flex flex-col items-center gap-4">
                            <GiRoundKnob size={30} className="shrink-0" />
                            <ColorPickerButton
                                color={formValues.color.sub}
                                onChange={(color) => handleColorChange('color.sub', color)}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <MdOutlinePalette size={30} className="shrink-0" />
                    <div className="flex flex-wrap gap-4">
                        {Array.from({ length: selectedTheme.color.pointOptions.length }, (_, i) => i).map((index) => (
                            <ColorPickerButton
                                key={index}
                                color={formValues.color.pointOptions[index]}
                                onChange={(color) => handleColorChange(`color.pointOptions.${index}`, color, true)}
                                onClick={() => setPreviewPointColor(formValues.color.pointOptions[index])}
                            />
                        ))}
                    </div>
                </div>

                <div
                    className="flex grow items-center justify-center rounded"
                    style={{ backgroundColor: previewTheme.color.main }}
                >
                    <TimeSelector time={time} currentTheme={previewTheme} setTime={setTime} text={previewTheme.text} />
                </div>
            </div>

            <Button currentTheme={selectedTheme} type="submit" aria-label="Save" className="h-10 w-full rounded-2xl">
                <IoMdCheckmark size={30} />
            </Button>
        </form>
    );
};

ThemeForm.displayName = 'ThemeForm';

export default ThemeForm;
