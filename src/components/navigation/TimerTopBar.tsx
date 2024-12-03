import { IoIosSave, IoMdClose } from 'react-icons/io';
import { useThemeStore } from '../../store/themeStore';

interface TimerTopBarProps {
    title: string;
    onClose: () => void;
    onSave: () => void;
}

const TimerTopBar: React.FC<TimerTopBarProps> = ({ title, onClose, onSave }) => {
    const { themes, globalThemeKey } = useThemeStore();
    const currentTheme = themes[globalThemeKey];

    return (
        <div
            className="fixed left-0 top-0 flex h-14 w-full items-center px-4 text-white shadow-md"
            style={{
                backgroundColor: currentTheme.color.point,
            }}
        >
            <button onClick={onClose}>
                <IoMdClose size={24} />
            </button>

            <h1 className="ml-4 text-xl font-bold">{title}</h1>

            <button onClick={onSave} className="ml-auto">
                <IoIosSave size={24} />
            </button>
        </div>
    );
};

export default TimerTopBar;
