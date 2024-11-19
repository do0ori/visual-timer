import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
    volume: number; // Notification sound volume (0 to 1)
    setVolume: (volume: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            volume: 1, // Default volume (max)
            setVolume: (volume) => set({ volume }),
        }),
        {
            name: 'settings-store',
        }
    )
);
