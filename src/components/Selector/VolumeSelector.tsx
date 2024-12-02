import { IoVolumeMedium } from 'react-icons/io5';
import { useSettingsStore } from '../../store/settingsStore';
import { useThemeStore } from '../../store/themeStore';
import ListElement from '../common/ListElement';

const VolumeSelector: React.FC = () => {
    const { themes, globalThemeKey } = useThemeStore();
    const { volume, setVolume } = useSettingsStore();

    const pointColor = themes[globalThemeKey].color.point;

    const volumeIcon = <IoVolumeMedium size={24} className="size-full" />;
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

    return <ListElement icon={volumeIcon} content={volumeSlider} />;
};

export default VolumeSelector;
