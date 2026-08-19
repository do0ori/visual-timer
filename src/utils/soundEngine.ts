// Audio Synthesizer & Player Engine
// Generates crystal-clear synth tones without external network dependencies,
// plus supports bundled MP3s and custom uploaded user audio!

class SoundEngine {
  private ctx: AudioContext | null = null;
  private customAudioCache: Record<string, HTMLAudioElement> = {};

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  // 1. Zen Bell (Rich meditative chime with harmonic overtones)
  playZenBell(volume = 1) {
    const ctx = this.getContext();
    const now = ctx.currentTime;
    const frequencies = [528, 1056, 1584, 2112]; // Solfeggio Love frequency harmonics
    const gains = [0.6, 0.25, 0.1, 0.05];

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(gains[i] * volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 3.0);
    });
  }

  // 2. Digital Chime (Upbeat marimba melody)
  playDigitalChime(volume = 1) {
    const ctx = this.getContext();
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio

    notes.forEach((freq, i) => {
      const startTime = now + i * 0.12;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.5 * volume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 1.2);
    });
  }

  // 3. Classic Alarm Beep
  playClassicAlarm(volume = 1) {
    const ctx = this.getContext();
    const now = ctx.currentTime;

    for (let b = 0; b < 3; b++) {
      const startTime = now + b * 0.25;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(880, startTime);

      gain.gain.setValueAtTime(0.3 * volume, startTime);
      gain.gain.setValueAtTime(0.0001, startTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.15);
    }
  }

  // 4. Gentle Gong (Deep calming gong)
  playGentleGong(volume = 1) {
    const ctx = this.getContext();
    const now = ctx.currentTime;
    const frequencies = [220, 440, 660, 880];

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime((0.5 / (i + 1)) * volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.0);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 4.0);
    });
  }

  // 5. Play Audio File or User Uploaded Sound
  playAudioUrl(url: string, volume = 1, loop = false): () => void {
    try {
      const audio = new Audio(url);
      audio.volume = Math.max(0, Math.min(1, volume));
      audio.loop = loop;
      void audio.play().catch((err) => {
        console.debug('Audio play fallback to synth:', err);
        this.playZenBell(volume);
      });
      return () => {
        audio.pause();
        audio.currentTime = 0;
      };
    } catch {
      this.playZenBell(volume);
      return () => {};
    }
  }
}

export const soundEngine = new SoundEngine();

export interface SoundOption {
  id: string;
  label: string;
  type: 'synth' | 'audio' | 'custom';
  description: string;
  value: string;
}

export const PRESET_SOUNDS: SoundOption[] = [
  { id: 'zen-bell', label: '🔔 Zen Bell (Singing Bowl)', type: 'synth', description: 'Crystal-clear meditative chime', value: 'synth:zen-bell' },
  { id: 'digital-chime', label: '🎶 Joyful Chime (Arpeggio)', type: 'synth', description: 'Bright uplifting chord', value: 'synth:digital-chime' },
  { id: 'gentle-gong', label: '🪷 Deep Gong (Focus Finish)', type: 'synth', description: 'Deep grounding resonance', value: 'synth:gentle-gong' },
  { id: 'classic-beep', label: '⏰ Digital Beep (Classic)', type: 'synth', description: 'Traditional 3-beep alarm', value: 'synth:classic-beep' },
  { id: 'radar', label: '📡 Radar Pulse', type: 'audio', description: 'Classic sonar rhythm', value: '/visual-timer/audios/radar.mp3' },
  { id: 'chime-time', label: '🎵 Chime Time', type: 'audio', description: 'Melodic chime tones', value: '/visual-timer/audios/chime-time.mp3' },
  { id: 'beep-beep', label: '🔊 Beep Beep Alarm', type: 'audio', description: 'Crisp audible alarm', value: '/visual-timer/audios/beep-beep.mp3' },
];

export function playSound(soundId: string, volume = 1, mute = false): (() => void) | void {
  if (mute || volume <= 0) return;

  if (soundId === 'synth:zen-bell' || soundId === 'zen-bell') {
    soundEngine.playZenBell(volume);
    return;
  }
  if (soundId === 'synth:digital-chime' || soundId === 'digital-chime') {
    soundEngine.playDigitalChime(volume);
    return;
  }
  if (soundId === 'synth:gentle-gong' || soundId === 'gentle-gong') {
    soundEngine.playGentleGong(volume);
    return;
  }
  if (soundId === 'synth:classic-beep' || soundId === 'classic-beep') {
    soundEngine.playClassicAlarm(volume);
    return;
  }

  // Audio file path or data URL
  return soundEngine.playAudioUrl(soundId, volume);
}
