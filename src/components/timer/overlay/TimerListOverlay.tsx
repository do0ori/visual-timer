import { useState } from 'react';
import { IoMdTrash } from 'react-icons/io';
import { MdEdit } from 'react-icons/md';
import { TIMER_TYPE, TIMER_TYPE_CONFIG } from '../../../config/timer/type';
import useOverlay from '../../../hooks/useOverlay';
import { useBaseTimerStore } from '../../../store/baseTimerStore';
import { useSelectedTimerStore } from '../../../store/selectedTimerStore';
import { useThemeStore } from '../../../store/themeStore';
import { BaseTimerData, TimerData } from '../../../store/types/timer';
import { getTimerPointColor } from '../../../utils/themeUtils';
import BackAddTopBar from '../../navigation/BackAddTopBar';
import TimerDataOverlay from './TimerDataOverlay';

const TimerListOverlay: React.FC = () => {
    const { themes, globalThemeKey } = useThemeStore();
    const originalTheme = themes[globalThemeKey];

    const selectTimer = useSelectedTimerStore((state) => state.selectTimer);
    const { timers, removeTimer } = useBaseTimerStore();
    const [targetTimer, setTargetTimer] = useState<BaseTimerData | null>(null);
    const [mode, setMode] = useState<'add' | 'edit'>('add');

    const { isOpen, close } = useOverlay('timer-list');

    const handleSelectTimer = (timerId: string) => {
        selectTimer(timerId);
    };

    const openOverlay = (timer?: BaseTimerData) => {
        setTargetTimer(timer || null);
        setMode(timer ? 'edit' : 'add');
        window.location.hash = 'timer-list&timer-data';
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
        };

        if (timer.type === TIMER_TYPE.BASE) {
            return (
                <Icon
                    {...commonProps}
                    stroke={getTimerPointColor(originalTheme, timer.pointColorIndex)}
                    time={timer.time}
                />
            );
        }

        return <Icon {...commonProps} />;
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
                <BackAddTopBar title="Timer List" onClose={close} onAdd={() => openOverlay()} />

                <div className="w-full p-5 pt-20">
                    <ul className="max-h-[calc(100vh-6.25rem)] space-y-5 overflow-y-auto no-scrollbar">
                        {timers.map((timer: BaseTimerData) => (
                            <li
                                key={timer.id}
                                className="flex items-center justify-between"
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
                                        className="cursor-pointer"
                                    />
                                    <IoMdTrash
                                        size={24}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeTimer(timer.id);
                                        }}
                                        aria-label="Delete Timer"
                                        className="cursor-pointer"
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <TimerDataOverlay initialTimerData={targetTimer} onClose={closeOverlay} mode={mode} />
        </>
    );
};

export default TimerListOverlay;
