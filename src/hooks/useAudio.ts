import { useCallback, useEffect, useRef } from 'react';
import { useSettingsStore } from '../store/settingsStore';

export type AudioControllers = {
    play: () => void;
    pause: () => void;
    reset: () => void;
};

// Singletone
class AudioSystem {
    private static instance: AudioSystem;
    readonly context: AudioContext;
    readonly gainNode: GainNode;
    audioBuffer: AudioBuffer | null = null;

    private constructor() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        this.context = new AudioCtx();
        this.gainNode = this.context.createGain();
        this.gainNode.connect(this.context.destination);
    }

    static getInstance() {
        if (!AudioSystem.instance) {
            AudioSystem.instance = new AudioSystem();
        }
        return AudioSystem.instance;
    }

    async safeResume() {
        if (this.context.state === 'suspended') {
            await this.context.resume();
        }
    }
}

const audioSystem = AudioSystem.getInstance();

const setupVisibilityHandler = () => {
    const handler = () => {
        if (!document.hidden) {
            audioSystem.safeResume().catch(console.error);
        }
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
};

export const useAudio = (): AudioControllers => {
    const { volume, selectedAlarm } = useSettingsStore();
    const sourceRef = useRef<AudioBufferSourceNode | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const pauseTimeRef = useRef<number>(0);
    const isPlayingRef = useRef(false);

    useEffect(() => {
        const cleanupVisibility = setupVisibilityHandler();

        const loadAudioBuffer = async () => {
            try {
                const response = await fetch(selectedAlarm);
                const arrayBuffer = await response.arrayBuffer();
                audioSystem.audioBuffer = await audioSystem.context.decodeAudioData(arrayBuffer);
            } catch (error) {
                console.error('Audio load failed:', error);
            }
        };

        const handleFirstInteraction = () => {
            // Play the sound very short initially for iOS
            const dummySource = audioSystem.context.createBufferSource();
            dummySource.start(0);
            dummySource.stop(0.001);

            loadAudioBuffer();
            window.removeEventListener('click', handleFirstInteraction);
            window.removeEventListener('touchstart', handleFirstInteraction);
        };

        window.addEventListener('click', handleFirstInteraction, { once: true });
        window.addEventListener('touchstart', handleFirstInteraction, { once: true });

        return () => {
            cleanupVisibility();
            sourceRef.current?.stop();
            window.removeEventListener('click', handleFirstInteraction);
            window.removeEventListener('touchstart', handleFirstInteraction);
        };
    }, [selectedAlarm]);

    useEffect(() => {
        audioSystem.gainNode.gain.value = volume;
    }, [volume]);

    const createSource = useCallback(() => {
        if (!audioSystem.audioBuffer) return null;

        sourceRef.current?.stop();
        const source = audioSystem.context.createBufferSource();
        source.buffer = audioSystem.audioBuffer;
        source.connect(audioSystem.gainNode);
        source.loop = true;
        sourceRef.current = source;
        return source;
    }, []);

    const play = useCallback(async () => {
        await audioSystem.safeResume();
        const source = createSource();
        if (!source) return;

        source.start(0, pauseTimeRef.current);
        startTimeRef.current = audioSystem.context.currentTime - pauseTimeRef.current;
        isPlayingRef.current = true;
    }, [createSource]);

    const pause = useCallback(() => {
        if (!sourceRef.current || !isPlayingRef.current) return;

        const elapsed = audioSystem.context.currentTime - (startTimeRef.current || 0);
        pauseTimeRef.current = elapsed % (audioSystem.audioBuffer?.duration || 0);
        sourceRef.current.stop();
        isPlayingRef.current = false;
    }, []);

    const reset = useCallback(() => {
        pauseTimeRef.current = 0;
        startTimeRef.current = null;
    }, []);

    return { play, pause, reset };
};
