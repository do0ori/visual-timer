import { useEffect, useRef, useState } from 'react';
import { TIMER_TYPE, TIMER_TYPE_CONFIG, TimerType } from '../../../config/timer/type';
import { useOverlay } from '../../../hooks/useOverlay';
import { useThemeStore } from '../../../store/themeStore';
import { BaseTimerData, RoutineTimerData, TimerData } from '../../../store/types/timer';
import TopBar from '../../common/TopBar';
import BaseTimerForm from './forms/BaseTimerForm';
import RoutineTimerForm from './forms/RoutineTimerForm';

type TimerItemOverlayProps = {
    initialTimerData: TimerData | null;
    mode: 'add' | 'edit';
    onClose: () => void;
};

const TimerItemOverlay: React.FC<TimerItemOverlayProps> = ({ initialTimerData, mode, onClose }) => {
    const { themes, globalThemeKey } = useThemeStore();
    const formRef = useRef<HTMLFormElement>(null);
    const [timerType, setTimerType] = useState<TimerType>(initialTimerData?.type || TIMER_TYPE.BASE);

    const { isOpen, close } = useOverlay('timer-item', onClose);

    useEffect(() => {
        if (isOpen) {
            setTimerType(initialTimerData?.type || TIMER_TYPE.BASE);
        }
    }, [isOpen]);

    const handleSave = () => {
        formRef.current?.requestSubmit();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex size-full"
            style={{ backgroundColor: themes[globalThemeKey].color.main }}
        >
            <TopBar.CancelSave
                onLeftClick={close}
                center={`${mode === 'add' ? 'Add' : 'Edit'} ${TIMER_TYPE_CONFIG[timerType].label}`}
                onRightClick={handleSave}
            />

            {timerType === TIMER_TYPE.BASE && (
                <BaseTimerForm
                    ref={formRef}
                    initialData={initialTimerData as BaseTimerData}
                    mode={mode}
                    timerType={timerType}
                    setTimerType={setTimerType}
                    close={close}
                />
            )}

            {timerType === TIMER_TYPE.ROUTINE && (
                <RoutineTimerForm
                    ref={formRef}
                    initialData={initialTimerData as RoutineTimerData}
                    mode={mode}
                    timerType={timerType}
                    setTimerType={setTimerType}
                    close={close}
                />
            )}
        </div>
    );
};

export default TimerItemOverlay;
