import React, { useRef, useState } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { MdOutlinePalette } from 'react-icons/md';
import Swal from 'sweetalert2';
import { useThemeStore } from '../../../store/themeStore';
import { Theme } from '../../../store/types/theme';
import ListItem from '../../common/ListItem';
import ThemeButton from '../../common/ThemeButton';
import Tooltip from '../../common/Tooltip';
import ThemeOverlay from '../ThemeOverlay';

const CustomThemeSelector: React.FC = () => {
    const { selectedTheme, themes, setTheme, removeTheme } = useThemeStore();
    const [targetTheme, setTargetTheme] = useState<Theme | null>(null);
    const [mode, setMode] = useState<'add' | 'edit'>('add');
    const longPressTimeoutRef = useRef<number | null>(null);
    const customThemes = themes.filter((theme) => !theme.id.startsWith('default-'));

    const customThemeIcon = <MdOutlinePalette size={24} className="size-full" />;

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

    const openOverlay = (theme?: Theme) => {
        setTargetTheme(theme || null);
        setMode(theme ? 'edit' : 'add');
        window.location.hash = 'settings&theme';
    };

    const closeOverlay = () => {
        setTargetTheme(null);
    };

    const customThemeSelectorContent = (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center gap-1">
                <span className="text-lg">Custom Themes</span>
                <Tooltip
                    title="Custom Theme Actions"
                    desc={`Long-press (or right-click) a <strong style='color:${selectedTheme.color.point};'>custom theme</strong> icon to <strong style='color:${selectedTheme.color.point};'>edit</strong> or <strong style='color:${selectedTheme.color.point};'>delete</strong> it.`}
                />
            </div>
            <div className="flex flex-wrap gap-3 pr-2">
                {customThemes.map((theme) => (
                    <ThemeButton
                        key={theme.id}
                        theme={theme}
                        isSelected={theme.id === selectedTheme.id}
                        onClick={() => setTheme(theme.id)}
                        onContext={(e) => {
                            e.preventDefault();
                            handleThemeContext(theme);
                        }}
                        onTouchStart={() => {
                            longPressTimeoutRef.current = window.setTimeout(() => {
                                handleThemeContext(theme);
                            }, 600);
                        }}
                        onTouchEnd={() => {
                            if (longPressTimeoutRef.current) {
                                window.clearTimeout(longPressTimeoutRef.current);
                                longPressTimeoutRef.current = null;
                            }
                        }}
                    />
                ))}
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

    return <ListItem icon={customThemeIcon} content={customThemeSelectorContent} />;
};

export default CustomThemeSelector;
