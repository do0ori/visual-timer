import DonateField from '../fields/DonateField';
import FeedbackField from '../fields/FeedbackField';
import VersionField from '../fields/VersionField';

const OthersSettings: React.FC = () => (
    <div className="space-y-8">
        <VersionField />
        <FeedbackField />
        <DonateField />
    </div>
);

export default OthersSettings;
