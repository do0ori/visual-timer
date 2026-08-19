import React from 'react';
import { Theme } from '../../store/types/theme';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  currentTheme?: Theme;
  visible?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  currentTheme,
  visible = true,
  children,
  onClick,
  className = '',
  type = 'button',
  style,
  disabled,
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn-tactile flex size-16 shrink-0 items-center justify-center rounded-full font-medium transition-all ${
        visible ? 'visible' : 'invisible'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'} ${
        currentTheme ? 'text-white shadow-soft' : ''
      } ${className}`}
      style={currentTheme ? { backgroundColor: currentTheme.color.point, ...style } : style}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
