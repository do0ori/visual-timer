import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';
import { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { MdDeleteOutline, MdDragIndicator, MdExpandMore, MdOutlineHourglassEmpty, MdOutlinePalette, MdOutlineTimer } from 'react-icons/md';
import { useAutoScroll } from '../../../../hooks/useAutoScroll';
import { Theme } from '../../../../store/types/theme';
import { getTimerPointColor } from '../../../../utils/themeUtils';
import { BaseTimerIcon } from '../../../icons';
import TimeDisplay from '../../shared/displays/TimeDisplay';
import PointColorSelector from '../fields/PointColorSelector';
import TimeSelector from '../fields/TimeSelector';
import TimerUnitSelector from '../fields/TimerUnitSelector';
import { RoutineTimerFormData } from './RoutineTimerForm';

type RoutineTimerItemFormProps = {
  index: number;
  currentTheme: Theme;
  dragHandleProps?: DraggableProvidedDragHandleProps;
  register: UseFormRegister<RoutineTimerFormData>;
  setValue: UseFormSetValue<RoutineTimerFormData>;
  watch: UseFormWatch<RoutineTimerFormData>;
  isOpen: boolean;
  onToggle: () => void;
  onDelete: () => void;
};

const RoutineTimerItemForm = ({
  index,
  currentTheme,
  dragHandleProps,
  register,
  setValue,
  watch,
  isOpen,
  onToggle,
  onDelete,
}: RoutineTimerItemFormProps) => {
  const item = watch(`items.${index}`);
  const pointColor = getTimerPointColor(currentTheme, item.pointColorIndex);
  const stepTheme = { ...currentTheme, color: { ...currentTheme.color, point: pointColor } };
  const containerRef = useAutoScroll<HTMLDivElement>(isOpen);
  const duration = `${item.time} ${item.isMinutes ? 'min' : 'sec'}`;
  const alarm = item.interval > 0 ? `${item.interval}s alarm` : 'No alarm';

  return (
    <div ref={containerRef}>
      <div
        className="overflow-hidden rounded-2xl border shadow-soft transition-colors"
        style={{
          backgroundColor: '#FFFFFF',
          borderColor: isOpen ? pointColor : 'rgba(0,0,0,0.09)',
          color: '#1A1A1A',
          boxShadow: isOpen ? `0 0 0 2px ${pointColor}30` : undefined,
        }}
      >
        <div className="flex items-center gap-2 p-3 sm:p-3.5">
          <button
            type="button"
            {...dragHandleProps}
            aria-label={`Reorder step ${index + 1}`}
            className="shrink-0 rounded-xl p-2 text-zinc-400 transition-colors hover:bg-black/5 hover:text-zinc-700 cursor-grab active:cursor-grabbing"
          >
            <MdDragIndicator size={20} />
          </button>

          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isOpen}
            className="flex min-w-0 flex-1 items-center gap-3 text-left"
          >
            <span
              className="flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-black"
              style={{ backgroundColor: `${pointColor}20`, color: pointColor }}
            >
              {index + 1}
            </span>
            <BaseTimerIcon size={28} time={item.time} stroke={pointColor} className="shrink-0" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold">{item.title || `Timer ${index + 1}`}</span>
              <span className="mt-0.5 block text-xs text-zinc-500">
                {duration} · {alarm}
              </span>
            </span>
            <MdExpandMore
              size={22}
              className={`shrink-0 text-zinc-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>

          <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete step ${index + 1}`}
            className="shrink-0 rounded-xl p-2 text-red-500 transition-colors hover:bg-red-500/10"
          >
            <MdDeleteOutline size={20} />
          </button>
        </div>

        {isOpen && (
          <div className="space-y-5 border-t border-black/5 px-4 pb-5 pt-4 sm:px-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Step name</label>
              <input
                {...register(`items.${index}.title`)}
                placeholder={`Step ${index + 1}`}
                className="w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm font-semibold text-zinc-900 outline-none transition-shadow focus:ring-2"
                style={{ '--tw-ring-color': `${pointColor}66` } as React.CSSProperties}
                onBlur={(event) => setValue(`items.${index}.title`, event.target.value.trim())}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500">
                <MdOutlineTimer className="text-base" /> Duration
              </label>
              <div className="flex flex-wrap items-center gap-3 rounded-xl bg-black/[0.03] p-3">
                <TimeDisplay className="pointer-events-none w-12 text-center text-xl font-bold" currentTime={item.time.toString()} />
                <div className="min-w-44 flex-1">
                  <TimerUnitSelector
                    isMinutes={item.isMinutes}
                    onChange={(nextIsMinutes) => setValue(`items.${index}.isMinutes`, nextIsMinutes)}
                  />
                </div>
              </div>
              <TimeSelector time={item.time} currentTheme={stepTheme} setTime={(time) => setValue(`items.${index}.time`, time)} text={item.title} />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500">
                <MdOutlinePalette className="text-base" /> Step color
              </label>
              <PointColorSelector
                colors={currentTheme.color.pointOptions}
                selectedIndex={item.pointColorIndex}
                onSelect={(colorIndex) => setValue(`items.${index}.pointColorIndex`, colorIndex)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 rounded-xl bg-black/[0.03] p-3 text-sm text-zinc-700">
              <MdOutlineHourglassEmpty size={20} style={{ color: pointColor }} />
              <span className="font-semibold">Alarm for</span>
              <input
                type="number"
                min="0"
                {...register(`items.${index}.interval`, { valueAsNumber: true })}
                className="w-16 rounded-lg border border-black/10 bg-white px-2 py-1.5 text-center font-bold text-zinc-900 outline-none focus:ring-2"
                style={{ '--tw-ring-color': `${pointColor}66` } as React.CSSProperties}
              />
              <span>seconds</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutineTimerItemForm;
