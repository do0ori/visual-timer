import confetti from 'canvas-confetti';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { AudioControllers } from '../hooks/useAudio';
import { useSettingsStore } from '../store/settingsStore';
import { useStatsStore } from '../store/statsStore';
import { BaseTimerData, RoutineTimerItem } from '../store/types/timer';

const triggerCelebration = (pointColor: string) => {
  try {
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([150, 80, 150]);
    }

    // Confetti explosion
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: [pointColor, '#FFD700', '#FF6B6B', '#4ECDC4', '#A8E6CF'],
      disableForReducedMotion: true,
    });
  } catch (err) {
    console.debug('Celebration animation skipped:', err);
  }
};

const getNotificationConfig = (timer: BaseTimerData | RoutineTimerItem, pointColor: string) => {
  const isLandscape = window.innerWidth > window.innerHeight;
  const leftSideWidth = isLandscape ? window.innerWidth / 2 : window.innerWidth;

  return {
    title: `🎉 ${timer.title ? `"${timer.title}"` : 'Timer'} Complete!`,
    text: `Your ${timer.time} ${timer.isMinutes ? 'min' : 'sec'} session has finished. Great job! ⏱️`,
    confirmButtonColor: pointColor,
    confirmButtonText: 'Well Done! 👏',
    width: isLandscape ? `${leftSideWidth * 0.9}px` : '92%',
    position: isLandscape ? ('center-start' as const) : ('center' as const),
    customClass: {
      popup: 'rounded-3xl shadow-float',
      confirmButton: 'rounded-2xl px-6 py-3 font-semibold text-base',
    },
  };
};

export const handleFinish = (
  timer: BaseTimerData | RoutineTimerItem,
  audio: AudioControllers,
  pointColor: string,
  onSuccess: () => void
) => {
  const resetAudio = () => {
    audio.pause();
    audio.reset();
  };

  const handleOnSuccess = () => {
    resetAudio();
    onSuccess();
    navigator.serviceWorker.controller?.postMessage({
      command: 'clear-timer',
      timer,
    });
  };

  // Record completed session to stats
  try {
    const durationMinutes = timer.isMinutes ? timer.time : Math.max(1, Math.round(timer.time / 60));
    useStatsStore.getState().addSession({
      timerTitle: timer.title || 'Focus Session',
      durationMinutes,
      themePointColor: pointColor,
      type: 'interval' in timer ? 'routine' : 'base',
    });
  } catch (err) {
    console.error('Failed to log stats session:', err);
  }

  // Trigger visual and haptic celebration
  triggerCelebration(pointColor);

  if ('interval' in timer && timer.interval <= 0) {
    handleOnSuccess();
    return;
  }

  resetAudio();
  audio.play();

  const swalConfig: SweetAlertOptions = {
    ...getNotificationConfig(timer, pointColor),
  };

  if ('interval' in timer && timer.interval > 0) {
    swalConfig.timer = timer.interval * 1000;
    swalConfig.timerProgressBar = true;
    swalConfig.showConfirmButton = false;

    Swal.fire(swalConfig).then(() => {
      handleOnSuccess();
    });
  } else {
    Swal.fire(swalConfig).then((result) => {
      if (!result.isDenied) {
        handleOnSuccess();
      }
    });
  }
};

export const handleDragEvent = (e: React.MouseEvent | React.TouchEvent, setTime: (time: number) => void) => {
  const { isClockwise } = useSettingsStore.getState();

  const rect = e.currentTarget.getBoundingClientRect();

  // Coordinates
  const clientX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
  const clientY = 'clientY' in e ? e.clientY : e.touches[0].clientY;

  // SVG center relative coordinates
  const x = clientX - rect.left - rect.width / 2;
  const y = clientY - rect.top - rect.height / 2;

  // Radius check
  const radius = rect.width / 2;
  const distanceFromCenter = Math.sqrt(x ** 2 + y ** 2);
  if (distanceFromCenter > radius) return;

  // Angle in degrees (0 deg at top 12 o'clock)
  const radians = Math.atan2(y, x);
  let degrees = radians * (180 / Math.PI) + 90;
  if (degrees < 0) degrees += 360;

  // Round to nearest 6 degrees (1 min / 1 sec increments)
  const roundedDegrees = Math.round(degrees / 6) * 6;

  // Calculate newTime based on direction
  const newTime = isClockwise ? roundedDegrees / 6 : (360 - roundedDegrees) / 6;

  setTime(newTime);
};
