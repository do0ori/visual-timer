import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TIMER_TYPE } from '../config/timer/type';
import { BaseTimerData } from './types/timer';

type SelectedTimerState = {
    defaultTimer: BaseTimerData;
    selectedTimerId: string;
    selectDefaultTimer: () => void;
    selectTimer: (id: string) => void;
    updateDefaultTimer: (updatedProps: Partial<BaseTimerData>) => void;
};

export const useSelectedTimerStore = create<SelectedTimerState>()(
    persist(
        (set) => {
            const defaultTimer: BaseTimerData = {
                id: 'default',
                type: TIMER_TYPE.BASE,
                title: '',
                time: 10,
                isMinutes: false,
            };

            return {
                defaultTimer,
                selectedTimerId: defaultTimer.id,
                selectTimer: (id) => set({ selectedTimerId: id }),
                selectDefaultTimer: () => set((state) => ({ selectedTimerId: state.defaultTimer.id })),
                updateDefaultTimer: (updatedProps) =>
                    set((state) => ({
                        defaultTimer: { ...state.defaultTimer, ...updatedProps },
                    })),
            };
        },
        {
            name: 'selected-timer-store',
            onRehydrateStorage: () => (state) => {
                if (state) {
                    setTimeout(() => {
                        state.selectedTimerId = state.defaultTimer.id;
                    }, 0);
                }
            },
        }
    )
);
