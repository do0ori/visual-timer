import { IoMdAdd, IoMdClose } from 'react-icons/io';
import TopBar from '../common/TopBar';

interface TimerListTopBarProps {
    title: string;
    onClose: () => void;
    onAdd: () => void;
}

const TimerListTopBar: React.FC<TimerListTopBarProps> = ({ title, onClose, onAdd }) => {
    return (
        <TopBar
            title={title}
            leftIcon={<IoMdClose size={24} />}
            onLeftClick={onClose}
            rightIcon={<IoMdAdd size={24} />}
            onRightClick={onAdd}
        />
    );
};

export default TimerListTopBar;
