import { NUM_TIMER_TYPES, TIMER_TYPE_CONFIG, TimerType } from '../../../../config/timer/type';
import { useTheme } from '../../../../hooks/useTheme';

type TimerTypeSelectorProps = {
    selectedType: TimerType;
    onTypeSelect: (type: TimerType) => void;
};

const TimerTypeSelector: React.FC<TimerTypeSelectorProps> = ({ selectedType, onTypeSelect }) => {
    const { originalTheme } = useTheme();

    return (
        <div
            className={`grid gap-4`}
            style={{
                gridTemplateColumns: `repeat(${NUM_TIMER_TYPES}, minmax(0, 1fr))`,
            }}
        >
            {Object.entries(TIMER_TYPE_CONFIG).map(([type, config]) => (
                <button
                    key={type}
                    onClick={() => onTypeSelect(type as TimerType)}
                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 ${
                        selectedType === type ? '' : 'border-transparent hover:scale-105'
                    }`}
                    style={{
                        borderColor: selectedType === type ? originalTheme.color.point : undefined,
                    }}
                >
                    <config.icon size={24} />
                    <span>{config.label}</span>
                </button>
            ))}
        </div>
    );
};

export default TimerTypeSelector;
