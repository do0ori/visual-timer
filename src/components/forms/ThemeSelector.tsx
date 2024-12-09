import { useThemeStore } from '../../store/themeStore';

const ThemeSelector: React.FC = () => {
    const { themes, globalThemeKey, setGlobalTheme } = useThemeStore();

    return (
        <>
            {Object.entries(themes).map(([key, theme]) => (
                <div
                    key={key}
                    className="flex items-center justify-between space-x-4"
                    onClick={() => setGlobalTheme(key)}
                >
                    <div className="flex items-center space-x-4">
                        <button
                            className="size-12 rounded-full border-2 border-white shadow-[4px_4px_10px_rgba(0,0,0,0.2)]"
                            style={{
                                background: `linear-gradient(135deg, ${theme.color.main} 50%, ${theme.color.point} 50%)`,
                            }}
                        ></button>
                        <span className="cursor-pointer text-lg">{key}</span>
                    </div>
                    <input
                        type="checkbox"
                        checked={key === globalThemeKey}
                        onChange={() => setGlobalTheme(key)}
                        className="form-checkbox size-5"
                        style={{
                            accentColor: theme.color.point,
                        }}
                    />
                </div>
            ))}
        </>
    );
};

export default ThemeSelector;
