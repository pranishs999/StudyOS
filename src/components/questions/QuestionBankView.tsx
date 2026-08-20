import React, { useState } from 'react';
import { 
  HelpCircle, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Star, 
  Lightbulb, 
  Sparkles, 
  BookOpen, 
  Trash2, 
  Award,
  Flame,
  ChevronRight
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { Question, QuestionStatus, Priority } from '../../types';

export const QuestionBankView: React.FC = () => {
  const { 
    questions, 
    subjects, 
    units, 
    topics, 
    addQuestion, 
    deleteQuestion, 
    recordQuestionAttempt, 
    selectedQuestionId,
    setSelectedQuestionId 
  } = useStudy();

  const [selectedSubFilter, setSelectedSubFilter] = useState<string>('all');
  const [selectedMarksFilter, setSelectedMarksFilter] = useState<number | 'all'>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<QuestionStatus | 'all'>('all');
  const [onlyMustKnow, setOnlyMustKnow] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({
    'q_ai_1': true,
  });
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New Question form state
  const [newSubId, setNewSubId] = useState<string>(subjects[0]?.id || '');
  const [newTopicId, setNewTopicId] = useState<string>('');
  const [newQuestionText, setNewQuestionText] = useState<string>('');
  const [newAnswerText, setNewAnswerText] = useState<string>('');
  const [newHint, setNewHint] = useState<string>('');
  const [newMarks, setNewMarks] = useState<2 | 3 | 5 | 7 | 10>(5);
  const [newPriority, setNewPriority] = useState<Priority | 'must_know'>('high');
  const [newFormula, setNewFormula] = useState<string>('');
  const [isPastExam, setIsPastExam] = useState<boolean>(true);

  const filteredQuestions = questions.filter(q => {
    const matchesSub = selectedSubFilter === 'all' || q.subject_id === selectedSubFilter;
    const matchesMarks = selectedMarksFilter === 'all' || q.marks === selectedMarksFilter;
    const matchesStatus = selectedStatusFilter === 'all' || q.status === selectedStatusFilter;
    const matchesMustKnow = !onlyMustKnow || q.priority === 'must_know' || q.isPreviousExam;
    const matchesSearch = !searchQuery || 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.tags && q.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesSub && matchesMarks && matchesStatus && matchesMustKnow && matchesSearch;
  });

  const toggleAnswer = (qId: string) => {
    setRevealedAnswers(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const toggleHint = (qId: string) => {
    setRevealedHints(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const sub = subjects.find(s => s.id === newSubId);
    const top = topics.find(t => t.id === newTopicId);
    if (!sub || !newQuestionText.trim() || !newAnswerText.trim()) return;

    addQuestion({
      subject_id: newSubId,
      unit_id: top?.unit_id || 'unit_1',
      topic_id: newTopicId || 'top_1',
      subject_name: sub.name,
      subject_code: sub.code,
      unit_title: 'Unit II',
      topic_title: top?.title || 'Core Topic',
      question: newQuestionText.trim(),
      answer: newAnswerText.trim(),
      hint: newHint.trim() || undefined,
      keyFormula: newFormula.trim() || undefined,
      formulaLabel: newFormula.trim() ? 'CORE FORMULA' : undefined,
      marks: newMarks,
      priority: newPriority,
      difficulty: 'hard',
      status: 'not_practiced',
      attemptsCount: 0,
      tags: [sub.code, `${newMarks} Marks`],
      isPreviousExam: isPastExam,
    });

    setIsAddModalOpen(false);
    setNewQuestionText('');
    setNewAnswerText('');
    setNewHint('');
    setNewFormula('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">High-Yield Exam Question Bank</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Previous university exam problems, 10-mark derivations, numericals, and theorem proofs.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs shadow-indigo-100 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Exam Question</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search questions by keyword, theorem, algorithm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Quick toggle for Must-Know / Past Exams */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOnlyMustKnow(!onlyMustKnow)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                onlyMustKnow
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Must-Know Past Papers Only</span>
            </button>
          </div>
        </div>

        {/* Filter Pills: Subject, Marks, Status */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Subject Pills */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-semibold text-slate-400 mr-1">Subject:</span>
            <button
              onClick={() => setSelectedSubFilter('all')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${selectedSubFilter === 'all' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
            >
              All
            </button>
            {subjects.map(sub => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubFilter(sub.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${selectedSubFilter === sub.id ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
              >
                {sub.code}
              </button>
            ))}
          </div>

          {/* Marks Filter */}
          <div className="flex items-center gap-1 ml-auto">
            <span className="text-[11px] font-semibold text-slate-400 mr-1">Marks:</span>
            {['all', 2, 3, 5, 7, 10].map(m => (
              <button
                key={m}
                onClick={() => setSelectedMarksFilter(m as any)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold ${selectedMarksFilter === m ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
              >
                {m === 'all' ? 'All' : `${m}M`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <HelpCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No questions match your filter</h4>
            <p className="text-xs text-slate-500 mt-1">Try changing your search term or subject filters.</p>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isAnswerOpen = revealedAnswers[q.id] ?? false;
            const isHintOpen = revealedHints[q.id] ?? false;

            return (
              <div
                key={q.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs space-y-3.5 transition-all"
              >
                {/* Question Header Badges */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white font-mono uppercase">
                      {q.subject_code}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
                      {q.topic_title}
                    </span>
                    {q.isPreviousExam && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                        ⭐ Past University Exam
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                      {q.marks} MARKS
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      q.status === 'mastered' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' :
                      q.status === 'confident' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                      q.status === 'practicing' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                      'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {q.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* The Question Text */}
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {q.question}
                </h4>

                {/* Hint Drawer if available */}
                {q.hint && (
                  <div>
                    <button
                      onClick={() => toggleHint(q.id)}
                      className="text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 hover:underline"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>{isHintOpen ? 'Hide Hint' : 'Need a hint?'}</span>
                    </button>
                    {isHintOpen && (
                      <div className="mt-2 p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200">
                        💡 {q.hint}
                      </div>
                    )}
                  </div>
                )}

                {/* Answer / Solution Reveal */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleAnswer(q.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      {isAnswerOpen ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{isAnswerOpen ? 'Hide Model Solution' : 'Reveal Model Solution'}</span>
                    </button>
                  </div>

                  {isAnswerOpen && (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs leading-relaxed space-y-3 animate-in fade-in">
                      <div className="flex items-center justify-between text-[11px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                        <span>Model Solution & Proof</span>
                        <span>{q.marks} Marks Breakdown</span>
                      </div>

                      {q.keyFormula && (
                        <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 font-mono font-bold text-indigo-900 dark:text-indigo-200">
                          {q.keyFormula}
                        </div>
                      )}

                      <div className="whitespace-pre-line text-slate-700 dark:text-slate-300 font-normal">
                        {q.answer}
                      </div>

                      {/* Self Assessment Action */}
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-500">Record Practice Result:</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => recordQuestionAttempt(q.id, 1)}
                            className="px-2.5 py-1 rounded bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 font-semibold text-[10px]"
                          >
                            Struggled
                          </button>
                          <button
                            onClick={() => recordQuestionAttempt(q.id, 3)}
                            className="px-2.5 py-1 rounded bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 font-semibold text-[10px]"
                          >
                            Needs Work
                          </button>
                          <button
                            onClick={() => recordQuestionAttempt(q.id, 5)}
                            className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 font-semibold text-[10px]"
                          >
                            Solved Correctly ✓
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Question Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Add Exam Question</h3>

            <form onSubmit={handleCreateQuestion} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                  <select
                    value={newSubId}
                    onChange={(e) => {
                      setNewSubId(e.target.value);
                      setNewTopicId('');
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Marks</label>
                  <select
                    value={newMarks}
                    onChange={(e) => setNewMarks(Number(e.target.value) as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                  >
                    <option value={2}>2 Marks (Short)</option>
                    <option value={5}>5 Marks (Medium)</option>
                    <option value={7}>7 Marks (Numerical)</option>
                    <option value={10}>10 Marks (Long / Derivation)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Question Text</label>
                <textarea
                  placeholder="State and prove the theorem, or calculate the output..."
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  required
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Model Solution / Proof</label>
                <textarea
                  placeholder="Step 1: Formula definition&#10;Step 2: Substitution&#10;Step 3: Conclusion"
                  value={newAnswerText}
                  onChange={(e) => setNewAnswerText(e.target.value)}
                  required
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Key Formula (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. E = mc^2"
                    value={newFormula}
                    onChange={(e) => setNewFormula(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Hint (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Remember to test base case k=0"
                    value={newHint}
                    onChange={(e) => setNewHint(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pastExamCheck"
                  checked={isPastExam}
                  onChange={(e) => setIsPastExam(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <label htmlFor="pastExamCheck" className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  This appeared in previous university examinations
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
