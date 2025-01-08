import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RoutineTimerData, RoutineTimerItem } from './types/timer';

type RoutineTimerState = {
    timers: RoutineTimerData[];
    addTimer: (newTimer: RoutineTimerData) => void;
    updateTimer: (id: string, updatedProps: Partial<RoutineTimerData>) => void;
    removeTimer: (id: string) => void;
    getTimer: (id: string) => RoutineTimerData | undefined;
    nextTimer: (routineId: string) => void;
    resetTimer: (routineId: string) => void;
    updateTimerItem: (routineId: string, itemIndex: number, updates: Partial<RoutineTimerItem>) => void;
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
            nextTimer: (routineId) => {
                set((state) => {
                    const timer = state.timers.find((t) => t.id === routineId);
                    if (!timer) return state;

                    const nextIndex = timer.currentItemIndex + 1;
                    if (nextIndex >= timer.items.length && timer.repeat) {
                        return {
                            timers: state.timers.map((t) => (t.id === routineId ? { ...t, currentItemIndex: 0 } : t)),
                        };
                    }
                    if (nextIndex >= timer.items.length) {
                        return {
                            timers: state.timers.map((t) => (t.id === routineId ? { ...t, isRunning: false } : t)),
                        };
                    }
                    return {
                        timers: state.timers.map((t) =>
                            t.id === routineId ? { ...t, currentItemIndex: nextIndex } : t
                        ),
                    };
                });
            },
            resetTimer: (routineId) =>
                set((state) => ({
                    timers: state.timers.map((t) =>
                        t.id === routineId ? { ...t, currentItemIndex: 0, isRunning: false } : t
                    ),
                })),
            updateTimerItem: (routineId, itemIndex, updates) =>
                set((state) => ({
                    timers: state.timers.map((t) =>
                        t.id === routineId
                            ? {
                                  ...t,
                                  items: t.items.map((item, index) =>
                                      index === itemIndex ? { ...item, ...updates } : item
                                  ),
                              }
                            : t
                    ),
                })),
        }),
        {
            name: 'routine-timer-store',
        }
    )
);
