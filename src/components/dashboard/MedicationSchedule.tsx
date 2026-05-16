import { useState } from 'react';
import { Bell, Plus, X, Clock, Check, Pill, Pencil } from 'lucide-react';
import type { DemoMedication } from '../../data/demoAnalysis';
import { DEMO_MEDICATIONS } from '../../data/demoAnalysis';

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const today = new Date();
const dayOfWeek = today.getDay();
const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

interface AddMedModalProps {
  onClose: () => void;
  onAdd: (med: DemoMedication) => void;
}

function AddMedModal({ onClose, onAdd }: AddMedModalProps) {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('1');
  const [unit, setUnit] = useState('таблетка');
  const [time, setTime] = useState('09:00');
  const [notes, setNotes] = useState('');

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd({
      id: `med_${Date.now()}`,
      name,
      dosage,
      unit,
      times: [time],
      notes,
      active: true,
      daysTotal: 30,
      daysCurrent: 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-900 text-lg">Добавить лекарство</h3>
          <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <X size={16} className="text-gray-500" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Название</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Например: Витамин D3"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-gray-800 bg-gray-50" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Доза</label>
              <input value={dosage} onChange={e => setDosage(e.target.value)} placeholder="1"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-gray-800 bg-gray-50" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Единица</label>
              <select value={unit} onChange={e => setUnit(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-gray-800 bg-gray-50">
                {['таблетка', 'капсула', 'мл', 'капли', 'саше'].map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Время приёма</label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-gray-800 bg-gray-50" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Заметки</label>
            <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Принимать с едой..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-gray-800 bg-gray-50" />
          </div>
          <button onClick={handleAdd} disabled={!name.trim()}
            className="w-full bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-colors mt-2">
            Добавить лекарство
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MedicationSchedule() {
  const [medications, setMedications] = useState<DemoMedication[]>(DEMO_MEDICATIONS);
  const [taken, setTaken] = useState<Set<string>>(new Set());
  const [showAdd, setShowAdd] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [activeDayOffset, setActiveDayOffset] = useState(0);

  const toggleTaken = (key: string) => {
    setTaken(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const removeMed = (id: string) => {
    setMedications(prev => prev.filter(m => m.id !== id));
  };

  const addMed = (med: DemoMedication) => {
    setMedications(prev => [...prev, med]);
  };

  const handleNotif = () => {
    if (!notifEnabled && 'Notification' in window) {
      Notification.requestPermission().then(perm => {
        if (perm === 'granted') {
          setNotifEnabled(true);
          new Notification('Мои анализы', {
            body: 'Уведомления о приёме лекарств включены!',
          });
        }
      });
    } else {
      setNotifEnabled(prev => !prev);
    }
  };

  const activeMeds = medications.filter(m => m.active);
  const morningMeds = activeMeds.filter(m => m.times.some(t => parseInt(t) < 12));
  const afternoonMeds = activeMeds.filter(m => m.times.some(t => parseInt(t) >= 12 && parseInt(t) < 17));
  const eveningMeds = activeMeds.filter(m => m.times.some(t => parseInt(t) >= 17));

  return (
    <div className="space-y-5">
      {/* Notification toggle */}
      <div className={`rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-colors ${notifEnabled ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-50 border border-gray-100'}`}
        onClick={handleNotif}>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${notifEnabled ? 'bg-emerald-500' : 'bg-gray-200'}`}>
            <Bell size={16} className={notifEnabled ? 'text-white' : 'text-gray-500'} />
          </div>
          <div>
            <p className={`text-sm font-bold ${notifEnabled ? 'text-emerald-800' : 'text-gray-700'}`}>
              {notifEnabled ? 'Уведомления включены' : 'Включить напоминания'}
            </p>
            <p className="text-xs text-gray-500">Push-уведомление о приёме лекарств</p>
          </div>
        </div>
        <div className={`w-12 h-6 rounded-full transition-colors ${notifEnabled ? 'bg-emerald-500' : 'bg-gray-300'} relative`}>
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${notifEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
        </div>
      </div>

      {/* Week calendar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-gray-900">Сегодня, {today.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</span>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {DAYS.map((d, i) => {
            const date = new Date(today);
            date.setDate(today.getDate() + mondayOffset + i);
            const isToday = i + mondayOffset === 0;
            const isActive = i === (dayOfWeek === 0 ? 6 : dayOfWeek - 1) + activeDayOffset;
            return (
              <button
                key={d}
                onClick={() => setActiveDayOffset(i - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))}
                className={`flex flex-col items-center py-2 px-1 rounded-xl transition-colors ${
                  isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                <span className={`text-[10px] font-medium ${isActive ? 'text-gray-300' : 'text-gray-400'}`}>{d}</span>
                <span className={`text-sm font-bold mt-0.5 ${isActive ? 'text-white' : 'text-gray-800'}`}>{date.getDate()}</span>
                {isToday && (
                  <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isActive ? 'bg-emerald-400' : 'bg-emerald-500'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Medication slots */}
      {[
        { label: '☀️ Утро', meds: morningMeds, emoji: '☀️' },
        { label: '🌤 День', meds: afternoonMeds, emoji: '🌤' },
        { label: '🌙 Вечер', meds: eveningMeds, emoji: '🌙' },
      ].map(({ label, meds }) => meds.length > 0 && (
        <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50">
            <span className="text-sm font-bold text-gray-700">{label}</span>
          </div>
          <div className="divide-y divide-gray-50">
            {meds.map(med => {
              const key = `${med.id}_${label}`;
              const isTaken = taken.has(key);
              const progress = Math.round((med.daysCurrent / med.daysTotal) * 100);
              return (
                <div key={med.id} className="px-4 py-3">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleTaken(key)}
                      className={`mt-0.5 w-6 h-6 rounded-full flex-shrink-0 border-2 flex items-center justify-center transition-all duration-200 ${
                        isTaken
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'border-gray-300 hover:border-emerald-400'
                      }`}
                    >
                      {isTaken && <Check size={12} className="text-white" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-sm font-bold ${isTaken ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                          {med.name}
                        </span>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <Clock size={12} className="text-gray-400" />
                          <span className="text-xs text-gray-500">{med.times.join(', ')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-500">{med.dosage} {med.unit}</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-600 font-bold px-1.5 py-0.5 rounded-full uppercase">
                          <Pill size={9} className="inline mr-0.5" />таблетки
                        </span>
                      </div>
                      {med.notes && <p className="text-xs text-gray-400 mt-0.5 truncate">{med.notes}</p>}
                      <div className="mt-2">
                        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                          <span>День {med.daysCurrent}/{med.daysTotal}</span>
                          <span className="text-emerald-600 font-semibold">{progress}%</span>
                        </div>
                        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400 rounded-full transition-all" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    </div>
                    <button onClick={() => removeMed(med.id)} className="text-gray-300 hover:text-red-400 transition-colors mt-0.5">
                      <X size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {activeMeds.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          <Pill size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Нет активных лекарств</p>
          <p className="text-xs mt-1">Добавьте первое лекарство</p>
        </div>
      )}

      <button
        onClick={() => setShowAdd(true)}
        className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 rounded-2xl transition-colors shadow-lg"
      >
        <Plus size={18} />
        Добавить лекарство
      </button>

      {showAdd && <AddMedModal onClose={() => setShowAdd(false)} onAdd={addMed} />}
    </div>
  );
}
