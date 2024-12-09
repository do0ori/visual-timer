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
    'default-classic': {
        color: {
            main: '#F4E3C1',
            point: '#4A7658',
            sub: '#F0BE81',
            pointOptions: [
                '#4A7658', // 세이지 그린
                '#3D6A4C', // 포레스트 그린
                '#8B4F4F', // 버건디 레드
                '#C15959', // 코랄 레드
                '#6B4E8E', // 딥 퍼플
                '#795695', // 플럼 퍼플
                '#567989', // 피콕 블루
                '#5B728A', // 스틸 블루
            ],
        },
        text: 'Great things\ntake time.',
    },
    'default-purple': {
        color: {
            main: '#DCE0E3',
            point: '#9079C9',
            sub: '#D7D5E0',
            pointOptions: [
                '#9079C9', // 라벤더 퍼플
                '#7B68B5', // 딥 라벤더
                '#D37B7B', // 살몬 핑크
                '#B86C6C', // 러스트 레드
                '#7DB6A6', // 민트 그린
                '#78C3B2', // 터콰이즈
                '#6AAFAF', // 틸 블루
                '#85A8D8', // 파스텔 블루
            ],
        },
        text: 'Becoming a better\nversion of me.',
    },
    'default-black': {
        color: {
            main: '#202123',
            point: '#4C6A60',
            sub: '#CEE5DD',
            pointOptions: [
                '#4C6A60', // 틸 그린
                '#3D5A52', // 다크 틸
                '#5A3D3D', // 초콜릿 브라운
                '#774F4F', // 버건디
                '#884474', // 플럼 레드
                '#8B4A6E', // 와인 레드
                '#7F4D6E', // 베리
                '#6D3E5D', // 오베르진
            ],
        },
        text: 'For my better\ntomorrow.',
    },
};
