import { useCallback, useEffect, useRef } from 'react';
import { useSettingsStore } from '../store/settingsStore';

export type AudioControllers = {
    play: (src?: string) => void;
    pause: () => void;
    reset: () => void;
};

// Singleton AudioSystem
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
    const { volume, mute, selectedAlarm } = useSettingsStore();
    const currentSrcRef = useRef<string | null>(null); // For comparison of src value

    const sourceRef = useRef<AudioBufferSourceNode | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const pauseTimeRef = useRef<number>(0);
    const isPlayingRef = useRef(false);

    useEffect(() => {
        audioSystem.gainNode.gain.value = mute ? 0 : volume;
    }, [volume, mute]);

    useEffect(() => {
        const handleFirstInteraction = () => {
            const dummySource = audioSystem.context.createBufferSource();
            dummySource.start(0);
            dummySource.stop(0.001);
            window.removeEventListener('click', handleFirstInteraction);
            window.removeEventListener('touchstart', handleFirstInteraction);
        };
        window.addEventListener('click', handleFirstInteraction, { once: true });
        window.addEventListener('touchstart', handleFirstInteraction, { once: true });
        return () => {
            window.removeEventListener('click', handleFirstInteraction);
            window.removeEventListener('touchstart', handleFirstInteraction);
        };
    }, []);

    const loadAudioBuffer = async (sourceUrl: string) => {
        try {
            const response = await fetch(sourceUrl);
            const arrayBuffer = await response.arrayBuffer();
            audioSystem.audioBuffer = await audioSystem.context.decodeAudioData(arrayBuffer);
            currentSrcRef.current = sourceUrl;
        } catch (error) {
            console.error('Audio load failed:', error);
        }
    };

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

    const play = useCallback(
        async (src?: string) => {
            const srcToUse = src || selectedAlarm;
            if (!srcToUse) return;
            if (currentSrcRef.current !== srcToUse) {
                await loadAudioBuffer(srcToUse);
            }
            await audioSystem.safeResume();
            const source = createSource();
            if (!source) return;
            source.start(0, pauseTimeRef.current);
            startTimeRef.current = audioSystem.context.currentTime - pauseTimeRef.current;
            isPlayingRef.current = true;
        },
        [createSource, selectedAlarm]
    );

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

    useEffect(() => {
        const cleanupVisibility = setupVisibilityHandler();
        return () => {
            cleanupVisibility();
            sourceRef.current?.stop();
        };
    }, []);

    return { play, pause, reset };
};
