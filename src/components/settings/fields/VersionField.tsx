import { IoMdInformationCircleOutline } from 'react-icons/io';
import packageMetadata from '../../../../package.json';
import { useThemeStore } from '../../../store/themeStore';
import ListItem from '../../common/ListItem';

const VersionField: React.FC = () => {
    const { selectedTheme } = useThemeStore();
    const versionIcon = <IoMdInformationCircleOutline size={24} className="size-full" />;

    const versionContent = (
        <div className="flex w-full items-center justify-between gap-4">
            <div>
                <div className="text-lg">Version</div>
                <p className="text-xs opacity-70">v{packageMetadata.version}</p>
            </div>
            <a
                href="https://github.com/do0ori/visual-timer/releases"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold hover:underline"
                style={{ color: selectedTheme.color.point }}
            >
                Release notes
            </a>
        </div>
    );

    return <ListItem icon={versionIcon} content={versionContent} />;
};

export default VersionField;
