import { IoVolumeHigh, IoVolumeMute } from 'react-icons/io5';
import { useSettingsStore } from '../../../store/settingsStore';
import { useThemeStore } from '../../../store/themeStore';
import ListItem from '../../common/ListItem';

const VolumeSelector: React.FC = () => {
    const { themes, globalThemeKey } = useThemeStore();
    const { volume, setVolume } = useSettingsStore();

    const pointColor = themes[globalThemeKey].color.point;

    const handleToggleVolume = () => {
        if (volume === 0) {
            setVolume(1);
        } else {
            setVolume(0);
        }
    };

    const volumeIcon =
        volume === 0 ? (
            <IoVolumeMute size={24} className="size-full" onClick={handleToggleVolume} style={{ cursor: 'pointer' }} />
        ) : (
            <IoVolumeHigh size={24} className="size-full" onClick={handleToggleVolume} style={{ cursor: 'pointer' }} />
        );

    const volumeSlider = (
        <div className="flex w-full flex-col gap-2">
            <label htmlFor="volume" className="text-lg">
                Volume
            </label>
            <div className="flex gap-5">
                <input
                    type="range"
                    id="volume"
                    min={0}
                    max={1}
                    step={0.1}
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full"
                    style={{ accentColor: pointColor }}
                />
                <p>{Math.round(volume * 100)}%</p>
            </div>
        </div>
    );

    return <ListItem icon={volumeIcon} content={volumeSlider} />;
};

export default VolumeSelector;
