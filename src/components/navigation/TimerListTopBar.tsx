import { IoIosArrowBack, IoMdAdd } from 'react-icons/io';
import TopBar from '../common/TopBar';

type TimerListTopBarProps = {
    title: string;
    onClose: () => void;
    onAdd: () => void;
};

const TimerListTopBar: React.FC<TimerListTopBarProps> = ({ title, onClose, onAdd }) => {
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

export default TimerListTopBar;
