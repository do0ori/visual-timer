import { useState, useRef, useEffect } from 'react';
import { useAspectRatio } from '../hooks/useAspectRatio';
import { useMainTimerStore, MainTimerData } from '../store/mainTimerStore';
import { IoList } from 'react-icons/io5';
import { MdEdit } from 'react-icons/md';
import { FaCircle, FaPlus } from 'react-icons/fa';

const TimerList: React.FC<{ isRunning: boolean }> = ({ isRunning }) => {
    const aspectRatio = useAspectRatio();
    const { timers, selectTimer, removeTimer } = useMainTimerStore();
    const [isOpen, setIsOpen] = useState(false);
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
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleSelectTimer = (timerId: string) => {
        selectTimer(timerId);
        setIsOpen(false);
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
                    <h2 className="mb-10 text-2xl font-bold">Timer List</h2>
                    <ul className="space-y-5">
                        {timers.map((timer: MainTimerData) => (
                            <li
                                key={timer.id}
                                className="flex cursor-pointer items-center justify-between space-x-2"
                                onClick={() => handleSelectTimer(timer.id)}
                            >
                                <div className="flex grow gap-5">
                                    <div className="flex-shrink-0">
                                        <FaCircle size={50} fill={timer.pointColor} className="h-full w-full" />
                                    </div>
                                    <div className="flex flex-col pr-5">
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
                                            console.log('수정');
                                        }}
                                    />
                                    <FaPlus
                                        size={24}
                                        className="rotate-45"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeTimer(timer.id);
                                        }}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TimerList;
