import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import { useThemeStore } from './store/themeStore';

function App() {
    const { compColor } = useThemeStore();
    const { originalTheme } = useTheme();

    useEffect(() => {
        document.body.style.backgroundColor = originalTheme.color.main;
        document.body.style.color = compColor;

        return () => {
            document.body.style.backgroundColor = '';
            document.body.style.color = '';
        };
    }, [originalTheme, compColor]);

    return (
        <div className={`select-none`}>
            <Outlet />
        </div>
    );
}

export default App;
