export type StopPreview = () => void;

export const createAudioPreviewController = () => {
    let stopCurrentPreview: StopPreview | undefined;

    const stop = () => {
        stopCurrentPreview?.();
        stopCurrentPreview = undefined;
    };

    const start = (play: () => StopPreview | undefined) => {
        stop();
        stopCurrentPreview = play();
        return Boolean(stopCurrentPreview);
    };

    const isPlaying = () => Boolean(stopCurrentPreview);

    const toggle = (play: () => StopPreview | undefined) => {
        if (isPlaying()) {
            stop();
            return false;
        }

        return start(play);
    };

    return { isPlaying, start, stop, toggle };
};
