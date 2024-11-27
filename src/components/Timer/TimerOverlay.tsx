import { useState, useEffect } from 'react';
import { useThemeStore } from '../../store/themeStore';
import { MainTimerData, useMainTimerStore } from '../../store/mainTimerStore';
import { MdTextFields, MdOutlinePalette, MdOutlineTimer } from 'react-icons/md';
import TimerTopBar from '../Navigation/TimerTopBar';
import { deepCopy } from '../../utils/deepCopy';
import TimeSelector from '../Selector/TimeSelector';

interface TimerOverlayProps {
    isOpen: boolean;
    initialTimerData: MainTimerData | null;
    onClose: () => void;
    mode: 'add' | 'edit';
}

const TimerOverlay: React.FC<TimerOverlayProps> = ({ isOpen, initialTimerData, onClose, mode }) => {
    const { themes, globalThemeKey } = useThemeStore();
    const originalTheme = themes[globalThemeKey];

    const { addTimer, updateTimer } = useMainTimerStore();
    const [title, setTitle] = useState(initialTimerData?.title || '');
    const [pointColor, setPointColor] = useState(initialTimerData?.pointColor || originalTheme.color.point);
    const [isMinutes, setIsMinutes] = useState(initialTimerData?.isMinutes || false);
    const [time, setTime] = useState(initialTimerData?.time || 5);

    const currentTheme = deepCopy(themes[globalThemeKey]);
    currentTheme.color.point = pointColor;

    // Update form values if the initialTimerData changes (e.g., switching between edit targets)
    useEffect(() => {
        if (initialTimerData) {
            setTitle(initialTimerData.title || '');
            setPointColor(initialTimerData.pointColor || currentTheme.color.point);
            setIsMinutes(initialTimerData.isMinutes || false);
            setTime(initialTimerData.time || 5);
        } else {
            // Reset fields for a new timer
            setTitle('');
            setPointColor(originalTheme.color.point);
            setIsMinutes(false);
            setTime(5);
        }
    }, [initialTimerData]);

    const resetFields = () => {
        setTitle('');
        setPointColor(originalTheme.color.point);
        setIsMinutes(false);
        setTime(5);
    };

    const handleSave = () => {
        const finalTitle = title.trim() || `Timer-${time}`;

        if (initialTimerData) {
            updateTimer(initialTimerData.id, { title: finalTitle, pointColor, isMinutes, time });
        } else {
            addTimer({
                id: Date.now().toString(),
                title: finalTitle,
                pointColor,
                isMinutes,
                time,
                isRunning: false,
            });
        }
        resetFields();
        onClose();
    };

    const handleCancel = () => {
        resetFields();
        onClose();
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex ${isOpen ? 'translate-x-0' : 'translate-x-full'} h-full w-full`}
            style={{
                backgroundColor: currentTheme.color.main,
            }}
        >
            <TimerTopBar
                title={mode === 'edit' ? 'Edit Timer' : 'Add New Timer'}
                onClose={handleCancel}
                onSave={handleSave}
            />

            <div className="w-full p-5 pt-16">
                <div className="mt-6 flex h-full flex-col space-y-7">
                    <label className="flex items-center gap-8">
                        <MdTextFields size={30} />
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded border px-2 py-1"
                            placeholder="New Timer"
                        />
                    </label>
                    <label className="flex items-center gap-8">
                        <MdOutlinePalette size={30} />
                        <input
                            type="color"
                            value={pointColor}
                            onChange={(e) => {
                                setPointColor(e.target.value);
                                currentTheme.color.point = e.target.value;
                            }}
                            className="color-picker w-full rounded"
                        />
                    </label>
                    <label className="flex items-center gap-8">
                        <MdOutlineTimer size={30} />
                        <div className="flex gap-5">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="timeUnit"
                                    value="minutes"
                                    checked={isMinutes}
                                    onChange={() => setIsMinutes(true)}
                                    className="form-radio"
                                    style={{
                                        accentColor: originalTheme.color.point,
                                    }}
                                />
                                <span>Min</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="timeUnit"
                                    value="seconds"
                                    checked={!isMinutes}
                                    onChange={() => setIsMinutes(false)}
                                    className="form-radio"
                                    style={{
                                        accentColor: originalTheme.color.point,
                                    }}
                                />
                                <span>Sec</span>
                            </label>
                        </div>
                    </label>
                    <label className="flex grow items-center justify-center">
                        <TimeSelector time={time} currentTheme={currentTheme} setTime={setTime} />
                    </label>
                </div>
            </div>
        </div>
    );
};

export default TimerOverlay;