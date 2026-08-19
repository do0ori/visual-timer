import { IoMdInformationCircleOutline } from 'react-icons/io';
import { MdOpenInNew } from 'react-icons/md';
import packageMetadata from '../../../../package.json';
import ListItem from '../../common/ListItem';

const VersionField: React.FC = () => {
    const versionIcon = <IoMdInformationCircleOutline size={24} className="size-full" />;

    const versionContent = (
        <div className="flex w-full items-center justify-between gap-4">
            <div>
                <div className="text-lg">Version</div>
                <p className="text-xs opacity-70">v{packageMetadata.version}</p>
            </div>
            <MdOpenInNew size={18} className="shrink-0 opacity-60" aria-hidden="true" />
        </div>
    );

    return (
        <a
            href="https://github.com/do0ori/visual-timer/releases"
            target="_blank"
            rel="noreferrer"
            className="block -m-3 rounded-2xl p-3 cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2"
        >
            <ListItem icon={versionIcon} content={versionContent} />
        </a>
    );
};

export default VersionField;
