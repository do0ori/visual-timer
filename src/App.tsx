import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useThemeStore } from './store/themeStore';

function App() {
    const { themes, globalThemeKey, compColor } = useThemeStore();
    const currentTheme = themes[globalThemeKey];

    useEffect(() => {
        document.body.style.backgroundColor = currentTheme.color.main;
        document.body.style.color = compColor;

        return () => {
            document.body.style.backgroundColor = '';
            document.body.style.color = '';
        };
    }, [currentTheme, compColor]);

    return (
        <div className={`select-none`}>
            <Outlet />
        </div>
    );
}

export default App;
