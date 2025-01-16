import AlarmSelector from '../fields/AlarmSelector';
import VolumeSelector from '../fields/VolumeSelector';

const AlarmSettings: React.FC = () => (
    <div>
        <h3 className="text-lg font-semibold">Alarm</h3>
        <div className="mt-6 space-y-4">
            <VolumeSelector />
            <AlarmSelector />
        </div>
    </div>
);

export default AlarmSettings;
