import React, { useEffect, useState } from 'react';
import { IoMdAdd, IoMdClose, IoMdFlash, IoMdSearch } from 'react-icons/io';
import { MdDeleteOutline, MdEdit, MdExpandMore, MdHourglassTop } from 'react-icons/md';
import { getCardSurface, getTextColor } from '../../../utils/colorUtils';
import { TIMER_TYPE, TIMER_TYPE_CONFIG, TimerType } from '../../../config/timer/type';
import { useOverlay } from '../../../hooks/useOverlay';
import { useBaseTimerStore } from '../../../store/baseTimerStore';
import { useRoutineTimerStore } from '../../../store/routineTimerStore';
import { useSelectedTimerStore } from '../../../store/selectedTimerStore';
import { useThemeStore } from '../../../store/themeStore';
import { TimerData } from '../../../store/types/timer';
import { getTimerPointColor } from '../../../utils/themeUtils';
import Button from '../../common/Button';
import TimerItemOverlay from './TimerItemOverlay';

const QUICK_TEMPLATES: {
  title: string;
  desc: string;
  badge: string;
  badgeColor: string;
  create: (pointColorIdx: number) => TimerData;
}[] = [
  {
    title: '🍅 Pomodoro 25/5',
    desc: '4x (25m Focus + 5m Break) + 20m Long Rest',
    badge: 'Pomodoro',
    badgeColor: 'bg-red-500/15 text-red-700 dark:text-red-300',
    create: (idx) => ({
      id: `routine_pomodoro_${Date.now()}`,
      type: TIMER_TYPE.ROUTINE,
      title: '🍅 Classic Pomodoro',
      pointColorIndex: idx,
      items: [
        { id: `p1_${Date.now()}`, type: TIMER_TYPE.BASE, title: 'Focus 1', time: 25, isMinutes: true, pointColorIndex: 7, interval: 5 },
        { id: `b1_${Date.now()}`, type: TIMER_TYPE.BASE, title: 'Short Break', time: 5, isMinutes: true, pointColorIndex: 3, interval: 5 },
        { id: `p2_${Date.now()}`, type: TIMER_TYPE.BASE, title: 'Focus 2', time: 25, isMinutes: true, pointColorIndex: 7, interval: 5 },
        { id: `b2_${Date.now()}`, type: TIMER_TYPE.BASE, title: 'Short Break', time: 5, isMinutes: true, pointColorIndex: 3, interval: 5 },
        { id: `p3_${Date.now()}`, type: TIMER_TYPE.BASE, title: 'Focus 3', time: 25, isMinutes: true, pointColorIndex: 7, interval: 5 },
        { id: `lb_${Date.now()}`, type: TIMER_TYPE.BASE, title: 'Long Break', time: 20, isMinutes: true, pointColorIndex: 2, interval: 5 },
      ],
    }),
  },
  {
    title: '⚡ Deep Focus 50/10',
    desc: '50m Deep Work + 10m Refresh Rest',
    badge: 'Deep Work',
    badgeColor: 'bg-blue-500/15 text-blue-700 dark:text-blue-300',
    create: (idx) => ({
      id: `routine_deep_${Date.now()}`,
      type: TIMER_TYPE.ROUTINE,
      title: '⚡ Deep Work Session',
      pointColorIndex: idx,
      items: [
        { id: `dw1_${Date.now()}`, type: TIMER_TYPE.BASE, title: 'Deep Focus', time: 50, isMinutes: true, pointColorIndex: 4, interval: 5 },
        { id: `dwb_${Date.now()}`, type: TIMER_TYPE.BASE, title: 'Rest & Stretch', time: 10, isMinutes: true, pointColorIndex: 1, interval: 5 },
      ],
    }),
  },
  {
    title: '💪 HIIT Workout 45/15',
    desc: '4 rounds of 45s Exercise + 15s Rest',
    badge: 'Workout',
    badgeColor: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
    create: (idx) => ({
      id: `routine_hiit_${Date.now()}`,
      type: TIMER_TYPE.ROUTINE,
      title: '💪 HIIT Workout',
      pointColorIndex: idx,
      items: Array.from({ length: 4 }, (_, i) => [
        { id: `ex_${i}_${Date.now()}`, type: TIMER_TYPE.BASE, title: `Exercise Round ${i + 1}`, time: 45, isMinutes: false, pointColorIndex: 7, interval: 3 },
        { id: `rst_${i}_${Date.now()}`, type: TIMER_TYPE.BASE, title: `Rest`, time: 15, isMinutes: false, pointColorIndex: 3, interval: 3 },
      ]).flat(),
    }),
  },
  {
    title: '☕ Power Nap 15m',
    desc: '15 minutes quick recharge',
    badge: 'Basic',
    badgeColor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
    create: (idx) => ({
      id: `base_nap_${Date.now()}`,
      type: TIMER_TYPE.BASE,
      title: '☕ Power Nap',
      time: 15,
      isMinutes: true,
      pointColorIndex: idx,
    }),
  },
];

const TimerListOverlay: React.FC = () => {
  const { selectedTheme, compColor } = useThemeStore();
  const selectTimer = useSelectedTimerStore((state) => state.selectTimer);
  const { timers: baseTimers, removeTimer: removeBaseTimer } = useBaseTimerStore();
  const { timers: routineTimers, removeTimer: removeRoutineTimer } = useRoutineTimerStore();

  const [targetTimer, setTargetTimer] = useState<TimerData | null>(null);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [initialTimerType, setInitialTimerType] = useState<TimerType>(TIMER_TYPE.BASE);
  const [activeTab, setActiveTab] = useState<'all' | 'base' | 'routine'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(true);

  const { isOpen, close } = useOverlay('timer-list');

  const timers = [...baseTimers, ...routineTimers];
  const filteredTimers = timers
    .filter((t) => {
      if (activeTab === 'base') return t.type === TIMER_TYPE.BASE;
      if (activeTab === 'routine') return t.type === TIMER_TYPE.ROUTINE;
      return true;
    })
    .filter((t) => {
      if (!searchQuery.trim()) return true;
      return t.title.toLowerCase().includes(searchQuery.toLowerCase());
    });

  const handleSelectTimer = (timerId: string) => {
    selectTimer(timerId);
    close();
  };

  useEffect(() => {
    if (isOpen) setIsTemplatesOpen(timers.length === 0);
  }, [isOpen]);

  const openOverlay = (timer?: TimerData, nextMode: 'add' | 'edit' = timer ? 'edit' : 'add') => {
    setTargetTimer(timer || null);
    setMode(nextMode);
    setInitialTimerType(activeTab === 'routine' ? TIMER_TYPE.ROUTINE : TIMER_TYPE.BASE);
    window.location.hash = 'timer-list&timer-item';
  };

  const closeOverlay = () => {
    setTargetTimer(null);
  };

  const getTimerIcon = (timer: TimerData) => {
    const config = TIMER_TYPE_CONFIG[timer.type];
    const Icon = config.icon;

    const commonProps = {
      size: 46,
      className: 'rounded-full shrink-0 drop-shadow-sm',
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

  const handleCustomizeTemplate = (tpl: (typeof QUICK_TEMPLATES)[0]) => openOverlay(tpl.create(4), 'add');

  if (!isOpen) return null;

  const { cardBg, cardBorder } = getCardSurface(
    selectedTheme.color.main,
    selectedTheme.color.sub,
    selectedTheme.color.point
  );
  const isDark = getTextColor(selectedTheme.color.main) === 'white';

  return (
    <>
      {/* Responsive Backdrop (Desktop: Centered Modal, Mobile: Fullscreen) */}
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-md p-0 md:p-6 lg:p-10 animate-fade-in">
        {/* Main Dialog Window */}
        <div
          className="relative flex flex-col size-full md:max-w-4xl md:max-h-[90vh] md:rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-scale-up"
          style={{
            backgroundColor: selectedTheme.color.main,
            color: compColor,
          }}
        >
          {/* Header */}
          <div
            className="flex h-16 shrink-0 items-center justify-between px-6 shadow-sm border-b border-white/10"
            style={{ backgroundColor: selectedTheme.color.point }}
          >
            <div className="flex items-center gap-3 text-white">
              <h2 className="text-xl font-bold font-display tracking-tight">Timer Presets & Routines</h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={close}
                aria-label="Close"
                className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <IoMdClose size={26} />
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="p-4 sm:p-5 pb-3 border-b border-black/5 dark:border-white/5 space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Category Segmented Control */}
              <div
                className="relative grid w-full grid-cols-3 rounded-2xl p-1 sm:w-[17.5rem]"
                style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.07)' }}
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-xl bg-white/95 shadow-sm transition-transform duration-200 ease-out ${
                    activeTab === 'all'
                      ? 'translate-x-0'
                      : activeTab === 'base'
                        ? 'translate-x-full'
                        : 'translate-x-[200%]'
                  }`}
                />
                {(['all', 'base', 'routine'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="relative z-10 rounded-xl px-3 py-2 text-center text-xs transition-colors sm:px-4 sm:text-sm"
                    style={{
                      color: activeTab === tab ? selectedTheme.color.point : compColor,
                      fontWeight: activeTab === tab ? 700 : 500,
                      opacity: activeTab === tab ? 1 : 0.65,
                    }}
                  >
                    {tab === 'all' ? 'All' : tab === 'base' ? 'Basic' : 'Routine'}
                  </button>
                ))}
              </div>

              {/* Search Bar & Mobile Actions */}
              <div className="flex items-center gap-2 flex-1 sm:max-w-xs">
                <div className="relative flex-1">
                  <IoMdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg opacity-50" style={{ color: compColor }} />
                  <input
                    type="text"
                    placeholder="Search timers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderColor: 'rgba(0,0,0,0.09)',
                      color: '#1A1A1A',
                    }}
                  />
                </div>

                {/* Desktop Create Button */}
                <button
                  onClick={() => openOverlay()}
                  className="hidden sm:flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white shadow-soft transition-transform active:scale-95 shrink-0"
                  style={{ backgroundColor: selectedTheme.color.point }}
                >
                  <IoMdAdd size={20} />
                  <span>New</span>
                </button>
              </div>
            </div>
          </div>

          {/* Scrollable Gallery Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 no-scrollbar space-y-6">
            {/* Quick 1-Click Templates */}
            {!searchQuery && (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setIsTemplatesOpen((open) => !open)}
                  aria-expanded={isTemplatesOpen}
                  className="flex w-full items-center justify-between rounded-xl px-1 py-1 text-xs font-bold uppercase tracking-wider opacity-80 transition-opacity hover:opacity-100"
                >
                  <span className="flex items-center gap-1.5">
                    <IoMdFlash className="text-amber-500 text-base" />
                    Popular Preset Templates
                  </span>
                  <MdExpandMore className={`text-lg transition-transform ${isTemplatesOpen ? 'rotate-180' : ''}`} />
                </button>
                {isTemplatesOpen && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {QUICK_TEMPLATES.map((tpl, i) => (
                    <button
                      key={i}
                      onClick={() => handleCustomizeTemplate(tpl)}
                      className="btn-tactile group text-left p-4 rounded-2xl border shadow-soft hover:shadow-dial transition-all flex flex-col justify-between"
                      style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.09)', color: '#1A1A1A' }}
                    >
                      <div>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${tpl.badgeColor}`}>
                          {tpl.badge}
                        </span>
                        <h4 className="font-bold text-sm sm:text-base mt-2 group-hover:underline">{tpl.title}</h4>
                        <p className="text-xs opacity-70 mt-1 line-clamp-2 leading-relaxed">{tpl.desc}</p>
                      </div>
                      <div
                        className="flex items-center gap-1 text-xs font-bold mt-3.5 pt-2 border-t"
                        style={{ color: selectedTheme.color.point, borderColor: cardBorder }}
                      >
                        <MdEdit size={16} /> Customize Template
                      </div>
                    </button>
                  ))}
                </div>}
              </div>
            )}

            {/* User Timers Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                  Your Timers ({filteredTimers.length})
                </span>
              </div>

              {filteredTimers.length === 0 ? (
                <div className="p-10 text-center rounded-3xl border border-dashed space-y-3" style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.12)', color: '#1A1A1A' }}>
                  <MdHourglassTop className="mx-auto text-4xl opacity-40" />
                  <h4 className="font-bold text-base">No timers found</h4>
                  <p className="text-xs opacity-70 max-w-sm mx-auto">
                    {searchQuery
                      ? 'No results match your search query.'
                      : 'Create your first custom basic timer or routine timer to get started.'}
                  </p>
                  <button
                    onClick={() => openOverlay()}
                    className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-soft"
                    style={{ backgroundColor: selectedTheme.color.point }}
                  >
                    <IoMdAdd size={16} /> Create Timer
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {filteredTimers.map((timer: TimerData) => (
                    <div
                      key={timer.id}
                      onClick={() => handleSelectTimer(timer.id)}
                      className="btn-tactile group flex cursor-pointer items-center gap-3 rounded-2xl border p-4 shadow-soft transition-all hover:shadow-dial"
                      style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.09)', color: '#1A1A1A' }}
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3.5">
                        <div className="group-hover:scale-105 transition-transform">{getTimerIcon(timer)}</div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-base line-clamp-1 group-hover:underline">
                            {timer.title || 'Untitled Timer'}
                          </h4>
                          <div className="text-xs opacity-75 mt-0.5 flex items-center gap-2">
                            <span className="font-semibold">
                              {timer.type === TIMER_TYPE.BASE
                                ? `${timer.time} ${timer.isMinutes ? 'min' : 'sec'}`
                                : `${timer.items.length} steps (${timer.items
                                    .reduce(
                                      (acc, it) => acc + (it.isMinutes ? it.time : Math.round(it.time / 60)),
                                      0
                                    )}m total)`}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleEditTimer(e, timer)}
                          aria-label="Edit Timer"
                          className="rounded-xl border p-2 opacity-70 transition-colors hover:opacity-100"
                          style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.09)', color: '#1A1A1A' }}
                        >
                          <MdEdit size={18} />
                        </button>
                        <button
                          onClick={(e) => handleDeleteTimer(e, timer)}
                          aria-label="Delete Timer"
                          className="rounded-xl p-2 text-red-500 opacity-75 transition-colors hover:bg-red-500/20 hover:opacity-100"
                        >
                          <MdDeleteOutline size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Bottom Bar */}
          <div className="sm:hidden p-4 border-t border-black/10 dark:border-white/10">
            <Button
              currentTheme={selectedTheme}
              onClick={() => openOverlay()}
              aria-label="Create Custom Timer"
              className="h-12 w-full rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-float"
            >
              <IoMdAdd size={24} />
              <span>Create New Timer</span>
            </Button>
          </div>
        </div>
      </div>

      <TimerItemOverlay
        initialTimerData={targetTimer}
        initialTimerType={initialTimerType}
        onClose={closeOverlay}
        mode={mode}
      />
    </>
  );
};

export default TimerListOverlay;
