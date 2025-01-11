import { BiSolidBellRing } from 'react-icons/bi';
import { alarmOptions } from '../../config/audio/alarms';
import { useSettingsStore } from '../../store/settingsStore';
import { useThemeStore } from '../../store/themeStore';
import Dropdown from '../common/Dropdown';
import ListElement from '../common/ListElement';

const AlarmSelector: React.FC = () => {
    const { themes, globalThemeKey } = useThemeStore();
    const { selectedAlarm, setSelectedAlarm } = useSettingsStore();

    const currentTheme = themes[globalThemeKey];

    const alarmIcon = <BiSolidBellRing size={24} className="size-full" />;
    const alarmSelector = (
        <div className="flex w-full flex-col gap-2">
            <div className="text-lg">Sound</div>
            <Dropdown
                options={alarmOptions}
                selectedValue={selectedAlarm}
                onChange={setSelectedAlarm}
                currentTheme={currentTheme}
                buttonBorderColor={currentTheme.color.point}
            />
        </div>
    );

    return <ListElement icon={alarmIcon} content={alarmSelector} />;
};

export default AlarmSelector;
