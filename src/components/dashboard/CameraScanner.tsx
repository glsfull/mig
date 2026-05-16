import { useState, useRef, useCallback } from 'react';
import { Camera, X, Zap, CheckCircle, AlertTriangle, RotateCcw, Image, FlashlightOff as FlashOff } from 'lucide-react';

interface Props {
  onScanComplete: () => void;
}

type ScanState = 'idle' | 'preview' | 'scanning' | 'done' | 'error';

const SCAN_STEPS = [
  { label: 'Распознавание текста (OCR)', duration: 900 },
  { label: 'Извлечение показателей', duration: 700 },
  { label: 'Сопоставление с нормами', duration: 600 },
  { label: 'Формирование расшифровки', duration: 500 },
];

const DEMO_DETECTED = [
  { name: 'Гемоглобин', raw: 'Hgb 98 г/л', status: 'low' },
  { name: 'Лейкоциты', raw: 'WBC 11.2 × 10⁹/л', status: 'high' },
  { name: 'Тромбоциты', raw: 'PLT 245 × 10⁹/л', status: 'normal' },
  { name: 'СОЭ', raw: 'ESR 28 мм/ч', status: 'high' },
  { name: 'Глюкоза', raw: 'Glu 5.4 ммоль/л', status: 'normal' },
];

const SAMPLE_IMAGES = [
  { label: 'Анализ крови', bg: 'bg-red-50', text: 'text-red-700', emoji: '🩸' },
  { label: 'Биохимия', bg: 'bg-orange-50', text: 'text-orange-700', emoji: '🔬' },
  { label: 'Гормоны', bg: 'bg-blue-50', text: 'text-blue-700', emoji: '⚗️' },
];

export default function CameraScanner({ onScanComplete }: Props) {
  const [state, setState] = useState<ScanState>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [selectedSample, setSelectedSample] = useState(0);
  const [cameraMode, setCameraMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const runScan = useCallback(async () => {
    setState('scanning');
    setCurrentStep(0);
    setProgress(0);

    let elapsed = 0;
    const total = SCAN_STEPS.reduce((s, st) => s + st.duration, 0);

    for (let i = 0; i < SCAN_STEPS.length; i++) {
      setCurrentStep(i);
      const step = SCAN_STEPS[i];
      const frames = 20;
      const frameMs = step.duration / frames;

      for (let f = 0; f < frames; f++) {
        await new Promise(r => setTimeout(r, frameMs));
        elapsed += frameMs;
        setProgress(Math.round((elapsed / total) * 100));
      }
    }

    setState('done');
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setState('preview');
    }
  };

  const handleOpenCamera = () => {
    setCameraMode(true);
    setState('preview');
  };

  const handleReset = () => {
    setState('idle');
    setProgress(0);
    setCurrentStep(0);
    setCameraMode(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleConfirm = () => {
    onScanComplete();
  };

  if (state === 'idle') {
    return (
      <div className="space-y-5">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="relative">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-900/30">
              <Camera size={22} className="text-white" />
            </div>
            <h2 className="text-xl font-black mb-2">Сканер анализов</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Сфотографируйте бланк анализа или выберите фото из галереи.
              ИИ распознает текст и расшифрует каждый показатель за секунды.
            </p>
          </div>
        </div>

        {/* Camera / gallery buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleOpenCamera}
            className="flex flex-col items-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl p-5 transition-all active:scale-95 shadow-lg shadow-emerald-200"
          >
            <Camera size={28} />
            <div>
              <p className="font-bold text-sm">Сфотографировать</p>
              <p className="text-emerald-100 text-xs mt-0.5">Открыть камеру</p>
            </div>
          </button>

          <button
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center gap-3 bg-white hover:bg-gray-50 text-gray-700 rounded-2xl p-5 transition-all active:scale-95 shadow-sm border border-gray-200"
          >
            <Image size={28} className="text-gray-600" />
            <div>
              <p className="font-bold text-sm">Из галереи</p>
              <p className="text-gray-400 text-xs mt-0.5">JPG, PNG, HEIC</p>
            </div>
          </button>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Sample images */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Или выберите демо-пример</p>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {SAMPLE_IMAGES.map((s, i) => (
              <button
                key={s.label}
                onClick={() => { setSelectedSample(i); setState('preview'); }}
                className={`flex-shrink-0 flex flex-col items-center gap-2 ${s.bg} border-2 rounded-2xl p-4 transition-all hover:opacity-80 ${
                  selectedSample === i ? `border-current ${s.text}` : 'border-transparent'
                }`}
              >
                <span className="text-3xl">{s.emoji}</span>
                <span className={`text-xs font-bold ${s.text}`}>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-2">
          <p className="text-xs font-bold text-blue-800 uppercase tracking-wide">Советы для лучшего результата</p>
          {[
            'Убедитесь, что бланк хорошо освещён',
            'Держите камеру параллельно документу',
            'Избегайте бликов и теней',
            'Весь текст должен быть в кадре',
          ].map(t => (
            <div key={t} className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                <Zap size={9} className="text-blue-700" />
              </div>
              <p className="text-xs text-blue-700">{t}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (state === 'preview') {
    return (
      <div className="space-y-5">
        <div className="relative">
          {/* Camera preview simulation */}
          <div className="relative bg-gray-900 rounded-3xl overflow-hidden" style={{ aspectRatio: '3/4' }}>
            {cameraMode ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-6xl mb-4">📷</div>
                <p className="text-white text-sm font-semibold">Камера активна</p>
                <p className="text-gray-400 text-xs mt-1">Наведите на бланк анализа</p>
                <div className="absolute inset-8 border-2 border-emerald-400 rounded-2xl opacity-60">
                  <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-emerald-400 rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-emerald-400 rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-emerald-400 rounded-br-lg" />
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                <div className="text-5xl mb-4">{SAMPLE_IMAGES[selectedSample].emoji}</div>
                <div className="bg-white/10 backdrop-blur rounded-2xl p-4 w-full max-w-xs">
                  <div className="space-y-2">
                    {['ОАО «Лаборатория»', 'Анализ крови (ОАК)', 'Иванов И.И. · 13.05.2026', '─────────────────────', 'Hgb ............. 98 г/л', 'WBC ............. 11.2', 'PLT ............. 245', 'ESR ............. 28'].map(line => (
                      <div key={line} className={`h-2.5 bg-white/20 rounded-full ${line.includes('─') ? 'opacity-20' : ''}`} style={{ width: `${60 + Math.random() * 30}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Flash button */}
            <button className="absolute top-4 right-4 w-9 h-9 bg-black/40 rounded-full flex items-center justify-center">
              <FlashOff size={16} className="text-white" />
            </button>

            {/* Close */}
            <button onClick={handleReset} className="absolute top-4 left-4 w-9 h-9 bg-black/40 rounded-full flex items-center justify-center">
              <X size={16} className="text-white" />
            </button>
          </div>
        </div>

        <button
          onClick={runScan}
          className="w-full flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-200 text-base active:scale-95"
        >
          <Zap size={20} />
          Распознать и расшифровать
        </button>

        <button onClick={handleReset} className="w-full flex items-center justify-center gap-2 text-gray-500 font-semibold py-3">
          <RotateCcw size={14} /> Сделать снова
        </button>
      </div>
    );
  }

  if (state === 'scanning') {
    return (
      <div className="space-y-6 py-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 relative">
            <div className="absolute inset-0 border-4 border-emerald-200 rounded-full border-t-emerald-500 animate-spin" />
            <Zap size={28} className="text-emerald-600" />
          </div>
          <h3 className="text-lg font-black text-gray-900">Анализирую...</h3>
          <p className="text-sm text-gray-400 mt-1">ИИ обрабатывает ваш анализ</p>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
            <span>Обработка</span>
            <span className="text-emerald-600">{progress}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {SCAN_STEPS.map((step, i) => (
            <div key={step.label} className="flex items-center gap-3">
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                i < currentStep ? 'bg-emerald-500' : i === currentStep ? 'bg-emerald-100 animate-pulse' : 'bg-gray-100'
              }`}>
                {i < currentStep
                  ? <CheckCircle size={14} className="text-white" />
                  : <span className={`text-xs font-bold ${i === currentStep ? 'text-emerald-600' : 'text-gray-300'}`}>{i + 1}</span>
                }
              </div>
              <span className={`text-sm font-semibold ${
                i < currentStep ? 'text-emerald-700' : i === currentStep ? 'text-gray-900' : 'text-gray-300'
              }`}>{step.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (state === 'done') {
    return (
      <div className="space-y-5">
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-emerald-500" />
          </div>
          <h3 className="text-xl font-black text-gray-900">Распознано!</h3>
          <p className="text-sm text-gray-500 mt-1">{DEMO_DETECTED.length} показателей извлечено</p>
        </div>

        {/* Detected markers */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Извлечённые показатели</p>
          {DEMO_DETECTED.map(m => (
            <div key={m.name} className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                m.status === 'normal' ? 'bg-emerald-500' : m.status === 'high' ? 'bg-amber-500' : 'bg-blue-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">{m.name}</p>
                <p className="text-xs text-gray-400 font-mono">{m.raw}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                m.status === 'normal' ? 'bg-emerald-100 text-emerald-700' :
                m.status === 'high' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {m.status === 'normal' ? 'норма' : m.status === 'high' ? 'выше' : 'ниже'}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3 flex gap-2">
          <AlertTriangle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 leading-relaxed">
            Проверьте извлечённые данные перед подтверждением. OCR может допускать ошибки.
          </p>
        </div>

        <button
          onClick={handleConfirm}
          className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-200 text-base"
        >
          <CheckCircle size={18} />
          Перейти к расшифровке
        </button>

        <button onClick={handleReset} className="w-full flex items-center justify-center gap-2 text-gray-500 font-semibold py-2">
          <RotateCcw size={14} /> Сканировать снова
        </button>
      </div>
    );
  }

  return null;
}
