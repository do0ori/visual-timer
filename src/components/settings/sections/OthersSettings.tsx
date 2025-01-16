import DonateField from '../fields/DonateField';
import FeedbackField from '../fields/FeedbackField';

const OthersSettings: React.FC = () => (
    <div>
        <h3 className="text-lg font-semibold">Others</h3>
        <div className="mt-6 space-y-8">
            <FeedbackField />
            <DonateField />
        </div>
    </div>
);

export default OthersSettings;
