import { useThemeStore } from '../../store/themeStore';
import SettingsTopBar from '../navigation/SettingsTopBar';
import AlarmSelector from '../selector/AlarmSelector';
import ThemeSelector from '../selector/ThemeSelector';
import VolumeSelector from '../selector/VolumeSelector';

const SettingsOverlay: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { themes, globalThemeKey } = useThemeStore();
    const originalTheme = themes[globalThemeKey];

    return (
        <div
            className={`absolute inset-0 z-40 size-full shadow-lg ${isOpen ? 'visible' : 'invisible'}`}
            style={{
                backgroundColor: originalTheme.color.main,
            }}
        >
            <SettingsTopBar title="Settings" onClose={onClose} />

            <div className="max-h-[calc(100vh-2rem)] overflow-y-auto no-scrollbar">
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
