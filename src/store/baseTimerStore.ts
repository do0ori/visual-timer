import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TIMER_TYPE } from '../config/timer/type';
import { BaseTimerData } from './types/timer';

type BaseTimerState = {
    timers: BaseTimerData[];
    addTimer: (newTimer: BaseTimerData) => void;
    updateTimer: (id: string, updatedProps: Partial<BaseTimerData>) => void;
    removeTimer: (id: string) => void;
    getTimer: (id: string) => BaseTimerData | undefined;
};

export const useBaseTimerStore = create<BaseTimerState>()(
    persist(
        (set, get) => ({
            timers: [
                {
                    id: 'base-example',
                    type: TIMER_TYPE.BASE,
                    title: 'Pasta Al Dente',
                    time: 9,
                    isMinutes: true,
                    pointColorIndex: 3,
                },
            ],
            addTimer: (newTimer) => set((state) => ({ timers: [...state.timers, newTimer] })),
            updateTimer: (id, updatedProps) =>
                set((state) => ({
                    timers: state.timers.map((timer) => (timer.id === id ? { ...timer, ...updatedProps } : timer)),
                })),
            removeTimer: (id) =>
                set((state) => ({
                    timers: state.timers.filter((timer) => timer.id !== id),
                })),
            getTimer: (id) => get().timers.find((timer) => timer.id === id),
        }),
        {
            name: 'base-timer-store',
        }
    )
);
