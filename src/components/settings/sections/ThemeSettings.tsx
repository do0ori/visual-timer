import CustomThemeSelector from '../fields/CustomThemeSelector';
import DefaultThemeSelector from '../fields/DefaultThemeSelector';

const ThemeSettings: React.FC = () => (
    <div className="space-y-8">
        <DefaultThemeSelector />
        <CustomThemeSelector />
    </div>
);

export default ThemeSettings;
