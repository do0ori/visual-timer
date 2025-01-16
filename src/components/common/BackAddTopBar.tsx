import { IoIosArrowBack, IoMdAdd } from 'react-icons/io';
import TopBar from './TopBar';

type BackAddTopBarProps = {
    title: string;
    onClose: () => void;
    onAdd: () => void;
};

const BackAddTopBar: React.FC<BackAddTopBarProps> = ({ title, onClose, onAdd }) => {
    return (
        <TopBar
            title={title}
            leftIcon={<IoIosArrowBack size={24} />}
            onLeftClick={onClose}
            rightIcon={<IoMdAdd size={24} />}
            onRightClick={onAdd}
        />
    );
};

export default BackAddTopBar;
