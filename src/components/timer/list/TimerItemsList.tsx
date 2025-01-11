import { Theme } from '../../../config/theme/themes';
import { RoutineTimerItem } from '../../../store/types/timer';
import Dropdown from '../../common/Dropdown';
import TimeDisplay from '../display/TimeDisplay';

interface TimerItemsListProps {
    items: RoutineTimerItem[];
    currentItemIndex: number;
    currentTime: string;
    currentTheme: Theme;
    onChange: (index: number) => void;
}

const TimerItemsList: React.FC<TimerItemsListProps> = ({
    items,
    currentItemIndex,
    currentTime,
    currentTheme,
    onChange,
}) => {
    const options = items.map((item, index) => ({
        label: item.title || `Timer ${index + 1}`,
        value: index,
        prefix: `#${index + 1}`,
        subLabel: `${item.time} ${item.isMinutes ? 'min' : 'sec'}`,
    }));

    const customHeader = (
        <div className="flex w-full grow items-baseline justify-center gap-2">
            <TimeDisplay currentTime={currentTime} />
            <div className="text-gray-400">
                ({currentItemIndex + 1}/{items.length})
            </div>
        </div>
    );

    return (
        <Dropdown
            options={options}
            selectedValue={currentItemIndex}
            onChange={onChange}
            currentTheme={currentTheme}
            customHeader={customHeader}
        />
    );
};

export default TimerItemsList;
