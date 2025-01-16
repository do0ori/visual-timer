type TimeDisplayProps = {
    currentTime: string;
    className?: string;
};

const TimeDisplay: React.FC<TimeDisplayProps> = ({ currentTime, className }) => {
    return <div className={`text-3xl ${className || ''}`}>{currentTime}</div>;
};

export default TimeDisplay;
