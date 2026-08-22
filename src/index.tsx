import * as Sentry from '@sentry/react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import './index.css';
import ErrorPage from './pages/ErrorPage';
import MainPage from './pages/MainPage';
import NotFoundPage from './pages/NotFoundPage';
import { configureTimerNotificationApiUrl } from './services/timerNotificationService';

configureTimerNotificationApiUrl(import.meta.env.VITE_TIMER_NOTIFICATION_API_URL);

const parseLocalStorage = () => {
    return Object.keys(localStorage).reduce(
        (acc, key) => {
            try {
                acc[key] = JSON.parse(localStorage.getItem(key) || '');
            } catch {
                acc[key] = localStorage.getItem(key);
            }
            return acc;
        },
        {} as Record<string, unknown>
    );
};

const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
if (sentryDsn) {
    Sentry.init({
        dsn: sentryDsn,
        beforeSend(event) {
            event.extra = {
                ...event.extra,
                localStorage: parseLocalStorage(),
            };
            return event;
        },
    });
}

const router = createBrowserRouter(
    [
        {
            path: '/',
            element: (
                <Sentry.ErrorBoundary fallback={<ErrorPage />}>
                    <App />
                </Sentry.ErrorBoundary>
            ),
            errorElement: <ErrorPage />,
            children: [
                {
                    index: true,
                    path: '/',
                    element: <MainPage />,
                },
            ],
        },
        {
            path: '*',
            element: <NotFoundPage />,
        },
    ],
    {
        basename: '/visual-timer',
    }
);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<RouterProvider router={router} />);

// Register Service Worker with auto-update
registerSW({
    immediate: true,
    onRegisterError(error) {
        console.error('Service worker registration failed:', error);
    },
    onNeedRefresh() {
        console.debug('New content available, updating service worker.');
    },
    onOfflineReady() {
        console.debug('App ready to work offline.');
    },
});
