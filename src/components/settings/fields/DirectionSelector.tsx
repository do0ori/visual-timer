import { TbRotateDot } from 'react-icons/tb';
import { useSettingsStore } from '../../../store/settingsStore';
import { useThemeStore } from '../../../store/themeStore';
import Dropdown from '../../common/Dropdown';
import ListItem from '../../common/ListItem';

const DirectionSelector: React.FC = () => {
    const { selectedTheme } = useThemeStore();
    const { isClockwise, setIsClockwise } = useSettingsStore();

    const directionIcon = isClockwise ? (
        <TbRotateDot size={24} className={'size-full rotate-90 -scale-x-100'} />
    ) : (
        <TbRotateDot size={24} className={'size-full -rotate-90'} />
    );

    const directionSelector = (
        <div className="flex w-full flex-col gap-2">
            <div className="text-lg">Direction</div>
            <Dropdown
                options={[
                    { label: 'Clockwise', value: true },
                    { label: 'Counter-clockwise', value: false },
                ]}
                selectedValue={isClockwise}
                onChange={setIsClockwise}
                currentTheme={selectedTheme}
                buttonBorderColor={selectedTheme.color.point}
            />
        </div>
    );

    return <ListItem icon={directionIcon} content={directionSelector} />;
};

export default DirectionSelector;
