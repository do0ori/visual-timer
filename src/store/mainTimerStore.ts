import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TimerData = {
    id: string;
    title?: string;
    time: number;
    isMinutes: boolean;
    isRunning: boolean;
    pointColorIndex?: number;
};

type MainTimerState = {
    defaultTimer: TimerData;
    selectedTimerId: string;
    timers: TimerData[];
    selectTimer: (id: string) => void;
    addTimer: (newTimer: TimerData) => void;
    getTimer: (id: string) => TimerData;
    updateTimer: (id: string, updatedProps: Partial<TimerData>) => void;
    removeTimer: (id: string) => void;
};

export const useMainTimerStore = create<MainTimerState>()(
    persist(
        (set, get) => ({
            defaultTimer: {
                id: 'default',
                time: 10,
                isMinutes: false,
                isRunning: false,
            },

            selectedTimerId: 'default',

            timers: [
                {
                    id: 'pasta',
                    title: 'Pasta (Al Dente)',
                    time: 9,
                    isMinutes: true,
                    isRunning: false,
                    pointColorIndex: 0,
                },
            ],

            selectTimer: (id) => set({ selectedTimerId: id }),

            addTimer: (newTimer) => {
                set((state) => ({
                    timers: [...state.timers, newTimer],
                }));
            },

            getTimer: (id) => {
                const state = get();
                return id === 'default'
                    ? state.defaultTimer
                    : state.timers.find((t) => t.id === id) || state.defaultTimer;
            },

            updateTimer: (id: string, updatedProps: Partial<TimerData>) => {
                set((state) => {
                    return id === 'default'
                        ? { defaultTimer: { ...state.defaultTimer, ...updatedProps } }
                        : {
                              timers: state.timers.map((timer) =>
                                  timer.id === id ? { ...timer, ...updatedProps } : timer
                              ),
                          };
                });
            },

            removeTimer: (id) => {
                set((state) => {
                    const isRemovingSelected = state.selectedTimerId === id;
                    return {
                        timers: state.timers.filter((timer) => timer.id !== id),
                        selectedTimerId: isRemovingSelected ? 'default' : state.selectedTimerId,
                    };
                });
            },
        }),
        {
            name: 'main-timer-store',
            onRehydrateStorage: () => (state) => {
                if (state) {
                    setTimeout(() => {
                        state.selectedTimerId = 'default';
                    }, 0);
                }
            },
        }
    )
);
