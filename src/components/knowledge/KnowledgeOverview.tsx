import React from 'react';
import { 
  Network, 
  Share2, 
  BrainCircuit, 
  Lightbulb, 
  ArrowRight, 
  Plus, 
  Sparkles, 
  BookOpen,
  Zap
} from 'lucide-react';
import { useRouter, Link } from '../../router/RouterContext';
import { useStudy } from '../../context/StudyContext';

export const KnowledgeOverview: React.FC = () => {
  const { navigate } = useRouter();
  const { concepts, conceptRelations, subjects } = useStudy();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-indigo-600" />
            <span>Knowledge Graph & Conceptual Semantic Web</span>
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            Visual inter-disciplinary concept mapping, prerequisite ontology trees, and AI semantic vector clustering.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/knowledge/graph"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            <Share2 className="w-4 h-4" />
            <span>Launch Visual Interactive Graph</span>
          </Link>
        </div>
      </div>

      {/* 4 Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/knowledge/graph"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Share2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
            Interactive Graph
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            2D/3D physics-based node cluster simulation & links
          </p>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
            <span>Explore network</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        <Link
          to="/knowledge/concepts"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
            Core Concepts
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            {concepts.length} fundamental academic paradigms & theories
          </p>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <span>Browse concepts</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        <Link
          to="/knowledge/relations"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Network className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
            Relations & Ontologies
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            {conceptRelations.length} prerequisite trees, generalizations, and isomorphisms
          </p>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            <span>View taxonomy</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        <Link
          to="/knowledge/insights"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Lightbulb className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
            Cross-Discipline Insights
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            AI synthesized analogies connecting math, physics & systems
          </p>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-purple-600 dark:text-purple-400">
            <span>Read insights</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Concepts overview preview */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-emerald-600" />
            <span>Mastery Levels of Central Academic Concepts</span>
          </h2>
          <Link to="/knowledge/concepts" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            View all ({concepts.length})
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {concepts.slice(0, 6).map(concept => (
            <div
              key={concept.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                  {concept.subject_code}
                </span>
                <span className="text-[10px] font-bold text-slate-500 capitalize">
                  {concept.complexity}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                {concept.name}
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                {concept.summary}
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mb-1">
                  <span>Mastery</span>
                  <span>{concept.masteryLevel}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${concept.masteryLevel}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
