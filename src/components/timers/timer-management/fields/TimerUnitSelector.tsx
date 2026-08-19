type TimerUnitSelectorProps = {
  isMinutes: boolean;
  onChange: (isMinutes: boolean) => void;
};

const TimerUnitSelector: React.FC<TimerUnitSelectorProps> = ({ isMinutes, onChange }) => (
  <div className="relative grid grid-cols-2 rounded-xl bg-black/5 p-1 dark:bg-white/10">
    <span
      aria-hidden="true"
      className={`absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-lg bg-white shadow-soft transition-transform duration-200 ease-out ${
        isMinutes ? 'translate-x-0' : 'translate-x-full'
      }`}
    />
    <button
      type="button"
      onClick={() => onChange(true)}
      aria-pressed={isMinutes}
      className={`relative z-10 py-2 text-xs font-bold transition-colors ${isMinutes ? 'text-gray-900' : 'opacity-70'}`}
    >
      Minutes (min)
    </button>
    <button
      type="button"
      onClick={() => onChange(false)}
      aria-pressed={!isMinutes}
      className={`relative z-10 py-2 text-xs font-bold transition-colors ${!isMinutes ? 'text-gray-900' : 'opacity-70'}`}
    >
      Seconds (sec)
    </button>
  </div>
);

export default TimerUnitSelector;
