export const getBrightness = (hexColor: string): number => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Apply the formula for perceived brightness
    return (r * 299 + g * 587 + b * 114) / 1000;
};

// Returns true if the color is dark, otherwise false
export const isDarkColor = (hexColor: string): boolean => {
    return getBrightness(hexColor) < 128; // Use a threshold for brightness
};
