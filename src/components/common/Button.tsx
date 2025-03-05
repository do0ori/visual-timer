import { Theme } from '../../store/types/theme';

type ButtonProps = {
    'aria-label': string;
    currentTheme?: Theme;
    visible?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
    style?: React.CSSProperties;
};

const Button: React.FC<ButtonProps> = ({
    'aria-label': ariaLabel,
    currentTheme,
    visible = true,
    children,
    onClick,
    className,
    type = 'button',
    style,
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            aria-label={ariaLabel}
            className={`flex size-16 shrink-0 items-center justify-center rounded-full active:brightness-90 ${
                visible ? 'visible' : 'invisible'
            } ${currentTheme ? 'text-white' : ''} ${className || ''}`}
            style={currentTheme ? { backgroundColor: currentTheme.color.point, ...style } : style}
        >
            {children}
        </button>
    );
};

export default Button;
