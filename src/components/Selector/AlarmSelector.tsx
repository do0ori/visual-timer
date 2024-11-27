import React from 'react';
import { useThemeStore } from '../../store/themeStore';
import { useSettingsStore } from '../../store/settingsStore';
import { alarmOptions } from '../../config/timer/alarms';
import { BiSolidBellRing } from 'react-icons/bi';
import Dropdown from '../common/Dropdown';
import ListElement from '../common/ListElement';

const AlarmSelector: React.FC = () => {
    const { themes, globalThemeKey } = useThemeStore();
    const { selectedAlarm, setSelectedAlarm } = useSettingsStore();

    const currentTheme = themes[globalThemeKey];

    const alarmIcon = <BiSolidBellRing size={24} className="h-full w-full" />;
    const alarmSelector = (
        <div className="flex w-full flex-col gap-2">
            <div className="text-lg">Sound</div>
            <Dropdown
                options={alarmOptions}
                selectedValue={selectedAlarm}
                onChange={setSelectedAlarm}
                currentTheme={currentTheme}
            />
        </div>
    );

    return <ListElement icon={alarmIcon} content={alarmSelector} />;
};

export default AlarmSelector;
