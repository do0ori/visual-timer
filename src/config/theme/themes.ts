import { Theme } from '../../store/types/theme';

export const themes: Theme[] = [
    {
        id: 'default-beige-green',
        title: 'Beige Green',
        color: {
            main: '#F4E3C1',
            point: '#4A7658',
            sub: '#F0BE81',
            pointOptions: ['#F07F7F', '#8B72CB', '#6372BB', '#5892D0', '#4A7658', '#FFD438', '#F89B00', '#E15B5B'],
        },
        text: 'Great things\ntake time.',
    },
    {
        id: 'default-gray-purple',
        title: 'Gray Purple',
        color: {
            main: '#DCE0E3',
            point: '#9079C9',
            sub: '#D7D5E0',
            pointOptions: ['#F7ABC5', '#9079C9', '#7A97F0', '#88B8DD', '#6B9E87', '#fED367', '#fBAD65', '#f55C5C'],
        },
        text: 'Becoming a better\nversion of me.',
    },
    {
        id: 'default-black-green',
        title: 'Black Green',
        color: {
            main: '#202123',
            point: '#4C6A60',
            sub: '#CEE5DD',
            pointOptions: ['#FFA3B9', '#7457BC', '#0E64AF', '#4BACB9', '#4C6A60', '#FFB700', '#EB7A1E', '#C40808'],
        },
        text: 'For my better\ntomorrow.',
    },
    {
        id: 'default-sky-blue',
        title: 'Sky Blue',
        color: {
            main: '#C8D9EB',
            point: '#76A3DE',
            sub: '#FFF0B9',
            pointOptions: ['#4A668B', '#597aa6', '#7A96BB', '#789AC6', '#779FD2', '#76A3DE', '#87AFE2', '#A9C6EA'],
        },

        text: 'Dive deep into dreams,\nlet your spirit soar.',
    },
    {
        id: 'default-lovely-pink',
        title: 'Lovely Pink',
        color: {
            main: '#FFD6D6',
            point: '#F48FB1',
            sub: '#FDF4AC',
            pointOptions: ['#B76B85', '#C8899E', '#D78BA5', '#E58DAB', '#F48FB1', '#F59DBB', '#F7ABC4', '#F8B9CE'],
        },
        text: 'Every sunset brings\na promise of a new dawn.',
    },
];
