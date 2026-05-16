import { useState, useRef } from 'react';
import { Upload, FileText, X, Loader2, CheckCircle, Image } from 'lucide-react';

const ANALYSIS_TYPES = [
  { value: 'blood', label: 'Анализ крови (ОАК)' },
  { value: 'biochem', label: 'Биохимия крови' },
  { value: 'urine', label: 'Анализ мочи' },
  { value: 'hormones', label: 'Гормоны' },
  { value: 'stool', label: 'Анализ кала' },
  { value: 'allergy', label: 'Аллергопанель' },
  { value: 'vitamins', label: 'Витамины и микроэлементы' },
  { value: 'other', label: 'Другое' },
];

interface Props {
  onAnalysisReady: () => void;
}

export default function UploadPanel({ onAnalysisReady }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [analysisType, setAnalysisType] = useState('blood');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setDone(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setLoadingStep(0);

    const steps = [
      { delay: 800, step: 1 },
      { delay: 1400, step: 2 },
      { delay: 1200, step: 3 },
      { delay: 800, step: 4 },
    ];

    for (const { delay, step } of steps) {
      await new Promise(r => setTimeout(r, delay));
      setLoadingStep(step);
    }

    setLoading(false);
    setDone(true);
    setTimeout(onAnalysisReady, 600);
  };

  const LOADING_STEPS = [
    'Загрузка документа...',
    'Распознавание текста...',
    'Извлечение показателей...',
    'ИИ анализирует результаты...',
    'Формирование расшифровки...',
  ];

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 animate-bounce-once">
          <CheckCircle size={32} className="text-emerald-600" />
        </div>
        <h3 className="text-xl font-black text-gray-900 mb-2">Расшифровка готова!</h3>
        <p className="text-gray-500 text-sm">Анализируем результаты...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-10 text-center">
        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Loader2 size={28} className="text-emerald-500 animate-spin" />
        </div>
        <p className="text-lg font-bold text-gray-900 mb-6">Обрабатываем ваш анализ</p>
        <div className="max-w-xs mx-auto space-y-3">
          {LOADING_STEPS.map((step, i) => (
            <div key={i} className={`flex items-center gap-3 transition-all duration-500 ${i <= loadingStep ? 'opacity-100' : 'opacity-30'}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                i < loadingStep ? 'bg-emerald-500' : i === loadingStep ? 'bg-emerald-200' : 'bg-gray-100'
              }`}>
                {i < loadingStep ? (
                  <CheckCircle size={12} className="text-white" />
                ) : i === loadingStep ? (
                  <Loader2 size={10} className="text-emerald-600 animate-spin" />
                ) : null}
              </div>
              <span className={`text-sm ${i <= loadingStep ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>{step}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Type selector */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Тип анализа</label>
        <div className="grid grid-cols-2 gap-2">
          {ANALYSIS_TYPES.map(t => (
            <button
              key={t.value}
              onClick={() => setAnalysisType(t.value)}
              className={`text-left px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-150 ${
                analysisType === t.value
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Drop zone */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Файл анализа</label>
        <div
          onDrop={handleDrop}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => !file && inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer ${
            dragOver
              ? 'border-emerald-400 bg-emerald-50'
              : file
              ? 'border-emerald-300 bg-emerald-50/50 cursor-default'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.heic"
            className="hidden"
            onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
          />

          {file ? (
            <div>
              <div className="flex items-center justify-center gap-3 mb-2">
                {file.type.startsWith('image') ? (
                  <Image size={28} className="text-emerald-600" />
                ) : (
                  <FileText size={28} className="text-emerald-600" />
                )}
                <div className="text-left">
                  <p className="font-bold text-gray-900 text-sm truncate max-w-[200px]">{file.name}</p>
                  <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(0)} KB</p>
                </div>
              </div>
              <button
                onClick={e => { e.stopPropagation(); setFile(null); }}
                className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 mx-auto"
              >
                <X size={12} /> Удалить
              </button>
            </div>
          ) : (
            <div>
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Upload size={22} className="text-gray-400" />
              </div>
              <p className="text-sm font-semibold text-gray-700 mb-1">
                Перетащите файл или нажмите
              </p>
              <p className="text-xs text-gray-400">PDF, JPG, PNG, HEIC · до 20 МБ</p>
            </div>
          )}
        </div>
      </div>

      {/* Demo button */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-xs text-gray-400">или</span>
        </div>
      </div>
      <button
        onClick={() => {
          setFile(new File(['demo'], 'анализ_крови_13052026.pdf', { type: 'application/pdf' }));
          setAnalysisType('blood');
        }}
        className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm"
      >
        <FileText size={16} />
        Использовать демо-анализ
      </button>

      <button
        onClick={handleAnalyze}
        disabled={!file}
        className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-emerald-200 text-base"
      >
        <Upload size={18} />
        Расшифровать анализ
      </button>

      <p className="text-center text-xs text-gray-400 leading-relaxed">
        Ваши данные защищены и не передаются третьим лицам. Расшифровка носит информационный характер.
      </p>
    </div>
  );
}
