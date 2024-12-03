import TopBar from '../components/navigation/TopBar';
import AlarmSelector from '../components/selector/AlarmSelector';
import ThemeSelector from '../components/selector/ThemeSelector';
import VolumeSelector from '../components/selector/VolumeSelector';

const SettingsPage: React.FC = () => {
    return (
        <>
            <TopBar title="Settings" />

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
        </>
    );
};

export default SettingsPage;
