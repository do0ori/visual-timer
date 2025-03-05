import { useThemeStore } from '../store/themeStore';
import { deepCopy } from '../utils/deepCopy';
import { getTimerPointColor } from '../utils/themeUtils';

export const useTheme = (pointColorIndex?: number, title?: string) => {
    const { selectedTheme } = useThemeStore();
    const selectedThemeCopy = deepCopy(selectedTheme);

    if (pointColorIndex !== undefined) {
        selectedThemeCopy.color.point = getTimerPointColor(selectedThemeCopy, pointColorIndex);
    }
    if (title) {
        selectedThemeCopy.text = title;
    }

    const defaultPointColorIndex = selectedTheme.color.pointOptions.findIndex(
        (color) => color === selectedThemeCopy.color.point
    );

    return { selectedThemeCopy, defaultPointColorIndex };
};
