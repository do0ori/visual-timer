import CustomThemeSelector from '../fields/CustomThemeSelector';
import DefaultThemeSelector from '../fields/DefaultThemeSelector';

const ThemeSettings: React.FC = () => (
    <div>
        <h3 className="text-lg font-semibold">Theme</h3>
        <div className="mt-6 space-y-4">
            <DefaultThemeSelector />
            <CustomThemeSelector />
        </div>
    </div>
);

export default ThemeSettings;
