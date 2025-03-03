import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Radar from '../assets/radar.mp3';

type SettingsState = {
    volume: number; // Notification sound volume (0 to 1)
    mute: boolean;
    selectedAlarm: string; // Selected alarm sound file URL
    isClockwise: boolean;
    setVolume: (volume: number) => void;
    setMute: (mute: boolean) => void;
    setSelectedAlarm: (alarm: string) => void;
    setIsClockwise: (isClockwise: boolean) => void;
};

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            volume: 1, // Default volume (max)
            mute: false,
            selectedAlarm: Radar, // Default alarm sound
            isClockwise: true, //Default direction
            setVolume: (volume) => set({ volume }),
            setMute: (mute) => set({ mute }),
            setSelectedAlarm: (alarm) => set({ selectedAlarm: alarm }),
            setIsClockwise: (isClockwise) => set({ isClockwise }),
        }),
        {
            name: 'settings-store',
            version: 1, // a migration will be triggered if the version in the storage mismatches this one
            migrate: (persistedState, version) => {
                const state = persistedState as SettingsState;
                if (version === 0) {
                    return {
                        ...state,
                        isClockwise: true,
                    };
                }
                return state;
            },
        }
    )
);
