import { IconBaseProps } from 'react-icons';

// lu/LuTimerReset
const RoutineTimerIcon = ({ size = '1em', ...props }: IconBaseProps) => (
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
        <path d="M10 2h4"></path>
        <path d="M12 14v-4"></path>
        <path d="M4 13a8 8 0 0 1 8-7 8 8 0 1 1-5.3 14L4 17.6"></path>
        <path d="M9 17H4v5"></path>
    </svg>
);

export default RoutineTimerIcon;
