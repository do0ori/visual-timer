import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import './index.css';
import MainPage from './pages/MainPage';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const router = createBrowserRouter(
    [
        { path: '*', element: <>[ERROR] 404 NOT FOUND</> },
        {
            path: '/',
            element: <App />,
            children: [
                {
                    index: true,
                    path: '/',
                    element: <MainPage />,
                },
            ],
        },
    ],
    {
        basename: '/visual-timer',
    }
);

// 앱 시작 시 알림 권한 설정 요청
if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission()
        .then((permission) => {
            if (permission === 'granted') {
                console.debug('Notification permission granted.');
            } else {
                console.debug('Notification permission denied.');
            }
        })
        .catch((error) => {
            console.error('Notification permission error:', error);
        });
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<RouterProvider router={router} />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
