import { LuLightbulb } from 'react-icons/lu';
import { MdOpenInNew } from 'react-icons/md';
import ListItem from '../../common/ListItem';

const FeedbackField: React.FC = () => {
    const IdeaIcon = <LuLightbulb size={24} className="size-full" />;
    const feedBackContent = (
        <div className="flex w-full items-center justify-between gap-4">
            <div>
                <div className="text-lg">Feedback</div>
                <p className="text-xs opacity-70">Share an idea or report an issue.</p>
            </div>
            <MdOpenInNew size={18} className="shrink-0 opacity-60" aria-hidden="true" />
        </div>
    );

    return (
        <a
            href="https://padlet.com/fuzzydo0ori/visual-timer-feedback-ykjvyrb6887wz6zc"
            target="_blank"
            rel="noreferrer"
            className="-m-1 block cursor-pointer rounded-2xl p-1 transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 dark:hover:bg-white/10"
        >
            <ListItem icon={IdeaIcon} content={feedBackContent} />
        </a>
    );
};

export default FeedbackField;
