import { Theme } from '../../store/types/theme';

interface ThemeButtonProps {
    theme: Theme;
    isSelected: boolean;
    onClick: () => void;
    onContext?: (e: React.MouseEvent) => void;
    onTouchStart?: () => void;
    onTouchEnd?: () => void;
}

const ThemeButton: React.FC<ThemeButtonProps> = ({
    theme,
    isSelected,
    onClick,
    onContext,
    onTouchStart,
    onTouchEnd,
}) => (
    <button
        type="button"
        onClick={onClick}
        onContextMenu={onContext}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className={`relative flex size-12 items-center justify-center rounded-full transition-all ${
            isSelected ? 'scale-110' : 'hover:scale-105'
        }`}
        title={theme.title}
    >
        {isSelected && (
            <div
                className="absolute inset-0 rounded-full"
                style={{
                    boxShadow: `0 0 0 3px ${theme.color.point}`,
                }}
            />
        )}
        <div
            className="size-10 rounded-full border border-gray-400"
            style={{
                background: `linear-gradient(135deg, ${theme.color.main} 0%, ${theme.color.main} 45%, ${theme.color.sub} 45%, ${theme.color.sub} 55%, ${theme.color.point} 55%, ${theme.color.point} 100%)`,
            }}
        />
    </button>
);

export default ThemeButton;
