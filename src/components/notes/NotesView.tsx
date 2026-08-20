import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Star, 
  Trash2, 
  Edit3, 
  Check, 
  HelpCircle, 
  BookOpen, 
  Sparkles,
  Layers,
  ArrowRight,
  Zap,
  Cpu
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { searchSemantic, VectorSearchResultItem } from '../../services/vectorClient';

export const NotesView: React.FC = () => {
  const { 
    notes, 
    addNote, 
    updateNote, 
    deleteNote, 
    toggleNoteFavorite, 
    subjects, 
    profile,
    vectorStatus,
    selectedNoteId, 
    setSelectedNoteId, 
    setSelectedSubjectId,
    setSelectedQuestionId,
    setActiveView 
  } = useStudy();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubFilter, setSelectedSubFilter] = useState<string>('all');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Active note
  const activeNote = notes.find(n => n.id === (selectedNoteId || notes[0]?.id)) || notes[0];

  // Edit buffer
  const [editTitle, setEditTitle] = useState<string>(activeNote?.title || '');
  const [editContent, setEditContent] = useState<string>(activeNote?.content || '');
  const [editTags, setEditTags] = useState<string>(activeNote?.tags?.join(', ') || '');

  // Semantic Related Items for active note
  const [relatedVectors, setRelatedVectors] = useState<VectorSearchResultItem[]>([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState<boolean>(false);

  useEffect(() => {
    if (!activeNote) {
      setRelatedVectors([]);
      return;
    }

    setIsLoadingRelated(true);
    const userId = profile.id || 'user_default';
    const query = `${activeNote.title} ${activeNote.tags.join(' ')}`;

    searchSemantic(query, userId, { limit: 5, minSimilarity: 0.30 })
      .then((res) => {
        if (res.success) {
          // Filter out current note itself
          setRelatedVectors(res.results.filter(r => r.documentId !== activeNote.id).slice(0, 3));
        }
      })
      .catch(() => {})
      .finally(() => setIsLoadingRelated(false));
  }, [activeNote?.id, activeNote?.title, profile.id]);

  // Select note handler
  const handleSelectNote = (id: string) => {
    setSelectedNoteId(id);
    const note = notes.find(n => n.id === id);
    if (note) {
      setEditTitle(note.title);
      setEditContent(note.content);
      setEditTags(note.tags.join(', '));
      setIsEditing(false);
    }
  };

  const handleSaveEdit = () => {
    if (!activeNote) return;
    updateNote(activeNote.id, {
      title: editTitle.trim() || activeNote.title,
      content: editContent,
      tags: editTags.split(',').map(t => t.trim()).filter(Boolean),
    });
    setIsEditing(false);
  };

  const handleCreateNewNote = () => {
    const sub = subjects[0];
    const newNote = addNote({
      subject_id: sub.id,
      unit_id: 'unit_1',
      subject_name: sub.name,
      subject_code: sub.code,
      subject_color: sub.color,
      unit_title: 'Unit I',
      title: 'Untitled Note',
      content: `# New Topic Notes

> **Summary:** Write your high-yield summary here.

## Core Formula & Theorems

$$formula$$

## Key Concepts
- Concept 1
- Concept 2`,
      tags: [sub.code, 'CheatSheet'],
      is_favorite: false,
      priority: 'high',
      updated_at: 'Just now',
    });

    setSelectedNoteId(newNote.id);
    setEditTitle(newNote.title);
    setEditContent(newNote.content);
    setEditTags(newNote.tags.join(', '));
    setIsEditing(true);
  };

  const filteredNotes = notes.filter(n => {
    const matchesSub = selectedSubFilter === 'all' || n.subject_id === selectedSubFilter;
    const matchesSearch = !searchQuery || 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSub && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Academic Smart Notes</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Markdown lecture summaries, formula cheat sheets, and connected vector knowledge.
          </p>
        </div>

        <button
          onClick={handleCreateNewNote}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs shadow-indigo-100 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* Two Column Layout (Sidebar list + Reader/Editor) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Note List & Filter (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs space-y-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search notes & tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Subject filter tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedSubFilter('all')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap cursor-pointer ${selectedSubFilter === 'all' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
              >
                All
              </button>
              {subjects.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSubFilter(s.id)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap cursor-pointer ${selectedSubFilter === s.id ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                >
                  {s.code}
                </button>
              ))}
            </div>
          </div>

          {/* Notes items list */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredNotes.map((note) => {
              const isSelected = activeNote?.id === note.id;

              return (
                <div
                  key={note.id}
                  onClick={() => handleSelectNote(note.id)}
                  className={`
                    p-3.5 rounded-xl border cursor-pointer transition-all space-y-1.5
                    ${isSelected
                      ? 'bg-white dark:bg-slate-900 border-indigo-400 dark:border-indigo-600 shadow-xs ring-1 ring-indigo-500/20'
                      : 'bg-white/80 dark:bg-slate-900/60 border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span 
                      className="px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white uppercase"
                      style={{ backgroundColor: note.subject_color }}
                    >
                      {note.subject_code}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleNoteFavorite(note.id);
                      }}
                      className="text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      <Star className={`w-3.5 h-3.5 ${note.is_favorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {note.title}
                  </h4>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {note.content.replace(/[#*`>]/g, '')}
                  </p>

                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {note.tags.map(t => (
                      <span key={t} className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Note Reader & Live Markdown Editor (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs p-6 space-y-4">
          {!activeNote ? (
            <div className="text-center py-20 text-slate-400">Select a note to read or edit.</div>
          ) : (
            <>
              {/* Note Action Toolbar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span 
                    className="px-2.5 py-1 rounded text-xs font-mono font-bold text-white uppercase"
                    style={{ backgroundColor: activeNote.subject_color }}
                  >
                    {activeNote.subject_code}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{activeNote.unit_title}</span>
                </div>

                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <button
                      onClick={handleSaveEdit}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Markdown</span>
                    </button>
                  )}

                  <button
                    onClick={() => deleteNote(activeNote.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title="Delete note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title & Tags */}
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full text-xl font-bold bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Comma-separated tags: OS, Algorithms, Midterm"
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {activeNote.title}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>Updated {activeNote.updated_at}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      {activeNote.tags.map(t => (
                        <span key={t} className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-[10px]">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Body Content */}
              {isEditing ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={14}
                  className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <div className="prose dark:prose-invert max-w-none text-xs leading-relaxed space-y-4 pt-2">
                  <div className="whitespace-pre-line text-slate-700 dark:text-slate-300 font-sans">
                    {activeNote.content}
                  </div>
                </div>
              )}

              {/* Semantic Knowledge Graph & Related Concepts via Vector Search */}
              {!isEditing && (
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Semantic Knowledge Discovery
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      Cosine Vector Match ({vectorStatus?.activeModel || 'gemini-embedding-2-preview'})
                    </span>
                  </div>

                  {isLoadingRelated ? (
                    <div className="flex items-center gap-2 py-3 text-xs text-slate-400 animate-pulse">
                      <Cpu className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                      <span>Computing semantic embeddings for related academic concepts...</span>
                    </div>
                  ) : relatedVectors.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {relatedVectors.map((rel) => {
                        const scorePct = Math.round(rel.similarityScore * 100);
                        return (
                          <div
                            key={rel.id}
                            onClick={() => {
                              if (rel.sourceType === 'topic') {
                                if (rel.subjectId) setSelectedSubjectId(rel.subjectId);
                                setActiveView('subjects');
                              } else if (rel.sourceType === 'question') {
                                setSelectedQuestionId(rel.documentId);
                                setActiveView('question-bank');
                              } else if (rel.sourceType === 'note') {
                                setSelectedNoteId(rel.documentId);
                              }
                            }}
                            className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800/60 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-indigo-50/50 dark:hover:bg-slate-800 cursor-pointer transition-all flex flex-col justify-between group"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase font-mono ${
                                  rel.sourceType === 'question' ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300' :
                                  rel.sourceType === 'note' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' :
                                  'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                                }`}>
                                  {rel.sourceType}
                                </span>
                                <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                  {scorePct}% match
                                </span>
                              </div>
                              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                {rel.title}
                              </p>
                            </div>
                            <div className="flex items-center justify-end pt-2 text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5">
                              <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 italic">
                      No strongly related concepts found above cosine threshold.
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
