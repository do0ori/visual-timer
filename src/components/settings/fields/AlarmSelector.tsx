import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BiSolidBellRing } from 'react-icons/bi';
import { IoMdCloudUpload, IoMdPlay, IoMdSquare, IoMdTrash } from 'react-icons/io';
import { useSettingsStore } from '../../../store/settingsStore';
import { useThemeStore } from '../../../store/themeStore';
import { createAudioPreviewController } from '../../../utils/audioPreviewController';
import { PRESET_SOUNDS, playSound } from '../../../utils/soundEngine';
import Dropdown from '../../common/Dropdown';
import ListItem from '../../common/ListItem';

const AlarmSelector: React.FC = () => {
    const { selectedTheme } = useThemeStore();
    const { selectedAlarm, customAlarm, setSelectedAlarm, setCustomAlarm, removeCustomAlarm, volume, mute } =
        useSettingsStore();
    const [isPlaying, setIsPlaying] = useState(false);
    const previewControllerRef = useRef(createAudioPreviewController());
    const previewTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const alarmIcon = <BiSolidBellRing size={24} className="size-full" />;

    const options = [
        ...PRESET_SOUNDS.map((s) => ({
            label: s.label,
            value: s.value,
            subLabel: s.description,
        })),
        ...(customAlarm
            ? [
                  {
                      label: `📁 ${customAlarm.name}`,
                      value: customAlarm.value,
                      subLabel: 'Custom Uploaded Sound',
                  },
              ]
            : []),
    ];

    const stopPreview = useCallback(() => {
        if (previewTimeoutRef.current) {
            clearTimeout(previewTimeoutRef.current);
            previewTimeoutRef.current = undefined;
        }

        previewControllerRef.current.stop();
        setIsPlaying(false);
    }, []);

    const startPreview = useCallback(
        (soundValue?: string) => {
            stopPreview();

            const soundToPlay = soundValue || selectedAlarm;
            const isPreviewPlaying = previewControllerRef.current.start(() => playSound(soundToPlay, volume, mute));
            setIsPlaying(isPreviewPlaying);

            if (isPreviewPlaying) {
                previewTimeoutRef.current = setTimeout(() => {
                    stopPreview();
                }, 3000);
            }
        },
        [mute, selectedAlarm, stopPreview, volume]
    );

    useEffect(() => stopPreview, [stopPreview]);

    const handleAlarmChange = (newAlarm: string) => {
        setSelectedAlarm(newAlarm);
        startPreview(newAlarm);
    };

    const handlePreviewButtonClick = () => {
        if (previewControllerRef.current.isPlaying()) {
            stopPreview();
        } else {
            startPreview();
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target?.result as string;
            if (dataUrl) {
                setCustomAlarm({ name: file.name, value: dataUrl });
                startPreview(dataUrl);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleCustomAudioRemoval = () => {
        stopPreview();
        removeCustomAlarm();
    };

    const alarmSelector = (
        <div className="flex w-full flex-col gap-3">
            <div className="flex items-center justify-between">
                <span className="whitespace-nowrap text-base font-bold sm:text-lg">Alarm Sound</span>
                <div className="flex items-center gap-2">
                    {/* Custom Sound Upload Button */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="btn-tactile flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-white shadow-soft transition-transform active:scale-95"
                        style={{ backgroundColor: selectedTheme.color.point }}
                    >
                        <IoMdCloudUpload size={18} /> Upload Audio
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="audio/*"
                        onChange={handleFileUpload}
                        className="hidden"
                    />

                    {customAlarm && (
                        <button
                            onClick={handleCustomAudioRemoval}
                            className="btn-tactile flex items-center justify-center rounded-xl bg-red-500 p-2 text-white shadow-soft transition-transform active:scale-95"
                            aria-label="Remove custom audio"
                            title="Remove custom audio"
                        >
                            <IoMdTrash size={18} />
                        </button>
                    )}

                    {/* Sound Preview Play Button */}
                    <button
                        onClick={handlePreviewButtonClick}
                        className="btn-tactile flex items-center justify-center rounded-xl p-2 text-white shadow-soft transition-transform active:scale-95"
                        style={{ backgroundColor: selectedTheme.color.point }}
                        aria-label="Preview Sound"
                    >
                        {isPlaying ? <IoMdSquare size={18} /> : <IoMdPlay size={18} />}
                    </button>
                </div>
            </div>

            <Dropdown
                options={options}
                selectedValue={selectedAlarm}
                onChange={handleAlarmChange}
                currentTheme={selectedTheme}
                buttonBorderColor={selectedTheme.color.point}
                hideSubLabelOnMobile
            />
        </div>
    );

    return <ListItem icon={alarmIcon} content={alarmSelector} />;
};

export default AlarmSelector;
