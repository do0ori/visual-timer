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
            className="-m-1 block cursor-pointer rounded-2xl p-1 transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 dark:hover:bg-white/10"
        >
            <ListItem icon={versionIcon} content={versionContent} />
        </a>
    );
};

export default VersionField;
