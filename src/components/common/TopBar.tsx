import { useThemeStore } from '../../store/themeStore';

type TopBarProps = {
    title: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onLeftClick?: () => void;
    onRightClick?: () => void;
};

const TopBar: React.FC<TopBarProps> = ({ title, leftIcon, rightIcon, onLeftClick, onRightClick }) => {
    const { themes, globalThemeKey } = useThemeStore();
    const currentTheme = themes[globalThemeKey];

    return (
        <div
            className="absolute left-0 top-0 flex h-14 w-full items-center px-4 text-white shadow-md"
            style={{
                backgroundColor: currentTheme.color.point,
            }}
        >
            {leftIcon && <button onClick={onLeftClick}>{leftIcon}</button>}

            <h1 className="ml-4 text-xl font-bold">{title}</h1>

            {rightIcon && (
                <button onClick={onRightClick} className="ml-auto">
                    {rightIcon}
                </button>
            )}
        </div>
    );
};

export default TopBar;
