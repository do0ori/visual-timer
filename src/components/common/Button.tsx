import { Theme } from '../../config/theme/themes';

type ButtonProps = {
    'aria-label': string;
    currentTheme?: Theme;
    visible?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
};

const Button: React.FC<ButtonProps> = ({
    'aria-label': ariaLabel,
    currentTheme,
    visible = true,
    children,
    onClick,
    className,
    type = 'button',
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            aria-label={ariaLabel}
            className={`flex size-16 items-center justify-center rounded-full active:brightness-90 ${
                visible ? 'visible' : 'invisible'
            } ${currentTheme ? 'text-white' : ''} ${className || ''}`}
            style={currentTheme ? { backgroundColor: currentTheme.color.point } : undefined}
        >
            {children}
        </button>
    );
};

export default Button;
