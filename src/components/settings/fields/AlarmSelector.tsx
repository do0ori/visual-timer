import { BiSolidBellRing } from 'react-icons/bi';
import { alarmOptions } from '../../../config/audio/alarms';
import { useAudio } from '../../../hooks/useAudio';
import { useTheme } from '../../../hooks/useTheme';
import { useSettingsStore } from '../../../store/settingsStore';
import Dropdown from '../../common/Dropdown';
import ListItem from '../../common/ListItem';

const AlarmSelector: React.FC = () => {
    const { originalTheme } = useTheme();
    const { selectedAlarm, setSelectedAlarm } = useSettingsStore();
    const audio = useAudio();

    const alarmIcon = <BiSolidBellRing size={24} className="size-full" />;

    const handleAlarmChange = (alarm: typeof selectedAlarm) => {
        setSelectedAlarm(alarm);
        setTimeout(() => {
            audio.play(alarm);
        }, 0);
    };

    const handleDropdownToggle = (isOpen: boolean) => {
        if (!isOpen) {
            audio.pause();
            audio.reset();
        }
    };

    const alarmSelector = (
        <div className="flex w-full flex-col gap-2">
            <div className="text-lg">Sound</div>
            <Dropdown
                options={alarmOptions}
                selectedValue={selectedAlarm}
                onChange={handleAlarmChange}
                currentTheme={originalTheme}
                buttonBorderColor={originalTheme.color.point}
                onToggle={handleDropdownToggle}
            />
        </div>
    );

    return <ListItem icon={alarmIcon} content={alarmSelector} />;
};

export default AlarmSelector;
