import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TIMER_TYPE } from '../config/timer/type';
import { BaseTimerData } from './types/timer';

type SelectedTimerState = {
    defaultTimer: BaseTimerData;
    selectedTimerId: string;
    selectTimer: (id: string) => void;
    updateDefaultTimer: (updatedProps: Partial<BaseTimerData>) => void;
};

export const useSelectedTimerStore = create<SelectedTimerState>()(
    persist(
        (set) => ({
            defaultTimer: {
                id: 'default',
                type: TIMER_TYPE.BASE,
                time: 10,
                isMinutes: false,
            },
            selectedTimerId: 'default',
            selectTimer: (id) => set({ selectedTimerId: id }),
            updateDefaultTimer: (updatedProps) =>
                set((state) => ({
                    defaultTimer: { ...state.defaultTimer, ...updatedProps },
                })),
        }),
        {
            name: 'selected-timer-store',
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
