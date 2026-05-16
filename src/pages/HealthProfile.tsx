import { useState } from 'react';
import { Save, User, CheckCircle } from 'lucide-react';
import { DEMO_USER_PROFILE } from '../data/demoAnalysis';
import type { UserProfile } from '../data/demoAnalysis';

const BLOOD_TYPES = ['A(II)+', 'A(II)-', 'B(III)+', 'B(III)-', 'O(I)+', 'O(I)-', 'AB(IV)+', 'AB(IV)-', 'Не знаю'];
const CHRONIC_CONDITIONS = [
  'Гипертония', 'Сахарный диабет', 'Заболевания щитовидной железы',
  'Хронические заболевания почек', 'Бронхиальная астма', 'Сердечно-сосудистые заболевания',
  'Заболевания ЖКТ', 'Онкологические заболевания', 'Анемия', 'Ожирение',
];

function BMIWidget({ weight, height }: { weight: number; height: number }) {
  if (!weight || !height) return null;
  const bmi = weight / Math.pow(height / 100, 2);
  const bmiStr = bmi.toFixed(1);
  let label = '';
  let color = '';
  if (bmi < 18.5) { label = 'Недостаточный вес'; color = 'text-blue-600'; }
  else if (bmi < 25) { label = 'Норма'; color = 'text-emerald-600'; }
  else if (bmi < 30) { label = 'Избыточный вес'; color = 'text-amber-600'; }
  else { label = 'Ожирение'; color = 'text-red-600'; }

  return (
    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Индекс массы тела (ИМТ)</p>
      <div className="flex items-center justify-between">
        <div>
          <span className={`text-3xl font-black ${color}`}>{bmiStr}</span>
          <p className={`text-sm font-semibold mt-0.5 ${color}`}>{label}</p>
        </div>
        <div className="text-right text-xs text-gray-400 space-y-0.5">
          <p>{'<'}18.5 — дефицит</p>
          <p>18.5–24.9 — норма</p>
          <p>25–29.9 — избыток</p>
          <p>{'≥'}30 — ожирение</p>
        </div>
      </div>
      {/* Bar */}
      <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${bmi < 18.5 ? 'bg-blue-500' : bmi < 25 ? 'bg-emerald-500' : bmi < 30 ? 'bg-amber-400' : 'bg-red-500'}`}
          style={{ width: `${Math.min((bmi / 40) * 100, 100)}%`, transition: 'width 0.5s ease' }}
        />
      </div>
    </div>
  );
}

export default function HealthProfile() {
  const [profile, setProfile] = useState<UserProfile>({ ...DEMO_USER_PROFILE });
  const [saved, setSaved] = useState(false);

  const update = (field: keyof UserProfile, value: unknown) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const toggleCondition = (c: string) => {
    const current = profile.chronicConditions;
    update('chronicConditions', current.includes(c)
      ? current.filter(x => x !== c)
      : [...current, c]);
  };

  const handleSave = async () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-5">
      {/* Avatar */}
      <div className="flex flex-col items-center py-4">
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200 mb-3">
          <User size={36} className="text-white" />
        </div>
        <p className="font-black text-xl text-gray-900">{profile.fullName || 'Имя пользователя'}</p>
        <p className="text-sm text-gray-500 mt-0.5">
          {profile.age ? `${profile.age} лет` : 'Возраст не указан'} ·{' '}
          {profile.sex === 'male' ? 'Мужской пол' : 'Женский пол'}
        </p>
      </div>

      {/* Personal info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide text-gray-500">Личные данные</h3>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Полное имя</label>
          <input
            value={profile.fullName}
            onChange={e => update('fullName', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            placeholder="Иван Иванов"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Возраст</label>
            <input
              type="number"
              value={profile.age || ''}
              onChange={e => update('age', parseInt(e.target.value) || 0)}
              min={1} max={120}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              placeholder="34"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Пол</label>
            <div className="flex rounded-xl overflow-hidden border border-gray-200">
              {([['male', 'Муж.'], ['female', 'Жен.']] as const).map(([v, l]) => (
                <button
                  key={v}
                  onClick={() => update('sex', v)}
                  className={`flex-1 py-3 text-sm font-bold transition-colors ${
                    profile.sex === v ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Рост (см)</label>
            <input
              type="number"
              value={profile.heightCm || ''}
              onChange={e => update('heightCm', parseInt(e.target.value) || 0)}
              min={100} max={250}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              placeholder="179"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Вес (кг)</label>
            <input
              type="number"
              value={profile.weightKg || ''}
              onChange={e => update('weightKg', parseFloat(e.target.value) || 0)}
              min={30} max={300}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              placeholder="78"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Группа крови</label>
          <div className="flex flex-wrap gap-2">
            {BLOOD_TYPES.map(t => (
              <button
                key={t}
                onClick={() => update('bloodType', t)}
                className={`text-xs font-bold px-3 py-2 rounded-xl border transition-all duration-150 ${
                  profile.bloodType === t
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* BMI */}
      <BMIWidget weight={profile.weightKg} height={profile.heightCm} />

      {/* Chronic conditions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide text-gray-500 mb-3">Хронические заболевания</h3>
        <p className="text-xs text-gray-500 mb-3">Выберите все имеющиеся заболевания</p>
        <div className="flex flex-wrap gap-2">
          {CHRONIC_CONDITIONS.map(c => {
            const active = profile.chronicConditions.includes(c);
            return (
              <button
                key={c}
                onClick={() => toggleCondition(c)}
                className={`text-xs font-semibold px-3 py-2 rounded-xl border transition-all duration-150 flex items-center gap-1.5 ${
                  active
                    ? 'bg-emerald-500 text-white border-emerald-500'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                {active && <CheckCircle size={11} />}
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Allergies */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide text-gray-500 mb-3">Аллергии</h3>
        <textarea
          value={profile.allergies}
          onChange={e => update('allergies', e.target.value)}
          rows={3}
          placeholder="Например: пенициллин, пыльца берёзы, кошачья шерсть..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition resize-none placeholder-gray-400"
        />
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-2xl transition-all duration-200 shadow-lg text-base ${
          saved
            ? 'bg-emerald-500 text-white shadow-emerald-200'
            : 'bg-gray-900 hover:bg-gray-800 text-white'
        }`}
      >
        {saved ? (
          <><CheckCircle size={18} /> Сохранено!</>
        ) : (
          <><Save size={18} /> Сохранить профиль</>
        )}
      </button>
    </div>
  );
}
