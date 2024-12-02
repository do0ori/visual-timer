import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../../store/themeStore';

const TopBar: React.FC<{ title: string }> = ({ title }) => {
    const { themes, globalThemeKey } = useThemeStore();
    const currentTheme = themes[globalThemeKey];
    const navigate = useNavigate();

    return (
        <div
            className="fixed left-0 top-0 flex h-14 w-full items-center px-4 text-white shadow-md"
            style={{
                backgroundColor: currentTheme.color.point,
            }}
        >
            <button onClick={() => navigate('/')}>
                <IoArrowBack size={24} />
            </button>
            <h1 className="ml-4 text-xl font-bold">{title}</h1>
        </div>
    );
};

export default TopBar;
