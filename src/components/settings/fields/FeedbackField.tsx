import { LuLightbulb } from 'react-icons/lu';
import ListItem from '../../common/ListItem';

const FeedbackField: React.FC = () => {
    const IdeaIcon = <LuLightbulb size={24} className="size-full" />;
    const feedBackContent = (
        <div className="flex w-full flex-col gap-2">
            <a
                href="https://padlet.com/fuzzydo0ori/visual-timer-feedback-ykjvyrb6887wz6zc"
                target="_blank"
                rel="noreferrer"
            >
                <div className="text-lg">Feedback</div>
            </a>
        </div>
    );

    return <ListItem icon={IdeaIcon} content={feedBackContent} />;
};

export default FeedbackField;
