import { LuLightbulb } from 'react-icons/lu';
import ListElement from '../../../common/ListElement';

const FeedbackField: React.FC = () => {
    const IdeaIcon = <LuLightbulb size={24} className="size-full" />;
    const feedBackContent = (
        <div className="flex w-full flex-col gap-2">
            <a href="mailto:fuzzydo0ori@gmail.com">
                <div className="text-lg">Feedback</div>
            </a>
        </div>
    );

    return <ListElement icon={IdeaIcon} content={feedBackContent} />;
};

export default FeedbackField;
