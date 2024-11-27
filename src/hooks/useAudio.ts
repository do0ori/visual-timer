import { useEffect, useRef } from 'react';
import alarmSound from '../assets/alarmSound.mp3';

export const useAudio = (volume: number) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const audio = new Audio(alarmSound);
        audio.loop = true;
        audio.volume = volume;

        const initializeAudio = () => {
            audio
                .play()
                .then(() => {
                    audio.pause(); // Play briefly, then pause to enable future playback
                    audio.currentTime = 0; // Reset time
                    console.log('Audio initialized');
                })
                .catch((error) => {
                    console.error('Audio initialization error:', error);
                });
        };

        // Add a listener for user interaction
        window.addEventListener('click', initializeAudio, { once: true });
        window.addEventListener('touchstart', initializeAudio, { once: true });

        audioRef.current = audio;

        return () => {
            // Cleanup listeners
            window.removeEventListener('click', initializeAudio);
            window.removeEventListener('touchstart', initializeAudio);
        };
    }, [volume]);

    return audioRef;
};
