import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FocusSession {
  id: string;
  timerTitle: string;
  durationMinutes: number;
  completedAt: string; // ISO date string
  themePointColor: string;
  type: 'base' | 'routine';
}

interface StatsState {
  sessions: FocusSession[];
  addSession: (session: Omit<FocusSession, 'id' | 'completedAt'>) => void;
  getTodayMinutes: () => number;
  getWeeklyMinutes: () => number;
  getTotalSessions: () => number;
  getStreakDays: () => number;
  clearHistory: () => void;
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      sessions: [],

      addSession: (sessionData) => {
        const newSession: FocusSession = {
          ...sessionData,
          id: `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          completedAt: new Date().toISOString(),
        };
        set((state) => ({
          sessions: [newSession, ...state.sessions].slice(0, 500), // Keep last 500 records
        }));
      },

      getTodayMinutes: () => {
        const todayStr = new Date().toDateString();
        return get()
          .sessions.filter((s) => new Date(s.completedAt).toDateString() === todayStr)
          .reduce((sum, s) => sum + s.durationMinutes, 0);
      },

      getWeeklyMinutes: () => {
        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        return get()
          .sessions.filter((s) => new Date(s.completedAt).getTime() >= oneWeekAgo)
          .reduce((sum, s) => sum + s.durationMinutes, 0);
      },

      getTotalSessions: () => get().sessions.length,

      getStreakDays: () => {
        const { sessions } = get();
        if (sessions.length === 0) return 0;

        const uniqueDays = new Set(
          sessions.map((s) => new Date(s.completedAt).toISOString().split('T')[0])
        );

        let streak = 0;
        const current = new Date();

        while (true) {
          const dateStr = current.toISOString().split('T')[0];
          if (uniqueDays.has(dateStr)) {
            streak++;
            current.setDate(current.getDate() - 1);
          } else {
            // Check if streak was yesterday
            if (streak === 0) {
              current.setDate(current.getDate() - 1);
              const yesterdayStr = current.toISOString().split('T')[0];
              if (uniqueDays.has(yesterdayStr)) {
                streak++;
                current.setDate(current.getDate() - 1);
                continue;
              }
            }
            break;
          }
        }
        return streak;
      },

      clearHistory: () => set({ sessions: [] }),
    }),
    {
      name: 'visual-timer-stats',
    }
  )
);
