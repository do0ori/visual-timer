import TopBar from '../components/Navigation/TopBar';
import ThemeSelector from '../components/Settings/ThemeSelector';

const SettingsPage: React.FC = () => {
    return (
        <>
            <TopBar title="Settings" />
            <div className="p-5 pt-16">
                <h3 className="text-lg font-semibold">Theme</h3>
                <div className="mt-6 space-y-4">
                    <ThemeSelector />
                </div>
            </div>
        </>
    );
};

export default SettingsPage;
