import React from 'react';
import { 
  BookOpen, 
  FileText, 
  HardDrive, 
  Folder, 
  Tags, 
  ArrowRight, 
  Plus, 
  Download, 
  ExternalLink,
  Search,
  Tag as TagIcon
} from 'lucide-react';
import { useRouter, Link } from '../../router/RouterContext';
import { useStudy } from '../../context/StudyContext';

export const LibraryOverview: React.FC = () => {
  const { navigate } = useRouter();
  const { resources, documents, folders } = useStudy();

  const recentResources = resources.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>Academic Resource Library</span>
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            Curated textbooks, past university examination papers, lecture slides, and digital repositories.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/library/files"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Upload / Add Resource</span>
          </Link>
        </div>
      </div>

      {/* 4 Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/library/documents"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
            All Documents
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            {documents.length} study cheatsheets and markdown summaries
          </p>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
            <span>Browse documents</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        <Link
          to="/library/files"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <HardDrive className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
            Files & Media
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            {resources.length} PDF books, slides, and video lectures
          </p>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <span>View files</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        <Link
          to="/library/folders"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Folder className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
            Folders
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            {folders.length} hierarchical categories & subject dossiers
          </p>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            <span>Explore folders</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        <Link
          to="/library/tags"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Tags className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
            Tag Taxonomy
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            Indexed cross-subject keywords and taxonomy index
          </p>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-purple-600 dark:text-purple-400">
            <span>Browse tags</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Featured Resources Table / List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-emerald-600" />
            <span>Curated Academic Resources</span>
          </h2>
          <Link to="/library/files" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            View all resources ({resources.length})
          </Link>
        </div>

        <div className="space-y-3">
          {recentResources.map(res => (
            <div
              key={res.id}
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80 hover:bg-slate-100/80 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {res.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-600 dark:text-slate-300 mt-0.5">
                    <span className="font-semibold text-emerald-600">{res.subject_code}</span>
                    <span>• {res.type.toUpperCase()}</span>
                    <span>• {res.sizeOrDuration || 'Academic Reference'}</span>
                  </div>
                </div>
              </div>

              <a
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-2xs shrink-0"
              >
                <span>Open</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
