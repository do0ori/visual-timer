import { Theme } from '../../../../store/types/theme';
import Switch from '../../../common/Switch';

type UnitSwitchProps = {
    onClick: () => void;
    isMinutes: boolean;
    isRunning: boolean;
    currentTheme: Theme;
};

const UnitSwitch: React.FC<UnitSwitchProps> = ({ onClick, isMinutes, isRunning, currentTheme }) => {
    return (
        <Switch
            options={[
                { value: 'seconds', label: 'sec' },
                { value: 'minutes', label: 'min' },
            ]}
            value={isMinutes ? 'minutes' : 'seconds'}
            onChange={() => onClick()}
            backgroundColor={currentTheme.color.point}
            isVisible={!isRunning}
        />
    );
};

export default UnitSwitch;
