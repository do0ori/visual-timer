import { useOverlay } from '../../hooks/useOverlay';
import { useTheme } from '../../hooks/useTheme';
import BackTopBar from '../common/BackTopBar';
import AlarmSelector from './fields/AlarmSelector';
import DonateField from './fields/DonateField';
import FeedbackField from './fields/FeedbackField';
import ThemeSelector from './fields/ThemeSelector';
import VolumeSelector from './fields/VolumeSelector';

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

                <div className="p-5">
                    <h3 className="text-lg font-semibold">Others</h3>
                    <div className="mt-6 space-y-8">
                        <FeedbackField />
                        <DonateField />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsOverlay;
