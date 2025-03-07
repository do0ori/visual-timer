import React from 'react';
import { IoMdColorPalette } from 'react-icons/io';
import { useThemeStore } from '../../../store/themeStore';
import ListItem from '../../common/ListItem';
import ThemeButton from '../../common/ThemeButton';

const DefaultThemeSelector: React.FC = () => {
    const { selectedTheme, themes, setTheme } = useThemeStore();
    const defaultThemes = themes.filter((theme) => theme.id.startsWith('default-'));

    const defaultThemeIcon = <IoMdColorPalette size={24} className="size-full" />;

    const defaultThemeSelectorContent = (
        <div className="flex w-full flex-col gap-4">
            <span className="text-lg">Default Themes</span>
            <div className="flex flex-wrap gap-3">
                {defaultThemes.map((theme) => (
                    <ThemeButton
                        key={theme.id}
                        theme={theme}
                        isSelected={theme.id === selectedTheme.id}
                        onClick={() => setTheme(theme.id)}
                    />
                ))}
            </div>
        </div>
    );

    return <ListItem icon={defaultThemeIcon} content={defaultThemeSelectorContent} />;
};

export default DefaultThemeSelector;
