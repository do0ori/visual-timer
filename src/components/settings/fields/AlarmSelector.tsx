import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BiSolidBellRing } from 'react-icons/bi';
import { IoMdCloudUpload, IoMdPlay, IoMdSquare } from 'react-icons/io';
import { useSettingsStore } from '../../../store/settingsStore';
import { useThemeStore } from '../../../store/themeStore';
import { PRESET_SOUNDS, playSound } from '../../../utils/soundEngine';
import Dropdown from '../../common/Dropdown';
import ListItem from '../../common/ListItem';

const AlarmSelector: React.FC = () => {
  const { selectedTheme } = useThemeStore();
  const { selectedAlarm, setSelectedAlarm, volume, mute } = useSettingsStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const stopAudioRef = useRef<(() => void) | void>(undefined);
  const previewTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customSoundName, setCustomSoundName] = useState<string>('');

  const alarmIcon = <BiSolidBellRing size={24} className="size-full" />;

  const options = [
    ...PRESET_SOUNDS.map((s) => ({
      label: s.label,
      value: s.value,
      subLabel: s.description,
    })),
    ...(customSoundName
      ? [
          {
            label: `📁 ${customSoundName}`,
            value: selectedAlarm,
            subLabel: 'Custom Uploaded Sound',
          },
        ]
      : []),
  ];

  const stopPreview = useCallback(() => {
    if (stopAudioRef.current) {
      stopAudioRef.current();
      stopAudioRef.current = undefined;
    }

    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
      previewTimeoutRef.current = undefined;
    }

    setIsPlaying(false);
  }, []);

  const startPreview = useCallback((soundValue?: string) => {
    stopPreview();

    const soundToPlay = soundValue || selectedAlarm;
    const stopFn = playSound(soundToPlay, volume, mute);
    stopAudioRef.current = stopFn;
    setIsPlaying(Boolean(stopFn));

    if (stopFn) {
      previewTimeoutRef.current = setTimeout(() => {
        stopPreview();
      }, 3000);
    }
  }, [mute, selectedAlarm, stopPreview, volume]);

  useEffect(() => stopPreview, [stopPreview]);

  const handleAlarmChange = (newAlarm: string) => {
    setSelectedAlarm(newAlarm);
    startPreview(newAlarm);
  };

  const handlePreviewButtonClick = () => {
    if (isPlaying) {
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
        setCustomSoundName(file.name);
        setSelectedAlarm(dataUrl);
        startPreview(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const alarmSelector = (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-base sm:text-lg font-bold whitespace-nowrap">Alarm Sound</span>
        <div className="flex items-center gap-2">
          {/* Custom Sound Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-tactile px-3 py-2 rounded-xl text-xs font-semibold text-white shadow-soft flex items-center gap-1.5 transition-transform active:scale-95"
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

          {/* Sound Preview Play Button */}
          <button
            onClick={handlePreviewButtonClick}
            className="btn-tactile p-2 rounded-xl text-white shadow-soft flex items-center justify-center transition-transform active:scale-95"
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
