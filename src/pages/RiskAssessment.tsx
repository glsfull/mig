import { useState } from 'react';
import { ChevronDown, ChevronUp, Check, AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import { DEMO_RISKS } from '../data/demoAnalysis';
import type { RiskAssessment } from '../data/demoAnalysis';

function RiskRing({ score, color }: { score: number; color: string }) {
  const r = 34;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const strokeColor = color === 'red' ? '#ef4444' : color === 'amber' ? '#f59e0b' : '#10b981';

  return (
    <div className="relative w-20 h-20 flex-shrink-0">
      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="#f3f4f6" strokeWidth="7" />
        <circle
          cx="40" cy="40" r={r} fill="none"
          stroke={strokeColor} strokeWidth="7"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-lg font-black ${
          color === 'red' ? 'text-red-600' : color === 'amber' ? 'text-amber-600' : 'text-emerald-600'
        }`}>{score}%</span>
      </div>
    </div>
  );
}

function RiskCard({ risk }: { risk: RiskAssessment }) {
  const [open, setOpen] = useState(false);

  const levelLabel = risk.level === 'high' ? 'Высокий' : risk.level === 'medium' ? 'Средний' : 'Низкий';
  const levelClass = risk.level === 'high'
    ? 'bg-red-100 text-red-700'
    : risk.level === 'medium'
    ? 'bg-amber-100 text-amber-700'
    : 'bg-emerald-100 text-emerald-700';

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${
      risk.level === 'high' ? 'border-red-100' : risk.level === 'medium' ? 'border-amber-100' : 'border-gray-100'
    }`}>
      <div
        className="p-4 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-4">
          <RiskRing score={risk.score} color={risk.color} />
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-1 flex-wrap">
              <span className="text-xl">{risk.icon}</span>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${levelClass}`}>
                {levelLabel} риск
              </span>
            </div>
            <h3 className="font-bold text-gray-900 text-sm leading-tight">{risk.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{risk.description}</p>
          </div>
          <div className="flex-shrink-0">
            {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          </div>
        </div>
      </div>

      {open && (
        <div className="border-t border-gray-50 px-4 pb-4 pt-3 space-y-4 animate-fade-in">
          {/* Factors */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Факторы риска</p>
            <div className="space-y-2">
              {risk.factors.map(f => (
                <div key={f.name} className="flex items-center gap-2.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                    f.impact === 'negative' ? 'bg-red-100' : f.impact === 'positive' ? 'bg-emerald-100' : 'bg-gray-100'
                  }`}>
                    {f.impact === 'negative' ? (
                      <AlertTriangle size={10} className="text-red-600" />
                    ) : f.impact === 'positive' ? (
                      <Check size={10} className="text-emerald-600" />
                    ) : (
                      <Info size={10} className="text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1 flex items-center justify-between gap-2">
                    <span className="text-sm text-gray-700">{f.name}</span>
                    <span className={`text-xs font-medium ${
                      f.impact === 'negative' ? 'text-red-600' : f.impact === 'positive' ? 'text-emerald-600' : 'text-gray-400'
                    }`}>{f.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className={`rounded-xl p-3 ${
            risk.level === 'high' ? 'bg-red-50' : risk.level === 'medium' ? 'bg-amber-50' : 'bg-emerald-50'
          }`}>
            <p className="text-xs font-bold uppercase tracking-wide mb-2 text-gray-500">Рекомендации</p>
            <ul className="space-y-1.5">
              {risk.recommendations.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    risk.level === 'high' ? 'bg-red-200' : risk.level === 'medium' ? 'bg-amber-200' : 'bg-emerald-200'
                  }`}>
                    <span className="text-[8px] font-bold">{i + 1}</span>
                  </div>
                  <span className="text-xs text-gray-700 leading-relaxed">{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RiskAssessment() {
  const highCount = DEMO_RISKS.filter(r => r.level === 'high').length;
  const medCount = DEMO_RISKS.filter(r => r.level === 'medium').length;
  const lowCount = DEMO_RISKS.filter(r => r.level === 'low').length;

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-red-50 rounded-2xl p-3 text-center border border-red-100">
          <p className="text-2xl font-black text-red-600">{highCount}</p>
          <p className="text-xs text-red-600 mt-0.5">Высокий</p>
        </div>
        <div className="bg-amber-50 rounded-2xl p-3 text-center border border-amber-100">
          <p className="text-2xl font-black text-amber-600">{medCount}</p>
          <p className="text-xs text-amber-600 mt-0.5">Средний</p>
        </div>
        <div className="bg-emerald-50 rounded-2xl p-3 text-center border border-emerald-100">
          <p className="text-2xl font-black text-emerald-600">{lowCount}</p>
          <p className="text-xs text-emerald-600 mt-0.5">Низкий</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
        <ShieldCheck size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-800 leading-relaxed">
          Оценка рисков рассчитывается по научно-обоснованным формулам на основе ваших анализов и профиля. Не является медицинским диагнозом.
        </p>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {[...DEMO_RISKS].sort((a, b) => b.score - a.score).map(risk => (
          <RiskCard key={risk.id} risk={risk} />
        ))}
      </div>
    </div>
  );
}
