import React from 'react';
import { IoMdClose } from 'react-icons/io';
import { useOverlay } from '../../hooks/useOverlay';
import { useThemeStore } from '../../store/themeStore';
import { Theme } from '../../store/types/theme';
import ThemeForm from './forms/ThemeForm';

type ThemeOverlayProps = {
  initialTheme: Theme | null;
  mode: 'add' | 'edit';
  onClose: () => void;
};

const ThemeOverlay: React.FC<ThemeOverlayProps> = ({ initialTheme, mode, onClose }) => {
  const { selectedTheme, compColor } = useThemeStore();
  const { isOpen, close } = useOverlay('theme', onClose);

  const handleClose = () => {
    close();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-0 md:p-6 lg:p-10 animate-fade-in">
      <div
        className="relative flex flex-col size-full md:max-w-4xl md:max-h-[90vh] md:rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-scale-up"
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
          <h2 className="text-xl font-bold font-display text-white">
            {mode === 'add' ? 'Create Custom Theme' : 'Edit Custom Theme'}
          </h2>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <IoMdClose size={26} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 no-scrollbar">
          <ThemeForm initialData={initialTheme} mode={mode} close={handleClose} />
        </div>
      </div>
    </div>
  );
};

export default ThemeOverlay;
