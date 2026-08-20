import React from 'react';
import { 
  FileText, 
  BookOpen, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  Plus, 
  ArrowRight, 
  Clock, 
  Tag, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useRouter, Link } from '../../router/RouterContext';
import { useStudy } from '../../context/StudyContext';

export const WorkspaceOverview: React.FC = () => {
  const { navigate } = useRouter();
  const { 
    documents, 
    notes, 
    tasks, 
    sessions, 
    toggleTaskCompleted,
    addDocument 
  } = useStudy();

  const handleCreateDocument = () => {
    const newDoc = addDocument({
      title: 'Untitled Document',
      content: '# Untitled Document\n\nStart typing your academic notes or research draft here...',
      tags: ['Draft'],
      wordCount: 12,
      status: 'draft',
    });
    navigate(`/workspace/documents/${newDoc.id}`);
  };

  const pendingTasks = tasks.filter(t => t.status !== 'completed').slice(0, 4);
  const recentDocs = documents.slice(0, 4);
  const recentNotes = notes.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Academic Workspace</h1>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            Centralized hub for markdown documents, lecture notes, assignment tasks, and study schedule.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCreateDocument}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Document</span>
          </button>
          <Link
            to="/workspace/tasks"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all"
          >
            <CheckSquare className="w-4 h-4 text-indigo-500" />
            <span>Manage Tasks</span>
          </Link>
        </div>
      </div>

      {/* 4 Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/workspace/documents"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            Documents
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            {documents.length} markdown files & formula cheatsheets
          </p>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
            <span>Open editor</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        <Link
          to="/workspace/notes"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            Smart Notes
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            {notes.length} curated syllabus high-yield notes
          </p>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <span>Browse notes</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        <Link
          to="/workspace/tasks"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <CheckSquare className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            Tasks & Deadlines
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            {pendingTasks.length} pending academic assignments
          </p>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            <span>View tasks</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        <Link
          to="/workspace/calendar"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            Study Calendar
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            {sessions.length} scheduled review sessions
          </p>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-purple-600 dark:text-purple-400">
            <span>Open calendar</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Two Columns: Recent Documents & Priority Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Documents */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Recent Documents</h2>
            </div>
            <Link to="/workspace/documents" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              View all
            </Link>
          </div>

          <div className="space-y-2.5">
            {recentDocs.map(doc => (
              <Link
                key={doc.id}
                to={`/workspace/documents/${doc.id}`}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50/70 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800/80 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600">
                      {doc.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-slate-600 dark:text-slate-300 mt-0.5">
                      {doc.subject_code && (
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                          {doc.subject_code}
                        </span>
                      )}
                      <span>• {doc.wordCount} words</span>
                      <span>• {doc.updated_at}</span>
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Priority Assignment Tasks */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-amber-600" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Active Academic Tasks</h2>
            </div>
            <Link to="/workspace/tasks" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              Manage all
            </Link>
          </div>

          <div className="space-y-2.5">
            {pendingTasks.map(task => (
              <div
                key={task.id}
                className="flex items-start justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80 transition-all hover:bg-slate-100/80 dark:hover:bg-slate-800"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <button
                    onClick={() => toggleTaskCompleted(task.id)}
                    className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-600 dark:text-slate-300 mt-1">
                      {task.subject_code && (
                        <span className="font-semibold text-amber-600 dark:text-amber-400">
                          {task.subject_code}
                        </span>
                      )}
                      <span>Due: {task.dueDate}</span>
                      <span className={`px-1.5 py-0.2 rounded font-semibold uppercase ${
                        task.priority === 'urgent' ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600' :
                        task.priority === 'high' ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600' :
                        'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
