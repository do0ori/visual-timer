import React from 'react';
import { IoAdd, IoList, IoPause, IoPlay, IoRefresh, IoSettingsSharp } from 'react-icons/io5';
import { Theme } from '../../../../store/types/theme';
import Button from '../../../common/Button';

type ControlButtonsProps = {
  isMinutes: boolean;
  isRunning: boolean;
  isInitialized: boolean;
  currentTheme: Theme;
  start: () => void;
  stop: () => void;
  reset: () => void;
  add: (time: number) => void;
};

const ControlButtons: React.FC<ControlButtonsProps> = ({
  isMinutes,
  isRunning,
  isInitialized,
  currentTheme,
  start,
  stop,
  reset,
  add,
}) => {
  const handleStart = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      try {
        await Notification.requestPermission();
      } catch (err) {
        console.debug('Notification permission request skipped:', err);
      }
    }
    start();
  };

  return (
    <div className="flex items-center justify-between w-full">
      {/* Left Action: Timer List / Add Time */}
      <div className="flex items-center justify-start min-w-[50px]">
        {isInitialized ? (
          <Button
            onClick={() => (window.location.hash = 'timer-list')}
            aria-label="Timer List"
            title="Timer Presets & Routines"
          >
            <IoList size={30} />
          </Button>
        ) : (
          <Button
            onClick={() => add(isMinutes ? 1 : 10)}
            aria-label="Add time"
            currentTheme={currentTheme}
          >
            <div className="flex items-center justify-center font-bold">
              <IoAdd size={20} />
              <span className="text-lg">{isMinutes ? 1 : 10}</span>
            </div>
          </Button>
        )}
      </div>

      {/* Center Action: Start / Stop Button (Exact Center) */}
      <div className="flex items-center justify-center">
        <Button
          onClick={isRunning ? stop : handleStart}
          aria-label={isRunning ? 'Pause Timer' : 'Start Timer'}
          currentTheme={currentTheme}
        >
          {isRunning ? <IoPause size={28} /> : <IoPlay size={28} className="ml-0.5" />}
        </Button>
      </div>

      {/* Right Action: Settings / Reset Button */}
      <div className="flex items-center justify-end min-w-[50px]">
        {isInitialized ? (
          <Button
            onClick={() => (window.location.hash = 'settings')}
            aria-label="Settings"
            title="Settings"
          >
            <IoSettingsSharp size={30} />
          </Button>
        ) : (
          <Button
            onClick={reset}
            aria-label="Reset Timer"
            currentTheme={currentTheme}
          >
            <IoRefresh size={28} className="-scale-x-100" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ControlButtons;
