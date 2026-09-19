import * as Sentry from '@sentry/react';
import ReactDOM from 'react-dom/client';
import packageMetadata from '../package.json';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import './index.css';
import ErrorPage from './pages/ErrorPage';
import MainPage from './pages/MainPage';
import NotFoundPage from './pages/NotFoundPage';
import { configureTimerNotificationApiUrl } from './services/timerNotificationService';

configureTimerNotificationApiUrl(import.meta.env.VITE_TIMER_NOTIFICATION_API_URL);

document.addEventListener(
    'click',
    () => {
        if ('Notification' in window && Notification.permission === 'default') {
            void Notification.requestPermission().catch((error) =>
                console.debug('Unable to request notification permission:', error)
            );
        }
    },
    { once: true }
);

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

/**
 * Stack frames from our own build always point at the hashed bundle under `assets/`.
 * Frames attributed to the document URL (or to an injected/eval'd script) come from
 * browser extensions and in-app injections, which `window.onerror` also reports.
 * Tagging the origin keeps those separable in Sentry instead of silently mixing them in.
 */
const isOwnCodeEvent = (event: Sentry.ErrorEvent) => {
    const frames = event.exception?.values?.flatMap((value) => value.stacktrace?.frames ?? []) ?? [];
    const located = frames.filter((frame) => Boolean(frame.filename));
    if (located.length === 0) return true;
    return located.some((frame) => frame.filename?.includes(`${import.meta.env.BASE_URL}assets/`));
};

const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
if (sentryDsn) {
    Sentry.init({
        dsn: sentryDsn,
        release: `visual-timer@${packageMetadata.version}`,
        beforeSend(event) {
            event.extra = {
                ...event.extra,
                localStorage: parseLocalStorage(),
            };
            event.tags = {
                ...event.tags,
                own_code: isOwnCodeEvent(event),
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
