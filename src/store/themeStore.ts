import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { themes } from '../config/theme/themes';
import { getTextColor } from '../utils/colorUtils';
import { Theme } from './types/theme';

type ThemeState = {
    selectedTheme: Theme;
    themes: Theme[];
    compColor: 'white' | 'black';
    setTheme: (id: string) => void;
    addTheme: (theme: Theme) => void;
    updateTheme: (id: string, updatedProps: Partial<Theme>) => void;
    removeTheme: (id: string) => void;
};

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            selectedTheme: themes[0],
            themes: [...themes],
            compColor: getTextColor(themes[0].color.main),

            setTheme: (id) => {
                const { themes } = get();
                const theme = themes.find((t) => t.id === id);
                if (theme) {
                    set({
                        selectedTheme: theme,
                        compColor: getTextColor(theme.color.main),
                    });
                } else {
                    console.warn(`Theme with id "${id}" does not exist.`);
                }
            },

            addTheme: (theme) => {
                set((state) => ({
                    themes: [...state.themes, theme],
                }));
            },

            updateTheme: (id, updatedProps) =>
                set((state) => {
                    const updatedThemes = state.themes.map((t) => (t.id === id ? { ...t, ...updatedProps } : t));

                    return {
                        themes: updatedThemes,
                        ...(state.selectedTheme.id === id && {
                            selectedTheme: { ...state.selectedTheme, ...updatedProps },
                            compColor: updatedProps.color?.main
                                ? getTextColor(updatedProps.color.main)
                                : state.compColor,
                        }),
                    };
                }),

            removeTheme: (id) =>
                set((state) => {
                    if (id.startsWith('default-')) {
                        console.warn(`Cannot remove default theme: "${id}".`);
                        return {};
                    }
                    const updatedThemes = state.themes.filter((t) => t.id !== id);
                    const newSelectedTheme = state.selectedTheme.id === id ? updatedThemes[0] : state.selectedTheme;

                    return {
                        themes: updatedThemes,
                        selectedTheme: newSelectedTheme,
                        ...(state.selectedTheme.id === id && {
                            compColor: getTextColor(newSelectedTheme.color.main),
                        }),
                    };
                }),
        }),
        {
            name: 'theme-store',
            version: 2, // a migration will be triggered if the version in the storage mismatches this one
            migrate: (persistedState, version) => {
                const state = persistedState as ThemeState;
                if (version === 0) {
                    return {
                        ...state,
                        themes: { ...themes },
                    };
                } else if (version === 1) {
                    if ('globalThemeKey' in state) delete state.globalThemeKey;
                    return {
                        ...state,
                        selectedTheme: themes[0],
                        themes: [...themes],
                    };
                }
                return state;
            },
        }
    )
);
