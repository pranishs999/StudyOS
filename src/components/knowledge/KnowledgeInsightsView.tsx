import React from 'react';
import { Lightbulb, ArrowLeft, Sparkles, Network, ArrowRight } from 'lucide-react';
import { useRouter, Link } from '../../router/RouterContext';
import { useStudy } from '../../context/StudyContext';

export const KnowledgeInsightsView: React.FC = () => {
  const { navigate } = useRouter();
  const { concepts, conceptRelations } = useStudy();

  const crossDomainInsights = [
    {
      id: 'ins_1',
      title: 'Duality: Linear Algebra Eigendecomposition & Principal Component Analysis',
      disciplineA: 'Linear Algebra (MATH 204)',
      disciplineB: 'Deep Learning & ML (CS 420)',
      explanation: 'The mathematical operation of finding principal eigenvectors of a covariance matrix in Deep Learning is algebraically identical to calculating the orthogonal diagonalizing basis of a symmetric Gram matrix.',
      formula: '\\Sigma v = \\lambda v \\iff \\max_u \\text{Var}(u^T X)',
      similarityScore: 0.96,
    },
    {
      id: 'ins_2',
      title: 'Isomorphism: Petri Nets in OS Deadlocks & Non-Deterministic Finite Automata',
      disciplineA: 'Operating Systems (CS 301)',
      disciplineB: 'Theory of Computation (CS 210)',
      explanation: 'Deadlock detection graph cycles in resource allocation graphs correspond directly to infinite looping states in finite state transition automata without accepting terminal states.',
      formula: 'RAG = (V, E) \\quad \\text{where } V = P \\cup R',
      similarityScore: 0.89,
    },
    {
      id: 'ins_3',
      title: 'Information Geometry: Cross-Entropy Loss & Kullback-Leibler Divergence',
      disciplineA: 'Probability Theory',
      disciplineB: 'Neural Networks Optimization',
      explanation: 'Minimizing multi-class cross-entropy loss with empirical target one-hot vectors is strictly equivalent to minimizing the relative entropy (KL Divergence) between the ground truth distribution and softmax probabilities.',
      formula: 'H(p, q) = H(p) + D_{\\text{KL}}(p \\parallel q)',
      similarityScore: 0.94,
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/knowledge')}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Back to Knowledge Hub"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-purple-600" />
              <span>Cross-Disciplinary Synthesized Insights</span>
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Vector-analyzed bridges across mathematics, theoretical computer science, and distributed engineering.
            </p>
          </div>
        </div>

        <Link
          to="/knowledge/graph"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs"
        >
          <Network className="w-4 h-4" />
          <span>Graph View</span>
        </Link>
      </div>

      {/* Insights Cards */}
      <div className="space-y-4">
        {crossDomainInsights.map(ins => (
          <div
            key={ins.id}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>{ins.title}</span>
              </h3>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                {(ins.similarityScore * 100).toFixed(0)}% Semantic Match
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                {ins.disciplineA}
              </span>
              <span className="text-slate-400 font-bold">⟷</span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                {ins.disciplineB}
              </span>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {ins.explanation}
            </p>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-100 dark:border-slate-800 text-xs font-mono text-indigo-700 dark:text-indigo-300 overflow-x-auto">
              {ins.formula}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
