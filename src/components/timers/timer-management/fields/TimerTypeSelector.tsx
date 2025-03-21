import { NUM_TIMER_TYPES, TIMER_TYPE_CONFIG, TimerType } from '../../../../config/timer/type';
import { useThemeStore } from '../../../../store/themeStore';
import Tooltip from '../../../common/Tooltip';

type TimerTypeSelectorProps = {
    selectedType: TimerType;
    onTypeSelect: (type: TimerType) => void;
};

const TimerTypeSelector: React.FC<TimerTypeSelectorProps> = ({ selectedType, onTypeSelect }) => {
    const { selectedTheme } = useThemeStore();

    return (
        <div
            className={`grid gap-4`}
            style={{
                gridTemplateColumns: `repeat(${NUM_TIMER_TYPES}, minmax(0, 1fr))`,
            }}
        >
            {Object.entries(TIMER_TYPE_CONFIG).map(([type, config]) => (
                <div
                    key={type}
                    onClick={() => onTypeSelect(type as TimerType)}
                    className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 p-4 ${
                        selectedType === type ? '' : 'border-transparent hover:scale-105'
                    }`}
                    style={{
                        borderColor: selectedType === type ? selectedTheme.color.point : undefined,
                    }}
                >
                    <config.icon size={24} />
                    <div className="flex items-center gap-1">
                        <span>{config.label}</span>
                        <Tooltip title={`What is the ${config.label.toLowerCase()}?`} desc={config.desc} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TimerTypeSelector;
