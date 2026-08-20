import React from 'react';
import { 
  Microscope, 
  GitFork, 
  BookMarked, 
  Quote, 
  Sparkles, 
  ArrowRight, 
  Plus, 
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { useRouter, Link } from '../../router/RouterContext';
import { useStudy } from '../../context/StudyContext';

export const ResearchOverview: React.FC = () => {
  const { navigate } = useRouter();
  const { researchProjects, researchPapers, citations } = useStudy();

  const activeProjects = researchProjects.slice(0, 3);
  const recentPapers = researchPapers.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Microscope className="w-5 h-5 text-indigo-600" />
            <span>Academic Research Hub</span>
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            Conduct literature reviews, organize paper collections, manage BibTeX citations, and track projects.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/research/papers"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Paper / Citation</span>
          </Link>
        </div>
      </div>

      {/* 4 Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/research/projects"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <GitFork className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
            Research Projects
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            {researchProjects.length} active investigations & research workspaces
          </p>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
            <span>View projects</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        <Link
          to="/research/papers"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <BookMarked className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
            Academic Papers
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            {researchPapers.length} curated papers, preprints, and abstracts
          </p>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <span>Browse literature</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        <Link
          to="/research/references"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Quote className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
            BibTeX References
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            {citations.length} exported citation keys & standard formats
          </p>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            <span>Manage BibTeX</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        <Link
          to="/research/citations"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
            Citation Matrix
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            Impact metrics, citation counts, and venue indices
          </p>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-purple-600 dark:text-purple-400">
            <span>View matrix</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Active Projects and Seminal Literature */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Active Research Projects */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <GitFork className="w-4 h-4 text-indigo-600" />
              <span>Active Research Projects</span>
            </h2>
            <Link to="/research/projects" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {activeProjects.map(proj => (
              <div
                key={proj.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {proj.title}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 uppercase">
                    {proj.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                  {proj.description}
                </p>
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                    <span>Progress: {proj.progressPercent}%</span>
                    <span>Due: {proj.dueDate}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${proj.progressPercent}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seminal Literature */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-emerald-600" />
              <span>Key Academic Literature</span>
            </h2>
            <Link to="/research/papers" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              View library
            </Link>
          </div>

          <div className="space-y-3">
            {recentPapers.map(paper => (
              <div
                key={paper.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80 space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                    {paper.title}
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-600 shrink-0">
                    {paper.year}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  {paper.authors.join(', ')} • {paper.publicationOrVenue}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span>Citations: {paper.citationsCount.toLocaleString()}</span>
                  {paper.url && (
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-0.5 hover:underline"
                    >
                      <span>PDF</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
