import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useThemeStore } from './store/themeStore';

function App() {
    const { selectedTheme, compColor } = useThemeStore();

    useEffect(() => {
        document.body.style.backgroundColor = selectedTheme.color.main;
        document.body.style.color = compColor;

        return () => {
            document.body.style.backgroundColor = '';
            document.body.style.color = '';
        };
    }, [selectedTheme, compColor]);

    document.addEventListener(
        'touchmove',
        (e) => {
            if (e.target === document.body) {
                e.preventDefault();
            }
        },
        { passive: false }
    );

    return (
        <div className={`select-none`}>
            <Outlet />
        </div>
    );
}

export default App;
