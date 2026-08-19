import AlarmSelector from '../fields/AlarmSelector';
import VolumeSelector from '../fields/VolumeSelector';

const AlarmSettings: React.FC = () => (
    <div className="space-y-8">
        <VolumeSelector />
        <AlarmSelector />
    </div>
);

export default AlarmSettings;
