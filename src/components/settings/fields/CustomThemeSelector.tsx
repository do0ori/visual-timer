import React, { useState } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { MdDeleteOutline, MdEdit, MdOutlinePalette } from 'react-icons/md';
import { useThemeStore } from '../../../store/themeStore';
import { Theme } from '../../../store/types/theme';
import ListItem from '../../common/ListItem';
import ThemeButton from '../../common/ThemeButton';
import ThemeOverlay from '../ThemeOverlay';

const CustomThemeSelector: React.FC = () => {
  const { selectedTheme, themes, setTheme, removeTheme } = useThemeStore();
  const [targetTheme, setTargetTheme] = useState<Theme | null>(null);
  const [mode, setMode] = useState<'add' | 'edit'>('add');

  const customThemes = themes.filter((theme) => !theme.id.startsWith('default-'));
  const customThemeIcon = <MdOutlinePalette size={24} className="size-full" />;

  const openOverlay = (theme?: Theme) => {
    setTargetTheme(theme || null);
    setMode(theme ? 'edit' : 'add');
    window.location.hash = 'settings&theme';
  };

  const closeOverlay = () => {
    setTargetTheme(null);
  };

  const customThemeSelectorContent = (
    <div className="flex w-full min-w-0 flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold">Custom Themes</span>
        <button
          type="button"
          onClick={() => openOverlay()}
          className="btn-tactile px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 text-white shadow-soft transition-transform active:scale-95 shrink-0"
          style={{ backgroundColor: selectedTheme.color.point }}
        >
          <IoMdAdd size={16} /> New Theme
        </button>
      </div>

      {customThemes.length === 0 ? (
        <div
          className="p-8 text-center rounded-2xl border border-dashed space-y-2 w-full"
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: 'rgba(0,0,0,0.12)',
            color: '#1A1A1A',
          }}
        >
          <p className="text-xs opacity-80">No custom themes created yet.</p>
          <button
            type="button"
            onClick={() => openOverlay()}
            className="text-xs font-bold hover:underline"
            style={{ color: selectedTheme.color.point }}
          >
            + Create your first custom palette
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 w-full min-w-0">
          {customThemes.map((theme) => {
            const isSelected = theme.id === selectedTheme.id;
            const cleanQuote = theme.text ? theme.text.replace(/\n/g, ' ') : '';

            return (
              <div
                key={theme.id}
                onClick={() => setTheme(theme.id)}
                className={`btn-tactile group cursor-pointer p-4 rounded-2xl border transition-all flex items-center justify-between gap-3.5 shadow-soft hover:scale-[1.01] w-full min-w-0`}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: isSelected ? selectedTheme.color.point : 'rgba(0,0,0,0.09)',
                  color: '#1A1A1A',
                  boxShadow: isSelected ? `0 0 0 2.5px ${selectedTheme.color.point}` : undefined,
                }}
              >
                {/* Clean Circular 3-Stripe Diagonal ThemeButton Swatch Icon */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1 overflow-hidden">
                  <div className="shrink-0 pointer-events-none">
                    {/* isSelected=false: ring indicator is handled by the card border, not the button */}
                    <ThemeButton
                      theme={theme}
                      isSelected={false}
                      onClick={() => {}}
                    />
                  </div>

                  {/* Title & Quote Details */}
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <div className="font-bold text-sm truncate">{theme.title}</div>
                    {cleanQuote && (
                      <div className="text-[11px] opacity-75 flex items-center gap-1 mt-0.5 min-w-0 overflow-hidden">
                        <span
                          className="size-2 rounded-full inline-block shrink-0 shadow-xs"
                          style={{ backgroundColor: theme.color.point }}
                        />
                        <span className="truncate min-w-0 block italic">"{cleanQuote}"</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0 ml-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => openOverlay(theme)}
                    aria-label="Edit Theme"
                    className="p-2 rounded-xl hover:opacity-100 transition-all opacity-70 shrink-0 border"
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderColor: 'rgba(0,0,0,0.09)',
                      color: '#1A1A1A',
                    }}
                    title="Edit Theme"
                  >
                    <MdEdit size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeTheme(theme.id)}
                    aria-label="Delete Theme"
                    className="p-2 rounded-xl bg-red-500/15 text-red-600 dark:text-red-400 hover:bg-red-500/25 transition-colors opacity-80 hover:opacity-100 shrink-0"
                    title="Delete Theme"
                  >
                    <MdDeleteOutline size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ThemeOverlay initialTheme={targetTheme} onClose={closeOverlay} mode={mode} />
    </div>
  );

  return <ListItem icon={customThemeIcon} content={customThemeSelectorContent} />;
};

export default CustomThemeSelector;
