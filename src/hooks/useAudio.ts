import { useEffect, useRef } from 'react';
import { useSettingsStore } from '../store/settingsStore';

export type AudioControllers = {
    play: () => void;
    pause: () => void;
    reset: () => void;
};

export const useAudio = (): AudioControllers => {
    const { volume, selectedAlarm } = useSettingsStore();
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceRef = useRef<AudioBufferSourceNode | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);
    const audioBufferRef = useRef<AudioBuffer | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const pauseTimeRef = useRef<number>(0);
    const isPlayingRef = useRef<boolean>(false);
    const isInitializedRef = useRef<boolean>(false);

    const initializeAudioContext = async () => {
        try {
            if (isInitializedRef.current) return;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            const audioContext = new AudioContext();
            audioContextRef.current = audioContext;

            // Need to check the context status and resume for iOS
            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }

            const gainNode = audioContext.createGain();
            gainNode.gain.value = volume;
            gainNode.connect(audioContext.destination);
            gainNodeRef.current = gainNode;

            const response = await fetch(selectedAlarm);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            audioBufferRef.current = audioBuffer;

            // Play the sound very short initially for iOS
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(gainNode);
            source.start();
            source.stop(audioContext.currentTime + 0.01);

            isInitializedRef.current = true;
            console.debug('Audio initialized');
        } catch (error) {
            console.error('Audio initialization error:', error);
        }
    };

    useEffect(() => {
        const handleUserInteraction = () => {
            if (!isInitializedRef.current) {
                initializeAudioContext();
            }
        };

        window.addEventListener('click', handleUserInteraction);
        window.addEventListener('touchstart', handleUserInteraction);

        return () => {
            // Cleanup listeners
            window.removeEventListener('click', handleUserInteraction);
            window.removeEventListener('touchstart', handleUserInteraction);
        };
    }, [selectedAlarm]);

    useEffect(() => {
        if (gainNodeRef.current) {
            gainNodeRef.current.gain.value = volume;
        }
    }, [volume]);

    const createNewSource = () => {
        if (!audioContextRef.current || !audioBufferRef.current || !gainNodeRef.current) return null;

        if (sourceRef.current) {
            sourceRef.current.disconnect();
        }

        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBufferRef.current;
        source.loop = true;
        source.connect(gainNodeRef.current);
        sourceRef.current = source;
        return source;
    };

    const play = async () => {
        if (!audioContextRef.current || !audioBufferRef.current) return;

        try {
            // Need to check the context status and resume for iOS
            if (audioContextRef.current.state === 'suspended') {
                await audioContextRef.current.resume();
            }

            const source = createNewSource();
            if (!source) return;

            if (pauseTimeRef.current > 0) {
                source.start(0, pauseTimeRef.current);
            } else {
                source.start();
            }

            startTimeRef.current = audioContextRef.current.currentTime - pauseTimeRef.current;
            isPlayingRef.current = true;
        } catch (error) {
            console.error('Playback error:', error);
        }
    };

    const pause = () => {
        if (!audioContextRef.current || !sourceRef.current || !isPlayingRef.current) return;

        const elapsed = audioContextRef.current.currentTime - (startTimeRef.current || 0);
        pauseTimeRef.current = elapsed % (audioBufferRef.current?.duration || 0);

        sourceRef.current.stop();
        isPlayingRef.current = false;
    };

    const reset = () => {
        pauseTimeRef.current = 0;
        startTimeRef.current = null;
    };

    return { play, pause, reset };
};
