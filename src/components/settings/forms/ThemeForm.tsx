import React, { useState } from 'react';
import { Path, useForm } from 'react-hook-form';
import { BiPieChart } from 'react-icons/bi';
import { GiRoundKnob } from 'react-icons/gi';
import { IoMdCheckmark, IoMdFlash } from 'react-icons/io';
import { MdFormatColorFill, MdFormatQuote, MdOutlinePalette, MdTextFields } from 'react-icons/md';
import { useThemeStore } from '../../../store/themeStore';
import { Theme } from '../../../store/types/theme';
import { getTextColor } from '../../../utils/colorUtils';
import Button from '../../common/Button';
import ColorPickerButton from '../../common/ColorPickerButton';
import TimeSelector from '../../timers/timer-management/fields/TimeSelector';

type ThemeFormData = Omit<Theme, 'id'>;

type ThemeFormProps = {
  initialData: Theme | null;
  mode: 'add' | 'edit';
  close: () => void;
};

const THEME_PRESETS: {
  name: string;
  emoji: string;
  theme: ThemeFormData;
}[] = [
  {
    name: 'Matcha Latte',
    emoji: '🍵',
    theme: {
      title: 'Matcha Latte',
      text: 'Breathe in peace,\nbreathe out focus.',
      color: {
        main: '#E8EFE9',
        point: '#557B55',
        sub: '#9BB59B',
        pointOptions: ['#3A5A40', '#588157', '#A3B18A', '#DAD7CD', '#606C38', '#283618', '#DDA15E', '#BC6C25'],
      },
    },
  },
  {
    name: 'Sunset Tangerine',
    emoji: '🍊',
    theme: {
      title: 'Sunset Tangerine',
      text: 'Radiate energy\nand achieve goals.',
      color: {
        main: '#FFF4EB',
        point: '#E65100',
        sub: '#FFB74D',
        pointOptions: ['#BF360C', '#D84315', '#E64A19', '#F4511E', '#FF7043', '#FF8A65', '#FFAB91', '#FFCCBC'],
      },
    },
  },
  {
    name: 'Ocean Breeze',
    emoji: '🌊',
    theme: {
      title: 'Ocean Breeze',
      text: 'Flow like water,\nsteady and calm.',
      color: {
        main: '#EBF4F6',
        point: '#0284C7',
        sub: '#7DD3FC',
        pointOptions: ['#0C4A6E', '#0369A1', '#0284C7', '#38BDF8', '#7DD3FC', '#BAE6FD', '#E0F2FE', '#F0F9FF'],
      },
    },
  },
  {
    name: 'Midnight Lavender',
    emoji: '🌌',
    theme: {
      title: 'Midnight Lavender',
      text: 'Quiet mind,\npowerful focus.',
      color: {
        main: '#232232',
        point: '#A78BFA',
        sub: '#4C1D95',
        pointOptions: ['#C4B5FD', '#A78BFA', '#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95', '#2E1065'],
      },
    },
  },
  {
    name: 'Warm Espresso',
    emoji: '☕',
    theme: {
      title: 'Warm Espresso',
      text: 'One sip at a time,\none task at a time.',
      color: {
        main: '#F7F3EE',
        point: '#6F4E37',
        sub: '#A67B5B',
        pointOptions: ['#3E2723', '#4E342E', '#5D4037', '#6D4C41', '#795548', '#8D6E63', '#A1887F', '#D7CCC8'],
      },
    },
  },
];

const ThemeForm: React.FC<ThemeFormProps> = ({ initialData, mode, close }) => {
  const { selectedTheme, compColor, addTheme, updateTheme, setTheme } = useThemeStore();
  const [time, setTime] = useState<number>(15);
  const [previewPointColor, setPreviewPointColor] = useState<string | null>(null);

  const isDarkMain = getTextColor(selectedTheme.color.main) === 'white';

  const { register, handleSubmit, watch, setValue, reset } = useForm<ThemeFormData>({
    defaultValues: {
      title: initialData?.title || '',
      color: {
        main: initialData?.color.main || selectedTheme.color.main,
        point: initialData?.color.point || selectedTheme.color.point,
        sub: initialData?.color.sub || selectedTheme.color.sub,
        pointOptions: initialData?.color.pointOptions || selectedTheme.color.pointOptions,
      },
      text: initialData?.text || 'See how glowing\nyou are.',
    },
  });

  const formValues = watch();

  const handleColorChange = (
    field: Path<ThemeFormData> | `color.pointOptions.${number}`,
    color: string,
    isPoint = false
  ) => {
    setValue(field, color, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    if (isPoint) {
      setPreviewPointColor(color);
    }
  };

  const handleApplyPreset = (preset: (typeof THEME_PRESETS)[0]) => {
    reset(preset.theme);
    setPreviewPointColor(preset.theme.color.point);
  };

  const previewTheme: Theme = {
    ...formValues,
    color: {
      ...formValues.color,
      point: previewPointColor || formValues.color.point,
    },
    id: 'preview',
  };

  const onSubmit = (data: ThemeFormData) => {
    const themeData: Theme = {
      ...data,
      id: initialData?.id || `custom-${Date.now()}`,
      title: data.title?.trim() || 'My Custom Theme',
    };

    if (mode === 'add') {
      addTheme(themeData);
    } else {
      updateTheme(themeData.id, themeData);
    }
    setTheme(themeData.id);
    close();
  };

  // Reusable theme-derived input and card container styles
  const inputStyle: React.CSSProperties = {
    backgroundColor: isDarkMain ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.85)',
    borderColor: `${selectedTheme.color.point}60`,
    color: compColor,
  };

  const cardBoxStyle: React.CSSProperties = {
    backgroundColor: `${selectedTheme.color.sub}25`,
    borderColor: `${selectedTheme.color.point}35`,
    color: compColor,
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full space-y-6">
      {/* 2-Column Responsive Studio Layout on Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start flex-1">
        {/* Left Column: Live Dial Preview */}
        <div
          className="flex flex-col items-center justify-center p-6 rounded-3xl backdrop-blur-md border shadow-soft transition-colors duration-300 min-h-[320px]"
          style={{
            backgroundColor: previewTheme.color.main,
            borderColor: `${previewTheme.color.point}50`,
          }}
        >
          <span
            className="text-xs font-bold uppercase tracking-wider mb-3 text-center"
            style={{ color: getTextColor(previewTheme.color.main) === 'white' ? '#FFFFFF' : '#1A1A1A' }}
          >
            Live Theme Preview
          </span>
          <div className="size-64 sm:size-72 flex items-center justify-center">
            <TimeSelector
              time={time}
              currentTheme={previewTheme}
              setTime={setTime}
              text={previewTheme.text}
            />
          </div>
        </div>

        {/* Right Column: Theme Color Pickers & Options */}
        <div className="space-y-6 flex flex-col justify-center">
          {/* Quick Palette Inspiration Presets */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: compColor }}>
              <IoMdFlash style={{ color: selectedTheme.color.point }} className="text-sm" /> Palette Inspirations
            </label>
            <div className="flex flex-wrap gap-2">
              {THEME_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="btn-tactile px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
                  style={{
                    backgroundColor: `${selectedTheme.color.sub}30`,
                    borderColor: `${selectedTheme.color.point}45`,
                    color: compColor,
                  }}
                >
                  <span>{preset.emoji}</span>
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: compColor }}>
              <MdTextFields className="text-base" style={{ color: selectedTheme.color.point }} /> Theme Name
            </label>
            <input
              {...register('title')}
              type="text"
              placeholder="e.g. Cozy Autumn, Cyberpunk Focus"
              className="w-full px-4 py-2.5 rounded-xl border font-medium text-sm focus:outline-none focus:ring-2"
              style={inputStyle}
            />
          </div>

          {/* Motivational Quote in Center */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: compColor }}>
              <MdFormatQuote className="text-base" style={{ color: selectedTheme.color.point }} /> Motivational Quote (Shown inside dial)
            </label>
            <textarea
              {...register('text')}
              rows={2}
              placeholder="e.g. See how glowing you are."
              className="w-full px-4 py-2 rounded-xl border font-medium text-xs resize-none focus:outline-none focus:ring-2"
              style={inputStyle}
            />
          </div>

          {/* Primary 3 Colors */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: compColor }}>
              <MdOutlinePalette className="text-base" style={{ color: selectedTheme.color.point }} /> Core Theme Colors
            </label>
            <div
              className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl border shadow-xs"
              style={cardBoxStyle}
            >
              {/* Main Color */}
              <div className="flex flex-col items-center gap-1.5 text-center">
                <span className="text-[11px] font-bold flex items-center gap-1 opacity-90">
                  <MdFormatColorFill style={{ color: selectedTheme.color.point }} /> Background
                </span>
                <ColorPickerButton
                  color={formValues.color.main}
                  onChange={(color) => handleColorChange('color.main', color)}
                />
              </div>

              {/* Point Color */}
              <div className="flex flex-col items-center gap-1.5 text-center">
                <span className="text-[11px] font-bold flex items-center gap-1 opacity-90">
                  <BiPieChart style={{ color: selectedTheme.color.point }} /> Timer Arc
                </span>
                <ColorPickerButton
                  color={formValues.color.point}
                  onChange={(color) => handleColorChange('color.point', color, true)}
                  onClick={() => setPreviewPointColor(formValues.color.point)}
                />
              </div>

              {/* Sub Knob Color */}
              <div className="flex flex-col items-center gap-1.5 text-center">
                <span className="text-[11px] font-bold flex items-center gap-1 opacity-90">
                  <GiRoundKnob style={{ color: selectedTheme.color.point }} /> Knob Accent
                </span>
                <ColorPickerButton
                  color={formValues.color.sub}
                  onChange={(color) => handleColorChange('color.sub', color)}
                />
              </div>
            </div>
          </div>

          {/* Routine Steps Palette Swatches */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: compColor }}>
              <MdOutlinePalette className="text-base" style={{ color: selectedTheme.color.point }} /> Routine Step Palette Swatches (8 colors)
            </label>
            <div
              className="flex flex-wrap gap-2.5 p-3.5 rounded-2xl border shadow-xs"
              style={cardBoxStyle}
            >
              {Array.from({ length: formValues.color.pointOptions?.length || 8 }, (_, i) => i).map((index) => (
                <div key={index} className="flex flex-col items-center gap-1">
                  <ColorPickerButton
                    color={formValues.color.pointOptions?.[index] || '#888888'}
                    onChange={(color) => handleColorChange(`color.pointOptions.${index}`, color, true)}
                    onClick={() => setPreviewPointColor(formValues.color.pointOptions?.[index])}
                  />
                  <span className="text-[9px] font-semibold opacity-75">#{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4 border-t border-black/5 dark:border-white/5">
        <Button
          currentTheme={selectedTheme}
          type="submit"
          aria-label="Save Custom Theme"
          className="h-12 w-full rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-float"
        >
          <IoMdCheckmark size={22} />
          <span>Save & Apply Theme</span>
        </Button>
      </div>
    </form>
  );
};

ThemeForm.displayName = 'ThemeForm';

export default ThemeForm;
