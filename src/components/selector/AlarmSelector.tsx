import { BiSolidBellRing } from 'react-icons/bi';
import { alarmOptions } from '../../config/audio/alarms';
import { useTheme } from '../../hooks/useTheme';
import { useSettingsStore } from '../../store/settingsStore';
import Dropdown from '../common/Dropdown';
import ListElement from '../common/ListElement';

const AlarmSelector: React.FC = () => {
    const { originalTheme } = useTheme();
    const { selectedAlarm, setSelectedAlarm } = useSettingsStore();

    const alarmIcon = <BiSolidBellRing size={24} className="size-full" />;
    const alarmSelector = (
        <div className="flex w-full flex-col gap-2">
            <div className="text-lg">Sound</div>
            <Dropdown
                options={alarmOptions}
                selectedValue={selectedAlarm}
                onChange={setSelectedAlarm}
                currentTheme={originalTheme}
                buttonBorderColor={originalTheme.color.point}
            />
        </div>
    );

    return <ListElement icon={alarmIcon} content={alarmSelector} />;
};

export default AlarmSelector;
