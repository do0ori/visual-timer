import { IoIosArrowBack, IoMdClose } from 'react-icons/io';
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
            className="flex h-14 w-full shrink-0 items-center px-4 text-white shadow-md"
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
const CloseIcon = <IoMdClose size={24} />;

const Back: React.FC<Omit<TopBarProps, 'leftIcon'>> = (props) => <BaseTopBar leftIcon={BackIcon} {...props} />;
const Cancel: React.FC<Omit<TopBarProps, 'leftIcon'>> = (props) => <BaseTopBar leftIcon={CloseIcon} {...props} />;

const TopBar = {
    Back,
    Cancel,
};

export default TopBar;
