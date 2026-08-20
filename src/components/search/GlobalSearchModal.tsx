import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  BookOpen, 
  HelpCircle, 
  FileText, 
  ArrowRight, 
  Sparkles,
  Zap,
  Filter,
  Layers,
  Database,
  Cpu
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { searchHybrid, searchSemantic, VectorSearchResultItem } from '../../services/vectorClient';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SearchMode = 'hybrid' | 'vector' | 'lexical';

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const { 
    topics, 
    questions, 
    notes, 
    resources, 
    subjects, 
    profile,
    vectorStatus,
    isIndexingVectors,
    setActiveView, 
    setSelectedSubjectId, 
    setSelectedQuestionId, 
    setSelectedNoteId,
  } = useStudy();

  const [query, setQuery] = useState<string>('');
  const [mode, setMode] = useState<SearchMode>('hybrid');
  const [vectorResults, setVectorResults] = useState<VectorSearchResultItem[]>([]);
  const [isLoadingVectors, setIsLoadingVectors] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setVectorResults([]);
      setSearchError(null);
    }
  }, [isOpen]);

  // Handle Escape and Ctrl+K key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Execute Vector / Hybrid search on query debounce
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed || mode === 'lexical') {
      setVectorResults([]);
      setIsLoadingVectors(false);
      return;
    }

    setIsLoadingVectors(true);
    setSearchError(null);

    const timer = setTimeout(async () => {
      try {
        const userId = profile.id || 'user_default';
        const res = mode === 'hybrid'
          ? await searchHybrid(trimmed, userId, { limit: 12, minSimilarity: 0.25 })
          : await searchSemantic(trimmed, userId, { limit: 12, minSimilarity: 0.35 });

        if (res.success) {
          setVectorResults(res.results);
        } else {
          setSearchError(res.error || 'Semantic search unavailable.');
        }
      } catch (err: any) {
        setSearchError(err?.message || 'Error executing vector search.');
      } finally {
        setIsLoadingVectors(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, mode, profile.id]);

  if (!isOpen) return null;

  const cleanQuery = query.trim().toLowerCase();

  // Local lexical match fallback
  const matchingTopics = cleanQuery
    ? topics.filter(t => t.title.toLowerCase().includes(cleanQuery) || t.description.toLowerCase().includes(cleanQuery) || (t.keyFormula && t.keyFormula.toLowerCase().includes(cleanQuery)))
    : [];

  const matchingQuestions = cleanQuery
    ? questions.filter(q => q.question.toLowerCase().includes(cleanQuery) || q.answer.toLowerCase().includes(cleanQuery) || (q.keyFormula && q.keyFormula.toLowerCase().includes(cleanQuery)))
    : [];

  const matchingNotes = cleanQuery
    ? notes.filter(n => n.title.toLowerCase().includes(cleanQuery) || n.content.toLowerCase().includes(cleanQuery))
    : [];

  const matchingResources = cleanQuery
    ? resources.filter(r => r.title.toLowerCase().includes(cleanQuery) || (r.notes && r.notes.toLowerCase().includes(cleanQuery)))
    : [];

  const hasLexicalResults = matchingTopics.length > 0 || matchingQuestions.length > 0 || matchingNotes.length > 0 || matchingResources.length > 0;
  const hasVectorResults = vectorResults.length > 0;

  const handleResultClick = (sourceType: string, documentId: string, subjectId?: string) => {
    if (sourceType === 'topic') {
      if (subjectId) setSelectedSubjectId(subjectId);
      setActiveView('subjects');
    } else if (sourceType === 'question') {
      setSelectedQuestionId(documentId);
      setActiveView('question-bank');
    } else if (sourceType === 'note') {
      setSelectedNoteId(documentId);
      setActiveView('notes');
    } else if (sourceType === 'resource') {
      setActiveView('resources');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-center pt-16 p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[82vh]">
        {/* Search Header Input */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search concepts, formulas, questions, notes... (e.g. Turing Completeness, Bellman-Ford)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          {isLoadingVectors && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 text-[11px] font-medium animate-pulse">
              <Cpu className="w-3 h-3 animate-spin" />
              <span>Embedding...</span>
            </div>
          )}
          <kbd className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-500">
            ESC
          </kbd>
        </div>

        {/* Mode Selector / Controls */}
        <div className="px-4 py-2 bg-slate-50/70 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-2.5 h-2.5" />
              Engine:
            </span>
            <button
              onClick={() => setMode('hybrid')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                mode === 'hybrid'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              Hybrid Vector + Lexical
            </button>
            <button
              onClick={() => setMode('vector')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                mode === 'vector'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              Pure Semantic (Cosine)
            </button>
            <button
              onClick={() => setMode('lexical')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                mode === 'lexical'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              Keywords Only
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
            <Database className="w-3 h-3 text-indigo-500" />
            <span>{vectorStatus?.totalVectors ?? 0} vectors</span>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!cleanQuery ? (
            <div className="py-12 text-center text-xs text-slate-400 space-y-2">
              <Sparkles className="w-8 h-8 text-indigo-500 mx-auto opacity-70" />
              <p className="font-semibold text-slate-700 dark:text-slate-200">Semantic & Vector Discovery</p>
              <p>Type any concept, mathematical formula, or question to explore deep semantic matches across all subjects.</p>
            </div>
          ) : (mode !== 'lexical' && hasVectorResults) ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span>Semantic Vector Matches ({vectorResults.length})</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Model: {vectorStatus?.activeModel || 'gemini-embedding-2-preview'}
                </span>
              </div>

              <div className="space-y-2">
                {vectorResults.map((item) => {
                  const scorePercent = Math.round((item.hybridScore ?? item.similarityScore) * 100);
                  const isHighMatch = scorePercent >= 60;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleResultClick(item.sourceType, item.documentId, item.subjectId)}
                      className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:border-indigo-200 dark:hover:border-indigo-800/50 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-indigo-50/40 dark:hover:bg-slate-800 cursor-pointer transition-all group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase font-mono ${
                            item.sourceType === 'question' ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300' :
                            item.sourceType === 'note' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' :
                            'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                          }`}>
                            {item.sourceType}
                          </span>
                          {item.subjectCode && (
                            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                              {item.subjectCode}
                            </span>
                          )}
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                            {item.title}
                          </h4>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                            isHighMatch
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300'
                          }`}>
                            {scorePercent}% match
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </div>

                      {item.contentChunk && (
                        <p className="mt-1.5 text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                          {item.contentChunk}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : hasLexicalResults ? (
            <div className="space-y-4">
              {/* Topics */}
              {matchingTopics.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-indigo-500" />
                    <span>Syllabus Topics ({matchingTopics.length})</span>
                  </span>
                  {matchingTopics.slice(0, 4).map(top => {
                    const sub = subjects.find(s => s.id === top.subject_id);
                    return (
                      <div
                        key={top.id}
                        onClick={() => handleResultClick('topic', top.id, top.subject_id)}
                        className="p-2.5 rounded-xl hover:bg-indigo-50/70 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between transition-colors group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold text-white uppercase font-mono bg-indigo-600">
                            {sub?.code || 'SUB'}
                          </span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600">
                            {top.title}
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Questions */}
              {matchingQuestions.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <HelpCircle className="w-3 h-3 text-rose-500" />
                    <span>Questions Bank ({matchingQuestions.length})</span>
                  </span>
                  {matchingQuestions.slice(0, 4).map(q => (
                    <div
                      key={q.id}
                      onClick={() => handleResultClick('question', q.id)}
                      className="p-2.5 rounded-xl hover:bg-rose-50/70 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between transition-colors group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold text-white uppercase font-mono bg-rose-600">
                          {q.marks}M
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-rose-600">
                          {q.question}
                        </span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600" />
                    </div>
                  ))}
                </div>
              )}

              {/* Notes */}
              {matchingNotes.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <FileText className="w-3 h-3 text-indigo-500" />
                    <span>Smart Notes ({matchingNotes.length})</span>
                  </span>
                  {matchingNotes.slice(0, 3).map(note => (
                    <div
                      key={note.id}
                      onClick={() => handleResultClick('note', note.id)}
                      className="p-2.5 rounded-xl hover:bg-indigo-50/70 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between transition-colors group"
                    >
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600">
                        {note.title}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-400 space-y-1">
              <p>No results found for "{query}".</p>
              {searchError && <p className="text-[11px] text-rose-500">{searchError}</p>}
            </div>
          )}
        </div>

        {/* Footer Status Bar */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Vector Engine: Active</span>
            <span>•</span>
            <span>{vectorStatus?.activeDimension ? `${vectorStatus.activeDimension}-dim` : '768-dim'}</span>
            {isIndexingVectors && (
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold animate-pulse">
                (Syncing index...)
              </span>
            )}
          </div>
          <span className="font-mono text-[10px]">
            {vectorStatus?.totalDocuments || 0} Docs Indexed
          </span>
        </div>
      </div>
    </div>
  );
};
