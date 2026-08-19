import { TIMER_TYPE, TIMER_TYPE_CONFIG, TimerType } from '../../../../config/timer/type';
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
            className="relative grid grid-cols-2 rounded-2xl p-1"
            style={{
                backgroundColor: isDark ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.07)',
            }}
        >
            <span
                aria-hidden="true"
                className={`absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-xl bg-white/95 shadow-sm transition-transform duration-200 ease-out ${
                    selectedType === TIMER_TYPE.BASE ? 'translate-x-0' : 'translate-x-full'
                }`}
            />
            {Object.entries(TIMER_TYPE_CONFIG).map(([type, config]) => (
                <div
                    key={type}
                    onClick={() => onTypeSelect(type as TimerType)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') onTypeSelect(type as TimerType);
                    }}
                    role="button"
                    tabIndex={0}
                    className="relative z-10 flex cursor-pointer flex-col items-center gap-2 rounded-xl p-4 transition-colors"
                    style={{
                        color: selectedType === type ? selectedTheme.color.point : compColor,
                        fontWeight: selectedType === type ? 700 : 500,
                        opacity: selectedType === type ? 1 : 0.65,
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
