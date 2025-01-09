import { IconBaseProps } from 'react-icons';

// lu/LuTimer
const BaseTimerIcon = ({ size = '1em', ...props }: IconBaseProps) => (
    <svg
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
        height={size}
        width={size}
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <line x1="10" x2="14" y1="2" y2="2"></line>
        <line x1="12" x2="15" y1="14" y2="11"></line>
        <circle cx="12" cy="14" r="8"></circle>
    </svg>
);

export default BaseTimerIcon;
