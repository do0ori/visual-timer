import { Theme } from '../store/types/theme';

export const getTimerPointColor = (theme: Theme, colorIndex?: number): string => {
    if (colorIndex === undefined) {
        return theme.color.point;
    }
    return theme.color.pointOptions[colorIndex] || theme.color.point;
};
