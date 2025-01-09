import { NUM_TIMER_TYPES, TIMER_TYPE_CONFIG, TimerType } from '../../config/timer/type';

type TimerTypeSelectorProps = {
    selectedType: TimerType;
    onTypeSelect: (type: TimerType) => void;
};

const TimerTypeSelector: React.FC<TimerTypeSelectorProps> = ({ selectedType, onTypeSelect }) => {
    return (
        <div className="flex flex-col gap-4">
            <div className={`grid grid-cols-${NUM_TIMER_TYPES} gap-4`}>
                {Object.entries(TIMER_TYPE_CONFIG).map(([type, config]) => (
                    <button
                        key={type}
                        onClick={() => onTypeSelect(type as TimerType)}
                        className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 ${
                            selectedType === type ? 'border-white' : 'border-transparent hover:scale-105'
                        }`}
                    >
                        <config.icon size={24} />
                        <span>{config.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TimerTypeSelector;
