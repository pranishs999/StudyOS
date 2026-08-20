import React, { useState, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Copy, 
  Download, 
  Check, 
  Search, 
  Tag, 
  BookOpen, 
  Eye, 
  Edit3, 
  Columns, 
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useRouter } from '../../router/RouterContext';
import { useStudy } from '../../context/StudyContext';
import { WorkspaceDocument } from '../../types';

interface DocumentEditorViewProps {
  documentIdParam?: string;
}

export const DocumentEditorView: React.FC<DocumentEditorViewProps> = ({ documentIdParam }) => {
  const { navigate } = useRouter();
  const { 
    documents, 
    addDocument, 
    updateDocument, 
    deleteDocument, 
    duplicateDocument, 
    subjects,
    triggerConfetti,
    playSound
  } = useStudy();

  const [selectedDocId, setSelectedDocId] = useState<string>(() => {
    if (documentIdParam && documents.some(d => d.id === documentIdParam)) {
      return documentIdParam;
    }
    return documents[0]?.id || '';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [copied, setCopied] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');

  // Synchronize when documentIdParam updates
  useEffect(() => {
    if (documentIdParam && documents.some(d => d.id === documentIdParam)) {
      setSelectedDocId(documentIdParam);
    }
  }, [documentIdParam, documents]);

  const activeDoc = useMemo(() => {
    return documents.find(d => d.id === selectedDocId) || documents[0];
  }, [documents, selectedDocId]);

  const filteredDocs = useMemo(() => {
    if (!searchQuery.trim()) return documents;
    const q = searchQuery.toLowerCase();
    return documents.filter(d => 
      d.title.toLowerCase().includes(q) || 
      d.content.toLowerCase().includes(q) ||
      d.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [documents, searchQuery]);

  const handleSelectDoc = (id: string) => {
    setSelectedDocId(id);
    navigate(`/workspace/documents/${id}`);
  };

  const handleCreateNew = () => {
    const newDoc = addDocument({
      title: 'New Study Compendium',
      content: '# New Study Document\n\n## Section 1: Overview\n\nEnter academic formulas, notes, and definitions:\n$$E = mc^2$$\n',
      tags: ['Revision'],
      wordCount: 15,
      status: 'draft',
    });
    setSelectedDocId(newDoc.id);
    navigate(`/workspace/documents/${newDoc.id}`);
    playSound('click');
  };

  const handleContentChange = (content: string) => {
    if (!activeDoc) return;
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    updateDocument(activeDoc.id, {
      content,
      wordCount: words,
    });
  };

  const handleTitleChange = (title: string) => {
    if (!activeDoc) return;
    updateDocument(activeDoc.id, { title });
  };

  const handleSubjectChange = (subjectId: string) => {
    if (!activeDoc) return;
    const sub = subjects.find(s => s.id === subjectId);
    updateDocument(activeDoc.id, {
      subject_id: subjectId || undefined,
      subject_name: sub?.name,
      subject_code: sub?.code,
    });
  };

  const handleAddTag = () => {
    if (!activeDoc || !newTagInput.trim()) return;
    const clean = newTagInput.trim();
    if (!activeDoc.tags.includes(clean)) {
      updateDocument(activeDoc.id, {
        tags: [...activeDoc.tags, clean],
      });
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!activeDoc) return;
    updateDocument(activeDoc.id, {
      tags: activeDoc.tags.filter(t => t !== tagToRemove),
    });
  };

  const handleDelete = () => {
    if (!activeDoc) return;
    if (confirm(`Delete document "${activeDoc.title}"?`)) {
      deleteDocument(activeDoc.id);
      const remaining = documents.filter(d => d.id !== activeDoc.id);
      if (remaining.length > 0) {
        setSelectedDocId(remaining[0].id);
        navigate(`/workspace/documents/${remaining[0].id}`);
      } else {
        setSelectedDocId('');
        navigate('/workspace/documents');
      }
    }
  };

  const handleCopyMarkdown = () => {
    if (!activeDoc) return;
    navigator.clipboard.writeText(activeDoc.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!activeDoc) return;
    const element = document.createElement('a');
    const file = new Blob([activeDoc.content], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${activeDoc.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    playSound('finish');
  };

  return (
    <div className="space-y-4">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/workspace')}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Back to Workspace Overview"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Academic Markdown Editor</span>
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Full KaTeX math support, version tracking, and instant preview
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('edit')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'edit' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Editor Only"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Edit</span>
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'split' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Split View"
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Split</span>
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'preview' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Preview Only"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Preview</span>
            </button>
          </div>

          <button
            onClick={handleCreateNew}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Doc</span>
          </button>
        </div>
      </div>

      {/* Main Two-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* Left Column: Documents Browser List (3 Cols) */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 shadow-xs space-y-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter documents..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredDocs.map(doc => {
              const isSelected = doc.id === activeDoc?.id;
              return (
                <button
                  key={doc.id}
                  onClick={() => handleSelectDoc(doc.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 shadow-xs'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold truncate ${isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-800 dark:text-slate-200'}`}>
                      {doc.title}
                    </span>
                    {doc.subject_code && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {doc.subject_code}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-600 dark:text-slate-300 mt-1">
                    <span>{doc.wordCount} words</span>
                    <span>• v{doc.version}</span>
                    <span>• {doc.updated_at}</span>
                  </div>
                </button>
              );
            })}

            {filteredDocs.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-400">
                No documents found matching "{searchQuery}".
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Document Editor & Preview (9 Cols) */}
        <div className="lg:col-span-9 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          {activeDoc ? (
            <>
              {/* Document Header & Metadata Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={activeDoc.title}
                    onChange={e => handleTitleChange(e.target.value)}
                    className="w-full text-lg font-bold text-slate-900 dark:text-white bg-transparent border-none focus:outline-none focus:ring-0 placeholder-slate-400"
                    placeholder="Document Title..."
                  />
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {/* Subject Selector */}
                    <select
                      value={activeDoc.subject_id || ''}
                      onChange={e => handleSubjectChange(e.target.value)}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
                    >
                      <option value="">No Course Link</option>
                      {subjects.map(s => (
                        <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                      ))}
                    </select>

                    {/* Tags */}
                    {activeDoc.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300"
                      >
                        <Tag className="w-2.5 h-2.5" />
                        <span>{tag}</span>
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-rose-500 ml-0.5"
                        >
                          ×
                        </button>
                      </span>
                    ))}

                    <div className="inline-flex items-center gap-1">
                      <input
                        type="text"
                        placeholder="+ tag"
                        value={newTagInput}
                        onChange={e => setNewTagInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAddTag()}
                        className="w-16 px-1.5 py-0.5 text-[11px] rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:w-24 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Document Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={handleCopyMarkdown}
                    className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Copy Raw Markdown"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Download .md File"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => duplicateDocument(activeDoc.id)}
                    className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Duplicate Document"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete Document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Editor / Preview Area */}
              <div className="grid grid-cols-1 gap-4 min-h-[480px]">
                {viewMode === 'split' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Raw Editor */}
                    <div className="flex flex-col">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Markdown Input</div>
                      <textarea
                        value={activeDoc.content}
                        onChange={e => handleContentChange(e.target.value)}
                        className="w-full flex-1 min-h-[460px] p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y leading-relaxed"
                        placeholder="Write in Markdown..."
                      />
                    </div>

                    {/* KaTeX / GFM Live Preview */}
                    <div className="flex flex-col">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Live Rendered View</div>
                      <div className="w-full flex-1 min-h-[460px] p-5 rounded-xl bg-slate-50/50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 overflow-y-auto prose dark:prose-invert prose-indigo max-w-none text-xs leading-relaxed">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm, remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                        >
                          {activeDoc.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}

                {viewMode === 'edit' && (
                  <textarea
                    value={activeDoc.content}
                    onChange={e => handleContentChange(e.target.value)}
                    className="w-full min-h-[500px] p-5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                    placeholder="Write in Markdown..."
                  />
                )}

                {viewMode === 'preview' && (
                  <div className="w-full min-h-[500px] p-6 rounded-xl bg-slate-50/50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 overflow-y-auto prose dark:prose-invert prose-indigo max-w-none text-sm leading-relaxed">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                    >
                      {activeDoc.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Document Selected</h3>
              <p className="text-xs text-slate-400 mt-1">Create a new document or pick from the sidebar.</p>
              <button
                onClick={handleCreateNew}
                className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
              >
                Create First Document
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
