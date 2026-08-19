import React, { useEffect, useState } from 'react';
import { IoIosShareAlt, IoMdCheckmark, IoMdClose, IoMdFlame } from 'react-icons/io';
import { MdOutlineFastForward, MdRefresh } from 'react-icons/md';
import { useStatsStore } from '../../store/statsStore';
import { useThemeStore } from '../../store/themeStore';
import { BaseTimerData, RoutineTimerItem } from '../../store/types/timer';
import Button from './Button';

export interface TimerFinishModalProps {
  isOpen: boolean;
  timer: BaseTimerData | RoutineTimerItem | null;
  onClose: () => void;
  onRestart?: () => void;
  nextTimerTitle?: string;
  onSkipInterval?: () => void;
}

export const TimerFinishModal: React.FC<TimerFinishModalProps> = ({
  isOpen,
  timer,
  onClose,
  onRestart,
  nextTimerTitle,
  onSkipInterval,
}) => {
  const { selectedTheme, compColor } = useThemeStore();
  const streak = useStatsStore((s) => s.getStreakDays());
  const todayMinutes = useStatsStore((s) => s.getTodayMinutes());

  const [intervalRemaining, setIntervalRemaining] = useState<number | null>(null);

  // Check if interval countdown is active (for routine timer step)
  useEffect(() => {
    if (!isOpen || !timer || !('interval' in timer) || timer.interval <= 0) {
      setIntervalRemaining(null);
      return;
    }

    const intervalSec = timer.interval;
    setIntervalRemaining(intervalSec);

    const startTime = Date.now();
    const intervalTimer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, intervalSec - elapsed);
      setIntervalRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(intervalTimer);
        onClose();
      }
    }, 100);

    return () => clearInterval(intervalTimer);
  }, [isOpen, timer]);

  if (!isOpen || !timer) return null;

  const durationText = `${timer.time} ${timer.isMinutes ? 'min' : 'sec'}`;
  const isRoutineItem = 'interval' in timer;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-md p-6 rounded-3xl shadow-float border border-white/40 flex flex-col items-center text-center space-y-5 animate-scale-up"
        style={{
          backgroundColor: selectedTheme.color.main,
          color: compColor,
        }}
      >
        {/* Header Icon Badge */}
        <div
          className="size-16 rounded-full flex items-center justify-center text-3xl shadow-dial animate-bounce"
          style={{
            backgroundColor: selectedTheme.color.sub,
            color: selectedTheme.color.point,
          }}
        >
          🎉
        </div>

        {/* Title & Duration */}
        <div className="space-y-1">
          <h2 className="text-2xl font-black font-display tracking-tight">
            {timer.title ? `"${timer.title}"` : 'Timer'} Complete!
          </h2>
          <p className="text-sm opacity-80">
            Great job! You accomplished a <span className="font-bold underline">{durationText}</span> focus session.
          </p>
        </div>

        {/* Stats Pill Card */}
        <div className="w-full grid grid-cols-2 gap-2 p-3 rounded-2xl bg-white/40 dark:bg-black/20 backdrop-blur-sm border border-white/20">
          <div className="flex flex-col items-center">
            <span className="text-xs opacity-75 font-medium">Today's Focus</span>
            <span className="text-xl font-bold font-display">{todayMinutes}m</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs opacity-75 font-medium flex items-center gap-0.5">
              <IoMdFlame className="text-orange-500" /> Streak
            </span>
            <span className="text-xl font-bold font-display text-orange-600 dark:text-orange-400">
              {streak} Days
            </span>
          </div>
        </div>

        {/* Routine Auto-advance gauge (if routine interval) */}
        {isRoutineItem && intervalRemaining !== null && intervalRemaining > 0 && (
          <div className="w-full space-y-2 p-3.5 rounded-2xl bg-black/5 dark:bg-white/10">
            <div className="flex justify-between text-xs font-semibold">
              <span>Next: {nextTimerTitle || 'Next Step'}</span>
              <span>{intervalRemaining}s</span>
            </div>
            <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-200"
                style={{
                  backgroundColor: selectedTheme.color.point,
                  width: `${(intervalRemaining / timer.interval) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5 pt-2">
          {isRoutineItem && onSkipInterval ? (
            <Button
              currentTheme={selectedTheme}
              onClick={() => {
                onSkipInterval();
                onClose();
              }}
              className="w-full py-3.5 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-soft"
            >
              <MdOutlineFastForward size={22} />
              <span>Start Next Step Now</span>
            </Button>
          ) : (
            <>
              <Button
                currentTheme={selectedTheme}
                onClick={onClose}
                className="w-full py-3.5 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-soft"
              >
                <IoMdCheckmark size={22} />
                <span>Well Done! 👏</span>
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onClose();
                    window.location.hash = 'stats';
                  }}
                  className="btn-tactile py-2.5 px-3 rounded-2xl bg-white/60 dark:bg-black/30 font-semibold text-xs flex items-center justify-center gap-1.5 border border-white/20"
                >
                  <IoIosShareAlt size={16} /> Share Card
                </button>

                {onRestart && (
                  <button
                    onClick={() => {
                      onClose();
                      onRestart();
                    }}
                    className="btn-tactile py-2.5 px-3 rounded-2xl bg-white/60 dark:bg-black/30 font-semibold text-xs flex items-center justify-center gap-1.5 border border-white/20"
                  >
                    <MdRefresh size={16} /> Restart Timer
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimerFinishModal;
