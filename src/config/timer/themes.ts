import { themeColors } from '../themeColors';

export type Theme = {
    name: string;
    color: {
        main: string;
        point: string;
        sub: string;
    };
    text: {
        main: string;
        point: string;
        sub: string;
    };
    bg: {
        main: string;
        point: string;
        sub: string;
    };
    quote: string;
};

export const themes: Record<string, Theme> = {
    classic: {
        name: 'Classic',
        color: themeColors.classic,
        text: {
            main: `text-classic-main`,
            point: `text-classic-point`,
            sub: `text-classic-sub`,
        },
        bg: {
            main: `bg-classic-main`,
            point: `bg-classic-point`,
            sub: `bg-classic-sub`,
        },
        quote: 'Great things\ntake time.',
    },
    purple: {
        name: 'Purple',
        color: themeColors.purple,
        text: {
            main: `text-purple-main`,
            point: `text-purple-point`,
            sub: `text-purple-sub`,
        },
        bg: {
            main: `bg-purple-main`,
            point: `bg-purple-point`,
            sub: `bg-purple-sub`,
        },
        quote: 'Becoming a better\nversion of me.',
    },
    black: {
        name: 'Black',
        color: themeColors.black,
        text: {
            main: `text-black-main`,
            point: `text-black-point`,
            sub: `text-black-sub`,
        },
        bg: {
            main: `bg-black-main`,
            point: `bg-black-point`,
            sub: `bg-black-sub`,
        },
        quote: 'For my better\ntomorrow.',
    },
};
