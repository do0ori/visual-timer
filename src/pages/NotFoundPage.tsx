import { IoMdHome } from 'react-icons/io';
import { MdWarningAmber } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { useThemeStore } from '../store/themeStore';

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();
    const { selectedTheme } = useThemeStore();

    return (
        <div className="flex h-screen flex-col items-center justify-center gap-6 p-4 text-center">
            <div className="flex items-center gap-2">
                <MdWarningAmber size={28} className="text-amber-500" />
                <h1 className="text-2xl font-bold">Page Not Found</h1>
            </div>
            <p className="text-gray-600">Sorry, the page you are looking for does not exist.</p>
            <p className="text-sm text-gray-500">Path: {window.location.pathname}</p>
            <Button
                currentTheme={selectedTheme}
                onClick={() => navigate('/')}
                className="flex h-12 w-40 items-center justify-center gap-2 rounded-2xl text-lg"
                aria-label="Go Home"
            >
                <IoMdHome size={24} />
                <span>Go Home</span>
            </Button>
        </div>
    );
};

export default NotFoundPage;
