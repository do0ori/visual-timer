import { useState } from 'react';
import { FaCircle } from 'react-icons/fa';
import { IoMdTrash } from 'react-icons/io';
import { MdEdit } from 'react-icons/md';
import useOverlayClose from '../../hooks/useOverlayClose';
import { TimerData, useMainTimerStore } from '../../store/mainTimerStore';
import { useThemeStore } from '../../store/themeStore';
import TimerListTopBar from '../navigation/TimerListTopBar';
import TimerDataOverlay from './TimerDataOverlay';

const TimerListOverlay: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { themes, globalThemeKey } = useThemeStore();
    const originalTheme = themes[globalThemeKey];

    const { timers, selectTimer, removeTimer } = useMainTimerStore();
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const [targetTimer, setTargetTimer] = useState<TimerData | null>(null);
    const [mode, setMode] = useState<'add' | 'edit'>('add');

    useOverlayClose(isOpen, onClose);

    const handleSelectTimer = (timerId: string) => {
        selectTimer(timerId);
    };

    const openOverlay = (timer?: TimerData) => {
        setTargetTimer(timer || null);
        setMode(timer ? 'edit' : 'add');
        setIsOverlayOpen(true);
    };

    const closeOverlay = () => {
        setTargetTimer(null);
        setIsOverlayOpen(false);
    };

    if (!isOpen) return null;

    return (
        <>
            <div
                className="absolute inset-0 z-40 size-full shadow-lg"
                style={{
                    backgroundColor: originalTheme.color.main,
                    outline: `2px solid ${originalTheme.color.sub}33`,
                }}
            >
                <TimerListTopBar title="Timer List" onClose={onClose} onAdd={() => openOverlay()} />

                <div className="w-full p-5 pt-20">
                    <ul className="max-h-[calc(100vh-6.25rem)] space-y-5 overflow-y-auto no-scrollbar">
                        {timers.map((timer: TimerData) => (
                            <li
                                key={timer.id}
                                className="flex cursor-pointer items-center justify-between"
                                onClick={() => {
                                    handleSelectTimer(timer.id);
                                    onClose();
                                }}
                            >
                                <div className="flex grow gap-5">
                                    <div className="shrink-0 self-center">
                                        <FaCircle
                                            size={50}
                                            fill={timer.pointColor}
                                            className="rounded-full border-2 border-white shadow-[4px_4px_10px_rgba(0,0,0,0.2)]"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="line-clamp-2 overflow-hidden text-ellipsis">
                                            {timer.title}
                                        </span>
                                        <span className="text-gray-500">{`${timer.time} ${timer.isMinutes ? 'min' : 'sec'}`}</span>
                                    </div>
                                </div>
                                <div className="flex gap-5">
                                    <MdEdit
                                        size={24}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openOverlay(timer);
                                        }}
                                        aria-label="Edit Timer"
                                    />
                                    <IoMdTrash
                                        size={24}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeTimer(timer.id);
                                        }}
                                        aria-label="Delete Timer"
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <TimerDataOverlay
                isOpen={isOverlayOpen}
                initialTimerData={targetTimer}
                onClose={closeOverlay}
                mode={mode}
            />
        </>
    );
};

export default TimerListOverlay;
