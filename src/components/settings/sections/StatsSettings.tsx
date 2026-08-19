import React, { useRef, useState } from 'react';
import { IoIosShareAlt, IoMdFlame, IoMdTime } from 'react-icons/io';
import { MdCheckCircle, MdDeleteOutline, MdTrendingUp } from 'react-icons/md';
import { useStatsStore } from '../../../store/statsStore';
import { useThemeStore } from '../../../store/themeStore';
import { getCardSurface } from '../../../utils/colorUtils';
import Button from '../../common/Button';

const StatsSettings: React.FC = () => {
  const { selectedTheme, compColor } = useThemeStore();
  const { sessions, getTodayMinutes, getWeeklyMinutes, getStreakDays, clearHistory } = useStatsStore();

  const [isGeneratingShare, setIsGeneratingShare] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const todayMinutes = getTodayMinutes();
  const weeklyMinutes = getWeeklyMinutes();
  const streakDays = getStreakDays();

  const { cardBg, cardBorder } = getCardSurface(
    selectedTheme.color.main,
    selectedTheme.color.sub,
    selectedTheme.color.point
  );

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

      const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
      gradient.addColorStop(0, selectedTheme.color.main);
      gradient.addColorStop(1, selectedTheme.color.sub);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1080);

      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
      ctx.shadowBlur = 40;
      ctx.shadowOffsetY = 20;
      ctx.beginPath();
      ctx.roundRect(90, 90, 900, 900, 48);
      ctx.fill();
      ctx.shadowColor = 'transparent';

      ctx.fillStyle = selectedTheme.color.point;
      ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⏰ MELLOW VISUAL TIMER', 540, 190);

      ctx.fillStyle = '#666666';
      ctx.font = '500 28px "Plus Jakarta Sans", sans-serif';
      const dateStr = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      ctx.fillText(dateStr, 540, 240);

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

      ctx.fillStyle = '#1A1A1A';
      ctx.font = 'bold 72px "Outfit", sans-serif';
      ctx.fillText(formatHoursMins(todayMinutes), 540, 465);

      ctx.fillStyle = '#888888';
      ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('TODAY FOCUSED', 540, 510);

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

      ctx.fillStyle = '#444444';
      ctx.font = 'italic 500 28px "Plus Jakarta Sans", sans-serif';
      const quote = selectedTheme.text.replace(/\n/g, ' ');
      ctx.fillText(`"${quote}"`, 540, 840);

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

  return (
    <div className="space-y-8">
      {/* KPI Cards — same white base as SNS share card */}
      <div className="grid grid-cols-3 gap-3">
        {/* Card 1: Today Focus */}
        <div
          className="flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl border shadow-soft transition-transform hover:scale-[1.02]"
          style={{ backgroundColor: '#FFFFFF', borderColor: `${selectedTheme.color.point}35`, color: '#1A1A1A' }}
        >
          <div
            className="p-2 rounded-xl mb-1.5"
            style={{ backgroundColor: `${selectedTheme.color.point}15`, color: selectedTheme.color.point }}
          >
            <IoMdTime size={22} />
          </div>
          <span className="text-xl sm:text-2xl font-black font-display" style={{ color: '#1A1A1A' }}>
            {formatHoursMins(todayMinutes)}
          </span>
          <span className="text-[11px] sm:text-xs font-bold mt-0.5" style={{ color: selectedTheme.color.point }}>
            Today
          </span>
        </div>

        {/* Card 2: Streak */}
        <div
          className="flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl border shadow-soft transition-transform hover:scale-[1.02]"
          style={{ backgroundColor: '#FFFFFF', borderColor: `${selectedTheme.color.point}35`, color: '#1A1A1A' }}
        >
          <div
            className="p-2 rounded-xl mb-1.5"
            style={{ backgroundColor: `${selectedTheme.color.point}15`, color: selectedTheme.color.point }}
          >
            <IoMdFlame size={22} />
          </div>
          <span className="text-xl sm:text-2xl font-black font-display" style={{ color: '#1A1A1A' }}>
            {streakDays}
          </span>
          <span className="text-[11px] sm:text-xs font-bold mt-0.5" style={{ color: selectedTheme.color.point }}>
            Day Streak
          </span>
        </div>

        {/* Card 3: 7 Days Total */}
        <div
          className="flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl border shadow-soft transition-transform hover:scale-[1.02]"
          style={{ backgroundColor: '#FFFFFF', borderColor: `${selectedTheme.color.point}35`, color: '#1A1A1A' }}
        >
          <div
            className="p-2 rounded-xl mb-1.5"
            style={{ backgroundColor: `${selectedTheme.color.point}15`, color: selectedTheme.color.point }}
          >
            <MdTrendingUp size={22} />
          </div>
          <span className="text-xl sm:text-2xl font-black font-display" style={{ color: '#1A1A1A' }}>
            {formatHoursMins(weeklyMinutes)}
          </span>
          <span className="text-[11px] sm:text-xs font-bold mt-0.5" style={{ color: selectedTheme.color.point }}>
            7 Days
          </span>
        </div>
      </div>

      {/* Share Card Generator Studio */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider opacity-75">
          Share Achievement Card to SNS
        </span>
        <div
          ref={shareCardRef}
          className="p-6 rounded-3xl shadow-dial border border-white/40 flex flex-col items-center text-center space-y-4 max-w-md mx-auto"
          style={{ backgroundColor: '#FFFFFF', color: '#1A1A1A' }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <h4 className="font-bold text-base font-display" style={{ color: selectedTheme.color.point }}>
              Daily Focus Card
            </h4>
          </div>

          <div className="py-1">
            <div className="text-4xl font-black font-display tracking-tight text-gray-900">
              {formatHoursMins(todayMinutes)}
            </div>
            <p className="text-xs text-gray-500 mt-1 font-medium">Total focus logged today</p>
          </div>

          <div className="w-full bg-gray-50 rounded-2xl p-3 text-xs italic text-gray-600">
            "{selectedTheme.text.replace(/\n/g, ' ')}"
          </div>

          <Button
            currentTheme={selectedTheme}
            onClick={handleShareCard}
            disabled={isGeneratingShare}
            className="w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-soft"
          >
            <IoIosShareAlt size={18} />
            <span>{isGeneratingShare ? 'Generating Card...' : 'Save & Share Image Card'}</span>
          </Button>
        </div>
      </div>

      {/* Activity History */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="font-bold text-sm uppercase tracking-wider opacity-80">
            Completed Sessions History ({sessions.length})
          </h4>
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
          <div
            className="p-8 text-center rounded-2xl border border-dashed"
            style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.12)', color: '#1A1A1A' }}
          >
            <p className="text-sm font-semibold">No sessions logged yet.</p>
            <p className="text-xs opacity-70 mt-0.5">Finish a timer countdown to record focus time here!</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar pr-1">
            {sessions.slice(0, 30).map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 rounded-2xl shadow-sm border"
                style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.09)', color: '#1A1A1A' }}
              >
                <div className="flex items-center gap-3">
                  <MdCheckCircle className="text-xl shrink-0" style={{ color: session.themePointColor }} />
                  <div>
                    <div className="font-semibold text-sm">{session.timerTitle || 'Focus Session'}</div>
                    <div className="text-xs opacity-60">
                      {new Date(session.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                      {new Date(session.completedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div
                  className="font-bold text-sm font-display px-2.5 py-1 rounded-xl shrink-0"
                  style={{ backgroundColor: `${selectedTheme.color.point}20`, color: selectedTheme.color.point }}
                >
                  +{session.durationMinutes}m
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsSettings;
