import { useState } from 'react';
import { Activity, ChevronDown, ChevronUp, TrendingDown, TrendingUp, Minus, CheckCircle, AlertTriangle } from 'lucide-react';
import { DEMO_HISTORY, DEMO_TRENDS } from '../data/demoAnalysis';
import type { MarkerTrend } from '../data/demoAnalysis';

const TYPE_LABELS: Record<string, string> = {
  blood: 'ОАК',
  biochem: 'Биохимия',
  hormones: 'Гормоны',
  urine: 'Моча',
  other: 'Прочее',
};

function MiniChart({ trend }: { trend: MarkerTrend }) {
  const values = trend.points.map(p => p.value);
  const minV = Math.min(...values) * 0.92;
  const maxV = Math.max(...values) * 1.08;
  const w = 240;
  const h = 64;
  const pad = 8;

  const px = (i: number) => pad + (i / (values.length - 1)) * (w - pad * 2);
  const py = (v: number) => h - pad - ((v - minV) / (maxV - minV)) * (h - pad * 2);

  const path = values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${px(i)} ${py(v)}`).join(' ');
  const area = `${path} L ${px(values.length - 1)} ${h} L ${pad} ${h} Z`;

  const last = values[values.length - 1];
  const prev = values[values.length - 2];
  const isRising = last > prev;
  const isNormal = last >= trend.min && last <= trend.max;

  const normY1 = py(trend.max);
  const normY2 = py(trend.min);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h4 className="font-bold text-gray-900 text-sm">{trend.name}</h4>
          <p className="text-xs text-gray-400">норма: {trend.min}–{trend.max} {trend.unit}</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className={`text-lg font-black ${isNormal ? 'text-emerald-600' : 'text-amber-600'}`}>
            {last}
          </span>
          <span className="text-xs text-gray-400">{trend.unit}</span>
          {isRising ? (
            <TrendingUp size={14} className={isNormal ? 'text-gray-400' : 'text-amber-500'} />
          ) : last < prev ? (
            <TrendingDown size={14} className={isNormal ? 'text-emerald-500' : 'text-amber-500'} />
          ) : (
            <Minus size={14} className="text-gray-400" />
          )}
        </div>
      </div>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ maxWidth: w }}>
        {/* Normal zone */}
        {normY1 > 0 && normY2 < h && (
          <rect x={pad} y={normY1} width={w - pad * 2} height={normY2 - normY1} fill="#d1fae5" opacity="0.5" />
        )}
        {/* Area */}
        <path d={area} fill={isNormal ? '#d1fae5' : '#fef3c7'} opacity="0.4" />
        {/* Line */}
        <path d={path} fill="none" stroke={isNormal ? '#10b981' : '#f59e0b'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Dots */}
        {values.map((v, i) => (
          <circle key={i} cx={px(i)} cy={py(v)} r="3"
            fill={isNormal ? '#10b981' : '#f59e0b'} stroke="white" strokeWidth="1.5" />
        ))}
      </svg>
      <div className="flex justify-between mt-1">
        {trend.points.map(p => (
          <span key={p.date} className="text-[9px] text-gray-400">{p.date}</span>
        ))}
      </div>
    </div>
  );
}

export default function AnalysisHistory() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'trends'>('list');

  return (
    <div className="space-y-5">
      {/* Toggle */}
      <div className="bg-gray-100 rounded-2xl p-1 flex gap-1">
        {([['list', 'История записей'], ['trends', 'Динамика показателей']] as const).map(([v, label]) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
              view === v ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {view === 'list' ? (
        <>
          <p className="text-xs text-gray-400 px-1">{DEMO_HISTORY.length} анализов за последний год</p>
          <div className="space-y-3">
            {DEMO_HISTORY.map(entry => {
              const isOpen = expanded === entry.id;
              return (
                <div key={entry.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <button
                    onClick={() => setExpanded(isOpen ? null : entry.id)}
                    className="w-full p-4 text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Activity size={18} className="text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 text-sm truncate">{entry.typeLabel}</p>
                            <p className="text-xs text-gray-400">{entry.date} · {entry.markersCount} показателей</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {entry.abnormalCount > 0 ? (
                              <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-full flex items-center gap-1">
                                <AlertTriangle size={9} />
                                {entry.abnormalCount} откл.
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full flex items-center gap-1">
                                <CheckCircle size={9} />
                                Норма
                              </span>
                            )}
                            <div className="text-center">
                              <p className={`text-sm font-black ${entry.healthScore >= 75 ? 'text-emerald-600' : entry.healthScore >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                                {entry.healthScore}
                              </p>
                              <p className="text-[9px] text-gray-400">балл</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${entry.healthScore >= 75 ? 'bg-emerald-500' : entry.healthScore >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}
                            style={{ width: `${entry.healthScore}%` }}
                          />
                        </div>
                      </div>
                      {isOpen ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0 mt-1" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0 mt-1" />}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 border-t border-gray-50 pt-3 space-y-2 animate-fade-in">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Показатели</p>
                      {entry.markers.map(m => (
                        <div key={m.name} className="flex items-center justify-between gap-2">
                          <span className="text-sm text-gray-700">{m.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-gray-900">{m.value} {m.unit}</span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              m.status === 'normal' ? 'bg-emerald-100 text-emerald-700' :
                              m.status === 'high' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {m.status === 'normal' ? 'норма' : m.status === 'high' ? 'повышено' : 'понижено'}
                            </span>
                          </div>
                        </div>
                      ))}
                      <p className="text-xs text-gray-400 pt-1">{entry.fileName}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <p className="text-xs text-gray-400 px-1">Динамика за последние 9 месяцев</p>
          <div className="space-y-4">
            {DEMO_TRENDS.map(trend => (
              <MiniChart key={trend.markerId} trend={trend} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
