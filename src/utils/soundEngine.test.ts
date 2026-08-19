import { playSound } from './soundEngine';

describe('playSound', () => {
  beforeEach(() => {
    const context = {
      state: 'running',
      currentTime: 0,
      destination: {},
      resume: jest.fn(),
      createOscillator: jest.fn(() => ({
        type: 'sine',
        frequency: { setValueAtTime: jest.fn() },
        connect: jest.fn(),
        start: jest.fn(),
        stop: jest.fn(),
      })),
      createGain: jest.fn(() => ({
        gain: {
          setValueAtTime: jest.fn(),
          exponentialRampToValueAtTime: jest.fn(),
        },
        connect: jest.fn(),
      })),
    };

    Object.defineProperty(window, 'AudioContext', {
      configurable: true,
      value: jest.fn(() => context),
    });
  });

  test('returns a stop function for a synth alarm', () => {
    const stop = playSound('synth:classic-beep');

    expect(stop).toEqual(expect.any(Function));
  });
});
