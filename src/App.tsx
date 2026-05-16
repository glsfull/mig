import { useState, useEffect } from 'react';
import {
  FileText, Brain, ShieldCheck, TrendingUp, Upload, ChevronRight,
  Star, Check, Menu, X, LogOut, User, Activity, Microscope, Heart,
  Zap, ArrowRight, BarChart3, Camera, Salad, Settings
} from 'lucide-react';
import { supabase } from './lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import AuthModal from './components/AuthModal';
import MobileAppMockup from './components/MobileAppMockup';
import FeatureCard from './components/FeatureCard';
import Dashboard from './pages/Dashboard';

const features = [
  {
    icon: Microscope,
    title: 'Расшифровка анализов',
    description: 'Загружайте анализы крови, мочи, кала и других биоматериалов. ИИ расшифрует результаты за секунды.',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
  },
  {
    icon: Brain,
    title: 'ИИ-диагностика',
    description: 'Опишите свои симптомы и получите предварительное заключение на основе ваших анализов.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: TrendingUp,
    title: 'Динамика показателей',
    description: 'Отслеживайте изменения ваших показателей во времени с наглядными графиками и трендами.',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
  },
  {
    icon: ShieldCheck,
    title: 'Оценка рисков',
    description: 'Научно-обоснованная оценка рисков заболеваний: сердце, диабет, ожирение и другие.',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
  },
  {
    icon: FileText,
    title: 'Отчёт для врача',
    description: 'Формируйте структурированные отчёты для врача с историей анализов и динамикой.',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  {
    icon: Heart,
    title: 'Личный кабинет здоровья',
    description: 'Все ваши медицинские данные в одном месте, надёжно защищены и доступны в любое время.',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
  },
  {
    icon: Camera,
    title: 'Сканер с камеры (OCR)',
    description: 'Сфотографируйте бланк анализа — ИИ мгновенно распознает текст и расшифрует каждый показатель без загрузки файла.',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
  },
  {
    icon: Salad,
    title: 'Программы здоровья',
    description: 'Персональные планы питания и образа жизни на основе ваших анализов. Антихолестериновая диета, восстановление гемоглобина и другие.',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
  },
];

const analysisTypes = ['Анализ крови', 'Анализ мочи', 'Биохимия', 'Гормоны', 'УЗИ', 'Кал', 'Аллергены', 'Сканер камеры'];

const testimonials = [
  {
    name: 'Анна Петрова',
    avatar: 'АП',
    role: 'Пациент',
    text: 'Загрузила анализы и за минуту получила подробное объяснение каждого показателя. Теперь не нужно ждать врача чтобы понять, всё ли в норме.',
    rating: 5,
  },
  {
    name: 'Дмитрий Козлов',
    avatar: 'ДК',
    role: 'Пациент',
    text: 'Описал симптомы, прикрепил анализы — ИИ указал на возможную проблему с щитовидной железой. Пошёл к эндокринологу и подтвердилось!',
    rating: 5,
  },
  {
    name: 'Светлана Морозова',
    avatar: 'СМ',
    role: 'Пациент',
    text: 'Наконец-то сервис, который объясняет медицинские термины простым языком. Слежу за своими показателями уже 3 месяца.',
    rating: 5,
  },
];

const plans = [
  {
    name: 'Бесплатно',
    price: '0',
    period: '',
    description: 'Для начала',
    features: ['3 расшифровки в месяц', 'Базовая интерпретация', 'История анализов'],
    cta: 'Начать бесплатно',
    highlighted: false,
  },
  {
    name: 'Про',
    price: '299',
    period: '/мес',
    description: 'Для активного мониторинга',
    features: [
      'Безлимитные расшифровки',
      'ИИ-диагностика симптомов',
      'Оценка рисков заболеваний',
      'Отчёты для врача',
      'Динамика показателей',
      'Приоритетная поддержка',
    ],
    cta: 'Попробовать 7 дней бесплатно',
    highlighted: true,
  },
  {
    name: 'Семейный',
    price: '499',
    period: '/мес',
    description: 'До 5 членов семьи',
    features: [
      'Всё из тарифа Про',
      'До 5 профилей',
      'Семейная история болезней',
      'Общие рекомендации',
    ],
    cta: 'Выбрать тариф',
    highlighted: false,
  },
];

const demoResults = [
  { name: 'Гемоглобин', value: '142', unit: 'г/л', status: 'normal', norm: '130–160' },
  { name: 'Лейкоциты', value: '9.8', unit: '×10⁹/л', status: 'high', norm: '4–9' },
  { name: 'Глюкоза', value: '5.1', unit: 'ммоль/л', status: 'normal', norm: '3.9–6.1' },
  { name: 'Холестерин', value: '6.2', unit: 'ммоль/л', status: 'high', norm: '<5.2' },
  { name: 'Тромбоциты', value: '234', unit: '×10⁹/л', status: 'normal', norm: '150–400' },
  { name: 'СОЭ', value: '18', unit: 'мм/ч', status: 'normal', norm: '2–15' },
];

export default function App() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUserMenuOpen(false);
  };

  const openAuth = (mode: 'login' | 'register') => {
    setMobileMenuOpen(false);
    setAuthModal(mode);
  };

  if (user) {
    return <Dashboard user={user} onSignOut={() => setUser(null)} />;
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ── NAVBAR ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center shadow-md shadow-emerald-200">
                <Activity size={18} className="text-white" />
              </div>
              <span className="font-black text-xl text-gray-900 tracking-tight">Мои анализы</span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">Возможности</a>
              <a href="#how" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">Как работает</a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">Тарифы</a>
              <a href="#app" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">Приложение</a>
              <button
                onClick={() => openAuth('login')}
                className="flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-700 font-semibold transition-colors"
                title="Войти как администратор"
              >
                <Settings size={14} />
                Админ
              </button>
            </nav>

            {/* Auth buttons desktop */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-xl px-3 py-2 transition-colors"
                  >
                    <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center">
                      <User size={14} className="text-white" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 max-w-[120px] truncate">
                      {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    </span>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs text-gray-400">Вы вошли как</p>
                        <p className="text-sm font-medium text-gray-700 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={15} />
                        Выйти
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => openAuth('login')}
                    className="text-sm font-semibold text-gray-700 hover:text-gray-900 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    Войти
                  </button>
                  <button
                    onClick={() => openAuth('register')}
                    className="text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 px-5 py-2 rounded-xl transition-colors shadow-md shadow-emerald-200"
                  >
                    Начать бесплатно
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 font-medium py-2">Возможности</a>
              <a href="#how" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 font-medium py-2">Как работает</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 font-medium py-2">Тарифы</a>
              <a href="#app" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 font-medium py-2">Приложение</a>
              <div className="pt-2 border-t border-gray-100 space-y-2">
                {user ? (
                  <button onClick={handleSignOut} className="w-full flex items-center justify-center gap-2 py-3 text-red-500 font-semibold border border-red-200 rounded-xl">
                    <LogOut size={16} /> Выйти
                  </button>
                ) : (
                  <>
                    <button onClick={() => openAuth('login')} className="w-full py-3 text-gray-700 font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                      Войти
                    </button>
                    <button onClick={() => openAuth('register')} className="w-full py-3 text-white font-semibold bg-emerald-500 rounded-xl hover:bg-emerald-600 transition-colors">
                      Начать бесплатно
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-emerald-50/30">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Text */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-emerald-100">
                <Zap size={14} />
                ИИ-расшифровка за секунды
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 leading-[1.05] mb-6">
                Понимайте свои<br />
                <span className="text-emerald-500">анализы</span> как<br />
                профессионал
              </h1>
              <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                Загружайте анализы крови, мочи, биохимию и другие — ИИ расшифрует каждый показатель,
                выявит отклонения и укажет на возможные причины.
              </p>

              {/* Analysis type tags */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-8">
                {analysisTypes.map(t => (
                  <span key={t} className="text-sm text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-full font-medium shadow-sm">
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                {user ? (
                  <button
                    onClick={() => {}}
                    className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 shadow-xl shadow-emerald-200 text-base"
                  >
                    <Upload size={18} />
                    Загрузить анализы
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => openAuth('register')}
                      className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 shadow-xl shadow-emerald-200 text-base"
                    >
                      Начать бесплатно
                      <ArrowRight size={16} />
                    </button>
                    <button
                      onClick={() => openAuth('login')}
                      className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-bold px-8 py-4 rounded-2xl transition-all duration-200 shadow-sm border border-gray-200 text-base"
                    >
                      Войти в кабинет
                    </button>
                  </>
                )}
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-4 mt-8 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {['АП', 'ДК', 'СМ', 'МВ'].map((initials, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ background: ['#10b981', '#0d9488', '#059669', '#14b8a6'][i] }}
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">+12 000 пользователей</p>
                </div>
              </div>
            </div>

            {/* Mockup */}
            <div className="flex-shrink-0 relative">
              <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-3xl scale-110 pointer-events-none" />
              <MobileAppMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ── DEMO RESULTS STRIP ── */}
      <section className="bg-white py-12 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-8">
            Пример расшифровки анализа крови
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {demoResults.map(r => (
              <div key={r.name} className={`rounded-2xl p-4 border ${
                r.status === 'normal'
                  ? 'bg-emerald-50 border-emerald-100'
                  : 'bg-amber-50 border-amber-100'
              }`}>
                <p className="text-xs font-medium text-gray-500 mb-1">{r.name}</p>
                <p className={`text-xl font-black ${r.status === 'normal' ? 'text-emerald-700' : 'text-amber-600'}`}>
                  {r.value}
                </p>
                <p className="text-xs text-gray-400">{r.unit}</p>
                <div className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                  r.status === 'normal'
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'bg-amber-100 text-amber-600'
                }`}>
                  {r.status === 'normal' ? 'В НОРМЕ' : 'ПОВЫШЕНО'}
                </div>
                <p className="text-[10px] text-gray-400 mt-1">норма: {r.norm}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-20 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              Всё для вашего здоровья
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Комплексная платформа для мониторинга здоровья с мощным ИИ-ассистентом
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(f => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              Как это работает
            </h2>
            <p className="text-gray-500 text-lg">Три шага до полного понимания ваших анализов</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-px bg-gradient-to-r from-emerald-200 via-teal-200 to-emerald-200" />

            {[
              {
                step: '01',
                icon: Camera,
                title: 'Сфотографируйте или загрузите',
                desc: 'Снимите бланк камерой прямо в приложении — OCR мгновенно распознает текст. Или загрузите PDF-файл.',
                color: 'bg-emerald-500',
              },
              {
                step: '02',
                icon: Brain,
                title: 'ИИ анализирует',
                desc: 'Нейросеть обрабатывает данные, сравнивает с нормами, выявляет отклонения и оценивает риски.',
                color: 'bg-teal-500',
              },
              {
                step: '03',
                icon: Salad,
                title: 'Получите план здоровья',
                desc: 'Расшифровка показателей, оценка рисков и персональная программа питания и образа жизни.',
                color: 'bg-emerald-600',
              },
            ].map(({ step, icon: Icon, title, desc, color }) => (
              <div key={step} className="flex flex-col items-center text-center relative">
                <div className={`w-20 h-20 ${color} rounded-3xl flex items-center justify-center shadow-xl mb-5 relative z-10`}>
                  <Icon size={28} className="text-white" />
                </div>
                <span className="text-xs font-bold text-gray-400 tracking-widest mb-2">{step}</span>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SYMPTOM CHECKER SECTION ── */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Demo chat */}
            <div className="flex-1 order-2 lg:order-1">
              <div className="bg-gray-800 rounded-3xl p-6 shadow-2xl border border-gray-700 max-w-md mx-auto lg:mx-0">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center">
                    <Brain size={16} className="text-white" />
                  </div>
                  <span className="text-white font-bold text-sm">ИИ-ассистент</span>
                  <span className="ml-auto flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-xs text-emerald-400">онлайн</span>
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-end">
                    <div className="bg-emerald-500 text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[80%]">
                      У меня постоянная усталость и головокружение. Вот мои анализы крови.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 bg-gray-700 rounded-xl flex-shrink-0 flex items-center justify-center">
                      <Brain size={14} className="text-emerald-400" />
                    </div>
                    <div className="bg-gray-700 text-gray-200 text-sm px-4 py-3 rounded-2xl rounded-tl-sm max-w-[85%] leading-relaxed">
                      Анализирую ваши показатели... Обнаружил сниженный уровень гемоглобина (98 г/л при норме 120–160). Это может указывать на
                      <span className="text-emerald-400 font-semibold"> железодефицитную анемию</span>. Также повышен показатель СОЭ.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 bg-gray-700 rounded-xl flex-shrink-0 flex items-center justify-center">
                      <Brain size={14} className="text-emerald-400" />
                    </div>
                    <div className="bg-gray-700 text-gray-200 text-sm px-4 py-3 rounded-2xl rounded-tl-sm max-w-[85%] leading-relaxed">
                      Рекомендую обратиться к терапевту или гематологу. Могу сформировать отчёт для врача.
                    </div>
                  </div>
                </div>

                {/* Input bar */}
                <div className="bg-gray-900 rounded-2xl flex items-center gap-2 px-4 py-3">
                  <span className="text-gray-500 text-sm flex-1">Опишите симптомы...</span>
                  <button className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center">
                    <ChevronRight size={16} className="text-white" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 order-1 lg:order-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-emerald-500/20">
                <Brain size={14} />
                ИИ-диагностика
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-5">
                Опишите симптомы —<br />
                <span className="text-emerald-400">ИИ выявит причины</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Загрузите анализы, опишите жалобы, и ИИ-ассистент укажет на возможные заболевания,
                основываясь на научно-обоснованных данных.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Анализ симптомов на основе ваших анализов',
                  'Предварительный диагноз с объяснением',
                  'Рекомендации к специалисту',
                  'Оценка серьёзности отклонений',
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-gray-300">
                    <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check size={12} className="text-white" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => openAuth('register')}
                className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 shadow-xl shadow-emerald-900/30 mx-auto lg:mx-0"
              >
                Попробовать бесплатно
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              Что говорят пользователи
            </h2>
            <p className="text-gray-500 text-lg">Тысячи людей уже следят за своим здоровьем</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{t.avatar}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              Простые и честные тарифы
            </h2>
            <p className="text-gray-500 text-lg">Начните бесплатно, переходите когда нужно</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {plans.map(plan => (
              <div
                key={plan.name}
                className={`relative rounded-3xl p-7 flex flex-col ${
                  plan.highlighted
                    ? 'bg-gray-900 text-white shadow-2xl scale-[1.02]'
                    : 'bg-white border border-gray-200 shadow-sm'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
                    Популярный
                  </div>
                )}
                <div className="mb-5">
                  <p className={`text-sm font-semibold mb-1 ${plan.highlighted ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    {plan.name}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-black ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                      {plan.price === '0' ? 'Бесплатно' : `${plan.price}₽`}
                    </span>
                    {plan.period && (
                      <span className={`text-sm ${plan.highlighted ? 'text-gray-400' : 'text-gray-400'}`}>
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm mt-1 ${plan.highlighted ? 'text-gray-400' : 'text-gray-500'}`}>
                    {plan.description}
                  </p>
                </div>
                <ul className="space-y-3 flex-1 mb-7">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        plan.highlighted ? 'bg-emerald-500' : 'bg-emerald-100'
                      }`}>
                        <Check size={11} className={plan.highlighted ? 'text-white' : 'text-emerald-600'} />
                      </div>
                      <span className={`text-sm ${plan.highlighted ? 'text-gray-300' : 'text-gray-600'}`}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => openAuth('register')}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                    plan.highlighted
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-900/30'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MOBILE APP ── */}
      <section id="app" className="py-20 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-emerald-100">
                <Activity size={14} />
                Мобильное приложение
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-5">
                Всегда под рукой —<br />
                <span className="text-emerald-500">в вашем телефоне</span>
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                Загружайте анализы прямо со смартфона, отслеживайте показатели и получайте
                уведомления об изменениях. Приложение доступно на iOS и Android.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  'OCR-сканер: фото бланка → расшифровка за секунды',
                  'Программы питания на основе анализов',
                  'Уведомления об отклонениях показателей',
                  'Синхронизация между устройствами',
                ].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check size={11} className="text-emerald-600" />
                    </div>
                    <span className="text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 justify-center lg:justify-start flex-wrap">
                <div className="flex items-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-2xl cursor-pointer hover:bg-gray-800 transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] text-gray-400">Скачать в</p>
                    <p className="text-sm font-bold leading-none">App Store</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-2xl cursor-pointer hover:bg-gray-800 transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M3.18 23.76c.28.15.61.16.9.03l12.54-7.27-2.7-2.7-10.74 9.94zm16.13-10.45L16.8 11.8 3.2.27C2.9.12 2.56.13 2.28.3L14.54 12.5l4.77.81zM21.43 10c-.42-.24-1.04-.24-1.46 0l-2.45 1.42 2.7 2.7 1.2-.7c.7-.4.7-1.58.01-1.99L21.43 10zM3.18.28C2.89.15 2.56.16 2.28.3c-.56.32-.56 1.15 0 1.47L14.54 11.5 17.24 8.8 3.18.28z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] text-gray-400">Доступно в</p>
                    <p className="text-sm font-bold leading-none">Google Play</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 stacked phone mockups */}
            <div className="flex-shrink-0 flex items-end gap-4 relative">
              {/* Phone 1 - risk assessment */}
              <div className="relative bg-gray-900 rounded-[36px] p-2 shadow-2xl" style={{ width: 200, transform: 'rotate(-6deg) translateY(16px)' }}>
                <div className="bg-white rounded-[28px] overflow-hidden" style={{ height: 380 }}>
                  <div className="px-4 pt-4 pb-3">
                    <div className="flex items-center gap-2 mb-3">
                      <button className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 text-gray-500"><path d="m15 18-6-6 6-6"/></svg>
                      </button>
                      <span className="text-xs font-bold text-gray-900">Оценка рисков</span>
                    </div>
                    <p className="text-[9px] text-gray-500 mb-3">Факторы риска на основе ваших данных</p>
                    <div className="space-y-2">
                      {[
                        { name: 'Комплексная оценка', date: '13.04.2026', pct: 15, color: 'text-emerald-500' },
                        { name: 'Ожирение/метаболизм', date: '24.10.2025', pct: 35, color: 'text-amber-500' },
                        { name: 'Сердечно-сосудистые', date: '12.03.2025', pct: 25, color: 'text-emerald-500' },
                      ].map(item => (
                        <div key={item.name} className="bg-gray-50 rounded-xl p-2.5 flex items-center justify-between">
                          <div>
                            <p className="text-[9px] font-bold text-gray-800 leading-tight">{item.name}</p>
                            <p className="text-[8px] text-gray-400">{item.date}</p>
                          </div>
                          <div className="relative w-9 h-9">
                            <svg className="w-9 h-9 -rotate-90" viewBox="0 0 36 36">
                              <circle cx="18" cy="18" r="14" fill="none" stroke="#e5e7eb" strokeWidth="3"/>
                              <circle cx="18" cy="18" r="14" fill="none" stroke={item.pct > 30 ? '#f59e0b' : '#10b981'} strokeWidth="3"
                                strokeDasharray={`${item.pct * 0.88} 88`} strokeLinecap="round"/>
                            </svg>
                            <span className={`absolute inset-0 flex items-center justify-center text-[8px] font-bold ${item.color}`}>
                              {item.pct}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-center mt-1 pb-0.5">
                  <div className="w-14 h-1 bg-gray-600 rounded-full" />
                </div>
              </div>

              {/* Phone 2 - main (center) */}
              <div className="relative bg-gray-900 rounded-[40px] p-2 shadow-2xl z-10" style={{ width: 220 }}>
                <div className="bg-white rounded-[32px] overflow-hidden" style={{ height: 440 }}>
                  <div className="bg-emerald-500 px-4 pt-5 pb-4">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <p className="text-emerald-100 text-[10px]">Добрый день,</p>
                        <p className="text-white font-bold text-sm">Иван Иванов</p>
                      </div>
                      <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                        <User size={14} className="text-white" />
                      </div>
                    </div>
                    <div className="bg-white/15 rounded-xl p-2.5 mt-2">
                      <p className="text-emerald-100 text-[9px] mb-0.5">Последний анализ</p>
                      <p className="text-white font-bold text-xs">Общий анализ крови</p>
                      <p className="text-emerald-200 text-[9px]">13 мая 2026 • 3 отклонения</p>
                    </div>
                  </div>

                  <div className="px-3 pt-3">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-2">Мои анализы</p>
                    <div className="space-y-2">
                      {[
                        { name: 'Кровь (ОАК)', date: '13.05.2026', status: 'Есть отклонения', color: 'text-amber-500', dot: 'bg-amber-400' },
                        { name: 'Биохимия', date: '01.04.2026', status: 'В норме', color: 'text-emerald-500', dot: 'bg-emerald-400' },
                        { name: 'Гормоны', date: '10.02.2026', status: 'Есть отклонения', color: 'text-amber-500', dot: 'bg-amber-400' },
                        { name: 'Анализ мочи', date: '01.01.2026', status: 'В норме', color: 'text-emerald-500', dot: 'bg-emerald-400' },
                      ].map(item => (
                        <div key={item.name} className="flex items-center gap-2 bg-gray-50 rounded-xl p-2.5">
                          <div className={`w-2 h-2 rounded-full ${item.dot} flex-shrink-0`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold text-gray-800 truncate">{item.name}</p>
                            <p className="text-[9px] text-gray-400">{item.date}</p>
                          </div>
                          <span className={`text-[8px] font-bold ${item.color}`}>{item.status}</span>
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-3 bg-emerald-500 text-white text-[10px] font-bold py-2.5 rounded-xl">
                      + Загрузить анализ
                    </button>
                  </div>
                </div>
                <div className="flex justify-center mt-1.5 pb-1">
                  <div className="w-20 h-1 bg-gray-600 rounded-full" />
                </div>
              </div>

              {/* Phone 3 - chat */}
              <div className="relative bg-gray-900 rounded-[36px] p-2 shadow-2xl" style={{ width: 200, transform: 'rotate(6deg) translateY(16px)' }}>
                <div className="bg-white rounded-[28px] overflow-hidden" style={{ height: 380 }}>
                  <div className="bg-gray-900 px-3 pt-4 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center">
                        <Brain size={12} className="text-white" />
                      </div>
                      <span className="text-white text-xs font-bold">ИИ-ассистент</span>
                      <span className="ml-auto w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    </div>
                  </div>
                  <div className="px-3 py-3 space-y-2.5 bg-gray-50 flex-1" style={{ height: 300 }}>
                    <div className="flex justify-end">
                      <div className="bg-emerald-500 text-white text-[9px] px-3 py-1.5 rounded-xl rounded-tr-none max-w-[80%]">
                        Что значит повышенный холестерин?
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <div className="w-5 h-5 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                        <Brain size={10} className="text-emerald-600" />
                      </div>
                      <div className="bg-white text-gray-700 text-[9px] px-2.5 py-2 rounded-xl rounded-tl-none max-w-[85%] leading-relaxed shadow-sm">
                        Холестерин 6.2 ммоль/л — выше нормы. Это увеличивает риск атеросклероза. Рекомендую диету и консультацию кардиолога.
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-emerald-500 text-white text-[9px] px-3 py-1.5 rounded-xl rounded-tr-none max-w-[80%]">
                        Что мне нужно сдать ещё?
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <div className="w-5 h-5 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                        <Brain size={10} className="text-emerald-600" />
                      </div>
                      <div className="bg-white text-gray-700 text-[9px] px-2.5 py-2 rounded-xl rounded-tl-none max-w-[85%] leading-relaxed shadow-sm">
                        Рекомендую: липидный профиль, АЛТ, АСТ, ЭКГ и консультацию терапевта.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center mt-1 pb-0.5">
                  <div className="w-14 h-1 bg-gray-600 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-gradient-to-br from-emerald-500 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-2xl" />
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-5 leading-tight">
            Начните следить за здоровьем<br />прямо сейчас
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Первые 3 расшифровки — бесплатно. Регистрация занимает 30 секунд.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => openAuth('register')}
              className="flex items-center justify-center gap-2 bg-white text-emerald-700 font-bold px-8 py-4 rounded-2xl hover:bg-emerald-50 transition-all duration-200 shadow-xl text-base"
            >
              Зарегистрироваться бесплатно
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => openAuth('login')}
              className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 text-base border border-white/30"
            >
              Уже есть аккаунт
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <Activity size={16} className="text-white" />
                </div>
                <span className="text-white font-black text-lg">Мои анализы</span>
              </div>
              <p className="text-sm leading-relaxed">
                ИИ-платформа для расшифровки медицинских анализов и мониторинга здоровья.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 text-sm">Сервис</h4>
              <ul className="space-y-2 text-sm">
                {['Расшифровка анализов', 'ИИ-диагностика', 'Оценка рисков', 'Отчёты для врача'].map(l => (
                  <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 text-sm">Компания</h4>
              <ul className="space-y-2 text-sm">
                {['О нас', 'Блог', 'Карьера', 'Контакты'].map(l => (
                  <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 text-sm">Поддержка</h4>
              <ul className="space-y-2 text-sm">
                {['Помощь', 'Политика конфиденциальности', 'Условия использования', 'Медицинский отказ'].map(l => (
                  <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
                ))}
                <li>
                  <button
                    onClick={() => openAuth('login')}
                    className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors font-semibold"
                  >
                    <Settings size={12} /> Панель администратора
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm">© 2026 Мои анализы. Все права защищены.</p>
            <p className="text-xs text-gray-600 max-w-sm text-center">
              Сервис не является медицинским и не заменяет консультацию врача.
            </p>
          </div>
        </div>
      </footer>

      {/* ── AUTH MODAL ── */}
      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onSuccess={() => setAuthModal(null)}
          onSwitchMode={setAuthModal}
        />
      )}

      {/* Click outside user menu */}
      {userMenuOpen && (
        <div className="fixed inset-0 z-30" onClick={() => setUserMenuOpen(false)} />
      )}
    </div>
  );
}
