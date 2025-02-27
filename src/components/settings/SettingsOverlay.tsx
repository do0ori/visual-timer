import { useOverlay } from '../../hooks/useOverlay';
import { useTheme } from '../../hooks/useTheme';
import TopBar from '../common/TopBar';
import AlarmSettings from './sections/AlarmSettings';
import OthersSettings from './sections/OthersSettings';
import ThemeSettings from './sections/ThemeSettings';

const SettingsOverlay: React.FC = () => {
    const { originalTheme } = useTheme();

    const { isOpen, close } = useOverlay('settings');

    if (!isOpen) return null;

    return (
        <div
            className="absolute inset-0 z-40 flex size-full flex-col shadow-lg"
            style={{
                backgroundColor: originalTheme.color.main,
                outline: `2px solid ${originalTheme.color.sub}33`,
            }}
        >
            <TopBar.Back onLeftClick={close} center="Settings" />

            <div className="p-5">
                <div className="max-h-[calc(100vh-96px)] space-y-10 overflow-y-auto no-scrollbar">
                    <ThemeSettings />
                    <AlarmSettings />
                    <OthersSettings />
                </div>
            </div>
        </div>
    );
};

export default SettingsOverlay;
