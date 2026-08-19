import { useCallback, useRef } from 'react';
import { useSettingsStore } from '../store/settingsStore';
import { playSound } from '../utils/soundEngine';

export type AudioControllers = {
  play: (src?: string) => void;
  pause: () => void;
  reset: () => void;
};

export const useAudio = (): AudioControllers => {
  const { volume, mute, selectedAlarm } = useSettingsStore();
  const stopCallbackRef = useRef<(() => void) | void>(undefined);

  const play = useCallback(
    (src?: string) => {
      const soundToPlay = src || selectedAlarm;
      if (stopCallbackRef.current) {
        stopCallbackRef.current();
        stopCallbackRef.current = undefined;
      }
      const stopFn = playSound(soundToPlay, volume, mute);
      stopCallbackRef.current = stopFn;
    },
    [volume, mute, selectedAlarm]
  );

  const pause = useCallback(() => {
    if (stopCallbackRef.current) {
      stopCallbackRef.current();
      stopCallbackRef.current = undefined;
    }
  }, []);

  const reset = useCallback(() => {
    pause();
  }, [pause]);

  return { play, pause, reset };
};
