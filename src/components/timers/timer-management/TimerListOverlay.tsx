import { useState } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { MdDeleteOutline, MdEdit } from 'react-icons/md';
import { TIMER_TYPE, TIMER_TYPE_CONFIG } from '../../../config/timer/type';
import { useOverlay } from '../../../hooks/useOverlay';
import { useBaseTimerStore } from '../../../store/baseTimerStore';
import { useRoutineTimerStore } from '../../../store/routineTimerStore';
import { useSelectedTimerStore } from '../../../store/selectedTimerStore';
import { useThemeStore } from '../../../store/themeStore';
import { TimerData } from '../../../store/types/timer';
import { getTimerPointColor } from '../../../utils/themeUtils';
import Button from '../../common/Button';
import TopBar from '../../common/TopBar';
import TimerItemOverlay from './TimerItemOverlay';

const TimerListOverlay: React.FC = () => {
    const { selectedTheme } = useThemeStore();

    const selectTimer = useSelectedTimerStore((state) => state.selectTimer);
    const { timers: baseTimers, removeTimer: removeBaseTimer } = useBaseTimerStore();
    const { timers: routineTimers, removeTimer: removeRoutineTimer } = useRoutineTimerStore();
    const [targetTimer, setTargetTimer] = useState<TimerData | null>(null);
    const [mode, setMode] = useState<'add' | 'edit'>('add');

    const { isOpen, close } = useOverlay('timer-list');

    const timers = [...baseTimers, ...routineTimers];

    const handleSelectTimer = (timerId: string) => {
        selectTimer(timerId);
    };

    const openOverlay = (timer?: TimerData) => {
        setTargetTimer(timer || null);
        setMode(timer ? 'edit' : 'add');
        window.location.hash = 'timer-list&timer-item';
    };

    const closeOverlay = () => {
        setTargetTimer(null);
    };

    const getTimerIcon = (timer: TimerData) => {
        const config = TIMER_TYPE_CONFIG[timer.type];
        const Icon = config.icon;

        const commonProps = {
            size: 50,
            className: 'rounded-full',
            stroke: getTimerPointColor(selectedTheme, timer.pointColorIndex),
        };

        if (timer.type === TIMER_TYPE.BASE) {
            return <Icon {...commonProps} time={timer.time} />;
        }

        return <Icon {...commonProps} />;
    };

    const handleEditTimer = (e: React.MouseEvent, timer: TimerData) => {
        e.stopPropagation();
        openOverlay(timer);
    };

    const handleDeleteTimer = (e: React.MouseEvent, timer: TimerData) => {
        e.stopPropagation();
        if (timer.type === TIMER_TYPE.BASE) {
            removeBaseTimer(timer.id);
        } else {
            removeRoutineTimer(timer.id);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div
                className="absolute inset-0 z-40 flex size-full flex-col shadow-lg"
                style={{
                    backgroundColor: selectedTheme.color.main,
                    outline: `2px solid ${selectedTheme.color.sub}33`,
                }}
            >
                <TopBar.Back onLeftClick={close} center="Timer List" />

                <div className="flex grow flex-col justify-between gap-5 p-5">
                    <ul className="max-h-[calc(100vh-156px)] space-y-5 overflow-y-auto no-scrollbar">
                        {timers.map((timer: TimerData) => (
                            <li
                                key={timer.id}
                                className="flex items-center justify-between gap-5"
                                onClick={() => {
                                    handleSelectTimer(timer.id);
                                    close();
                                }}
                            >
                                <div className="flex grow gap-5">
                                    <div className="shrink-0 self-center">{getTimerIcon(timer)}</div>
                                    <div className="flex flex-col">
                                        <span className="line-clamp-2 overflow-hidden text-ellipsis">
                                            {timer.title}
                                        </span>
                                        <span className="text-gray-500">
                                            {timer.type === TIMER_TYPE.BASE
                                                ? `${timer.time} ${timer.isMinutes ? 'min' : 'sec'}`
                                                : `${timer.items.length} ${timer.items.length === 1 ? 'item' : 'items'}`}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-5">
                                    <MdEdit
                                        size={24}
                                        onClick={(e) => handleEditTimer(e, timer)}
                                        aria-label="Edit Timer"
                                        className="cursor-pointer"
                                    />
                                    <MdDeleteOutline
                                        size={24}
                                        onClick={(e) => handleDeleteTimer(e, timer)}
                                        aria-label="Delete Timer"
                                        className="cursor-pointer"
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>

                    <Button
                        currentTheme={selectedTheme}
                        onClick={() => openOverlay()}
                        aria-label="Add Timer"
                        className="h-10 w-full rounded-2xl"
                    >
                        <IoMdAdd size={30} />
                    </Button>
                </div>
            </div>

            <TimerItemOverlay initialTimerData={targetTimer} onClose={closeOverlay} mode={mode} />
        </>
    );
};

export default TimerListOverlay;
