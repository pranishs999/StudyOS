import React, { useState, useMemo } from 'react';
import { Tags, ArrowLeft, Search, Tag, FileText, BookOpen } from 'lucide-react';
import { useRouter, Link } from '../../router/RouterContext';
import { useStudy } from '../../context/StudyContext';

export const LibraryTagsView: React.FC = () => {
  const { navigate } = useRouter();
  const { documents, notes, resources, questions } = useStudy();
  const [searchTag, setSearchTag] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Compute all unique tags and frequencies
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    documents.forEach(d => d.tags.forEach(t => { counts[t] = (counts[t] || 0) + 1; }));
    notes.forEach(n => n.tags.forEach(t => { counts[t] = (counts[t] || 0) + 1; }));
    resources.forEach(r => r.tags.forEach(t => { counts[t] = (counts[t] || 0) + 1; }));
    questions.forEach(q => (q.tags || []).forEach(t => { counts[t] = (counts[t] || 0) + 1; }));

    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [documents, notes, resources, questions]);

  const filteredTags = tagCounts.filter(([t]) => 
    t.toLowerCase().includes(searchTag.toLowerCase())
  );

  const matchedItems = useMemo(() => {
    if (!activeTag) return [];
    const items: { id: string; type: string; title: string; link: string }[] = [];

    documents.forEach(d => {
      if (d.tags.includes(activeTag)) {
        items.push({ id: d.id, type: 'Document', title: d.title, link: `/workspace/documents/${d.id}` });
      }
    });

    notes.forEach(n => {
      if (n.tags.includes(activeTag)) {
        items.push({ id: n.id, type: 'Note', title: n.title, link: `/workspace/notes` });
      }
    });

    resources.forEach(r => {
      if (r.tags.includes(activeTag)) {
        items.push({ id: r.id, type: 'Resource', title: r.title, link: `/library/files` });
      }
    });

    return items;
  }, [activeTag, documents, notes, resources]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/library')}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Back to Library"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Tags className="w-5 h-5 text-purple-600" />
              <span>Tag Taxonomy Explorer</span>
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Explore interconnected academic resources indexed across documents, notes, and questions.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Tag Cloud (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search taxonomy..."
              value={searchTag}
              onChange={e => setSearchTag(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {filteredTags.map(([tag, count]) => {
              const isSelected = activeTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setActiveTag(isSelected ? null : tag)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-xs scale-105'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:text-purple-600'
                  }`}
                >
                  <Tag className="w-3 h-3" />
                  <span>#{tag}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-purple-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Tagged Items (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {activeTag ? `Items tagged with #${activeTag} (${matchedItems.length})` : 'Select a tag to view linked items'}
          </h3>

          {activeTag && matchedItems.length > 0 ? (
            <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
              {matchedItems.map(item => (
                <Link
                  key={item.id}
                  to={item.link}
                  className="block p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 hover:bg-purple-50/50 hover:border-purple-200 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-purple-600 dark:text-purple-400">
                      {item.type}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                    {item.title}
                  </h4>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              {activeTag ? 'No items found for this tag.' : 'Click any tag chip to view associated resources.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
