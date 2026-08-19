import React from 'react';
import { IoMdColorPalette } from 'react-icons/io';
import { useThemeStore } from '../../../store/themeStore';
import ListItem from '../../common/ListItem';
import ThemeButton from '../../common/ThemeButton';

const DefaultThemeSelector: React.FC = () => {
  const { selectedTheme, compColor, themes, setTheme } = useThemeStore();
  const defaultThemes = themes.filter((theme) => theme.id.startsWith('default-'));

  const defaultThemeIcon = <IoMdColorPalette size={24} className="size-full" />;

  const defaultThemeSelectorContent = (
    <div className="flex w-full min-w-0 flex-col gap-4">
      <span className="text-lg font-bold">Default Themes</span>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 w-full min-w-0">
        {defaultThemes.map((theme) => {
          const isSelected = theme.id === selectedTheme.id;
          const cleanQuote = theme.text ? theme.text.replace(/\n/g, ' ') : '';

          return (
            <div
              key={theme.id}
              onClick={() => setTheme(theme.id)}
              className="btn-tactile group cursor-pointer p-4 rounded-2xl border transition-all flex items-center gap-3.5 shadow-soft hover:scale-[1.01] w-full min-w-0"
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: isSelected ? selectedTheme.color.point : 'rgba(0,0,0,0.09)',
                color: '#1A1A1A',
                boxShadow: isSelected ? `0 0 0 2.5px ${selectedTheme.color.point}` : undefined,
              }}
            >
              {/* Circular 3-Stripe Diagonal ThemeButton Swatch (pointer-events disabled) */}
              <div className="shrink-0 pointer-events-none">
                <ThemeButton
                  theme={theme}
                  isSelected={false}
                  onClick={() => {}}
                />
              </div>

              {/* Title & Quote */}
              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="font-bold text-sm truncate">{theme.title}</div>
                {cleanQuote && (
                  <div className="text-[11px] opacity-75 flex items-center gap-1 mt-0.5 min-w-0 overflow-hidden">
                    <span
                      className="size-2 rounded-full inline-block shrink-0"
                      style={{ backgroundColor: theme.color.point }}
                    />
                    <span className="truncate min-w-0 block italic">"{cleanQuote}"</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return <ListItem icon={defaultThemeIcon} content={defaultThemeSelectorContent} />;
};

export default DefaultThemeSelector;
