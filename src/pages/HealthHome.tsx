import { Upload, BarChart3, Brain, Pill, TrendingUp, ShieldCheck, BookOpen, User, AlertTriangle, CheckCircle, ChevronRight, Activity, Clock } from 'lucide-react';
import type { SupabaseUser } from '../types';
import { DEMO_HISTORY, DEMO_RISKS, DEMO_MEDICATIONS, HEALTH_SCORE, DEMO_MARKERS } from '../data/demoAnalysis';

type Tab = 'home' | 'upload' | 'results' | 'history' | 'symptoms' | 'meds' | 'risks' | 'report' | 'encyclopedia' | 'profile';

interface Props {
  user: SupabaseUser;
  onNavigate: (tab: Tab) => void;
}

function HealthScoreRing({ score }: { score: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#f3f4f6" strokeWidth="10" />
        <circle
          cx="60" cy="60" r={r} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-gray-900">{score}</span>
        <span className="text-xs text-gray-400 font-medium">из 100</span>
      </div>
    </div>
  );
}

export default function HealthHome({ user, onNavigate }: Props) {
  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Пользователь';
  const firstName = displayName.split(' ')[0];
  const lastAnalysis = DEMO_HISTORY[0];
  const highRisk = DEMO_RISKS.find(r => r.level === 'high');
  const nextMed = DEMO_MEDICATIONS[0];
  const abnormalMarkers = DEMO_MARKERS.filter(m => m.status !== 'normal');

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Доброе утро' : hour < 17 ? 'Добрый день' : 'Добрый вечер';

  return (
    <div className="space-y-5">
      {/* Greeting + Score */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="flex items-start justify-between gap-4 relative">
          <div className="flex-1 min-w-0">
            <p className="text-gray-400 text-sm mb-1">{greeting},</p>
            <h1 className="text-2xl font-black text-white leading-tight mb-3 truncate">{firstName}</h1>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${HEALTH_SCORE >= 75 ? 'bg-emerald-400' : HEALTH_SCORE >= 50 ? 'bg-amber-400' : 'bg-red-400'}`} />
                <span className="text-sm text-gray-300">
                  {HEALTH_SCORE >= 75 ? 'Хорошее состояние' : HEALTH_SCORE >= 50 ? 'Требует внимания' : 'Нужна консультация'}
                </span>
              </div>
              <p className="text-xs text-gray-500">Последний анализ: {lastAnalysis.date}</p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <HealthScoreRing score={HEALTH_SCORE} />
            <p className="text-center text-xs text-gray-500 mt-1">Индекс здоровья</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onNavigate('upload')}
          className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl p-4 text-left transition-all duration-200 shadow-lg shadow-emerald-200 active:scale-95"
        >
          <Upload size={22} className="mb-2" />
          <p className="font-bold text-sm">Загрузить анализ</p>
          <p className="text-emerald-100 text-xs mt-0.5">PDF, фото или скан</p>
        </button>
        <button
          onClick={() => onNavigate('symptoms')}
          className="bg-gray-900 hover:bg-gray-800 text-white rounded-2xl p-4 text-left transition-all duration-200 shadow-lg active:scale-95"
        >
          <Brain size={22} className="mb-2" />
          <p className="font-bold text-sm">ИИ-диагностика</p>
          <p className="text-gray-400 text-xs mt-0.5">Опишите симптомы</p>
        </button>
      </div>

      {/* Abnormal markers alert */}
      {abnormalMarkers.length > 0 && (
        <button
          onClick={() => onNavigate('results')}
          className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left hover:bg-amber-100 transition-colors"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={18} className="text-amber-600" />
              </div>
              <div>
                <p className="font-bold text-amber-900 text-sm">{abnormalMarkers.length} показателя вне нормы</p>
                <p className="text-amber-700 text-xs">
                  {abnormalMarkers.slice(0, 2).map(m => m.name).join(', ')}{abnormalMarkers.length > 2 ? ' и др.' : ''}
                </p>
              </div>
            </div>
            <ChevronRight size={16} className="text-amber-400 flex-shrink-0" />
          </div>
        </button>
      )}

      {/* Next medication */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <Clock size={14} className="text-emerald-600" />
            Ближайший приём
          </h3>
          <button onClick={() => onNavigate('meds')} className="text-xs text-emerald-600 font-semibold hover:text-emerald-700">
            Все лекарства
          </button>
        </div>
        <div className="flex items-center gap-3 bg-emerald-50 rounded-xl p-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Pill size={18} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-sm">{nextMed.name}</p>
            <p className="text-xs text-gray-500">{nextMed.dosage} {nextMed.unit} · {nextMed.times[0]}</p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full">{nextMed.times[0]}</span>
        </div>
      </div>

      {/* High risk alert */}
      {highRisk && (
        <button
          onClick={() => onNavigate('risks')}
          className="w-full bg-red-50 border border-red-100 rounded-2xl p-4 text-left hover:bg-red-100/50 transition-colors"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">
                {highRisk.icon}
              </div>
              <div>
                <p className="font-bold text-red-900 text-sm">Высокий риск</p>
                <p className="text-red-700 text-xs truncate max-w-[180px]">{highRisk.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="font-black text-red-600 text-lg">{highRisk.score}%</span>
              <ChevronRight size={16} className="text-red-400" />
            </div>
          </div>
        </button>
      )}

      {/* Last analysis */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <BarChart3 size={14} className="text-emerald-600" />
            Последний анализ
          </h3>
          <button onClick={() => onNavigate('history')} className="text-xs text-emerald-600 font-semibold hover:text-emerald-700">
            История
          </button>
        </div>
        <button
          onClick={() => onNavigate('results')}
          className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left"
        >
          <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
            <Activity size={18} className="text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-sm">{lastAnalysis.typeLabel}</p>
            <p className="text-xs text-gray-400">{lastAnalysis.date} · {lastAnalysis.markersCount} показателей</p>
          </div>
          <div className="text-right flex-shrink-0">
            {lastAnalysis.abnormalCount > 0 ? (
              <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                {lastAnalysis.abnormalCount} откл.
              </span>
            ) : (
              <CheckCircle size={18} className="text-emerald-500" />
            )}
          </div>
        </button>
      </div>

      {/* Feature grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { tab: 'history' as Tab, icon: TrendingUp, label: 'Динамика', color: 'bg-blue-50 text-blue-600', bg: 'bg-blue-100' },
          { tab: 'risks' as Tab, icon: ShieldCheck, label: 'Оценка рисков', color: 'bg-rose-50 text-rose-600', bg: 'bg-rose-100' },
          { tab: 'report' as Tab, icon: BarChart3, label: 'Отчёт врачу', color: 'bg-teal-50 text-teal-600', bg: 'bg-teal-100' },
          { tab: 'encyclopedia' as Tab, icon: BookOpen, label: 'Справочник', color: 'bg-amber-50 text-amber-600', bg: 'bg-amber-100' },
        ].map(item => (
          <button
            key={item.tab}
            onClick={() => onNavigate(item.tab)}
            className={`${item.color} rounded-2xl p-4 text-left hover:opacity-90 transition-all duration-150 border border-transparent hover:shadow-sm active:scale-95`}
          >
            <div className={`w-9 h-9 ${item.bg} rounded-xl flex items-center justify-center mb-2.5`}>
              <item.icon size={18} />
            </div>
            <p className="font-bold text-sm">{item.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
