import { TIMER_TYPE } from '../../config/timer/type';

export interface BaseTimerData {
    id: string;
    type: typeof TIMER_TYPE.BASE;
    title: string;
    time: number;
    isMinutes: boolean;
    pointColorIndex?: number;
}

export interface RoutineTimerItem extends BaseTimerData {
    interval: number; // 다음 타이머와의 간격 (초 단위)
}

export type RoutineTimerData = {
    id: string;
    type: typeof TIMER_TYPE.ROUTINE;
    title: string;
    items: RoutineTimerItem[];
};

export type TimerData = BaseTimerData | RoutineTimerData;
