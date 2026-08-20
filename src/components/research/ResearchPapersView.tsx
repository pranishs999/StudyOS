import React, { useState } from 'react';
import { 
  BookMarked, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Search, 
  CheckCircle2, 
  Circle, 
  ArrowLeft, 
  Sparkles,
  Quote
} from 'lucide-react';
import { useRouter } from '../../router/RouterContext';
import { useStudy } from '../../context/StudyContext';

export const ResearchPapersView: React.FC = () => {
  const { navigate } = useRouter();
  const { 
    researchPapers, 
    addResearchPaper, 
    deleteResearchPaper, 
    togglePaperRead, 
    addCitation, 
    playSound 
  } = useStudy();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newAuthors, setNewAuthors] = useState('');
  const [newVenue, setNewVenue] = useState('');
  const [newYear, setNewYear] = useState(2023);
  const [newAbstract, setNewAbstract] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newTags, setNewTags] = useState('');
  const [newDoi, setNewDoi] = useState('');

  const handleCreatePaper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const paper = addResearchPaper({
      title: newTitle.trim(),
      authors: newAuthors.split(',').map(a => a.trim()).filter(Boolean),
      publicationOrVenue: newVenue.trim() || 'Academic Preprint',
      year: Number(newYear) || 2024,
      abstract: newAbstract.trim(),
      url: newUrl.trim() || undefined,
      citationsCount: 0,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      notes: newNotes.trim(),
      isRead: false,
      doi: newDoi.trim() || undefined,
    });

    // Auto-generate BibTeX citation
    const citeKey = `${(newAuthors.split(',')[0] || 'author').trim().toLowerCase()}${newYear}`;
    addCitation({
      paperId: paper.id,
      citeKey,
      title: paper.title,
      authors: paper.authors.join(' and '),
      venue: paper.publicationOrVenue,
      year: paper.year,
      bibtex: `@article{${citeKey},\n  title={${paper.title}},\n  author={${paper.authors.join(' and ')}},\n  journal={${paper.publicationOrVenue}},\n  year={${paper.year}}\n}`,
    });

    setNewTitle('');
    setNewAuthors('');
    setNewVenue('');
    setNewAbstract('');
    setNewUrl('');
    setNewNotes('');
    setNewTags('');
    setNewDoi('');
    setIsAddOpen(false);
    playSound('click');
  };

  const filteredPapers = researchPapers.filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.authors.some(a => a.toLowerCase().includes(q)) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  });

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
              <BookMarked className="w-5 h-5 text-emerald-600" />
              <span>Academic Papers & Preprints</span>
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Read abstracts, extract formulas, and generate automated BibTeX citation entries.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Paper</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-lg">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Search literature by title, author, or keyword..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-xs"
        />
      </div>

      {/* Papers Grid */}
      <div className="space-y-4">
        {filteredPapers.map(paper => (
          <div
            key={paper.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-sm transition-all space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <button
                  onClick={() => togglePaperRead(paper.id)}
                  className="mt-0.5 text-slate-400 hover:text-emerald-600 cursor-pointer shrink-0"
                  title={paper.isRead ? 'Mark as unread' : 'Mark as read'}
                >
                  {paper.isRead ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {paper.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    {paper.authors.join(', ')} • <span className="font-semibold text-emerald-600 dark:text-emerald-400">{paper.publicationOrVenue}</span> ({paper.year})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {paper.url && (
                  <a
                    href={paper.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 transition-colors"
                  >
                    <span>PDF</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <button
                  onClick={() => deleteResearchPaper(paper.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Abstract */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-serif">
              <span className="font-bold font-sans text-slate-500 mr-1">Abstract:</span>
              {paper.abstract}
            </div>

            {paper.notes && (
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-mono bg-indigo-50/50 dark:bg-indigo-950/30 p-2.5 rounded-lg">
                💡 Notes: {paper.notes}
              </p>
            )}

            {/* Metadata Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <span>Citations: {paper.citationsCount.toLocaleString()}</span>
                {paper.doi && <span>• DOI: {paper.doi}</span>}
              </div>
              <div className="flex items-center gap-1">
                {paper.tags.map(t => (
                  <span key={t} className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-600 dark:text-slate-400">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Paper Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-emerald-600" />
              <span>Add Research Paper</span>
            </h2>

            <form onSubmit={handleCreatePaper} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Paper Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paxos Made Simple"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Authors (comma separated) *</label>
                <input
                  type="text"
                  required
                  placeholder="Leslie Lamport"
                  value={newAuthors}
                  onChange={e => setNewAuthors(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Venue / Journal</label>
                  <input
                    type="text"
                    placeholder="ACM SIGACT News"
                    value={newVenue}
                    onChange={e => setNewVenue(e.target.value)}
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
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Abstract</label>
                <textarea
                  rows={3}
                  placeholder="Paste paper abstract here..."
                  value={newAbstract}
                  onChange={e => setNewAbstract(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">PDF URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newUrl}
                    onChange={e => setNewUrl(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">DOI</label>
                  <input
                    type="text"
                    placeholder="10.1145/..."
                    value={newDoi}
                    onChange={e => setNewDoi(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tags</label>
                <input
                  type="text"
                  placeholder="Consensus, Distributed, Paxos"
                  value={newTags}
                  onChange={e => setNewTags(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
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
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Save Paper & BibTeX
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
