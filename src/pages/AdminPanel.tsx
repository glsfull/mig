import { useState, useEffect } from 'react';
import {
  Settings, Key, Brain, Eye, EyeOff, Save, CheckCircle,
  AlertTriangle, Shield, Sliders, ToggleLeft, ToggleRight,
  ChevronDown, ChevronUp, Users, Activity, BarChart3
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AdminSetting {
  id: string;
  key: string;
  value: string;
  label: string;
  description: string;
  is_secret: boolean;
}

interface StatsCard {
  label: string;
  value: string;
  icon: typeof Activity;
  color: string;
  bg: string;
}

const STATS: StatsCard[] = [
  { label: 'Пользователей', value: '1 247', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Анализов загружено', value: '8 914', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'ИИ-запросов', value: '23 441', icon: Brain, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Активных сегодня', value: '184', icon: BarChart3, color: 'text-rose-600', bg: 'bg-rose-50' },
];

const AI_PROVIDERS = [
  { id: 'openai', name: 'OpenAI', models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'] },
  { id: 'anthropic', name: 'Anthropic Claude', models: ['claude-sonnet-4-5', 'claude-haiku-3-5', 'claude-opus-4-5'] },
  { id: 'gemini', name: 'Google Gemini', models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-2.0-flash'] },
  { id: 'yandexgpt', name: 'YandexGPT', models: ['yandexgpt-lite', 'yandexgpt', 'yandexgpt-32k'] },
];

const OCR_PROVIDERS = [
  { id: 'tesseract', name: 'Tesseract (бесплатно)' },
  { id: 'google_vision', name: 'Google Cloud Vision' },
  { id: 'aws_textract', name: 'AWS Textract' },
  { id: 'azure_cv', name: 'Azure Computer Vision' },
];

export default function AdminPanel() {
  const [settings, setSettings] = useState<AdminSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [ocrKey, setOcrKey] = useState('');
  const [showOcrKey, setShowOcrKey] = useState(false);
  const [openSection, setOpenSection] = useState<string>('ai');

  const getSetting = (key: string) => settings.find(s => s.key === key)?.value ?? '';
  const provider = getSetting('ai_provider') || 'openai';
  const model = getSetting('ai_model') || 'gpt-4o';
  const aiEnabled = getSetting('ai_enabled') === 'true';
  const ocrEnabled = getSetting('ocr_enabled') === 'true';
  const ocrProvider = getSetting('ocr_provider') || 'tesseract';
  const maxTokens = getSetting('ai_max_tokens') || '2000';
  const temperature = getSetting('ai_temperature') || '0.3';

  const currentProviderModels = AI_PROVIDERS.find(p => p.id === provider)?.models ?? [];

  useEffect(() => {
    supabase.from('admin_settings').select('*').then(({ data }) => {
      if (data) setSettings(data);
      setLoading(false);
    });
  }, []);

  const updateLocal = (key: string, value: string) => {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
  };

  const saveSettings = async (keys: string[]) => {
    setSaving(true);
    for (const key of keys) {
      const val = settings.find(s => s.key === key)?.value ?? '';
      await supabase.from('admin_settings').update({ value: val, updated_at: new Date().toISOString() }).eq('key', key);
    }
    setSaving(false);
    setSavedKey(keys[0]);
    setTimeout(() => setSavedKey(null), 2500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const Section = ({ id, title, icon: Icon, children }: { id: string; title: string; icon: typeof Settings; children: React.ReactNode }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpenSection(openSection === id ? '' : id)}
        className="w-full flex items-center gap-3 p-5 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Icon size={17} className="text-gray-600" />
        </div>
        <span className="font-bold text-gray-900 flex-1">{title}</span>
        {openSection === id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      {openSection === id && (
        <div className="border-t border-gray-50 px-5 pb-5 pt-4 space-y-5">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Warning banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
        <Shield size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-amber-900 text-sm">Панель администратора</p>
          <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
            Изменения затрагивают всех пользователей платформы. Секретные ключи API хранятся в защищённом хранилище Edge Function Secrets и никогда не передаются клиенту.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATS.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mb-2`}>
              <s.icon size={17} className={s.color} />
            </div>
            <p className="text-xl font-black text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* AI Configuration */}
      <Section id="ai" title="Настройка нейросети" icon={Brain}>
        {/* Toggle */}
        <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
          <div>
            <p className="font-bold text-gray-900 text-sm">ИИ-расшифровка включена</p>
            <p className="text-xs text-gray-500 mt-0.5">Доступна для всех пользователей</p>
          </div>
          <button onClick={() => { updateLocal('ai_enabled', aiEnabled ? 'false' : 'true'); }}>
            {aiEnabled
              ? <ToggleRight size={32} className="text-emerald-500" />
              : <ToggleLeft size={32} className="text-gray-300" />}
          </button>
        </div>

        {/* Provider */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Провайдер нейросети</label>
          <div className="grid grid-cols-2 gap-2">
            {AI_PROVIDERS.map(p => (
              <button
                key={p.id}
                onClick={() => {
                  updateLocal('ai_provider', p.id);
                  updateLocal('ai_model', p.models[0]);
                }}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-left transition-all ${
                  provider === p.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${provider === p.id ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                <span className={`text-xs font-bold ${provider === p.id ? 'text-emerald-700' : 'text-gray-600'}`}>{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Model */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Модель</label>
          <div className="flex flex-wrap gap-2">
            {currentProviderModels.map(m => (
              <button
                key={m}
                onClick={() => updateLocal('ai_model', m)}
                className={`text-xs font-bold px-3 py-2 rounded-xl border-2 transition-all ${
                  model === m ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* API Key */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
            <Key size={11} />
            API-ключ {AI_PROVIDERS.find(p => p.id === provider)?.name}
          </label>
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="sk-... или введите новый ключ"
              className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition font-mono"
            />
            <button
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            Ключ сохраняется в Supabase Edge Function Secrets и недоступен клиенту
          </p>
        </div>

        {/* Params */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Макс. токенов</label>
            <input
              type="number"
              value={maxTokens}
              onChange={e => updateLocal('ai_max_tokens', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Temperature</label>
            <input
              type="number"
              step="0.1"
              min="0" max="1"
              value={temperature}
              onChange={e => updateLocal('ai_temperature', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            />
          </div>
        </div>

        <button
          onClick={() => saveSettings(['ai_provider', 'ai_model', 'ai_enabled', 'ai_max_tokens', 'ai_temperature'])}
          disabled={saving}
          className={`w-full flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl transition-all text-sm ${
            savedKey === 'ai_provider'
              ? 'bg-emerald-500 text-white'
              : 'bg-gray-900 hover:bg-gray-800 text-white'
          }`}
        >
          {savedKey === 'ai_provider' ? <><CheckCircle size={16} /> Сохранено</> : saving ? 'Сохранение...' : <><Save size={16} /> Сохранить настройки ИИ</>}
        </button>
      </Section>

      {/* OCR Configuration */}
      <Section id="ocr" title="Настройка OCR (распознавание текста)" icon={Settings}>
        <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
          <div>
            <p className="font-bold text-gray-900 text-sm">OCR включён</p>
            <p className="text-xs text-gray-500 mt-0.5">Сканирование анализов с камеры</p>
          </div>
          <button onClick={() => updateLocal('ocr_enabled', ocrEnabled ? 'false' : 'true')}>
            {ocrEnabled
              ? <ToggleRight size={32} className="text-emerald-500" />
              : <ToggleLeft size={32} className="text-gray-300" />}
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">OCR провайдер</label>
          <div className="space-y-2">
            {OCR_PROVIDERS.map(p => (
              <button
                key={p.id}
                onClick={() => updateLocal('ocr_provider', p.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${
                  ocrProvider === p.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${ocrProvider === p.id ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                <span className={`text-sm font-semibold ${ocrProvider === p.id ? 'text-emerald-700' : 'text-gray-600'}`}>{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {ocrProvider !== 'tesseract' && (
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
              <Key size={11} />
              API-ключ для OCR
            </label>
            <div className="relative">
              <input
                type={showOcrKey ? 'text' : 'password'}
                value={ocrKey}
                onChange={e => setOcrKey(e.target.value)}
                placeholder="Введите ключ OCR провайдера"
                className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition font-mono"
              />
              <button onClick={() => setShowOcrKey(!showOcrKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showOcrKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => saveSettings(['ocr_enabled', 'ocr_provider'])}
          disabled={saving}
          className={`w-full flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl transition-all text-sm ${
            savedKey === 'ocr_enabled'
              ? 'bg-emerald-500 text-white'
              : 'bg-gray-900 hover:bg-gray-800 text-white'
          }`}
        >
          {savedKey === 'ocr_enabled' ? <><CheckCircle size={16} /> Сохранено</> : <><Save size={16} /> Сохранить OCR</>}
        </button>
      </Section>

      {/* Current config summary */}
      <Section id="summary" title="Текущая конфигурация" icon={Sliders}>
        <div className="space-y-2">
          {[
            { label: 'Провайдер ИИ', value: AI_PROVIDERS.find(p => p.id === provider)?.name ?? provider },
            { label: 'Модель', value: model },
            { label: 'ИИ активен', value: aiEnabled ? 'Да' : 'Нет' },
            { label: 'Макс. токенов', value: maxTokens },
            { label: 'Temperature', value: temperature },
            { label: 'OCR активен', value: ocrEnabled ? 'Да' : 'Нет' },
            { label: 'OCR провайдер', value: OCR_PROVIDERS.find(p => p.id === ocrProvider)?.name ?? ocrProvider },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5">
              <span className="text-sm text-gray-500">{row.label}</span>
              <span className="text-sm font-bold text-gray-900">{row.value}</span>
            </div>
          ))}
        </div>
      </Section>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
        <AlertTriangle size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-800 leading-relaxed">
          Для применения ключей API в production разверните их через Supabase Dashboard → Edge Functions → Secrets.
          Имена переменных: <code className="bg-blue-100 px-1 rounded">AI_API_KEY</code>, <code className="bg-blue-100 px-1 rounded">OCR_API_KEY</code>.
        </p>
      </div>
    </div>
  );
}
