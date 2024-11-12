import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MainTimerData {
    id: string;
    title?: string;
    time: number;
    isMinutes: boolean;
    isRunning: boolean;
    pointColor?: string;
}

interface MainTimerState {
    defaultTimer: MainTimerData;
    selectedTimerId: string;
    timers: MainTimerData[];
    selectTimer: (id: string) => void;
    addTimer: (newTimer: MainTimerData) => void;
    getTimer: (id: string) => MainTimerData;
    updateTimer: (id: string, updatedProps: Partial<MainTimerData>) => void;
    removeTimer: (id: string) => void;
}

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
                    pointColor: '#5D6DB6',
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

            updateTimer: (id: string, updatedProps: Partial<MainTimerData>) => {
                set((state) => {
                    return id === 'default'
                        ? {
                              defaultTimer: { ...state.defaultTimer, ...updatedProps },
                          }
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
