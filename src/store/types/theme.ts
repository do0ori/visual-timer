export type ThemeColor = {
    main: string;
    point: string;
    sub: string;
    pointOptions: string[];
};

export type Theme = {
    id: string;
    title: string;
    color: ThemeColor;
    text: string;
};
