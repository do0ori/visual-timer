import { useEffect } from 'react';
import { useThemeStore } from './store/themeStore';
import { Outlet } from 'react-router-dom';

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
        <div className={`flex w-full flex-col`}>
            <Outlet />
        </div>
    );
}

export default App;
