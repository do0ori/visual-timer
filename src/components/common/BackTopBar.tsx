import { IoIosArrowBack } from 'react-icons/io';
import TopBar from './TopBar';

type BackTopBarProps = {
    title: string;
    onClose: () => void;
};

const BackTopBar: React.FC<BackTopBarProps> = ({ title, onClose }) => {
    return <TopBar title={title} leftIcon={<IoIosArrowBack size={24} />} onLeftClick={onClose} />;
};

export default BackTopBar;
