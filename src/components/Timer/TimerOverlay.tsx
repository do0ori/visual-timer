import { useState, useEffect } from 'react';
import { MainTimerData, useMainTimerStore } from '../../store/mainTimerStore';
import { MdTextFields, MdOutlinePalette, MdOutlineTimer } from 'react-icons/md';
import TimerTopBar from '../Navigation/TimerTopBar';
import { useThemeStore } from '../../store/themeStore';

interface TimerOverlayProps {
    isOpen: boolean;
    initialTimerData: MainTimerData | null;
    onClose: () => void;
    mode: 'add' | 'edit';
}

const TimerOverlay: React.FC<TimerOverlayProps> = ({ isOpen, initialTimerData, onClose, mode }) => {
    const { themes, globalThemeKey } = useThemeStore();
    const currentTheme = themes[globalThemeKey];
    const { addTimer, updateTimer } = useMainTimerStore();
    const [title, setTitle] = useState(initialTimerData?.title || '');
    const [pointColor, setPointColor] = useState(initialTimerData?.pointColor || '#000000');
    const [isMinutes, setIsMinutes] = useState(initialTimerData?.isMinutes || false);
    const [time, setTime] = useState(initialTimerData?.time || 1);

    // Update form values if the initialTimerData changes (e.g., switching between edit targets)
    useEffect(() => {
        if (initialTimerData) {
            setTitle(initialTimerData.title || '');
            setPointColor(initialTimerData.pointColor || '#000000');
            setIsMinutes(initialTimerData.isMinutes || false);
            setTime(initialTimerData.time || 1);
        } else {
            // Reset fields for a new timer
            setTitle('');
            setPointColor('#000000');
            setIsMinutes(false);
            setTime(1);
        }
    }, [initialTimerData]);

    const resetFields = () => {
        setTitle('');
        setPointColor('#000000');
        setIsMinutes(false);
        setTime(1);
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
            className={`fixed inset-0 z-50 flex transition-transform duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'} h-full w-full`}
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
                <div className="mt-6 flex flex-col space-y-5">
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
                            onChange={(e) => setPointColor(e.target.value)}
                            className="w-full rounded"
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
                                />
                                <span>Sec</span>
                            </label>
                        </div>
                    </label>
                    {/* TODO: TimerDisplay 개조해서 드래그앤클릭으로 시간 지정하도록 */}
                    <label>
                        Time (1-60):
                        <input
                            type="number"
                            min="1"
                            max="60"
                            value={time}
                            onChange={(e) => setTime(Number(e.target.value))}
                            className="w-full rounded border px-2 py-1"
                        />
                    </label>
                </div>
            </div>
        </div>
    );
};

export default TimerOverlay;
