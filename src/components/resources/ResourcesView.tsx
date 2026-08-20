import React, { useState } from 'react';
import { 
  FolderOpen, 
  Plus, 
  Search, 
  ExternalLink, 
  Youtube, 
  FileText, 
  Globe, 
  Star, 
  Trash2,
  Tag
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { Resource, ResourceType } from '../../types';

export const ResourcesView: React.FC = () => {
  const { 
    resources, 
    addResource, 
    deleteResource, 
    toggleResourceFavorite, 
    subjects 
  } = useStudy();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubFilter, setSelectedSubFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New resource form state
  const [newSubId, setNewSubId] = useState<string>(subjects[0]?.id || '');
  const [newTitle, setNewTitle] = useState<string>('');
  const [newType, setNewType] = useState<ResourceType>('pdf');
  const [newUrl, setNewUrl] = useState<string>('');
  const [newNotes, setNewNotes] = useState<string>('');
  const [newTags, setNewTags] = useState<string>('');

  const filteredResources = resources.filter(res => {
    const matchesSub = selectedSubFilter === 'all' || res.subject_id === selectedSubFilter;
    const matchesType = selectedTypeFilter === 'all' || res.type === selectedTypeFilter;
    const matchesSearch = !searchQuery || 
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (res.notes && res.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      res.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSub && matchesType && matchesSearch;
  });

  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case 'youtube': return <Youtube className="w-4 h-4 text-rose-500" />;
      case 'pdf': return <FileText className="w-4 h-4 text-amber-500" />;
      case 'website': return <Globe className="w-4 h-4 text-indigo-500" />;
      default: return <FileText className="w-4 h-4 text-slate-500" />;
    }
  };

  const handleCreateResource = (e: React.FormEvent) => {
    e.preventDefault();
    const sub = subjects.find(s => s.id === newSubId);
    if (!sub || !newTitle.trim() || !newUrl.trim()) return;

    addResource({
      subject_id: newSubId,
      subject_name: sub.name,
      subject_code: sub.code,
      title: newTitle.trim(),
      type: newType,
      url: newUrl.trim(),
      notes: newNotes.trim() || undefined,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      is_favorite: false,
      added_at: 'Just now',
      sizeOrDuration: newType === 'youtube' ? 'Video' : 'Document',
    });

    setIsAddModalOpen(false);
    setNewTitle('');
    setNewUrl('');
    setNewNotes('');
    setNewTags('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Academic Reference Repository</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Textbooks, video lectures, research papers, and curated cheat sheets.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs shadow-indigo-100 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Resource</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search textbook name, video, author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelectedSubFilter('all')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${selectedSubFilter === 'all' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
            >
              All
            </button>
            {subjects.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedSubFilter(s.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${selectedSubFilter === s.id ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
              >
                {s.code}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

          <div className="flex items-center gap-1">
            {['all', 'pdf', 'youtube', 'website'].map(t => (
              <button
                key={t}
                onClick={() => setSelectedTypeFilter(t)}
                className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${selectedTypeFilter === t ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                    {getResourceIcon(res.type)}
                  </div>
                  <span className="text-[10px] font-bold font-mono uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.2 rounded">
                    {res.subject_code}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleResourceFavorite(res.id)}
                    className="text-slate-300 hover:text-amber-400"
                  >
                    <Star className={`w-3.5 h-3.5 ${res.is_favorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                  <button
                    onClick={() => deleteResource(res.id)}
                    className="text-slate-300 hover:text-rose-500 p-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 transition-colors">
                {res.title}
              </h4>

              {res.notes && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {res.notes}
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1">
                {res.tags.map(t => (
                  <span key={t} className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                    #{t}
                  </span>
                ))}
              </div>

              <a
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <span>Open</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Add Resource Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Add Academic Resource</h3>

            <form onSubmit={handleCreateResource} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                <select
                  value={newSubId}
                  onChange={(e) => setNewSubId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Resource Title</label>
                <input
                  type="text"
                  placeholder="e.g. Silberschatz OS Textbook, NPTEL AI Lectures"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Resource Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as ResourceType)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                  >
                    <option value="pdf">PDF / Textbook</option>
                    <option value="youtube">YouTube Lecture</option>
                    <option value="website">Web Article / Doc</option>
                    <option value="document">Handwritten Notes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Textbook, Unit 1"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Link URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Notes / Key Sections</label>
                <textarea
                  placeholder="Recommended chapters 3 to 6 for CPU scheduling and memory management..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs"
                >
                  Save Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
