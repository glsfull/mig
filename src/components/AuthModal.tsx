import { useState } from 'react';
import { X, Eye, EyeOff, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  mode: 'login' | 'register';
  onClose: () => void;
  onSuccess: () => void;
  onSwitchMode: (mode: 'login' | 'register') => void;
}

export default function AuthModal({ mode, onClose, onSuccess, onSwitchMode }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        onSuccess();
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onSuccess();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Произошла ошибка';
      if (msg.includes('Invalid login credentials')) setError('Неверный email или пароль');
      else if (msg.includes('User already registered')) setError('Пользователь с таким email уже существует');
      else if (msg.includes('Password should be at least')) setError('Пароль должен содержать не менее 6 символов');
      else setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-modal-in">
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-8 pt-8 pb-10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
          >
            <X size={16} />
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
              <span className="text-white font-black text-lg">М</span>
            </div>
            <span className="text-white font-bold text-lg">Мои анализы</span>
          </div>
          <h2 className="text-white text-2xl font-bold">
            {mode === 'login' ? 'Добро пожаловать!' : 'Создать аккаунт'}
          </h2>
          <p className="text-white/80 text-sm mt-1">
            {mode === 'login'
              ? 'Войдите в личный кабинет'
              : 'Начните следить за своим здоровьем'}
          </p>
        </div>

        {/* Form */}
        <div className="px-8 py-6 -mt-4 bg-white rounded-t-3xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Полное имя</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  placeholder="Иван Иванов"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition text-gray-900 placeholder-gray-400 bg-gray-50"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="example@mail.ru"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition text-gray-900 placeholder-gray-400 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Пароль</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Минимум 6 символов"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition text-gray-900 placeholder-gray-400 bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 mt-2"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </button>

            <p className="text-center text-sm text-gray-500 pt-1">
              {mode === 'login' ? 'Ещё нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
              <button
                type="button"
                onClick={() => onSwitchMode(mode === 'login' ? 'register' : 'login')}
                className="text-emerald-600 font-semibold hover:underline"
              >
                {mode === 'login' ? 'Зарегистрироваться' : 'Войти'}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
