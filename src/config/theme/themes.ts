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
            pointOptions: ['#F07F7F', '#8B72CB', '#6372BB', '#5892D0', '#4A7658', '#FFD438', '#F89B00', '#E15B5B'],
        },
        text: 'Great things\ntake time.',
    },
    'gray-purple': {
        color: {
            main: '#DCE0E3',
            point: '#9079C9',
            sub: '#D7D5E0',
            pointOptions: ['#F7ABC5', '#9079C9', '#7A97F0', '#88B8DD', '#6B9E87', '#fED367', '#fBAD65', '#f55C5C'],
        },
        text: 'Becoming a better\nversion of me.',
    },
    'black-green': {
        color: {
            main: '#202123',
            point: '#4C6A60',
            sub: '#CEE5DD',
            pointOptions: ['#FFA3B9', '#7457BC', '#0E64AF', '#4BACB9', '#4C6A60', '#FFB700', '#EB7A1E', '#C40808'],
        },
        text: 'For my better\ntomorrow.',
    },
};
