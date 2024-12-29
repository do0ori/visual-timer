import { IoIosSave, IoMdClose } from 'react-icons/io';
import TopBar from '../common/TopBar';

type TimerTopBarProps = {
    title: string;
    onClose: () => void;
    onSave: () => void;
};

const TimerTopBar: React.FC<TimerTopBarProps> = ({ title, onClose, onSave }) => {
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

export default TimerTopBar;
