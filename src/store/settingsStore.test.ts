import { useSettingsStore } from './settingsStore';

describe('settings store custom alarm', () => {
    const defaultAlarm = '/visual-timer/audios/radar.mp3';

    afterEach(() => {
        useSettingsStore.setState({
            selectedAlarm: defaultAlarm,
            customAlarm: null,
        });
    });

    it('keeps custom alarm metadata with the selected sound', () => {
        const customAlarm = {
            name: 'focus-song.mp3',
            value: 'data:audio/mpeg;base64,custom-audio',
        };

        useSettingsStore.getState().setCustomAlarm(customAlarm);

        expect(useSettingsStore.getState().customAlarm).toEqual(customAlarm);
        expect(useSettingsStore.getState().selectedAlarm).toBe(customAlarm.value);
    });

    it('removes the custom alarm and restores the default sound', () => {
        useSettingsStore.getState().setCustomAlarm({
            name: 'focus-song.mp3',
            value: 'data:audio/mpeg;base64,custom-audio',
        });

        useSettingsStore.getState().removeCustomAlarm();

        expect(useSettingsStore.getState().customAlarm).toBeNull();
        expect(useSettingsStore.getState().selectedAlarm).toBe(defaultAlarm);
    });
});
