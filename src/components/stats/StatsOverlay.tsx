import React, { useRef, useState } from 'react';
import { IoIosShareAlt, IoMdClose, IoMdFlame, IoMdTime } from 'react-icons/io';
import { MdCheckCircle, MdDeleteOutline, MdTrendingUp, MdWorkspacePremium } from 'react-icons/md';
import { useOverlay } from '../../hooks/useOverlay';
import { useStatsStore } from '../../store/statsStore';
import { useThemeStore } from '../../store/themeStore';
import Button from '../common/Button';

export const StatsOverlay: React.FC = () => {
  const { selectedTheme, compColor } = useThemeStore();
  const { sessions, getTodayMinutes, getWeeklyMinutes, getStreakDays, clearHistory } = useStatsStore();
  const { isOpen, close } = useOverlay('stats');

  const [isGeneratingShare, setIsGeneratingShare] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const todayMinutes = getTodayMinutes();
  const weeklyMinutes = getWeeklyMinutes();
  const streakDays = getStreakDays();

  const formatHoursMins = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hours === 0) return `${mins}m`;
    return `${hours}h ${mins}m`;
  };

  const handleShareCard = async () => {
    setIsGeneratingShare(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1080;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Background Gradient
      const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
      gradient.addColorStop(0, selectedTheme.color.main);
      gradient.addColorStop(1, selectedTheme.color.sub);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1080);

      // Card Container
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
      ctx.shadowBlur = 40;
      ctx.shadowOffsetY = 20;
      ctx.beginPath();
      ctx.roundRect(90, 90, 900, 900, 48);
      ctx.fill();
      ctx.shadowColor = 'transparent';

      // Header App Title
      ctx.fillStyle = selectedTheme.color.point;
      ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⏰ MELLOW VISUAL TIMER', 540, 190);

      // Date
      ctx.fillStyle = '#666666';
      ctx.font = '500 28px "Plus Jakarta Sans", sans-serif';
      const dateStr = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      ctx.fillText(dateStr, 540, 240);

      // Decorative Dial Arc
      ctx.lineWidth = 24;
      ctx.strokeStyle = '#F0F0F0';
      ctx.beginPath();
      ctx.arc(540, 470, 150, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.strokeStyle = selectedTheme.color.point;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(540, 470, 150, -Math.PI / 2, Math.PI * 0.9);
      ctx.stroke();

      // Big Time Number inside Dial
      ctx.fillStyle = '#1A1A1A';
      ctx.font = 'bold 72px "Outfit", sans-serif';
      ctx.fillText(formatHoursMins(todayMinutes), 540, 465);

      ctx.fillStyle = '#888888';
      ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('TODAY FOCUSED', 540, 510);

      // Streak & Weekly Stat Pills
      ctx.fillStyle = '#FFF5EB';
      ctx.beginPath();
      ctx.roundRect(160, 670, 360, 100, 24);
      ctx.fill();
      ctx.fillStyle = '#E65100';
      ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`🔥 ${streakDays} Day Streak`, 340, 730);

      ctx.fillStyle = '#F0F9FF';
      ctx.beginPath();
      ctx.roundRect(560, 670, 360, 100, 24);
      ctx.fill();
      ctx.fillStyle = '#0284C7';
      ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`📊 ${formatHoursMins(weeklyMinutes)} This Week`, 740, 730);

      // Motivational Quote
      ctx.fillStyle = '#444444';
      ctx.font = 'italic 500 28px "Plus Jakarta Sans", sans-serif';
      const quote = selectedTheme.text.replace(/\n/g, ' ');
      ctx.fillText(`"${quote}"`, 540, 840);

      // Branding Footer
      ctx.fillStyle = '#999999';
      ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('visual-timer • do0ori.github.io/visual-timer', 540, 930);

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `visual-timer-focus-${new Date().toISOString().split('T')[0]}.png`, {
          type: 'image/png',
        });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'Mellow Visual Timer Focus',
              text: `I focused for ${formatHoursMins(todayMinutes)} today with Mellow Visual Timer! 🎯🔥`,
            });
            return;
          } catch {
            // fallback
          }
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mellow-focus-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (err) {
      console.error('Error generating share card:', err);
    } finally {
      setIsGeneratingShare(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-0 md:p-6 lg:p-10 animate-fade-in">
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
          <div className="flex items-center gap-2.5 text-white">
            <MdWorkspacePremium size={24} />
            <h2 className="text-xl font-bold font-display tracking-tight">Focus Stats & Achievement</h2>
          </div>
          <button
            onClick={close}
            aria-label="Close"
            className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <IoMdClose size={26} />
          </button>
        </div>

        {/* Content Body with 2-Column Desktop Grid */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 no-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left Column: Share Card Studio */}
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider opacity-75">
                Daily SNS Share Card (Instagram / Twitter)
              </span>

              <div
                ref={shareCardRef}
                className="p-6 rounded-3xl shadow-dial border border-white/40 flex flex-col items-center text-center space-y-4"
                style={{ backgroundColor: '#FFFFFF', color: '#1A1A1A' }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">✨</span>
                  <h3 className="font-bold text-lg font-display" style={{ color: selectedTheme.color.point }}>
                    Daily Achievement Card
                  </h3>
                </div>

                <div className="py-2">
                  <div className="text-5xl font-black font-display tracking-tight">
                    {formatHoursMins(todayMinutes)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 font-medium">Total focus time logged today</p>
                </div>

                <div className="grid grid-cols-2 gap-2 w-full">
                  <div className="p-2.5 rounded-2xl bg-orange-50 text-orange-700 text-center font-bold text-xs">
                    🔥 {streakDays} Day Streak
                  </div>
                  <div className="p-2.5 rounded-2xl bg-sky-50 text-sky-700 text-center font-bold text-xs">
                    📊 {formatHoursMins(weeklyMinutes)} This Week
                  </div>
                </div>

                <div className="w-full bg-gray-50 rounded-2xl p-3 text-xs italic text-gray-600">
                  "{selectedTheme.text.replace(/\n/g, ' ')}"
                </div>

                <Button
                  currentTheme={selectedTheme}
                  onClick={handleShareCard}
                  disabled={isGeneratingShare}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-soft"
                >
                  <IoIosShareAlt size={20} />
                  <span>{isGeneratingShare ? 'Rendering High-Res Card...' : 'Download & Share Card'}</span>
                </Button>
              </div>
            </div>

            {/* Right Column: Statistics & Session History */}
            <div className="space-y-6">
              {/* Metric KPI Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div
                  className="flex flex-col items-center justify-center p-4 rounded-2xl shadow-soft"
                  style={{ backgroundColor: `${selectedTheme.color.sub}44` }}
                >
                  <IoMdTime className="text-2xl mb-1" style={{ color: selectedTheme.color.point }} />
                  <span className="text-2xl font-bold font-display">{formatHoursMins(todayMinutes)}</span>
                  <span className="text-xs opacity-75 mt-1 font-medium">Today</span>
                </div>

                <div
                  className="flex flex-col items-center justify-center p-4 rounded-2xl shadow-soft"
                  style={{ backgroundColor: `${selectedTheme.color.sub}44` }}
                >
                  <IoMdFlame className="text-2xl mb-1 text-orange-500" />
                  <span className="text-2xl font-bold font-display">{streakDays}</span>
                  <span className="text-xs opacity-75 mt-1 font-medium">Day Streak</span>
                </div>

                <div
                  className="flex flex-col items-center justify-center p-4 rounded-2xl shadow-soft"
                  style={{ backgroundColor: `${selectedTheme.color.sub}44` }}
                >
                  <MdTrendingUp className="text-2xl mb-1 text-sky-500" />
                  <span className="text-2xl font-bold font-display">{formatHoursMins(weeklyMinutes)}</span>
                  <span className="text-xs opacity-75 mt-1 font-medium">7 Days</span>
                </div>
              </div>

              {/* Sessions History List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="font-bold text-sm uppercase tracking-wider opacity-80">
                    Activity History ({sessions.length})
                  </h3>
                  {sessions.length > 0 && (
                    <button
                      onClick={clearHistory}
                      className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 opacity-80"
                    >
                      <MdDeleteOutline size={16} /> Clear History
                    </button>
                  )}
                </div>

                {sessions.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl border border-dashed border-gray-400/30 bg-black/5 dark:bg-white/5 space-y-1">
                    <p className="text-sm font-semibold">No completed sessions yet.</p>
                    <p className="text-xs opacity-70">Complete your focus timers to see your accomplishments here!</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-72 overflow-y-auto no-scrollbar pr-1">
                    {sessions.slice(0, 30).map((session) => (
                      <div
                        key={session.id}
                        className="flex items-center justify-between p-3 rounded-2xl bg-white/50 dark:bg-black/20 backdrop-blur-md shadow-sm border border-white/20"
                      >
                        <div className="flex items-center gap-3">
                          <MdCheckCircle className="text-xl" style={{ color: session.themePointColor }} />
                          <div>
                            <div className="font-semibold text-sm">{session.timerTitle || 'Focus Session'}</div>
                            <div className="text-xs opacity-60">
                              {new Date(session.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                              {new Date(session.completedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </div>
                          </div>
                        </div>
                        <div className="font-bold text-sm font-display px-2.5 py-1 rounded-xl bg-black/5 dark:bg-white/10">
                          +{session.durationMinutes}m
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverlay;
