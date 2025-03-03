import { IoVolumeHigh, IoVolumeMute } from 'react-icons/io5';
import { useSettingsStore } from '../../../store/settingsStore';
import { useThemeStore } from '../../../store/themeStore';
import ListItem from '../../common/ListItem';
import Tooltip from '../../common/Tooltip';

const VolumeSelector: React.FC = () => {
    const { themes, globalThemeKey } = useThemeStore();
    const { volume, mute, setVolume, setMute } = useSettingsStore();

    const pointColor = themes[globalThemeKey].color.point;

    const handleMuteToggle = () => {
        if (mute) {
            setMute(false);
            if (volume === 0) setVolume(0.1);
        } else {
            setMute(true);
        }
    };

    const volumeIcon = mute ? (
        <IoVolumeMute size={24} className="size-full" onClick={handleMuteToggle} style={{ cursor: 'pointer' }} />
    ) : (
        <IoVolumeHigh size={24} className="size-full" onClick={handleMuteToggle} style={{ cursor: 'pointer' }} />
    );

    const volumeSlider = (
        <div className="flex w-full flex-col gap-2">
            <label htmlFor="volume" className="text-lg">
                <div className="flex items-center gap-1">
                    <span>Volume</span>
                    <Tooltip
                        title="Any problem?"
                        desc="If there is no sound, check the silent setting of the device."
                    />
                </div>
            </label>
            <div className="flex gap-5">
                <input
                    type="range"
                    id="volume"
                    min={0}
                    max={1}
                    step={0.1}
                    value={mute ? 0 : volume}
                    onChange={(e) => {
                        const newVolume = Number(e.target.value);
                        setVolume(newVolume);
                        if (newVolume === 0 && !mute) {
                            setMute(true);
                        } else if (newVolume !== 0 && mute) {
                            setMute(false);
                        }
                    }}
                    className="w-full"
                    style={{ accentColor: pointColor }}
                />
                <p>{mute ? 0 : Math.round(volume * 100)}%</p>
            </div>
        </div>
    );

    return <ListItem icon={volumeIcon} content={volumeSlider} />;
};

export default VolumeSelector;
