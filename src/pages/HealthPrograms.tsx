import { useState } from 'react';
import { ChevronRight, CheckCircle, Clock, Target, Flame, X, Calendar, Apple, Dumbbell, Moon, Droplets } from 'lucide-react';

interface Program {
  id: string;
  title: string;
  description: string;
  category: 'nutrition' | 'lifestyle';
  duration_days: number;
  difficulty: 'easy' | 'medium' | 'hard';
  goals: string[];
  tags: string[];
  cover_color: string;
  enrolled?: boolean;
  progress?: number;
}

const PROGRAMS: Program[] = [
  {
    id: '1',
    title: 'Антихолестериновая диета',
    description: 'Снижение холестерина через питание и образ жизни. Основан на средиземноморской диете и научных данных.',
    category: 'nutrition',
    duration_days: 30,
    difficulty: 'medium',
    goals: ['Снизить холестерин на 0.5–1.0 ммоль/л', 'Улучшить соотношение ЛПВП/ЛПНП', 'Уменьшить воспалительные маркеры'],
    tags: ['холестерин', 'сердце', 'питание'],
    cover_color: '#0d9488',
    enrolled: true,
    progress: 37,
  },
  {
    id: '2',
    title: 'Повышение гемоглобина',
    description: 'Программа восстановления уровня гемоглобина и ферритина при железодефицитной анемии.',
    category: 'nutrition',
    duration_days: 45,
    difficulty: 'easy',
    goals: ['Поднять гемоглобин до нормы', 'Восполнить запасы ферритина', 'Улучшить усвоение железа'],
    tags: ['анемия', 'железо', 'гемоглобин'],
    cover_color: '#dc2626',
    enrolled: true,
    progress: 13,
  },
  {
    id: '3',
    title: 'Нормализация витамина D',
    description: 'Комплексная программа восполнения дефицита витамина D: солнце, питание, добавки.',
    category: 'lifestyle',
    duration_days: 60,
    difficulty: 'easy',
    goals: ['Достичь уровня витамина D 40+ нг/мл', 'Укрепить иммунную систему', 'Улучшить качество сна'],
    tags: ['витамин D', 'иммунитет', 'солнце'],
    cover_color: '#d97706',
  },
  {
    id: '4',
    title: 'Профилактика диабета',
    description: 'Снижение риска диабета 2 типа через изменение образа жизни, питания и физической активности.',
    category: 'lifestyle',
    duration_days: 90,
    difficulty: 'medium',
    goals: ['Снизить уровень глюкозы', 'Нормализовать ИМТ', 'Повысить чувствительность к инсулину'],
    tags: ['диабет', 'глюкоза', 'метаболизм'],
    cover_color: '#7c3aed',
  },
  {
    id: '5',
    title: 'Детокс и поддержка печени',
    description: 'Программа поддержки функции печени через питание, гидратацию и снижение нагрузки.',
    category: 'nutrition',
    duration_days: 21,
    difficulty: 'easy',
    goals: ['Нормализовать АЛТ/АСТ', 'Снизить нагрузку на печень', 'Улучшить пищеварение'],
    tags: ['печень', 'детокс', 'биохимия'],
    cover_color: '#059669',
  },
  {
    id: '6',
    title: 'Снижение воспаления',
    description: 'Противовоспалительная диета и образ жизни для снижения маркеров воспаления.',
    category: 'lifestyle',
    duration_days: 30,
    difficulty: 'medium',
    goals: ['Снизить СОЭ до нормы', 'Уменьшить воспалительные процессы', 'Укрепить иммунитет'],
    tags: ['воспаление', 'СОЭ', 'иммунитет'],
    cover_color: '#ea580c',
  },
];

const NUTRITION_PLANS: Record<string, { day: string; meals: { time: string; name: string; cal: number; items: string[] }[] }[]> = {
  '1': [
    {
      day: 'День 1',
      meals: [
        { time: 'Завтрак', name: 'Овсяная каша с орехами', cal: 320, items: ['Овсянка 80г', 'Грецкие орехи 20г', 'Черника 50г', 'Оливковое масло 1 ч.л.'] },
        { time: 'Обед', name: 'Лосось с салатом', cal: 480, items: ['Лосось запечённый 150г', 'Салат из зелени', 'Оливковое масло', 'Авокадо ½ шт.'] },
        { time: 'Ужин', name: 'Чечевичный суп', cal: 290, items: ['Чечевица 80г', 'Овощи', 'Куркума', 'Цельнозерновой хлеб'] },
      ],
    },
  ],
  '2': [
    {
      day: 'День 1',
      meals: [
        { time: 'Завтрак', name: 'Гречневая каша с яйцом', cal: 350, items: ['Гречка 80г', 'Яйцо 2 шт.', 'Зелень', 'Стакан апельсинового сока'] },
        { time: 'Обед', name: 'Говяжья печень с овощами', cal: 420, items: ['Говяжья печень 150г', 'Болгарский перец', 'Шпинат 100г', 'Помидор'] },
        { time: 'Ужин', name: 'Фасолевый суп', cal: 310, items: ['Красная фасоль 100г', 'Морковь', 'Лук', 'Зелень'] },
      ],
    },
  ],
};

const LIFESTYLE_TIPS: Record<string, { icon: typeof Apple; color: string; bg: string; title: string; items: string[] }[]> = {
  '3': [
    { icon: Moon, color: 'text-blue-600', bg: 'bg-blue-50', title: 'Солнце и витамин D', items: ['15–20 минут солнечных ванн ежедневно', 'Лучшее время: 11:00–15:00', 'Не используйте крем с SPF первые 15 минут', 'Открытые руки и лицо дают максимальный синтез'] },
    { icon: Apple, color: 'text-amber-600', bg: 'bg-amber-50', title: 'Питание', items: ['Жирная рыба 3 раза в неделю', 'Яичный желток ежедневно', 'Грибы (особенно портобелло)', 'Молочные продукты обогащённые D3'] },
    { icon: Dumbbell, color: 'text-emerald-600', bg: 'bg-emerald-50', title: 'Физическая активность', items: ['Прогулки на улице каждый день', 'Силовые тренировки 2–3 раза/нед', 'Активность на свежем воздухе'] },
  ],
  '4': [
    { icon: Apple, color: 'text-emerald-600', bg: 'bg-emerald-50', title: 'Питание при риске диабета', items: ['Исключить сладкие напитки и соки', 'Цельнозерновые продукты вместо белых', 'Больше клетчатки (овощи, бобовые)', 'Дробное питание 5–6 раз в день'] },
    { icon: Dumbbell, color: 'text-blue-600', bg: 'bg-blue-50', title: 'Физическая активность', items: ['Ходьба 30 мин/день минимум', 'Аэробика снижает глюкозу на 20–30%', 'Силовые тренировки улучшают инсулинорезистентность', 'Избегать сидячего образа жизни >2 часов'] },
    { icon: Droplets, color: 'text-teal-600', bg: 'bg-teal-50', title: 'Гидратация', items: ['2 литра воды в день', 'Вода перед едой снижает аппетит', 'Зелёный чай без сахара', 'Избегать алкоголя'] },
  ],
};

function ProgramModal({ program, onClose, onEnroll }: { program: Program; onClose: () => void; onEnroll: (id: string) => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'plan'>('overview');
  const nutritionPlan = NUTRITION_PLANS[program.id];
  const lifestylePlan = LIFESTYLE_TIPS[program.id];
  const hasPlan = nutritionPlan || lifestylePlan;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[92vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="rounded-t-3xl sm:rounded-t-3xl overflow-hidden flex-shrink-0" style={{ background: program.cover_color }}>
          <div className="p-5 relative">
            <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-black/20 rounded-full flex items-center justify-center">
              <X size={16} className="text-white" />
            </button>
            <span className="text-[10px] font-bold text-white/70 uppercase tracking-wide">
              {program.category === 'nutrition' ? 'Программа питания' : 'Образ жизни'}
            </span>
            <h2 className="text-xl font-black text-white mt-1 pr-8">{program.title}</h2>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1">
                <Clock size={11} className="text-white" />
                <span className="text-xs font-bold text-white">{program.duration_days} дней</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1">
                <Flame size={11} className="text-white" />
                <span className="text-xs font-bold text-white capitalize">
                  {program.difficulty === 'easy' ? 'Простая' : program.difficulty === 'medium' ? 'Средняя' : 'Сложная'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        {hasPlan && (
          <div className="flex border-b border-gray-100 flex-shrink-0">
            {([['overview', 'Обзор'], ['plan', 'План на день']] as const).map(([v, l]) => (
              <button key={v} onClick={() => setActiveTab(v)}
                className={`flex-1 py-3 text-sm font-bold transition-colors ${
                  activeTab === v ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400'
                }`}>
                {l}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'overview' ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">{program.description}</p>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                  <Target size={11} /> Цели программы
                </p>
                <ul className="space-y-2">
                  {program.goals.map((g, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white text-[9px] font-bold" style={{ background: program.cover_color }}>{i + 1}</div>
                      <span className="text-sm text-gray-700 leading-relaxed">{g}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap gap-2">
                {program.tags.map(t => (
                  <span key={t} className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">{t}</span>
                ))}
              </div>
              {program.enrolled && program.progress !== undefined && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                    <span>Прогресс</span>
                    <span style={{ color: program.cover_color }}>{program.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${program.progress}%`, background: program.cover_color }} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              {nutritionPlan && nutritionPlan.map(day => (
                <div key={day.day}>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">{day.day}</p>
                  <div className="space-y-3">
                    {day.meals.map(meal => (
                      <div key={meal.time} className="bg-gray-50 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Apple size={14} className="text-emerald-600" />
                            <span className="text-xs font-bold text-gray-500">{meal.time}</span>
                          </div>
                          <span className="text-xs text-gray-400">{meal.cal} ккал</span>
                        </div>
                        <p className="font-bold text-gray-900 text-sm mb-2">{meal.name}</p>
                        <ul className="space-y-1">
                          {meal.items.map((item, i) => (
                            <li key={i} className="text-xs text-gray-500 flex items-center gap-1.5">
                              <div className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {lifestylePlan && lifestylePlan.map(block => (
                <div key={block.title} className={`${block.bg} rounded-2xl p-4`}>
                  <div className="flex items-center gap-2 mb-3">
                    <block.icon size={16} className={block.color} />
                    <p className={`font-bold text-sm ${block.color}`}>{block.title}</p>
                  </div>
                  <ul className="space-y-2">
                    {block.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className={`w-4 h-4 rounded-full ${block.bg} border ${block.color.replace('text', 'border')} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <span className={`text-[8px] font-bold ${block.color}`}>{i + 1}</span>
                        </div>
                        <span className="text-xs text-gray-700 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="p-5 border-t border-gray-100 flex-shrink-0">
          {program.enrolled ? (
            <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold py-3">
              <CheckCircle size={18} />
              Вы уже участвуете в этой программе
            </div>
          ) : (
            <button
              onClick={() => { onEnroll(program.id); onClose(); }}
              className="w-full flex items-center justify-center gap-2 text-white font-bold py-4 rounded-2xl transition-all shadow-lg text-base"
              style={{ background: program.cover_color }}
            >
              <Calendar size={18} />
              Начать программу
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HealthPrograms() {
  const [filter, setFilter] = useState<'all' | 'nutrition' | 'lifestyle' | 'enrolled'>('all');
  const [selected, setSelected] = useState<Program | null>(null);
  const [programs, setPrograms] = useState<Program[]>(PROGRAMS);

  const handleEnroll = (id: string) => {
    setPrograms(prev => prev.map(p => p.id === id ? { ...p, enrolled: true, progress: 0 } : p));
  };

  const filtered = programs.filter(p => {
    if (filter === 'enrolled') return p.enrolled;
    if (filter === 'nutrition') return p.category === 'nutrition';
    if (filter === 'lifestyle') return p.category === 'lifestyle';
    return true;
  });

  const enrolled = programs.filter(p => p.enrolled);

  return (
    <div className="space-y-5">
      {/* Enrolled programs */}
      {enrolled.length > 0 && (
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 px-1">Активные программы</p>
          <div className="space-y-3">
            {enrolled.map(p => (
              <button key={p.id} onClick={() => setSelected(p)} className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-left hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-black text-lg" style={{ background: p.cover_color }}>
                    {p.title[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">{p.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${p.progress}%`, background: p.cover_color }} />
                      </div>
                      <span className="text-xs font-bold" style={{ color: p.cover_color }}>{p.progress}%</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {([['all', 'Все'], ['enrolled', 'Мои'], ['nutrition', 'Питание'], ['lifestyle', 'Образ жизни']] as const).map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)}
            className={`flex-shrink-0 text-xs font-bold px-3.5 py-2 rounded-xl border transition-all ${
              filter === v ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
            }`}>
            {l}
          </button>
        ))}
      </div>

      {/* Program cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map(p => (
          <button
            key={p.id}
            onClick={() => setSelected(p)}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-left hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
          >
            <div className="h-20 relative flex items-end p-4" style={{ background: `linear-gradient(135deg, ${p.cover_color}ee, ${p.cover_color}99)` }}>
              <div className="absolute top-3 right-3 flex gap-1.5">
                {p.enrolled && (
                  <span className="text-[9px] font-bold bg-white/30 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle size={8} /> Активна
                  </span>
                )}
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  p.category === 'nutrition' ? 'bg-white/30 text-white' : 'bg-white/30 text-white'
                }`}>
                  {p.category === 'nutrition' ? 'Питание' : 'Образ жизни'}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-emerald-700 transition-colors">{p.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">{p.description}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock size={11} />
                  {p.duration_days} дней
                </div>
                <div className="flex items-center gap-1">
                  <Flame size={11} />
                  {p.difficulty === 'easy' ? 'Простая' : p.difficulty === 'medium' ? 'Средняя' : 'Сложная'}
                </div>
              </div>
              {p.enrolled && p.progress !== undefined && (
                <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${p.progress}%`, background: p.cover_color }} />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Target size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Программы не найдены</p>
        </div>
      )}

      {selected && (
        <ProgramModal
          program={selected}
          onClose={() => setSelected(null)}
          onEnroll={handleEnroll}
        />
      )}
    </div>
  );
}
