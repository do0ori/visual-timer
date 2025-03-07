import DirectionSelector from '../fields/DirectionSelector';

const TimerSettings: React.FC = () => (
    <div>
        <h3 className="text-lg font-semibold">Timer</h3>
        <div className="mt-6 space-y-4">
            <DirectionSelector />
        </div>
    </div>
);

export default TimerSettings;
