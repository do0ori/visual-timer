import { NUM_TIMER_TYPES, TIMER_TYPE_CONFIG, TimerType } from '../../../../config/timer/type';
import { useThemeStore } from '../../../../store/themeStore';
import { getTextColor } from '../../../../utils/colorUtils';
import Tooltip from '../../../common/Tooltip';

type TimerTypeSelectorProps = {
    selectedType: TimerType;
    onTypeSelect: (type: TimerType) => void;
};

const TimerTypeSelector: React.FC<TimerTypeSelectorProps> = ({ selectedType, onTypeSelect }) => {
    const { selectedTheme, compColor } = useThemeStore();
    const isDark = getTextColor(selectedTheme.color.main) === 'white';

    return (
        <div
            className="grid gap-1 rounded-2xl p-1"
            style={{
                gridTemplateColumns: `repeat(${NUM_TIMER_TYPES}, minmax(0, 1fr))`,
                backgroundColor: isDark ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.07)',
            }}
        >
            {Object.entries(TIMER_TYPE_CONFIG).map(([type, config]) => (
                <div
                    key={type}
                    onClick={() => onTypeSelect(type as TimerType)}
                    className="flex cursor-pointer flex-col items-center gap-2 rounded-xl p-4 transition-all"
                    style={{
                        backgroundColor: selectedType === type ? 'rgba(255,255,255,0.95)' : 'transparent',
                        color: selectedType === type ? selectedTheme.color.point : compColor,
                        fontWeight: selectedType === type ? 700 : 500,
                        opacity: selectedType === type ? 1 : 0.65,
                        boxShadow: selectedType === type ? '0 1px 4px rgba(0,0,0,0.12)' : 'none',
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
