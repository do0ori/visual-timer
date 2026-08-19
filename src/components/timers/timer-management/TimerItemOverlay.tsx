import React, { useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { TIMER_TYPE, TIMER_TYPE_CONFIG, TimerType } from '../../../config/timer/type';
import { useOverlay } from '../../../hooks/useOverlay';
import { useThemeStore } from '../../../store/themeStore';
import { BaseTimerData, RoutineTimerData, TimerData } from '../../../store/types/timer';
import BaseTimerForm from './forms/BaseTimerForm';
import RoutineTimerForm from './forms/RoutineTimerForm';

type TimerItemOverlayProps = {
  initialTimerData: TimerData | null;
  mode: 'add' | 'edit';
  onClose: () => void;
};

const TimerItemOverlay: React.FC<TimerItemOverlayProps> = ({ initialTimerData, mode, onClose }) => {
  const { selectedTheme, compColor } = useThemeStore();
  const [timerType, setTimerType] = useState<TimerType>(initialTimerData?.type || TIMER_TYPE.BASE);

  const { isOpen, close } = useOverlay('timer-item', onClose);

  useEffect(() => {
    if (isOpen) {
      setTimerType(initialTimerData?.type || TIMER_TYPE.BASE);
    }
  }, [isOpen, initialTimerData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-0 md:p-6 lg:p-10 animate-fade-in">
      <div
        className="relative flex flex-col size-full md:max-w-4xl md:max-h-[90vh] md:rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-scale-up"
        style={{
          backgroundColor: selectedTheme.color.main,
          color: compColor,
        }}
      >
        {/* Header */}
        <div
          className="flex h-16 shrink-0 items-center justify-between px-6 shadow-sm border-b border-white/10"
          style={{ backgroundColor: selectedTheme.color.point }}
        >
          <h2 className="text-xl font-bold font-display text-white">
            {mode === 'add' ? 'Create New' : 'Edit'} {TIMER_TYPE_CONFIG[timerType].label}
          </h2>
          <button
            onClick={close}
            aria-label="Close"
            className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <IoMdClose size={26} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 no-scrollbar">
          {timerType === TIMER_TYPE.BASE && (
            <BaseTimerForm
              initialData={initialTimerData as BaseTimerData}
              mode={mode}
              timerType={timerType}
              setTimerType={setTimerType}
              close={close}
            />
          )}

          {timerType === TIMER_TYPE.ROUTINE && (
            <RoutineTimerForm
              initialData={initialTimerData as RoutineTimerData}
              mode={mode}
              timerType={timerType}
              setTimerType={setTimerType}
              close={close}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TimerItemOverlay;
