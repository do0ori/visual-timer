import { TIMER_TYPE } from '../../config/timer/type';

export type BaseTimerData = {
    id: string;
    type: typeof TIMER_TYPE.BASE;
    title?: string;
    time: number;
    isMinutes: boolean;
    isRunning: boolean;
    pointColorIndex?: number;
};

export type RoutineTimerItem = {
    timer: BaseTimerData;
    interval: number; // 다음 타이머와의 간격 (초 단위)
};

export type RoutineTimerData = {
    id: string;
    type: typeof TIMER_TYPE.ROUTINE;
    title?: string;
    items: RoutineTimerItem[];
    currentItemIndex: number;
    isRunning: boolean;
    repeat: boolean;
};

export type TimerData = BaseTimerData | RoutineTimerData;
