import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import MainPage from './pages/MainPage';
import SettingsPage from './pages/SettingsPage';
import HamburgerLayout from './components/Layout/HamburgerLayout';
import TopBarLayout from './components/Layout/TopBarLayout';

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
                    element: (
                        <HamburgerLayout>
                            <MainPage />
                        </HamburgerLayout>
                    ),
                },
                {
                    path: 'settings',
                    element: (
                        <TopBarLayout>
                            <SettingsPage />
                        </TopBarLayout>
                    ),
                },
            ],
        },
    ],
    {
        basename: '/visual-timer',
    }
);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<RouterProvider router={router} />);
