interface AnalysisResult {
  name: string;
  value: string;
  unit: string;
  status: 'normal' | 'high' | 'low';
  min: number;
  max: number;
  current: number;
  description?: string;
}

const results: AnalysisResult[] = [
  {
    name: 'Тестостерон',
    value: '15.33',
    unit: 'нмоль/л',
    status: 'normal',
    min: 8.9,
    max: 42,
    current: 30,
    description: 'Уровень тестостерона в норме. Это указывает на сохранность репродуктивной функции, достаточный уровень либидо и нормальное состояние мышечной системы.',
  },
  {
    name: 'Пролактин',
    value: '535',
    unit: 'мЕд/л',
    status: 'high',
    min: 73,
    max: 407,
    current: 92,
    description: 'Уровень гормона превышает верхнюю границу нормы. Пролактин крайне чувствителен к внешним условиям: стрессу, качеству сна и физическим нагрузкам.',
  },
];

function StatusBar({ min, max, current, status }: { min: number; max: number; current: number; status: string }) {
  const segments = 40;
  const normalStart = Math.floor(segments * 0.25);
  const normalEnd = Math.floor(segments * 0.75);

  return (
    <div className="mt-2 mb-1">
      <div className="flex gap-0.5">
        {Array.from({ length: segments }).map((_, i) => {
          let color = 'bg-amber-300';
          if (i >= normalStart && i < normalEnd) color = 'bg-emerald-400';
          if (i < normalStart) color = 'bg-blue-300';
          const isActive = i <= Math.floor((current / 100) * segments);
          return (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${isActive ? color : 'bg-gray-200'}`}
            />
          );
        })}
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
        <span>{min}</span>
        <span className={`font-semibold text-[9px] px-1.5 py-0.5 rounded-full ${
          status === 'normal' ? 'bg-emerald-100 text-emerald-600' :
          status === 'high' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
        }`}>
          {status === 'normal' ? 'В НОРМЕ' : status === 'high' ? 'ПОВЫШЕНО' : 'ПОНИЖЕНО'}
        </span>
        <span>{max}</span>
      </div>
    </div>
  );
}

export default function MobileAppMockup() {
  return (
    <div className="relative mx-auto" style={{ width: 280 }}>
      {/* Phone frame */}
      <div className="relative bg-gray-900 rounded-[40px] p-2 shadow-2xl shadow-black/40">
        {/* Screen */}
        <div className="bg-white rounded-[32px] overflow-hidden" style={{ height: 560 }}>
          {/* Status bar */}
          <div className="flex justify-between items-center px-5 pt-3 pb-1">
            <span className="text-[11px] font-semibold text-gray-900">12:27</span>
            <div className="flex gap-1 items-center">
              <div className="flex gap-0.5 items-end h-3">
                {[60, 80, 100].map((h, i) => (
                  <div key={i} className="w-1 bg-gray-900 rounded-sm" style={{ height: `${h}%` }} />
                ))}
              </div>
              <span className="text-[11px] font-semibold text-gray-900 ml-1">LTE</span>
            </div>
          </div>

          {/* Dynamic island */}
          <div className="flex justify-center mb-1">
            <div className="w-24 h-6 bg-black rounded-full" />
          </div>

          {/* App content */}
          <div className="px-4 overflow-hidden" style={{ height: 490 }}>
            <h3 className="text-xl font-black text-gray-900 leading-tight mb-1">
              Расшифровка<br />анализов за<br />секунды.
            </h3>
            <p className="text-[11px] text-gray-500 mb-3">
              PDF, фото или скан —<br />загрузка и безопасное хранение.
            </p>

            {/* Results */}
            <div className="space-y-3">
              {results.map(r => (
                <div key={r.name} className="bg-gray-50 rounded-2xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-700">{r.name}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-gray-900">{r.value}</span>
                    <span className="text-xs text-gray-500">{r.unit}</span>
                  </div>
                  <StatusBar min={r.min} max={r.max} current={r.current} status={r.status} />
                  {r.description && (
                    <p className="text-[10px] text-gray-500 mt-1 leading-relaxed line-clamp-2">
                      {r.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Home indicator */}
        <div className="flex justify-center mt-1.5 pb-1">
          <div className="w-20 h-1 bg-gray-600 rounded-full" />
        </div>
      </div>
    </div>
  );
}
