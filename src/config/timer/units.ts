export type Unit = {
    interval: number;
    multiple: number;
    denominator: number;
};

export const timerUnits: Record<string, Unit> = {
    seconds: {
        interval: 10,
        multiple: 100,
        denominator: 6000,
    },
    minutes: {
        interval: 1000,
        multiple: 60,
        denominator: 3600,
    },
};
