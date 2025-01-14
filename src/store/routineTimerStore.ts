import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TIMER_TYPE } from '../config/timer/type';
import { RoutineTimerData } from './types/timer';

type RoutineTimerState = {
    timers: RoutineTimerData[];
    addTimer: (newTimer: RoutineTimerData) => void;
    updateTimer: (id: string, updatedProps: Partial<RoutineTimerData>) => void;
    removeTimer: (id: string) => void;
    getTimer: (id: string) => RoutineTimerData | undefined;
};

export const useRoutineTimerStore = create<RoutineTimerState>()(
    persist(
        (set, get) => ({
            timers: [
                {
                    id: 'routine-example',
                    type: TIMER_TYPE.ROUTINE,
                    title: 'Pomodoro Timer',
                    items: [
                        ...Array.from({ length: 4 }, (_, i) => [
                            {
                                id: `routine-example-p${i + 1}`,
                                type: TIMER_TYPE.BASE,
                                title: `Pomodoro ${i + 1}`,
                                time: 25,
                                isMinutes: true,
                                pointColorIndex: 7,
                                interval: 5,
                            },
                            {
                                id: `routine-example-sb${i + 1}`,
                                type: TIMER_TYPE.BASE,
                                title: `Short Break ${i + 1}`,
                                time: 5,
                                isMinutes: true,
                                pointColorIndex: 3,
                                interval: 5,
                            },
                        ]).flat(),
                        {
                            id: 'routine-example-lb',
                            type: TIMER_TYPE.BASE,
                            title: 'Long Break',
                            time: 30,
                            isMinutes: true,
                            pointColorIndex: 2,
                            interval: 5,
                        },
                    ],
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
            name: 'routine-timer-store',
        }
    )
);
