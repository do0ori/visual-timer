import ThemeSwitchButtons from '../components/Button/ThemeSwitchButtons';

const SettingsPage: React.FC = () => {
    return (
        <>
            <h3 className="text-lg font-semibold">Theme</h3>
            <ThemeSwitchButtons />
        </>
    );
};

export default SettingsPage;
