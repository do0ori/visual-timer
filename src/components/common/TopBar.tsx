import { IoIosArrowBack, IoIosSave, IoMdAdd, IoMdClose } from 'react-icons/io';
import { useTheme } from '../../hooks/useTheme';

type TopBarProps = {
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    center?: React.ReactNode;
    onLeftClick?: () => void;
    onRightClick?: () => void;
};

const BaseTopBar: React.FC<TopBarProps> = ({ leftIcon, rightIcon, center, onLeftClick, onRightClick }) => {
    const { originalTheme } = useTheme();

    return (
        <div
            className="absolute left-0 top-0 z-50 flex h-14 w-full items-center px-4 text-white shadow-md"
            style={{
                backgroundColor: originalTheme.color.point,
            }}
        >
            {leftIcon && <button onClick={onLeftClick}>{leftIcon}</button>}

            <h1 className="ml-4 text-xl font-bold">{center}</h1>

            {rightIcon && (
                <button onClick={onRightClick} className="ml-auto">
                    {rightIcon}
                </button>
            )}
        </div>
    );
};

const BackIcon = <IoIosArrowBack size={24} />;
const AddIcon = <IoMdAdd size={24} />;
const CloseIcon = <IoMdClose size={24} />;
const SaveIcon = <IoIosSave size={24} />;

const BackTopBar: React.FC<Omit<TopBarProps, 'leftIcon'>> = (props) => <BaseTopBar leftIcon={BackIcon} {...props} />;
const BackAddTopBar: React.FC<Omit<TopBarProps, 'leftIcon' | 'rightIcon'>> = (props) => (
    <BaseTopBar leftIcon={BackIcon} rightIcon={AddIcon} {...props} />
);
const CancelSaveTopBar: React.FC<Omit<TopBarProps, 'leftIcon' | 'rightIcon'>> = (props) => (
    <BaseTopBar leftIcon={CloseIcon} rightIcon={SaveIcon} {...props} />
);

const TopBar = {
    Back: BackTopBar,
    BackAdd: BackAddTopBar,
    CancelSave: CancelSaveTopBar,
};

export default TopBar;
