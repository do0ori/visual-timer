import { LuRepeat, LuRepeat1 } from 'react-icons/lu';
import { Theme } from '../../../../config/theme/themes';
import Switch from '../../../common/Switch';

type RepeatSwitchProps = {
    onClick: () => void;
    repeat: boolean;
    currentTheme: Theme;
};

const RepeatSwitch: React.FC<RepeatSwitchProps> = ({ onClick, repeat, currentTheme }) => {
    return (
        <Switch
            options={[
                { value: 'once', label: <LuRepeat1 /> },
                { value: 'repeat', label: <LuRepeat /> },
            ]}
            value={repeat ? 'repeat' : 'once'}
            onChange={() => onClick()}
            backgroundColor={currentTheme.color.point}
        />
    );
};

export default RepeatSwitch;
