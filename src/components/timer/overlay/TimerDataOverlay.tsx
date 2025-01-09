import { useEffect, useRef, useState } from 'react';
import { TIMER_TYPE, TIMER_TYPE_CONFIG, TimerType } from '../../../config/timer/type';
import useOverlay from '../../../hooks/useOverlay';
import { useThemeStore } from '../../../store/themeStore';
import { BaseTimerData } from '../../../store/types/timer';
import CancelSaveTopBar from '../../navigation/CancelSaveTopBar';
import BaseTimerForm from '../form/BaseTimerForm';

type TimerDataOverlayProps = {
    initialTimerData: BaseTimerData | null;
    mode: 'add' | 'edit';
    onClose: () => void;
};

const TimerDataOverlay: React.FC<TimerDataOverlayProps> = ({ initialTimerData, mode, onClose }) => {
    const { themes, globalThemeKey } = useThemeStore();
    const formRef = useRef<HTMLFormElement>(null);
    const [timerType, setTimerType] = useState<TimerType>(initialTimerData?.type || TIMER_TYPE.BASE);

    const { isOpen, close } = useOverlay('timer-data', onClose);

    useEffect(() => {
        if (isOpen) {
            setTimerType(TIMER_TYPE.BASE);
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
            <CancelSaveTopBar
                title={mode === 'add' ? 'Add Timer' : `Edit ${TIMER_TYPE_CONFIG[timerType].label}`}
                onClose={close}
                onSave={handleSave}
            />

            {timerType === TIMER_TYPE.BASE && (
                <BaseTimerForm
                    ref={formRef}
                    initialData={initialTimerData}
                    mode={mode}
                    timerType={timerType}
                    setTimerType={setTimerType}
                    close={close}
                />
            )}
        </div>
    );
};

export default TimerDataOverlay;
