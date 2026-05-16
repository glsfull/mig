import { useState } from 'react';
import { Download, Share2, CheckCircle, AlertTriangle, FileText, Activity, User, Calendar } from 'lucide-react';
import { DEMO_MARKERS, DEMO_HISTORY, DEMO_USER_PROFILE } from '../data/demoAnalysis';

export default function DoctorReport() {
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://моианализы.рф/report/share/abc123xyz');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1500));
    setGenerating(false);
    alert('В полной версии приложения PDF будет загружен на ваше устройство.');
  };

  const normal = DEMO_MARKERS.filter(m => m.status === 'normal');
  const abnormal = DEMO_MARKERS.filter(m => m.status !== 'normal');
  const profile = DEMO_USER_PROFILE;
  const bmi = (profile.weightKg / Math.pow(profile.heightCm / 100, 2)).toFixed(1);

  return (
    <div className="space-y-5">
      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleDownload}
          disabled={generating}
          className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:opacity-60 text-white font-bold py-3.5 rounded-2xl transition-colors shadow-lg text-sm"
        >
          {generating ? (
            <><span className="animate-spin">⏳</span> Генерация...</>
          ) : (
            <><Download size={16} /> Скачать PDF</>
          )}
        </button>
        <button
          onClick={handleCopyLink}
          className={`flex items-center justify-center gap-2 font-bold py-3.5 rounded-2xl transition-all duration-200 text-sm border-2 ${
            copied
              ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
          }`}
        >
          {copied ? <><CheckCircle size={16} /> Скопировано!</> : <><Share2 size={16} /> Поделиться</>}
        </button>
      </div>

      {/* Report preview */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Report header */}
        <div className="bg-gray-900 px-6 py-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-emerald-400" />
              <span className="text-white font-black text-base">Мои анализы</span>
            </div>
            <span className="text-gray-400 text-xs">13.05.2026</span>
          </div>
          <h2 className="text-white text-xl font-black mb-1">Медицинский отчёт</h2>
          <p className="text-gray-400 text-sm">Для передачи лечащему врачу</p>
        </div>

        {/* Patient block */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
              <User size={16} className="text-gray-500" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">{profile.fullName}</p>
              <p className="text-xs text-gray-400">{profile.age} лет · {profile.sex === 'male' ? 'Мужской' : 'Женский'} пол</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Рост', value: `${profile.heightCm} см` },
              { label: 'Вес', value: `${profile.weightKg} кг` },
              { label: 'ИМТ', value: bmi },
            ].map(item => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-2.5 text-center">
                <p className="text-sm font-bold text-gray-900">{item.value}</p>
                <p className="text-[10px] text-gray-400">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Analyses list */}
        <div className="px-6 py-4 border-b border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Calendar size={12} />
            История анализов
          </p>
          <div className="space-y-2">
            {DEMO_HISTORY.slice(0, 3).map(h => (
              <div key={h.id} className="flex items-center justify-between gap-2 py-1.5 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2">
                  <FileText size={13} className="text-gray-400" />
                  <span className="text-sm text-gray-700">{h.typeLabel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{h.date}</span>
                  {h.abnormalCount > 0 ? (
                    <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">{h.abnormalCount} откл.</span>
                  ) : (
                    <CheckCircle size={12} className="text-emerald-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Abnormal markers */}
        {abnormal.length > 0 && (
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
              <AlertTriangle size={12} className="text-amber-500" />
              Показатели вне нормы
            </p>
            <div className="space-y-2">
              {abnormal.map(m => (
                <div key={m.id} className="flex items-center justify-between gap-2 bg-amber-50 rounded-xl px-3 py-2.5">
                  <span className="text-sm font-semibold text-gray-800">{m.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-amber-700">{m.value} {m.unit}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      m.status === 'high' ? 'bg-amber-200 text-amber-800' : 'bg-blue-200 text-blue-800'
                    }`}>
                      {m.status === 'high' ? '↑' : '↓'} {m.status === 'high' ? 'Повышено' : 'Понижено'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Normal markers */}
        <div className="px-6 py-4 border-b border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
            <CheckCircle size={12} className="text-emerald-500" />
            Показатели в норме
          </p>
          <div className="grid grid-cols-2 gap-2">
            {normal.map(m => (
              <div key={m.id} className="flex items-center justify-between bg-emerald-50 rounded-xl px-3 py-2">
                <span className="text-xs text-gray-700 truncate pr-1">{m.name}</span>
                <span className="text-xs font-bold text-emerald-700 flex-shrink-0">{m.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div className="px-6 py-4">
          <p className="text-[10px] text-gray-400 leading-relaxed text-center">
            Данный отчёт сформирован автоматически сервисом «Мои анализы» и носит информационный характер.
            Не является медицинским заключением. Для постановки диагноза обратитесь к врачу.
          </p>
        </div>
      </div>
    </div>
  );
}
