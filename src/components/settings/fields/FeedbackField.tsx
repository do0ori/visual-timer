import { LuLightbulb } from 'react-icons/lu';
import ListItem from '../../common/ListItem';

const FeedbackField: React.FC = () => {
    const IdeaIcon = <LuLightbulb size={24} className="size-full" />;
    const feedBackContent = (
        <div className="flex w-full items-center justify-between gap-4">
            <div>
                <div className="text-lg">Feedback</div>
                <p className="text-xs opacity-70">Share an idea or report an issue.</p>
            </div>
            <a
                href="https://padlet.com/fuzzydo0ori/visual-timer-feedback-ykjvyrb6887wz6zc"
                target="_blank"
                rel="noreferrer"
                className="shrink-0 text-xs font-bold hover:underline"
            >
                Send feedback
            </a>
        </div>
    );

    return <ListItem icon={IdeaIcon} content={feedBackContent} />;
};

export default FeedbackField;
