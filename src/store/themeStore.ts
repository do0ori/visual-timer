import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Theme, themes } from '../config/theme/themes';
import { getTextColor } from '../utils/colorUtils';

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
            globalThemeKey: 'beige-green',
            themes: { ...themes },
            compColor: getTextColor(themes['beige-green'].color.main),

            setGlobalTheme: (themeKey) => {
                const { themes } = get();
                if (themes[themeKey]) {
                    set({
                        globalThemeKey: themeKey,
                        compColor: getTextColor(themes[themeKey].color.main),
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
                    globalThemeKey: globalThemeKey === themeKey ? 'beige-green' : globalThemeKey,
                }));
            },
        }),
        {
            name: 'theme-store',
        }
    )
);
