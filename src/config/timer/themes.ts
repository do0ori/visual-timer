export type ThemeColor = {
    main: string;
    point: string;
    sub: string;
};

export type Theme = {
    color: ThemeColor;
    text: string;
};

export const themes: Record<string, Theme> = {
    'default-classic': {
        color: {
            main: '#F4E3C1',
            point: '#4A7658',
            sub: '#F0BE81',
        },
        text: 'Great things\ntake time.',
    },
    'default-purple': {
        color: {
            main: '#DCE0E3',
            point: '#9079C9',
            sub: '#D7D5E0',
        },
        text: 'Becoming a better\nversion of me.',
    },
    'default-black': {
        color: {
            main: '#202123',
            point: '#4C6A60',
            sub: '#CEE5DD',
        },
        text: 'For my better\ntomorrow.',
    },
};
