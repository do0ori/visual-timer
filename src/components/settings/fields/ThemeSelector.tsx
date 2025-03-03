import { IoMdColorPalette } from 'react-icons/io';
import { useThemeStore } from '../../../store/themeStore';
import ListItem from '../../common/ListItem';

const ThemeSelector: React.FC = () => {
    const { themes, globalThemeKey, setGlobalTheme } = useThemeStore();

    const paletteIcon = <IoMdColorPalette size={24} className="size-full" />;
    const themeSelector = (
        <div className="flex w-full flex-col gap-4">
            <div className="text-lg">Theme</div>
            <div className="flex flex-wrap gap-3 px-2">
                {Object.entries(themes).map(([key, theme]) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => setGlobalTheme(key)}
                        className={`relative flex size-12 items-center justify-center rounded-full transition-all ${
                            key === globalThemeKey ? 'scale-110' : 'hover:scale-105'
                        }`}
                        title={key}
                    >
                        {key === globalThemeKey && (
                            <div
                                className="absolute inset-0 rounded-full"
                                style={{
                                    boxShadow: `0 0 0 3px ${theme.color.point}`,
                                }}
                            />
                        )}
                        <div
                            className="size-10 rounded-full"
                            style={{
                                background: `linear-gradient(135deg, ${theme.color.main} 0%, ${theme.color.main} 45%, ${theme.color.sub} 45%, ${theme.color.sub} 55%, ${theme.color.point} 55%, ${theme.color.point} 100%)`,
                            }}
                        />
                    </button>
                ))}
            </div>
        </div>
    );

    return <ListItem icon={paletteIcon} content={themeSelector} />;
};

export default ThemeSelector;
