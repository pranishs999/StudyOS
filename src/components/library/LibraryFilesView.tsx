import React, { useState } from 'react';
import { 
  HardDrive, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Search, 
  Filter, 
  FileText, 
  Video, 
  Globe, 
  ArrowLeft,
  Tag
} from 'lucide-react';
import { useRouter } from '../../router/RouterContext';
import { useStudy } from '../../context/StudyContext';
import { ResourceType } from '../../types';

export const LibraryFilesView: React.FC = () => {
  const { navigate } = useRouter();
  const { resources, addResource, deleteResource, subjects, playSound } = useStudy();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New resource form state
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newType, setNewType] = useState<ResourceType>('pdf');
  const [newSubjectId, setNewSubjectId] = useState(subjects[0]?.id || '');
  const [newNotes, setNewNotes] = useState('');
  const [newTags, setNewTags] = useState('');
  const [newSizeOrDuration, setNewSizeOrDuration] = useState('PDF • 4.2 MB');

  const handleCreateResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    const sub = subjects.find(s => s.id === newSubjectId);
    addResource({
      title: newTitle.trim(),
      url: newUrl.trim(),
      type: newType,
      subject_id: newSubjectId,
      subject_name: sub ? sub.name : 'Computer Science',
      subject_code: sub ? sub.code : 'CS',
      notes: newNotes.trim() || undefined,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      sizeOrDuration: newSizeOrDuration,
      is_favorite: false,
      added_at: new Date().toISOString().split('T')[0],
    });

    setNewTitle('');
    setNewUrl('');
    setNewNotes('');
    setNewTags('');
    setIsAddModalOpen(false);
    playSound('click');
  };

  const filteredResources = resources.filter(res => {
    if (selectedType !== 'all' && res.type !== selectedType) return false;
    if (selectedSubject !== 'all' && res.subject_id !== selectedSubject) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return res.title.toLowerCase().includes(q) || res.tags.some(t => t.toLowerCase().includes(q));
  });

  const getTypeIcon = (type: ResourceType) => {
    switch (type) {
      case 'youtube':
        return <Video className="w-4 h-4 text-rose-500" />;
      case 'pdf':
        return <FileText className="w-4 h-4 text-red-500" />;
      case 'website':
        return <Globe className="w-4 h-4 text-blue-500" />;
      default:
        return <HardDrive className="w-4 h-4 text-slate-500" />;
    }
  };

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
              <HardDrive className="w-5 h-5 text-emerald-600" />
              <span>Files, Slides & Media Resources</span>
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Access and manage textbooks, video lecture series, and course attachments.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Resource</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, subject, or tag..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All File Types</option>
            <option value="pdf">PDF Documents</option>
            <option value="youtube">Video Lectures</option>
            <option value="website">Web Links</option>
          </select>

          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Courses</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.code}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Files */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map(res => (
          <div
            key={res.id}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    {getTypeIcon(res.type)}
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {res.subject_code}
                  </span>
                </div>
                <button
                  onClick={() => deleteResource(res.id)}
                  className="p-1 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                  title="Remove resource"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-snug mb-1">
                {res.title}
              </h3>
              {res.notes && (
                <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 mb-2">
                  {res.notes}
                </p>
              )}

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1 mb-3">
                {res.tags.map(t => (
                  <span key={t} className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-1.5 py-0.2 rounded">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-300">
              <span>{res.sizeOrDuration || 'Reference'}</span>
              <a
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
              >
                <span>Open URL</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <HardDrive className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No resources found</h3>
          <p className="text-xs text-slate-400 mt-1">Try another search keyword or add a new file.</p>
        </div>
      )}

      {/* Add Resource Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-150">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-emerald-600" />
              <span>Add Resource / Attachment</span>
            </h2>

            <form onSubmit={handleCreateResource} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Resource Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Peterson Solution & Banker Algorithm Lecture Slides"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Resource URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as ResourceType)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="pdf">PDF File / Textbook</option>
                    <option value="youtube">Video Lecture</option>
                    <option value="website">Web Article / Doc</option>
                    <option value="file">File</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                  <select
                    value={newSubjectId}
                    onChange={e => setNewSubjectId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tags</label>
                <input
                  type="text"
                  placeholder="Slides, Unit2, Formulas"
                  value={newTags}
                  onChange={e => setNewTags(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
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
