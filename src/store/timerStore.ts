import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TimerType = 'main' | 'parallel' | 'routine';

export interface TimerData {
    id: string;
    time: number;
    isMinutes: boolean;
    pointColor?: string; // Timer's theme point color will be overridden if pointColor exists
}

interface TimerState {
    mainTimer: TimerData;
    parallelTimers: TimerData[];
    routineTimers: TimerData[];
    addTimer: (newTimer: TimerData, type: Omit<TimerType, 'main'>) => void;
    updateTimer: (id: string, updatedProps: Partial<TimerData>, type: TimerType) => void;
    removeTimer: (id: string, type: Omit<TimerType, 'main'>) => void;
}

export const useTimerStore = create<TimerState>()(
    persist(
        (set) => ({
            mainTimer: {
                id: 'main',
                time: 10,
                isMinutes: true,
            },
            parallelTimers: [],
            routineTimers: [],

            // Add timer to parallel or routine
            addTimer: (newTimer, type) => {
                set((state) => {
                    if (type === 'parallel') {
                        return { parallelTimers: [...state.parallelTimers, newTimer] };
                    } else {
                        return { routineTimers: [...state.routineTimers, newTimer] };
                    }
                });
            },

            // Update timer in main, parallel, or routine
            updateTimer: (id, updatedProps, type) => {
                set((state) => {
                    if (type === 'main') {
                        return { mainTimer: { ...state.mainTimer, ...updatedProps } };
                    } else if (type === 'parallel') {
                        return {
                            parallelTimers: state.parallelTimers.map((timer) =>
                                timer.id === id ? { ...timer, ...updatedProps } : timer
                            ),
                        };
                    } else {
                        return {
                            routineTimers: state.routineTimers.map((timer) =>
                                timer.id === id ? { ...timer, ...updatedProps } : timer
                            ),
                        };
                    }
                });
            },

            // Remove timer from parallel or routine
            removeTimer: (id, type) => {
                set((state) => {
                    if (type === 'parallel') {
                        return { parallelTimers: state.parallelTimers.filter((timer) => timer.id !== id) };
                    } else {
                        return { routineTimers: state.routineTimers.filter((timer) => timer.id !== id) };
                    }
                });
            },
        }),
        {
            name: 'timer-store',
        }
    )
);
