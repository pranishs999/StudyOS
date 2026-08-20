import React, { useState } from 'react';
import { Quote, Plus, Copy, Check, Trash2, ArrowLeft, Download } from 'lucide-react';
import { useRouter } from '../../router/RouterContext';
import { useStudy } from '../../context/StudyContext';

export const ResearchCitationsView: React.FC = () => {
  const { navigate } = useRouter();
  const { citations, addCitation, deleteCitation, playSound } = useStudy();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form state
  const [newCiteKey, setNewCiteKey] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newAuthors, setNewAuthors] = useState('');
  const [newVenue, setNewVenue] = useState('');
  const [newYear, setNewYear] = useState(2024);
  const [newBibtex, setNewBibtex] = useState('');

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    playSound('click');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCiteKey.trim() || !newTitle.trim()) return;

    const formattedBibtex = newBibtex.trim() || `@article{${newCiteKey.trim()},\n  title={${newTitle.trim()}},\n  author={${newAuthors.trim()}},\n  journal={${newVenue.trim()}},\n  year={${newYear}}\n}`;

    addCitation({
      citeKey: newCiteKey.trim(),
      title: newTitle.trim(),
      authors: newAuthors.trim(),
      venue: newVenue.trim() || 'Journal',
      year: Number(newYear) || 2024,
      bibtex: formattedBibtex,
    });

    setNewCiteKey('');
    setNewTitle('');
    setNewAuthors('');
    setNewVenue('');
    setNewBibtex('');
    setIsAddOpen(false);
  };

  const handleExportAllBib = () => {
    const combined = citations.map(c => c.bibtex).join('\n\n');
    const element = document.createElement('a');
    const file = new Blob([combined], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'study_os_references.bib';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/research')}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Back to Research Hub"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Quote className="w-5 h-5 text-amber-600" />
              <span>BibTeX Citations & Reference Matrix</span>
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Standard format bibliography export for LaTeX reports, papers, and academic theses.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportAllBib}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export .bib</span>
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Citation</span>
          </button>
        </div>
      </div>

      {/* Citations List */}
      <div className="space-y-4">
        {citations.map(c => (
          <div
            key={c.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded">
                  @{c.citeKey}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  {c.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  {c.authors} ({c.year}) • <span className="font-semibold">{c.venue}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(c.id, c.bibtex)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  {copiedId === c.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === c.id ? 'Copied' : 'Copy BibTeX'}</span>
                </button>
                <button
                  onClick={() => deleteCitation(c.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* BibTeX Code block */}
            <pre className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-100 dark:border-slate-800/80 text-[11px] font-mono text-slate-800 dark:text-slate-200 overflow-x-auto">
              {c.bibtex}
            </pre>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-150">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Quote className="w-5 h-5 text-amber-600" />
              <span>Add BibTeX Citation</span>
            </h2>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Cite Key *</label>
                  <input
                    type="text"
                    required
                    placeholder="lamport1978time"
                    value={newCiteKey}
                    onChange={e => setNewCiteKey(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Year</label>
                  <input
                    type="number"
                    value={newYear}
                    onChange={e => setNewYear(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="Title of paper or book"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Authors</label>
                <input
                  type="text"
                  placeholder="Last, First and Last, First"
                  value={newAuthors}
                  onChange={e => setNewAuthors(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Custom BibTeX (Optional)</label>
                <textarea
                  rows={4}
                  placeholder="@article{...}"
                  value={newBibtex}
                  onChange={e => setNewBibtex(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Save Citation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
