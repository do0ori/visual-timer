import { IoHeart } from 'react-icons/io5';
import { MdOpenInNew } from 'react-icons/md';
import ListItem from '../../common/ListItem';

const DonateField: React.FC = () => {
    const heartIcon = <IoHeart size={24} className="size-full" />;

    const donateContent = (
        <div className="flex w-full items-center justify-between gap-4">
            <div>
                <div className="text-lg">Support Mellow Visual Timer</div>
                <p className="text-xs opacity-70">Help keep the app free and improving.</p>
            </div>
            <MdOpenInNew size={18} className="shrink-0 opacity-60" aria-hidden="true" />
        </div>
    );

    return (
        <a
            href="https://www.paypal.com/paypalme/do0ori"
            target="_blank"
            rel="noopener noreferrer"
            className="block -m-3 rounded-2xl p-3 cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2"
        >
            <ListItem icon={heartIcon} content={donateContent} />
        </a>
    );
};

export default DonateField;
