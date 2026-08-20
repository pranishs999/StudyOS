import React, { useState } from 'react';
import { 
  RefreshCw, 
  CheckCircle2, 
  RotateCw, 
  Clock, 
  Award, 
  Sparkles, 
  ChevronRight, 
  Calendar,
  AlertTriangle,
  Flame,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { RevisionItem } from '../../types';

export const RevisionQueueView: React.FC = () => {
  const { 
    revisions, 
    completeRevision, 
    postponeRevision, 
    topics, 
    startFocusTimer, 
    setActiveView,
    triggerConfetti 
  } = useStudy();

  const [activeTab, setActiveTab] = useState<'due' | 'upcoming' | 'mastered'>('due');
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const dueItems = revisions.filter(r => r.status === 'due');
  const upcomingItems = revisions.filter(r => r.status === 'postponed' || (r.status === 'due' && new Date(r.due_date) > new Date()));
  const masteredItems = revisions.filter(r => r.status === 'mastered');

  const currentDeck = activeTab === 'due' ? dueItems : activeTab === 'upcoming' ? upcomingItems : masteredItems;
  const currentCard = currentDeck[activeCardIndex] || currentDeck[0];

  const currentTopic = currentCard ? topics.find(t => t.id === currentCard.topic_id) : null;

  const handleRateRecall = (confidence: number) => {
    if (!currentCard) return;
    completeRevision(currentCard.id, confidence);
    setIsFlipped(false);
    if (activeCardIndex >= currentDeck.length - 1) {
      setActiveCardIndex(0);
    }
  };

  const stageIntervalLabels = ['1 Day', '3 Days', '7 Days', '14 Days', '30 Days', 'Mastered'];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <span>Spaced Repetition & Recall Queue</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              Leitner EB-5
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Active recall scheduled automatically at 1, 3, 7, 14, and 30 day intervals to cement long-term memory.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-semibold shadow-xs">
          <button
            onClick={() => {
              setActiveTab('due');
              setActiveCardIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'due' ? 'bg-indigo-600 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <span>Due Today</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${activeTab === 'due' ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
              {dueItems.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('upcoming');
              setActiveCardIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'upcoming' ? 'bg-indigo-600 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <span>Upcoming</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${activeTab === 'upcoming' ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
              {upcomingItems.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('mastered');
              setActiveCardIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'mastered' ? 'bg-indigo-600 text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <span>Mastered</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${activeTab === 'mastered' ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
              {masteredItems.length}
            </span>
          </button>
        </div>
      </div>

      {/* Main Flash Drill Card or Empty State */}
      {currentDeck.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            {activeTab === 'due' ? 'You are all caught up for today!' : 'No cards in this deck'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Great job reinforcing your memory decay curve. New cards will appear as their revision interval arrives.
          </p>
          <button
            onClick={() => setActiveView('subjects')}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Review Full Syllabus</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Flashcard Drill View (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold">Card {activeCardIndex + 1} of {currentDeck.length}</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                Leitner Box {currentCard.revision_stage} ({stageIntervalLabels[Math.max(0, Math.min(stageIntervalLabels.length - 1, currentCard.revision_stage - 1))]})
              </span>
            </div>

            {/* Interactive Flashcard with Flip mechanism */}
            <div 
              onClick={() => setIsFlipped(!isFlipped)}
              className="min-h-[320px] sm:min-h-[380px] p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs cursor-pointer flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group relative overflow-hidden"
            >
              {/* Top Card Info Tag */}
              <div className="flex items-center justify-between">
                <span 
                  className="px-2.5 py-1 rounded text-xs font-mono font-bold text-white uppercase"
                  style={{ backgroundColor: currentCard.subject_color }}
                >
                  {currentCard.subject_name}
                </span>
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <RotateCw className="w-3.5 h-3.5 text-indigo-500" />
                  Click anywhere to {isFlipped ? 'hide answer' : 'reveal formula & answer'}
                </span>
              </div>

              {/* Central Question & Formula Prompt */}
              <div className="my-auto py-6 text-center space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {currentCard.topic_title}
                </h3>

                {!isFlipped ? (
                  <div className="inline-block px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
                    ❓ Recall: What are the core formulas, edge cases, and principles for this topic?
                  </div>
                ) : (
                  <div className="space-y-4 animate-in fade-in zoom-in-95">
                    {currentTopic?.keyFormula && (
                      <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-700 dark:text-indigo-300 font-mono">
                          Key Academic Formula / Rule
                        </span>
                        <p className="font-mono text-lg font-bold text-indigo-900 dark:text-indigo-100 mt-1">
                          {currentTopic.keyFormula}
                        </p>
                        {currentTopic.keyFormulaExplanation && (
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                            {currentTopic.keyFormulaExplanation}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-left text-xs text-slate-700 dark:text-slate-300 space-y-1">
                      <span className="font-bold uppercase text-[10px] text-slate-400">Revision Notes</span>
                      <p className="leading-relaxed">
                        {currentTopic?.description || currentCard.topic_description || 'Comprehensive review of concepts, derivations, and practice problems.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
                <span>Due Date: {currentCard.due_date}</span>
                <span>Stage: {currentCard.revision_stage} / 5</span>
              </div>
            </div>

            {/* Confidence Recall Rating Buttons (Shown upon Flip) */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs space-y-2">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 text-center">
                How well did you recall this topic?
              </p>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => handleRateRecall(1)}
                  className="py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 text-xs font-bold transition-all border border-rose-200 dark:border-rose-900/40"
                >
                  Forgot (Box 1)
                </button>
                <button
                  onClick={() => handleRateRecall(3)}
                  className="py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 text-xs font-bold transition-all border border-amber-200 dark:border-amber-900/40"
                >
                  Hard (+1 Day)
                </button>
                <button
                  onClick={() => handleRateRecall(4)}
                  className="py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 text-xs font-bold transition-all border border-blue-200 dark:border-blue-900/40"
                >
                  Good (Next Box)
                </button>
                <button
                  onClick={() => {
                    handleRateRecall(5);
                    triggerConfetti();
                  }}
                  className="py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-bold transition-all border border-emerald-200 dark:border-emerald-900/40"
                >
                  Mastered ✨
                </button>
              </div>
            </div>
          </div>

          {/* Right 4 Cols: Spaced Repetition Leitner Box Ladder */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">
                Leitner Retention Ladder
              </h3>

              <div className="space-y-2.5">
                {stageIntervalLabels.map((label, idx) => {
                  const boxNumber = idx + 1;
                  const itemsInBox = revisions.filter(r => (idx === 5 ? r.status === 'mastered' : r.revision_stage === boxNumber && r.status !== 'mastered'));
                  const isCurrentBox = currentCard && (idx === 5 ? currentCard.status === 'mastered' : currentCard.revision_stage === boxNumber);

                  return (
                    <div 
                      key={idx}
                      className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                        isCurrentBox 
                          ? 'bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-400 dark:border-indigo-600 shadow-xs' 
                          : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                          isCurrentBox 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            Box {idx + 1} ({label})
                          </p>
                        </div>
                      </div>

                      <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">
                        {itemsInBox.length} topics
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
