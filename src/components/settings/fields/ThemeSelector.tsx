import React, { useRef, useState } from 'react';
import { IoMdAdd, IoMdColorPalette } from 'react-icons/io';
import Swal from 'sweetalert2';
import { useThemeStore } from '../../../store/themeStore';
import { Theme } from '../../../store/types/theme';
import ListItem from '../../common/ListItem';
import Tooltip from '../../common/Tooltip';
import ThemeOverlay from '../ThemeOverlay';

const ThemeSelector: React.FC = () => {
    const { selectedTheme, themes, setTheme, removeTheme } = useThemeStore();
    const [targetTheme, setTargetTheme] = useState<Theme | null>(null);
    const [mode, setMode] = useState<'add' | 'edit'>('add');
    const longPressTimeoutRef = useRef<number | null>(null);

    const isCustomTheme = (themeId: string) => !themeId.startsWith('default-');

    const handleThemeContext = (theme: (typeof themes)[0]) => {
        Swal.fire({
            html: `<span>Choose an action for<br><strong>${theme.title}</strong> theme.</span>`,
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonText: 'Edit',
            denyButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            customClass: {
                popup: 'rounded-2xl p-6',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                openOverlay(theme);
            } else if (result.isDenied) {
                removeTheme(theme.id);
            }
        });
    };

    const renderThemeButton = (theme: (typeof themes)[0]) => (
        <button
            key={theme.id}
            type="button"
            onClick={() => setTheme(theme.id)}
            // right click(context menu) for PC
            onContextMenu={(e) => {
                e.preventDefault();
                if (isCustomTheme(theme.id)) {
                    handleThemeContext(theme);
                }
            }}
            // long-press for mobile
            onTouchStart={() => {
                // 600ms timeout
                if (isCustomTheme(theme.id)) {
                    longPressTimeoutRef.current = window.setTimeout(() => {
                        handleThemeContext(theme);
                    }, 600);
                }
            }}
            onTouchEnd={() => {
                if (longPressTimeoutRef.current) {
                    window.clearTimeout(longPressTimeoutRef.current);
                    longPressTimeoutRef.current = null;
                }
            }}
            className={`relative flex size-12 items-center justify-center rounded-full transition-all ${
                theme.id === selectedTheme.id ? 'scale-110' : 'hover:scale-105'
            }`}
            title={theme.title}
        >
            {theme.id === selectedTheme.id && (
                <div
                    className="absolute inset-0 rounded-full"
                    style={{
                        boxShadow: `0 0 0 3px ${theme.color.point}`,
                    }}
                />
            )}
            <div
                className="size-10 rounded-full border"
                style={{
                    background: `linear-gradient(135deg, ${theme.color.main} 0%, ${theme.color.main} 45%, ${theme.color.sub} 45%, ${theme.color.sub} 55%, ${theme.color.point} 55%, ${theme.color.point} 100%)`,
                    borderColor: theme.color.point,
                }}
            />
        </button>
    );

    const openOverlay = (theme?: Theme) => {
        setTargetTheme(theme || null);
        setMode(theme ? 'edit' : 'add');
        window.location.hash = 'settings&theme';
    };

    const closeOverlay = () => {
        setTargetTheme(null);
    };

    const themeSelectorContent = (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center gap-1 text-lg">
                <span>Theme</span>
                <Tooltip
                    title="Custom Theme Actions"
                    desc="Long-press (or right-click) a custom theme icon to edit or delete it."
                />
            </div>
            <div className="flex flex-wrap gap-3 px-2">
                {themes.map((theme) => renderThemeButton(theme))}
                <button
                    type="button"
                    className="flex size-12 items-center justify-center rounded-full border-2 border-dashed border-gray-400 transition-all hover:scale-105"
                    onClick={() => openOverlay()}
                    title="Add Custom Theme"
                >
                    <IoMdAdd size={20} className="text-gray-400" />
                </button>
            </div>
            <ThemeOverlay initialTheme={targetTheme} onClose={closeOverlay} mode={mode} />
        </div>
    );

    return <ListItem icon={<IoMdColorPalette size={24} className="size-full" />} content={themeSelectorContent} />;
};

export default ThemeSelector;
