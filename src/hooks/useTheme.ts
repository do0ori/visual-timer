import { useThemeStore } from '../store/themeStore';
import { deepCopy } from '../utils/deepCopy';
import { getTimerPointColor } from '../utils/themeUtils';

export const useTheme = (pointColorIndex?: number, title?: string) => {
    const { themes, globalThemeKey } = useThemeStore();
    const originalTheme = themes[globalThemeKey];
    const currentTheme = deepCopy(originalTheme);

    if (pointColorIndex !== undefined) {
        currentTheme.color.point = getTimerPointColor(currentTheme, pointColorIndex);
    }
    if (title) {
        currentTheme.text = title;
    }

    return { originalTheme, currentTheme };
};
