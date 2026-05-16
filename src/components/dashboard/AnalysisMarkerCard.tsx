import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import type { AnalysisMarker } from '../../data/demoAnalysis';

interface Props {
  marker: AnalysisMarker;
  index: number;
}

function getStatusConfig(status: AnalysisMarker['status']) {
  switch (status) {
    case 'low':
      return {
        label: 'ПОНИЖЕНО',
        barColor: 'bg-blue-500',
        badgeClass: 'bg-blue-100 text-blue-700',
        iconClass: 'text-blue-500',
        Icon: AlertCircle,
        cardBorder: 'border-blue-100',
      };
    case 'high':
      return {
        label: 'ПОВЫШЕНО',
        barColor: 'bg-amber-500',
        badgeClass: 'bg-amber-100 text-amber-700',
        iconClass: 'text-amber-500',
        Icon: AlertTriangle,
        cardBorder: 'border-amber-100',
      };
    case 'critical':
      return {
        label: 'КРИТИЧНО',
        barColor: 'bg-red-500',
        badgeClass: 'bg-red-100 text-red-700',
        iconClass: 'text-red-500',
        Icon: AlertTriangle,
        cardBorder: 'border-red-200',
      };
    default:
      return {
        label: 'В НОРМЕ',
        barColor: 'bg-emerald-500',
        badgeClass: 'bg-emerald-100 text-emerald-700',
        iconClass: 'text-emerald-500',
        Icon: CheckCircle,
        cardBorder: 'border-gray-100',
      };
  }
}

function ProgressBar({ value, min, max, status }: { value: number; min: number; max: number; status: string }) {
  const total = max * 1.4;
  const normalStart = (min / total) * 100;
  const normalEnd = (max / total) * 100;
  const valuePct = Math.min((value / total) * 100, 100);

  return (
    <div className="mt-3 mb-2">
      <div className="relative h-2.5 rounded-full bg-gray-100 overflow-hidden">
        {/* Low zone */}
        <div className="absolute left-0 top-0 h-full rounded-l-full bg-blue-200" style={{ width: `${normalStart}%` }} />
        {/* Normal zone */}
        <div className="absolute top-0 h-full bg-emerald-200" style={{ left: `${normalStart}%`, width: `${normalEnd - normalStart}%` }} />
        {/* High zone */}
        <div className="absolute top-0 right-0 h-full rounded-r-full bg-amber-200" style={{ width: `${100 - normalEnd}%` }} />
        {/* Value indicator */}
        <div
          className={`absolute top-0 h-full w-1 rounded-full ${
            status === 'normal' ? 'bg-emerald-600' : status === 'low' ? 'bg-blue-600' : 'bg-amber-600'
          } shadow-md transition-all duration-700`}
          style={{ left: `calc(${valuePct}% - 2px)` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-0.5">
        <span>{min} {''}</span>
        <span className="text-gray-500 font-medium">норма: {min}–{max}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

export default function AnalysisMarkerCard({ marker, index }: Props) {
  const [expanded, setExpanded] = useState(index < 2);
  const cfg = getStatusConfig(marker.status);
  const { Icon } = cfg;

  return (
    <div
      className={`bg-white rounded-2xl border ${cfg.cardBorder} shadow-sm overflow-hidden transition-all duration-200`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Icon size={18} className={cfg.iconClass} />
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 text-sm leading-tight truncate">{marker.name}</h3>
              <span className="text-[10px] text-gray-400">{marker.category}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-right">
              <span className="text-xl font-black text-gray-900">{marker.value}</span>
              <span className="text-xs text-gray-400 ml-1">{marker.unit}</span>
            </div>
            <span className={`text-[9px] font-bold px-2 py-1 rounded-full ${cfg.badgeClass}`}>
              {cfg.label}
            </span>
          </div>
        </div>

        <ProgressBar value={marker.value} min={marker.min} max={marker.max} status={marker.status} />

        {expanded && (
          <div className="mt-3 space-y-3 animate-fade-in">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">О показателе</p>
              <p className="text-sm text-gray-700 leading-relaxed">{marker.description}</p>
            </div>
            <div className={`rounded-xl p-3 ${marker.status === 'normal' ? 'bg-emerald-50' : 'bg-amber-50'}`}>
              <p className="text-xs font-semibold uppercase tracking-wide mb-1.5 text-gray-500">Интерпретация</p>
              <p className="text-sm leading-relaxed text-gray-700">{marker.interpretation}</p>
            </div>
            {marker.recommendation && (
              <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1.5">Рекомендация</p>
                <p className="text-sm text-blue-800 leading-relaxed">{marker.recommendation}</p>
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors w-full justify-center pt-1"
        >
          {expanded ? (
            <><ChevronUp size={14} /> Свернуть</>
          ) : (
            <><ChevronDown size={14} /> Подробнее</>
          )}
        </button>
      </div>
    </div>
  );
}
