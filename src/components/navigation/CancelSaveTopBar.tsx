import { IoIosSave, IoMdClose } from 'react-icons/io';
import TopBar from '../common/TopBar';

type CancelSaveTopBarProps = {
    title: string;
    onClose: () => void;
    onSave: () => void;
};

const CancelSaveTopBar: React.FC<CancelSaveTopBarProps> = ({ title, onClose, onSave }) => {
    return (
        <TopBar
            title={title}
            leftIcon={<IoMdClose size={24} />}
            onLeftClick={onClose}
            rightIcon={<IoIosSave size={24} />}
            onRightClick={onSave}
        />
    );
};

export default CancelSaveTopBar;
