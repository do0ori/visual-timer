import React, { useState } from 'react';
import { IoMdClose, IoMdColorPalette, IoMdInformationCircle } from 'react-icons/io';
import { MdOutlineBarChart, MdOutlineTimer } from 'react-icons/md';
import { useOverlay } from '../../hooks/useOverlay';
import { useThemeStore } from '../../store/themeStore';
import AlarmSettings from './sections/AlarmSettings';
import OthersSettings from './sections/OthersSettings';
import StatsSettings from './sections/StatsSettings';
import ThemeSettings from './sections/ThemeSettings';
import TimerSettings from './sections/TimerSettings';

type SettingsTab = 'stats' | 'theme' | 'timer' | 'about';

const SettingsOverlay: React.FC = () => {
  const { selectedTheme, compColor } = useThemeStore();
  const { isOpen, close } = useOverlay('settings');
  const [activeTab, setActiveTab] = useState<SettingsTab>('stats');

  if (!isOpen) return null;

  const tabs: { id: SettingsTab; label: string; shortLabel: string; icon: React.ReactNode }[] = [
    { id: 'stats', label: 'Focus Stats & Share', shortLabel: 'Stats', icon: <MdOutlineBarChart size={20} /> },
    { id: 'theme', label: 'Theme & Colors', shortLabel: 'Theme', icon: <IoMdColorPalette size={20} /> },
    { id: 'timer', label: 'Timer & Sound', shortLabel: 'Timer', icon: <MdOutlineTimer size={20} /> },
    { id: 'about', label: 'About & Developer', shortLabel: 'About', icon: <IoMdInformationCircle size={20} /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-0 md:p-6 lg:p-10 animate-fade-in">
      <div
        className="relative flex flex-col size-full md:max-w-5xl md:max-h-[90vh] md:rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-scale-up"
        style={{
          backgroundColor: selectedTheme.color.main,
          color: compColor,
        }}
      >
        {/* Header */}
        <div
          className="flex h-16 shrink-0 items-center justify-between px-6 shadow-sm border-b border-white/10"
          style={{ backgroundColor: selectedTheme.color.point }}
        >
          <h2 className="text-xl font-bold font-display text-white">App Settings</h2>
          <button
            onClick={close}
            aria-label="Close"
            className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <IoMdClose size={26} />
          </button>
        </div>

        {/* Mobile Tab Bar */}
        <div className="md:hidden grid grid-cols-4 p-1.5 gap-1 border-b border-black/5 dark:border-white/5 bg-black/5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[10px] font-bold transition-all gap-1 ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-soft'
                  : 'text-current opacity-70 hover:opacity-100'
              }`}
            >
              <div style={{ color: activeTab === tab.id ? selectedTheme.color.point : 'inherit' }}>
                {tab.icon}
              </div>
              <span className="truncate">{tab.shortLabel}</span>
            </button>
          ))}
        </div>

        {/* Desktop 2-Column Sidebar & Content Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          {/* Desktop Left Nav Sidebar */}
          <div className="hidden md:flex w-64 shrink-0 flex-col p-4 border-r border-black/5 dark:border-white/5 space-y-1.5 bg-black/5 dark:bg-white/5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-3 transition-all text-left ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-soft'
                    : 'text-current opacity-70 hover:opacity-100 hover:bg-white/40 dark:hover:bg-white/10'
                }`}
              >
                <div style={{ color: activeTab === tab.id ? selectedTheme.color.point : 'inherit' }}>
                  {tab.icon}
                </div>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Right Content Panel */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 no-scrollbar space-y-8 min-w-0">
            {activeTab === 'stats' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-display">Focus Stats & Achievement</h3>
                  <p className="text-xs opacity-70 mt-0.5">Track your daily focus time, streak, and download SNS share cards.</p>
                </div>
                <StatsSettings />
              </div>
            )}

            {activeTab === 'theme' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-display">Theme & Customization</h3>
                  <p className="text-xs opacity-70 mt-0.5">Select a built-in soothing theme or design your own custom palette.</p>
                </div>
                <ThemeSettings />
              </div>
            )}

            {activeTab === 'timer' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-display">Timer & Sound</h3>
                  <p className="text-xs opacity-70 mt-0.5">Customize timer behavior, alarm sounds, and volume.</p>
                </div>
                <TimerSettings />
                <AlarmSettings />
              </div>
            )}

            {activeTab === 'about' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-display">About & Developer</h3>
                  <p className="text-xs opacity-70 mt-0.5">Mellow Visual Timer 2.0 • Made with care for deep focus.</p>
                </div>
                <OthersSettings />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsOverlay;
