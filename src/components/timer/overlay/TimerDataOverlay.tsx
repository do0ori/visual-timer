import { useEffect, useState } from 'react';
import { TIMER_TYPE, TIMER_TYPE_CONFIG, TimerType } from '../../../config/timer/type';
import useOverlay from '../../../hooks/useOverlay';
import { useBaseTimerStore } from '../../../store/baseTimerStore';
import { useThemeStore } from '../../../store/themeStore';
import { BaseTimerData } from '../../../store/types/timer';
import CancelSaveTopBar from '../../navigation/CancelSaveTopBar';
import TimerTypeSelector from '../../selector/TimerTypeSelector';
import BaseTimerForm from '../form/BaseTimerForm';

type TimerDataOverlayProps = {
    initialTimerData: BaseTimerData | null;
    mode: 'add' | 'edit';
    onClose: () => void;
};

const TimerDataOverlay: React.FC<TimerDataOverlayProps> = ({ initialTimerData, mode, onClose }) => {
    const { themes, globalThemeKey } = useThemeStore();
    const { addTimer, updateTimer } = useBaseTimerStore();
    const { isOpen, close } = useOverlay('timer-data', onClose);

    const [timerType, setTimerType] = useState<TimerType>(initialTimerData?.type || TIMER_TYPE.BASE);
    const [formData, setFormData] = useState<Partial<BaseTimerData>>(initialTimerData || {});

    useEffect(() => {
        if (initialTimerData) {
            setTimerType(initialTimerData.type);
            setFormData(initialTimerData);
        }
    }, [initialTimerData]);

    const handleSave = () => {
        if (timerType === TIMER_TYPE.BASE) {
            const timerData: BaseTimerData = {
                id: initialTimerData?.id || crypto.randomUUID(),
                type: TIMER_TYPE.BASE,
                ...formData,
                time: formData.time || 5,
                isMinutes: formData.isMinutes || false,
                isRunning: false,
            };

            if (mode === 'add') {
                addTimer(timerData);
            } else {
                updateTimer(timerData.id, timerData);
            }
        }
        close();
    };

    if (!isOpen) return null;

    return (
        <div
            className="absolute inset-0 z-40 size-full shadow-lg"
            style={{
                backgroundColor: themes[globalThemeKey].color.main,
                outline: `2px solid ${themes[globalThemeKey].color.sub}33`,
            }}
        >
            <CancelSaveTopBar
                title={mode === 'add' ? 'Add Timer' : `Edit ${TIMER_TYPE_CONFIG[timerType].label}`}
                onClose={close}
                onSave={handleSave}
            />

            <div className="flex w-full flex-col gap-4 p-5 pt-20">
                {mode === 'add' && <TimerTypeSelector selectedType={timerType} onTypeSelect={setTimerType} />}

                {timerType === TIMER_TYPE.BASE && (
                    <BaseTimerForm
                        initialData={formData}
                        onSubmit={(newData) => setFormData({ ...formData, ...newData })}
                    />
                )}
            </div>
        </div>
    );
};

export default TimerDataOverlay;
