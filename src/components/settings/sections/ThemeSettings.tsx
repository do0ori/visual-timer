import DirectionSelector from '../fields/DirectionSelector';
import ThemeSelector from '../fields/ThemeSelector';

const ThemeSettings: React.FC = () => (
    <div>
        <h3 className="text-lg font-semibold">Timer</h3>
        <div className="mt-6 space-y-4">
            <ThemeSelector />
            <DirectionSelector />
        </div>
    </div>
);

export default ThemeSettings;
