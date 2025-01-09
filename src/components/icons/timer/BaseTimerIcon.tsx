import { IconBaseProps } from 'react-icons';

interface TimerIconProps extends IconBaseProps {
    time?: number;
}

// lu/LuTimer
const BaseTimerIcon = ({ size = '1em', time = 7, ...props }: TimerIconProps) => (
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
        <g transform={`rotate(${(time / 60) * 360}, 12, 14)`}>
            <path d="M12 14v-4"></path>
        </g>
        <circle cx="12" cy="14" r="8"></circle>
    </svg>
);

export default BaseTimerIcon;
