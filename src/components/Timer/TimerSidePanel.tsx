import { useState, useRef, useEffect } from 'react';
import { useAspectRatio } from '../../hooks/useAspectRatio';
import { useMainTimerStore, MainTimerData } from '../../store/mainTimerStore';
import { IoList } from 'react-icons/io5';
import { MdEdit } from 'react-icons/md';
import { FaCircle, FaPlus, FaTrash } from 'react-icons/fa';
import TimerOverlay from './TimerOverlay';

const TimerSidePanel: React.FC<{ isRunning: boolean }> = ({ isRunning }) => {
    const aspectRatio = useAspectRatio();
    const { timers, selectTimer, removeTimer } = useMainTimerStore();
    const [isOpen, setIsOpen] = useState(false);
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const [targetTimer, setTargetTimer] = useState<MainTimerData | null>(null);
    const [mode, setMode] = useState<'add' | 'edit'>('add');
    const menuRef = useRef<HTMLDivElement>(null);

    const widthClass =
        aspectRatio >= 1.6
            ? 'w-80' // 데스크톱
            : aspectRatio >= 1.3
              ? 'w-1/2' // 태블릿
              : 'w-3/4'; // 모바일

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen && !isOverlayOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, isOverlayOpen]);

    const handleSelectTimer = (timerId: string) => {
        selectTimer(timerId);
        setIsOpen(false);
    };

    const openOverlay = (timer?: MainTimerData) => {
        setTargetTimer(timer || null);
        setMode(timer ? 'edit' : 'add');
        setIsOverlayOpen(true);
    };

    const closeOverlay = () => {
        setTargetTimer(null);
        setIsOverlayOpen(false);
    };

    return (
        <div>
            <button
                onClick={toggleMenu}
                disabled={isOpen}
                className={`z-50 transition-opacity duration-300 ${
                    isRunning ? 'invisible' : 'visible'
                } ${isOpen ? 'opacity-0' : 'opacity-100'}`}
            >
                <IoList size={35} />
            </button>

            <div
                ref={menuRef}
                className={`fixed right-0 top-0 z-40 h-full bg-white shadow-lg transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} ${widthClass}`}
            >
                <div className="p-5 text-black">
                    <div className="mb-10 flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Timer List</h2>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                openOverlay();
                            }}
                            aria-label="Add Timer"
                        >
                            <FaPlus size={24} />
                        </button>
                    </div>
                    <ul className="no-scrollbar max-h-[calc(100vh-8rem)] space-y-5 overflow-y-auto">
                        {timers.map((timer: MainTimerData) => (
                            <li
                                key={timer.id}
                                className="flex cursor-pointer items-center justify-between"
                                onClick={() => handleSelectTimer(timer.id)}
                            >
                                <div className="flex grow gap-5">
                                    <div className="flex-shrink-0">
                                        <FaCircle size={50} fill={timer.pointColor} className="h-full w-full" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="line-clamp-2 overflow-hidden text-ellipsis">
                                            {timer.title}
                                        </span>
                                        <span className="text-gray-700">{`${timer.time} ${timer.isMinutes ? 'min' : 'sec'}`}</span>
                                    </div>
                                </div>
                                <div className="flex gap-5">
                                    <MdEdit
                                        size={24}
                                        className={`${timer.isRunning ? 'invisible' : 'visible'}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openOverlay(timer);
                                        }}
                                        aria-label="Edit Timer"
                                    />
                                    <FaTrash
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

            <TimerOverlay isOpen={isOverlayOpen} initialTimerData={targetTimer} onClose={closeOverlay} mode={mode} />
        </div>
    );
};

export default TimerSidePanel;
