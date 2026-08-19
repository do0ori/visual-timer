import { IoHeart } from 'react-icons/io5';
import { useThemeStore } from '../../../store/themeStore';
import ListItem from '../../common/ListItem';

const DonateField: React.FC = () => {
    const { selectedTheme } = useThemeStore();
    const heartIcon = <IoHeart size={24} className="size-full" />;

    const donateContent = (
        <div className="flex w-full items-center justify-between gap-4">
            <div>
                <div className="text-lg">Support Mellow Visual Timer</div>
                <p className="text-xs opacity-70">Help keep the app free and improving.</p>
            </div>
            <a
                href="https://www.paypal.com/paypalme/do0ori"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-lg border px-3 py-2 text-xs font-bold text-center transition hover:bg-black/5"
                style={{
                    borderColor: selectedTheme.color.point,
                }}
            >
                Buy Me a Coffee
            </a>
        </div>
    );

    return <ListItem icon={heartIcon} content={donateContent} />;
};

export default DonateField;
