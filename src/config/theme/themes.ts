export type ThemeColor = {
    main: string;
    point: string;
    sub: string;
    pointOptions: string[];
};

export type Theme = {
    color: ThemeColor;
    text: string;
};

export const themes: Record<string, Theme> = {
    'beige-green': {
        color: {
            main: '#F4E3C1',
            point: '#4A7658',
            sub: '#F0BE81',
            pointOptions: ['#4A7658', '#2D5438', '#3A6B4B', '#4F8544', '#414D47', '#785339', '#634E3E', '#916033'],
        },
        text: 'Great things\ntake time.',
    },
    'gray-purple': {
        color: {
            main: '#DCE0E3',
            point: '#9079C9',
            sub: '#D7D5E0',
            pointOptions: ['#9079C9', '#6A4FB8', '#546DBF', '#4A6ACC', '#7C99E5', '#6B6B7E', '#7E7E96', '#5D5D6E'],
        },
        text: 'Becoming a better\nversion of me.',
    },
    'black-green': {
        color: {
            main: '#202123',
            point: '#4C6A60',
            sub: '#CEE5DD',
            pointOptions: ['#4C6A60', '#3D7A6B', '#4C7569', '#3D5B6B', '#4F7A8C', '#456B8C', '#4D4D57', '#3F3F47'],
        },
        text: 'For my better\ntomorrow.',
    },
};
