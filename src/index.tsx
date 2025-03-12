import * as Sentry from '@sentry/react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import './index.css';
import ErrorPage from './pages/ErrorPage';
import MainPage from './pages/MainPage';
import NotFoundPage from './pages/NotFoundPage';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const parseLocalStorage = () => {
    return Object.keys(localStorage).reduce(
        (acc, key) => {
            try {
                acc[key] = JSON.parse(localStorage.getItem(key) || '');
            } catch (e) {
                acc[key] = localStorage.getItem(key);
            }
            return acc;
        },
        {} as Record<string, unknown>
    );
};

Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    beforeSend(event) {
        event.extra = {
            ...event.extra,
            localStorage: parseLocalStorage(),
        };
        return event;
    },
});

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

// 앱 시작 시 알림 권한 설정 요청
document.addEventListener(
    'click',
    () => {
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission()
                .then((permission) => {
                    if (permission === 'granted') {
                        console.debug('Notification permission granted.');
                    } else if (permission === 'denied') {
                        console.debug('Notification permission denied.');
                    } else {
                        console.debug('Notification permission ignored.');
                    }
                })
                .catch((error) => {
                    console.error('Notification permission error:', error);
                });
        }
    },
    { once: true }
);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<RouterProvider router={router} />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
