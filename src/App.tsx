import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useThemeStore } from './store/themeStore';
import { applyColorMode } from './utils/colorMode';

function App() {
    const { selectedTheme, compColor } = useThemeStore();

    useEffect(() => {
        document.body.style.backgroundColor = selectedTheme.color.main;
        document.body.style.color = compColor;
        applyColorMode(compColor);

        return () => {
            document.body.style.backgroundColor = '';
            document.body.style.color = '';
            document.documentElement.classList.remove('dark');
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
