import { useForm } from 'react-hook-form';
import { IoMdCheckmark } from 'react-icons/io';
import { MdFormatColorFill, MdInvertColors, MdOutlinePalette, MdTextFields } from 'react-icons/md';
import { useTheme } from '../../../hooks/useTheme';
import { useThemeStore } from '../../../store/themeStore';
import { Theme } from '../../../store/types/theme';
import Button from '../../common/Button';

type ThemeFormData = Omit<Theme, 'id'>;

type ThemeFormProps = {
    initialData: Theme | null;
    mode: 'add' | 'edit';
    close: () => void;
};

const ThemeForm: React.FC<ThemeFormProps> = ({ initialData, mode, close }) => {
    const { selectedThemeCopy } = useTheme();
    const { addTheme, updateTheme } = useThemeStore();

    const { register, handleSubmit } = useForm<ThemeFormData>({
        defaultValues: {
            title: initialData?.title || '',
            color: {
                main: initialData?.color.main || selectedThemeCopy.color.main,
                point: initialData?.color.point || selectedThemeCopy.color.point,
                sub: initialData?.color.sub || selectedThemeCopy.color.sub,
                pointOptions: initialData?.color.pointOptions || selectedThemeCopy.color.pointOptions,
            },
            text: initialData?.text || 'See how glowing you are.',
        },
    });

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
            <div className="max-h-[calc(100vh-96px)] space-y-6 overflow-y-auto no-scrollbar">
                <div className="flex items-center gap-4">
                    <MdTextFields size={24} className="shrink-0" />
                    <input
                        {...register('title')}
                        type="text"
                        placeholder="Theme Name"
                        className="w-full rounded border px-2 py-1 text-black"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <MdFormatColorFill size={24} className="shrink-0" />
                    <div className="flex items-center gap-2">
                        <span>Main:</span>
                        <input {...register('color.main')} type="color" defaultValue={'#000000'} className="h-8 w-20" />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <MdOutlinePalette size={24} className="shrink-0" />
                    <div className="flex items-center gap-2">
                        <span>Point:</span>
                        <input
                            {...register('color.point')}
                            type="color"
                            defaultValue={'#000000'}
                            className="h-8 w-20"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <MdInvertColors size={24} className="shrink-0" />
                    <div className="flex items-center gap-2">
                        <span>Sub:</span>
                        <input {...register('color.sub')} type="color" defaultValue={'#000000'} className="h-8 w-20" />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <MdTextFields size={24} className="shrink-0" />
                    <div className="flex items-center gap-2">
                        <span>Text:</span>
                        <input {...register('text')} type="text" className="h-8 w-20" />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <MdOutlinePalette size={24} className="shrink-0" />
                    <div className="flex flex-col gap-2">
                        <span>Point Options:</span>
                        <div className="flex flex-wrap gap-2">
                            {Array.from({ length: selectedThemeCopy.color.pointOptions.length }, (_, i) => i).map(
                                (index) => (
                                    <input
                                        key={index}
                                        {...register(`color.pointOptions.${index}`)}
                                        type="color"
                                        defaultValue={'#000000'}
                                        className="h-8 w-20"
                                    />
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Button
                currentTheme={selectedThemeCopy}
                type="submit"
                aria-label="Save"
                className="h-10 w-full rounded-2xl"
            >
                <IoMdCheckmark size={30} />
            </Button>
        </form>
    );
};

ThemeForm.displayName = 'ThemeForm';

export default ThemeForm;
