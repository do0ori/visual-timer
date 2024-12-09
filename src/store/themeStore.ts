import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Theme, themes } from '../config/theme/themes';
import { isDarkColor } from '../utils/colorUtils';

interface ThemeState {
    globalThemeKey: string;
    themes: Record<string, Theme>;
    compColor: 'white' | 'black';
    setGlobalTheme: (themeKey: string) => void;
    addCustomTheme: (themeKey: string, theme: Theme) => void;
    removeCustomTheme: (themeKey: string) => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            globalThemeKey: 'default-classic',
            themes: { ...themes },
            compColor: isDarkColor(themes['default-classic'].color.main) ? 'white' : 'black',

            setGlobalTheme: (themeKey) => {
                const { themes } = get();
                if (themes[themeKey]) {
                    const isDark = isDarkColor(themes[themeKey].color.main);
                    set({
                        globalThemeKey: themeKey,
                        compColor: isDark ? 'white' : 'black',
                    });
                } else {
                    console.warn(`Theme with key "${themeKey}" does not exist.`);
                }
            },

            addCustomTheme: (themeKey, theme) => {
                set((state) => ({
                    themes: { ...state.themes, [themeKey]: theme },
                }));
            },

            removeCustomTheme: (themeKey: string) => {
                const { themes, globalThemeKey } = get();

                if (themeKey.startsWith('default-')) {
                    console.warn(`Cannot remove default theme: "${themeKey}".`);
                    return;
                }

                const { [themeKey]: _, ...remainingThemes } = themes;

                set(() => ({
                    themes: remainingThemes,
                    globalThemeKey: globalThemeKey === themeKey ? 'default-classic' : globalThemeKey,
                }));
            },
        }),
        {
            name: 'theme-store',
        }
    )
);
