import React, { useMemo } from 'react';
import SettingsOverlay from '../components/settings/SettingsOverlay';
import BaseTimer from '../components/timers/base-timer/BaseTimer';
import RoutineTimer from '../components/timers/routine-timer/RoutineTimer';
import TimerListOverlay from '../components/timers/timer-management/TimerListOverlay';
import { TIMER_TYPE } from '../config/timer/type';
import { useBaseTimerStore } from '../store/baseTimerStore';
import { useRoutineTimerStore } from '../store/routineTimerStore';
import { useSelectedTimerStore } from '../store/selectedTimerStore';

const MainPage: React.FC = () => {
  const { defaultTimer, selectedTimerId } = useSelectedTimerStore();
  const { timers: baseTimers, getTimer: getBaseTimer } = useBaseTimerStore();
  const { timers: routineTimers, getTimer: getRoutineTimer } = useRoutineTimerStore();

  const timer = useMemo(() => {
    if (selectedTimerId === defaultTimer.id) return defaultTimer;
    return getBaseTimer(selectedTimerId) || getRoutineTimer(selectedTimerId) || defaultTimer;
  }, [selectedTimerId, defaultTimer, baseTimers, routineTimers]);

  return (
    <>
      {timer.type === TIMER_TYPE.BASE && <BaseTimer timer={timer} />}
      {timer.type === TIMER_TYPE.ROUTINE && <RoutineTimer timer={timer} />}

      {/* Global Root Overlays */}
      <TimerListOverlay />
      <SettingsOverlay />
    </>
  );
};

export default MainPage;
