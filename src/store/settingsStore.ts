import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Radar from '../assets/radar.mp3';

interface SettingsState {
    volume: number; // Notification sound volume (0 to 1)
    selectedAlarm: string; // Selected alarm sound file URL
    setVolume: (volume: number) => void;
    setSelectedAlarm: (alarm: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            volume: 1, // Default volume (max)
            selectedAlarm: Radar, // Default alarm sound
            setVolume: (volume) => set({ volume }),
            setSelectedAlarm: (alarm) => set({ selectedAlarm: alarm }),
        }),
        {
            name: 'settings-store',
        }
    )
);
