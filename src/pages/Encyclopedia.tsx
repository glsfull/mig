import { useState } from 'react';
import { Search, BookOpen, Clock, ChevronRight, X, Tag } from 'lucide-react';
import { DEMO_ARTICLES } from '../data/demoAnalysis';
import type { EncyclopediaArticle } from '../data/demoAnalysis';

const CATEGORIES = ['Все', 'Анализы крови', 'Биохимия', 'Гормоны', 'Витамины', 'Советы', 'Заболевания'];

const CATEGORY_COLORS: Record<string, string> = {
  'Анализы крови': 'bg-red-50 text-red-700 border-red-100',
  'Биохимия': 'bg-orange-50 text-orange-700 border-orange-100',
  'Гормоны': 'bg-purple-50 text-purple-700 border-purple-100',
  'Витамины': 'bg-yellow-50 text-yellow-700 border-yellow-100',
  'Советы': 'bg-blue-50 text-blue-700 border-blue-100',
  'Заболевания': 'bg-emerald-50 text-emerald-700 border-emerald-100',
};

function ArticleModal({ article, onClose }: { article: EncyclopediaArticle; onClose: () => void }) {
  const paragraphs = article.content.split('\n\n');

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 p-5 border-b border-gray-100 flex-shrink-0">
          <div className="flex-1 min-w-0">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border inline-block mb-2 ${CATEGORY_COLORS[article.category] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
              {article.category}
            </span>
            <h2 className="text-lg font-black text-gray-900 leading-tight">{article.title}</h2>
            <div className="flex items-center gap-1 mt-1">
              <Clock size={12} className="text-gray-400" />
              <span className="text-xs text-gray-400">{article.readTime} мин чтения</span>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {paragraphs.map((para, i) => {
            if (para.startsWith('**') && para.endsWith('**') && para.split('**').length === 3) {
              return <h3 key={i} className="text-base font-black text-gray-900 mt-2">{para.replace(/\*\*/g, '')}</h3>;
            }
            const parts = para.split(/(\*\*[^*]+\*\*)/g);
            return (
              <p key={i} className="text-sm text-gray-700 leading-relaxed">
                {parts.map((part, j) =>
                  part.startsWith('**') && part.endsWith('**')
                    ? <strong key={j} className="text-gray-900">{part.replace(/\*\*/g, '')}</strong>
                    : part
                )}
              </p>
            );
          })}
        </div>

        {/* Tags */}
        <div className="px-5 pb-5 pt-3 border-t border-gray-100 flex-shrink-0">
          <div className="flex flex-wrap gap-2">
            {article.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Encyclopedia() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Все');
  const [selected, setSelected] = useState<EncyclopediaArticle | null>(null);

  const filtered = DEMO_ARTICLES.filter(a => {
    const matchCat = category === 'Все' || a.category === category;
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Поиск по статьям..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X size={16} className="text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex-shrink-0 text-xs font-bold px-3.5 py-2 rounded-xl transition-all duration-150 border ${
              category === cat
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-400 px-1">{filtered.length} статей</p>

      {/* Articles */}
      <div className="space-y-3">
        {filtered.map(article => (
          <button
            key={article.id}
            onClick={() => setSelected(article)}
            className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-left hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <BookOpen size={18} className="text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[article.category] || 'bg-gray-100 text-gray-700 border-gray-100'}`}>
                    {article.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock size={10} className="text-gray-400" />
                    <span className="text-[10px] text-gray-400">{article.readTime} мин</span>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">{article.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{article.summary}</p>
              </div>
              <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0 mt-1" />
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <BookOpen size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Статьи не найдены</p>
          <button onClick={() => { setSearch(''); setCategory('Все'); }} className="text-xs text-emerald-600 mt-2">
            Сбросить фильтры
          </button>
        </div>
      )}

      {selected && <ArticleModal article={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
