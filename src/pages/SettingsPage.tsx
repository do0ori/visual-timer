import ThemeSelector from '../components/Settings/ThemeSelector';

const SettingsPage: React.FC = () => {
    return (
        <>
            <h3 className="text-lg font-semibold">Theme</h3>
            <ThemeSelector />
        </>
    );
};

export default SettingsPage;
