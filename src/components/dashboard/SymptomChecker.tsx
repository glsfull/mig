import { useState } from 'react';
import { Brain, Loader2, AlertTriangle, User, Stethoscope, ShieldAlert } from 'lucide-react';
import { DEMO_SYMPTOM_RESPONSE } from '../../data/demoAnalysis';

const SYMPTOM_SUGGESTIONS = [
  'Постоянная усталость', 'Головокружение', 'Боль в животе', 'Тошнота',
  'Головная боль', 'Боль в суставах', 'Одышка', 'Повышенная температура',
];

export default function SymptomChecker() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<typeof DEMO_SYMPTOM_RESPONSE | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    await new Promise(r => setTimeout(r, 2200));
    setLoading(false);
    setResult(DEMO_SYMPTOM_RESPONSE);
  };

  const addSuggestion = (s: string) => {
    setText(prev => prev ? `${prev}, ${s.toLowerCase()}` : s.toLowerCase());
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Опишите ваши симптомы и жалобы
        </label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={4}
          placeholder="Например: постоянная усталость последние 2 недели, головокружение по утрам, боль в правом подреберье, плохой сон..."
          className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent resize-none text-gray-800 placeholder-gray-400 bg-gray-50 text-sm leading-relaxed transition"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {SYMPTOM_SUGGESTIONS.map(s => (
            <button
              key={s}
              onClick={() => addSuggestion(s)}
              className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-colors"
            >
              + {s}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleAnalyze}
        disabled={loading || !text.trim()}
        className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-2xl transition-all duration-200 shadow-lg"
      >
        {loading ? (
          <><Loader2 size={18} className="animate-spin" /> Анализирую симптомы...</>
        ) : (
          <><Brain size={18} /> Проанализировать с ИИ</>
        )}
      </button>

      {loading && (
        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Brain size={16} className="text-emerald-600" />
            </div>
            <span className="text-sm font-semibold text-gray-700">ИИ изучает ваши анализы и симптомы...</span>
          </div>
          <div className="space-y-2">
            {['Анализирую показатели крови', 'Сопоставляю с симптомами', 'Формирую заключение'].map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-200 flex items-center justify-center">
                  <Loader2 size={10} className="animate-spin text-emerald-600" />
                </div>
                <span className="text-xs text-gray-500">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-4 animate-fade-in">
          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
            <ShieldAlert size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">{result.disclaimer}</p>
          </div>

          {/* Possible conditions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Brain size={16} className="text-emerald-600" />
              Возможные состояния
            </h4>
            <div className="space-y-3">
              {result.possibleConditions.map(c => (
                <div
                  key={c.name}
                  className={`rounded-xl p-4 border ${
                    c.color === 'red' ? 'bg-red-50 border-red-100' :
                    c.color === 'amber' ? 'bg-amber-50 border-amber-100' :
                    'bg-emerald-50 border-emerald-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h5 className={`font-bold text-sm ${
                      c.color === 'red' ? 'text-red-800' :
                      c.color === 'amber' ? 'text-amber-800' : 'text-emerald-800'
                    }`}>{c.name}</h5>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${
                      c.color === 'red' ? 'bg-red-200 text-red-700' :
                      c.color === 'amber' ? 'bg-amber-200 text-amber-700' :
                      'bg-emerald-200 text-emerald-700'
                    }`}>
                      {c.probability === 'высокая' ? '⚠ Высокая вероятность' :
                       c.probability === 'средняя' ? '~ Средняя вероятность' : 'Низкая'}
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed ${
                    c.color === 'red' ? 'text-red-700' :
                    c.color === 'amber' ? 'text-amber-700' : 'text-emerald-700'
                  }`}>{c.reasoning}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Specialists */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Stethoscope size={16} className="text-emerald-600" />
              Рекомендуемые специалисты
            </h4>
            <div className="flex flex-wrap gap-2">
              {result.specialists.map(s => (
                <div key={s} className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
                  <User size={13} className="text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-800">{s}</span>
                </div>
              ))}
            </div>
          </div>

          {result.urgency === 'medium' && (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
              <AlertTriangle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-blue-800 mb-1">Рекомендуется записаться к врачу</p>
                <p className="text-xs text-blue-700">В течение 1–2 недель. Состояние требует профессиональной оценки, но не является экстренным.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
