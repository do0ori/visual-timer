import useOverlay from '../../../hooks/useOverlay';
import { useThemeStore } from '../../../store/themeStore';
import AlarmSelector from '../../forms/AlarmSelector';
import ThemeSelector from '../../forms/ThemeSelector';
import VolumeSelector from '../../forms/VolumeSelector';
import SettingsTopBar from '../../navigation/SettingsTopBar';

const SettingsOverlay: React.FC = () => {
    const { themes, globalThemeKey } = useThemeStore();
    const originalTheme = themes[globalThemeKey];

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
            <SettingsTopBar title="Settings" onClose={close} />

            <div className="h-[95%] overflow-y-auto no-scrollbar">
                <div className="p-5 pt-20">
                    <h3 className="text-lg font-semibold">Theme</h3>
                    <div className="mt-6 space-y-4">
                        <ThemeSelector />
                    </div>
                </div>

                <div className="p-5">
                    <h3 className="text-lg font-semibold">Alarm</h3>
                    <div className="mt-6 space-y-4">
                        <VolumeSelector />
                        <AlarmSelector />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsOverlay;