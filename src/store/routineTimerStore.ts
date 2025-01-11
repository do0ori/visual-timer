import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
            timers: [],
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
