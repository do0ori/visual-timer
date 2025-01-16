import { useOverlay } from '../../hooks/useOverlay';
import { useTheme } from '../../hooks/useTheme';
import BackTopBar from '../common/BackTopBar';
import AlarmSettings from './sections/AlarmSettings';
import OthersSettings from './sections/OthersSettings';
import ThemeSettings from './sections/ThemeSettings';

const SettingsOverlay: React.FC = () => {
    const { originalTheme } = useTheme();

    const { isOpen, close } = useOverlay('settings');

    if (!isOpen) return null;

    return (
        <div
            className="absolute inset-0 z-40 size-full shadow-lg"
            style={{
                backgroundColor: originalTheme.color.main,
                outline: `2px solid ${originalTheme.color.sub}33`,
            }}
        >
            <BackTopBar title="Settings" onClose={close} />

            <div className="h-[95%] space-y-10 overflow-y-auto p-5 pt-20 no-scrollbar">
                <ThemeSettings />
                <AlarmSettings />
                <OthersSettings />
            </div>
        </div>
    );
};

export default SettingsOverlay;
