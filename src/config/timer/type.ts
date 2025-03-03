import { BaseTimerIcon, RoutineTimerIcon } from '../../components/icons/timer';

export const TIMER_TYPE = {
    BASE: 'base',
    ROUTINE: 'routine',
} as const;

export type TimerType = (typeof TIMER_TYPE)[keyof typeof TIMER_TYPE];

type TimerTypeConfigMap = {
    [K in TimerType]: {
        icon: typeof BaseTimerIcon | typeof RoutineTimerIcon;
        label: string;
        desc: string;
    };
};

export const TIMER_TYPE_CONFIG: TimerTypeConfigMap = {
    [TIMER_TYPE.BASE]: { icon: BaseTimerIcon, label: 'Basic Timer', desc: 'A simple, single timer for general use.' },
    [TIMER_TYPE.ROUTINE]: {
        icon: RoutineTimerIcon,
        label: 'Routine Timer',
        desc: 'A group of sequential basic timers for routine tasks.',
    },
} as const;

export const NUM_TIMER_TYPES = Object.keys(TIMER_TYPE).length;
