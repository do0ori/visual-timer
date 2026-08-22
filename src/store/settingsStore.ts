import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DEFAULT_ALARM = '/visual-timer/audios/radar.mp3';

type CustomAlarm = {
    name: string;
    value: string;
};

type SettingsState = {
    volume: number; // Notification sound volume (0 to 1)
    mute: boolean;
    selectedAlarm: string; // Selected alarm sound file URL
    customAlarm: CustomAlarm | null;
    isClockwise: boolean;
    setVolume: (volume: number) => void;
    setMute: (mute: boolean) => void;
    setSelectedAlarm: (alarm: string) => void;
    setCustomAlarm: (alarm: CustomAlarm) => void;
    removeCustomAlarm: () => void;
    setIsClockwise: (isClockwise: boolean) => void;
};

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            volume: 1, // Default volume (max)
            mute: false,
            selectedAlarm: DEFAULT_ALARM, // Default alarm sound
            customAlarm: null,
            isClockwise: true, //Default direction
            setVolume: (volume) => set({ volume }),
            setMute: (mute) => set({ mute }),
            setSelectedAlarm: (alarm) => set({ selectedAlarm: alarm }),
            setCustomAlarm: (customAlarm) => set({ customAlarm, selectedAlarm: customAlarm.value }),
            removeCustomAlarm: () => set({ customAlarm: null, selectedAlarm: DEFAULT_ALARM }),
            setIsClockwise: (isClockwise) => set({ isClockwise }),
        }),
        {
            name: 'settings-store',
            version: 3, // a migration will be triggered if the version in the storage mismatches this one
            migrate: (persistedState, version) => {
                const state = persistedState as SettingsState;
                if (version < 2) {
                    return {
                        ...state,
                        selectedAlarm: DEFAULT_ALARM,
                        isClockwise: true,
                        customAlarm: null,
                    };
                }
                if (version < 3) {
                    return { ...state, customAlarm: null };
                }
                return state;
            },
        }
    )
);
