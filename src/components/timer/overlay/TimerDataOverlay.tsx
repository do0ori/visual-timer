import { useEffect, useState } from 'react';
import { MdOutlinePalette, MdOutlineTimer, MdTextFields } from 'react-icons/md';
import useOverlay from '../../../hooks/useOverlay';
import { TimerData, useMainTimerStore } from '../../../store/mainTimerStore';
import { useThemeStore } from '../../../store/themeStore';
import { deepCopy } from '../../../utils/deepCopy';
import { getTimerPointColor } from '../../../utils/themeUtils';
import CancelSaveTopBar from '../../navigation/CancelSaveTopBar';
import TimeSelector from '../../selector/TimeSelector';
import TimeDisplay from '../display/TimeDisplay';

type TimerOverlayProps = {
    initialTimerData: TimerData | null;
    mode: 'add' | 'edit';
    onClose: () => void;
};

const TimerDataOverlay: React.FC<TimerOverlayProps> = ({ initialTimerData, mode, onClose }) => {
    const { themes, globalThemeKey } = useThemeStore();
    const originalTheme = themes[globalThemeKey];

    const { addTimer, updateTimer } = useMainTimerStore();
    const [title, setTitle] = useState(initialTimerData?.title || '');
    const [pointColorIndex, setPointColorIndex] = useState(initialTimerData?.pointColorIndex || 0);
    const [isMinutes, setIsMinutes] = useState(initialTimerData?.isMinutes || false);
    const [time, setTime] = useState(initialTimerData?.time || 5);

    const currentTheme = deepCopy(themes[globalThemeKey]);
    currentTheme.color.point = getTimerPointColor(currentTheme, pointColorIndex);

    const { isOpen, close } = useOverlay('timer-data', onClose);

    // Update form values if the initialTimerData changes (e.g., switching between edit targets)
    useEffect(() => {
        if (initialTimerData) {
            setTitle(initialTimerData.title || '');
            setPointColorIndex(initialTimerData.pointColorIndex || 0);
            setIsMinutes(initialTimerData.isMinutes || false);
            setTime(initialTimerData.time || 5);
        } else {
            // Reset fields for a new timer
            setTitle('');
            setPointColorIndex(0);
            setIsMinutes(false);
            setTime(5);
        }
    }, [initialTimerData]);

    const resetFields = () => {
        setTitle('');
        setPointColorIndex(0);
        setIsMinutes(false);
        setTime(5);
    };

    const handleSave = () => {
        const finalTitle = title.trim() || `Timer-${time}`;

        if (initialTimerData) {
            updateTimer(initialTimerData.id, { title: finalTitle, pointColorIndex, isMinutes, time });
        } else {
            addTimer({
                id: Date.now().toString(),
                title: finalTitle,
                pointColorIndex,
                isMinutes,
                time,
                isRunning: false,
            });
        }
        resetFields();
        close();
    };

    const handleCancel = () => {
        resetFields();
        close();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex size-full"
            style={{
                backgroundColor: originalTheme.color.main,
            }}
        >
            <CancelSaveTopBar
                title={mode === 'edit' ? 'Edit Timer' : 'Add New Timer'}
                onClose={handleCancel}
                onSave={handleSave}
            />

            <div className="w-full p-5 pt-20">
                <div className="flex h-full max-h-[calc(100vh-6.25rem)] flex-col space-y-7 overflow-y-auto no-scrollbar">
                    <label className="flex items-center gap-8">
                        <MdTextFields size={30} />
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded border px-2 py-1 text-black"
                            placeholder="New Timer"
                        />
                    </label>
                    <label className="flex items-center gap-8">
                        <MdOutlinePalette size={30} />
                        <div className="flex flex-wrap gap-3">
                            {currentTheme.color.pointOptions.map((color, index) => (
                                <button
                                    key={index}
                                    className={`size-10 rounded-full border-2 transition-all ${
                                        pointColorIndex === index
                                            ? 'scale-110 border-white'
                                            : 'border-transparent hover:scale-105'
                                    }`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setPointColorIndex(index)}
                                />
                            ))}
                        </div>
                    </label>
                    <label className="flex items-center gap-8">
                        <MdOutlineTimer size={30} />
                        <div className="flex gap-5">
                            <TimeDisplay
                                className="pointer-events-none w-10 text-center text-xl"
                                currentTime={time.toString()}
                            />
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

export default TimerDataOverlay;
