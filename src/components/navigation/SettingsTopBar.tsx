import { IoIosArrowBack } from 'react-icons/io';
import TopBar from '../common/TopBar';

interface SettingsTopBarProps {
    title: string;
    onClose: () => void;
}

const SettingsTopBar: React.FC<SettingsTopBarProps> = ({ title, onClose }) => {
    return <TopBar title={title} leftIcon={<IoIosArrowBack size={24} />} onLeftClick={onClose} />;
};

export default SettingsTopBar;
