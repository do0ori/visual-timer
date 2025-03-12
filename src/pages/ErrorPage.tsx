import * as Sentry from '@sentry/react';
import { IoMdHome } from 'react-icons/io';
import { MdError } from 'react-icons/md';
import { useNavigate, useRouteError } from 'react-router-dom';
import Button from '../components/common/Button';
import { useThemeStore } from '../store/themeStore';

const ErrorPage: React.FC = () => {
    const error = useRouteError();
    const navigate = useNavigate();
    const { selectedTheme } = useThemeStore();

    console.error('Application Error:', error);
    Sentry.captureException(error);

    return (
        <div className="flex h-screen flex-col items-center justify-center gap-6 p-4 text-center">
            <div className="flex items-center gap-2">
                <MdError size={28} className="text-red-500" />
                <h1 className="text-2xl font-bold">Oops!</h1>
            </div>
            <p className="text-gray-600">Sorry, an unexpected error has occurred.</p>
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

export default ErrorPage;
