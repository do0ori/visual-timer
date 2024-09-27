import { themeColors } from './src/config/themeColors';

/** @type {import('tailwindcss').Config} */
export const content = ['./src/**/*.{js,jsx,ts,tsx}'];
export const theme = {
    extend: {
        colors: {
            classic: themeColors.classic,
            purple: themeColors.purple,
            black: themeColors.black,
        },
    },
};
export const plugins = [];
