import { useState } from 'react';
import {
  Activity, Upload, BarChart3, Brain, Pill, LogOut,
  TrendingUp, ShieldCheck, BookOpen, User, Home,
  ChevronRight, Menu, History, Camera, Salad, Settings
} from 'lucide-react';
import type { SupabaseUser } from '../types';
import { supabase } from '../lib/supabase';
import UploadPanel from '../components/dashboard/UploadPanel';
import AnalysisMarkerCard from '../components/dashboard/AnalysisMarkerCard';
import SymptomChecker from '../components/dashboard/SymptomChecker';
import MedicationSchedule from '../components/dashboard/MedicationSchedule';
import CameraScanner from '../components/dashboard/CameraScanner';
import HealthHome from './HealthHome';
import AnalysisHistory from './AnalysisHistory';
import RiskAssessment from './RiskAssessment';
import DoctorReport from './DoctorReport';
import Encyclopedia from './Encyclopedia';
import HealthProfile from './HealthProfile';
import HealthPrograms from './HealthPrograms';
import AdminPanel from './AdminPanel';
import { DEMO_MARKERS } from '../data/demoAnalysis';

export type Tab =
  | 'home' | 'upload' | 'camera' | 'results'
  | 'history' | 'symptoms' | 'meds' | 'risks'
  | 'report' | 'encyclopedia' | 'profile' | 'programs' | 'admin';

interface Props {
  user: SupabaseUser;
  onSignOut: () => void;
}

const SIDEBAR_GROUPS = [
  {
    label: 'Главное',
    items: [
      { id: 'home' as Tab, icon: Home, label: 'Обзор' },
      { id: 'upload' as Tab, icon: Upload, label: 'Загрузить анализ' },
      { id: 'camera' as Tab, icon: Camera, label: 'Сканер камеры' },
      { id: 'results' as Tab, icon: Activity, label: 'Расшифровка' },
    ],
  },
  {
    label: 'Аналитика',
    items: [
      { id: 'history' as Tab, icon: History, label: 'История' },
      { id: 'risks' as Tab, icon: ShieldCheck, label: 'Оценка рисков' },
    ],
  },
  {
    label: 'ИИ & Здоровье',
    items: [
      { id: 'symptoms' as Tab, icon: Brain, label: 'ИИ-диагностика' },
      { id: 'meds' as Tab, icon: Pill, label: 'Лекарства' },
      { id: 'programs' as Tab, icon: Salad, label: 'Программы здоровья' },
    ],
  },
  {
    label: 'Прочее',
    items: [
      { id: 'report' as Tab, icon: BarChart3, label: 'Отчёт врачу' },
      { id: 'encyclopedia' as Tab, icon: BookOpen, label: 'Справочник' },
      { id: 'profile' as Tab, icon: User, label: 'Профиль' },
    ],
  },
];

const BOTTOM_TABS: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Главная', icon: Home },
  { id: 'history', label: 'Анализы', icon: History },
  { id: 'symptoms', label: 'ИИ', icon: Brain },
  { id: 'programs', label: 'Программы', icon: Salad },
  { id: 'profile', label: 'Профиль', icon: User },
];

const TAB_TITLES: Record<Tab, string> = {
  home: 'Обзор здоровья',
  upload: 'Загрузить анализ',
  camera: 'Сканер камеры',
  results: 'Расшифровка',
  history: 'История анализов',
  symptoms: 'ИИ-диагностика',
  meds: 'Расписание лекарств',
  risks: 'Оценка рисков',
  report: 'Отчёт для врача',
  encyclopedia: 'Справочник',
  profile: 'Профиль здоровья',
  programs: 'Программы здоровья',
  admin: 'Администратор',
};

const SUMMARY_STATS = {
  total: DEMO_MARKERS.length,
  normal: DEMO_MARKERS.filter(m => m.status === 'normal').length,
  abnormal: DEMO_MARKERS.filter(m => m.status !== 'normal').length,
};

const ADMIN_EMAIL = 'admin@moianalizi.ru';

export default function Dashboard({ user, onSignOut }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [analysisReady, setAnalysisReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Пользователь';
  const initials = displayName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);
  const isAdmin = user.email === ADMIN_EMAIL || user.user_metadata?.role === 'admin';

  const handleAnalysisReady = () => {
    setAnalysisReady(true);
    setTimeout(() => setActiveTab('results'), 600);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onSignOut();
  };

  const navigate = (tab: Tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const categories = [...new Set(DEMO_MARKERS.map(m => m.category))];

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
        <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center shadow-md shadow-emerald-200">
          <Activity size={18} className="text-white" />
        </div>
        <div>
          <p className="font-black text-gray-900 text-base leading-tight">Мои анализы</p>
          <p className="text-[10px] text-gray-400">Health Platform</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {SIDEBAR_GROUPS.map(group => (
          <div key={group.label}>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-1.5">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map(item => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${
                    activeTab === item.id
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <item.icon size={16} className={activeTab === item.id ? 'text-emerald-600' : 'text-gray-400'} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Admin section */}
        {isAdmin && (
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-1.5">Управление</p>
            <button
              onClick={() => navigate('admin')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${
                activeTab === 'admin' ? 'bg-amber-50 text-amber-700' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Settings size={16} className={activeTab === 'admin' ? 'text-amber-600' : 'text-gray-400'} />
              Панель администратора
            </button>
          </div>
        )}
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate('profile')}>
          <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{displayName}</p>
            <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
          </div>
          <button onClick={e => { e.stopPropagation(); handleSignOut(); }} className="text-gray-300 hover:text-red-400 transition-colors">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </>
  );

  const pageContent = (
    <div className="space-y-5">
      {activeTab === 'results' && analysisReady && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
            <p className="text-2xl font-black text-gray-900">{SUMMARY_STATS.total}</p>
            <p className="text-xs text-gray-500 mt-0.5">Показателей</p>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 shadow-sm text-center">
            <p className="text-2xl font-black text-emerald-600">{SUMMARY_STATS.normal}</p>
            <p className="text-xs text-emerald-600 mt-0.5">В норме</p>
          </div>
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 shadow-sm text-center">
            <p className="text-2xl font-black text-amber-600">{SUMMARY_STATS.abnormal}</p>
            <p className="text-xs text-amber-600 mt-0.5">Отклонений</p>
          </div>
        </div>
      )}

      {activeTab === 'home' && <HealthHome user={user} onNavigate={navigate} />}

      {activeTab === 'upload' && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <UploadPanel onAnalysisReady={handleAnalysisReady} />
        </div>
      )}

      {activeTab === 'camera' && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <CameraScanner onScanComplete={handleAnalysisReady} />
        </div>
      )}

      {activeTab === 'results' && (
        <div className="space-y-5">
          {!analysisReady ? (
            <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
              <Upload size={36} className="mx-auto text-gray-200 mb-4" />
              <p className="font-bold text-gray-700 mb-1">Нет данных для отображения</p>
              <p className="text-sm text-gray-400 mb-6">Загрузите анализ или отсканируйте камерой</p>
              <div className="flex gap-3 justify-center flex-wrap">
                <button onClick={() => setActiveTab('upload')} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-3 rounded-2xl transition-colors">
                  <Upload size={16} /> Загрузить
                </button>
                <button onClick={() => setActiveTab('camera')} className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold px-5 py-3 rounded-2xl transition-colors">
                  <Camera size={16} /> Сканировать
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">Общий анализ крови</span>
                  <span className="text-xs text-gray-400">13 мая 2026</span>
                </div>
                <h2 className="text-lg font-black text-gray-900">Расшифровка анализа</h2>
                <p className="text-sm text-gray-400">анализ_крови_13052026.pdf</p>
              </div>
              {categories.map(cat => (
                <div key={cat}>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1 mb-3">{cat}</h3>
                  <div className="space-y-3">
                    {DEMO_MARKERS.filter(m => m.category === cat).map((marker, i) => (
                      <AnalysisMarkerCard key={marker.id} marker={marker} index={i} />
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={() => setActiveTab('programs')} className="w-full bg-gradient-to-br from-teal-600 to-emerald-600 rounded-3xl p-5 text-left flex items-center justify-between group">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                      <Salad size={14} className="text-white" />
                    </div>
                    <span className="text-white font-bold text-sm">Подобрать программу здоровья</span>
                  </div>
                  <p className="text-white/70 text-xs">На основе ваших отклонений</p>
                </div>
                <ChevronRight size={18} className="text-white/50 group-hover:text-white transition-colors" />
              </button>
            </>
          )}
        </div>
      )}

      {activeTab === 'history' && <AnalysisHistory />}
      {activeTab === 'symptoms' && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <SymptomChecker />
        </div>
      )}
      {activeTab === 'meds' && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <MedicationSchedule />
        </div>
      )}
      {activeTab === 'risks' && <RiskAssessment />}
      {activeTab === 'report' && <DoctorReport />}
      {activeTab === 'encyclopedia' && <Encyclopedia />}
      {activeTab === 'programs' && <HealthPrograms />}
      {activeTab === 'admin' && <AdminPanel />}
      {activeTab === 'profile' && (
        <div className="space-y-5">
          <HealthProfile />
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {[
              { tab: 'programs' as Tab, icon: Salad, label: 'Программы здоровья', color: 'text-teal-600', bg: 'bg-teal-50' },
              { tab: 'risks' as Tab, icon: ShieldCheck, label: 'Оценка рисков', color: 'text-rose-600', bg: 'bg-rose-50' },
              { tab: 'report' as Tab, icon: BarChart3, label: 'Отчёт для врача', color: 'text-teal-600', bg: 'bg-teal-50' },
              { tab: 'encyclopedia' as Tab, icon: BookOpen, label: 'Справочник', color: 'text-amber-600', bg: 'bg-amber-50' },
              ...(isAdmin ? [{ tab: 'admin' as Tab, icon: Settings, label: 'Панель администратора', color: 'text-amber-600', bg: 'bg-amber-50' }] : []),
            ].map((item, i, arr) => (
              <button key={item.tab} onClick={() => navigate(item.tab)}
                className={`w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors ${i < arr.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <div className={`w-8 h-8 ${item.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <item.icon size={16} className={item.color} />
                </div>
                <span className="font-semibold text-gray-700 text-sm flex-1">{item.label}</span>
                <ChevronRight size={14} className="text-gray-300" />
              </button>
            ))}
          </div>
          <button onClick={handleSignOut} className="w-full flex items-center justify-center gap-2 text-red-500 font-bold py-3.5 rounded-2xl border-2 border-red-100 hover:bg-red-50 transition-colors">
            <LogOut size={16} /> Выйти из аккаунта
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 lg:w-64 bg-white border-r border-gray-100 fixed top-0 left-0 bottom-0 z-30 shadow-sm">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-72 bg-white h-full flex flex-col shadow-2xl animate-slide-right">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-60 lg:ml-64">
        {/* Top header */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
          <div className="px-4 md:px-6 lg:px-8 h-14 flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 flex-shrink-0">
              <Menu size={18} className="text-gray-600" />
            </button>
            <h1 className="font-black text-gray-900 text-base flex-1 truncate">{TAB_TITLES[activeTab]}</h1>

            {/* Desktop quick tabs */}
            <nav className="hidden lg:flex items-center gap-1 mr-2">
              {([
                { id: 'home' as Tab, label: 'Обзор' },
                { id: 'camera' as Tab, label: 'Сканер' },
                { id: 'symptoms' as Tab, label: 'ИИ' },
                { id: 'programs' as Tab, label: 'Программы' },
              ]).map(tab => (
                <button key={tab.id} onClick={() => navigate(tab.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    activeTab === tab.id ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}>
                  {tab.label}
                </button>
              ))}
              {isAdmin && (
                <button onClick={() => navigate('admin')}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'admin' ? 'bg-amber-500 text-white' : 'text-amber-600 hover:bg-amber-50'
                  }`}>
                  <Settings size={13} /> Админ
                </button>
              )}
            </nav>

            <button onClick={() => navigate('profile')} className="md:hidden w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{initials}</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 md:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-4xl w-full mx-auto">
          {pageContent}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 shadow-lg">
        <div className="grid grid-cols-5 h-16">
          {BOTTOM_TABS.map(tab => (
            <button key={tab.id} onClick={() => navigate(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                activeTab === tab.id ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'
              }`}>
              <div className={`p-1.5 rounded-xl ${activeTab === tab.id ? 'bg-emerald-50' : ''}`}>
                <tab.icon size={20} />
              </div>
              <span className="text-[9px] font-semibold leading-none">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}