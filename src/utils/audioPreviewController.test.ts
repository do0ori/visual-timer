import { createAudioPreviewController } from './audioPreviewController';

describe('audio preview controller', () => {
    it('stops the active preview when toggled again', () => {
        const controller = createAudioPreviewController();
        const stop = jest.fn();

        expect(controller.toggle(() => stop)).toBe(true);
        expect(controller.isPlaying()).toBe(true);

        expect(controller.toggle(() => stop)).toBe(false);
        expect(stop).toHaveBeenCalledTimes(1);
        expect(controller.isPlaying()).toBe(false);
    });

    it('stops the previous preview before starting another one', () => {
        const controller = createAudioPreviewController();
        const firstStop = jest.fn();
        const secondStop = jest.fn();

        controller.start(() => firstStop);
        controller.start(() => secondStop);

        expect(firstStop).toHaveBeenCalledTimes(1);
        expect(controller.isPlaying()).toBe(true);
        controller.stop();
        expect(secondStop).toHaveBeenCalledTimes(1);
    });
});
