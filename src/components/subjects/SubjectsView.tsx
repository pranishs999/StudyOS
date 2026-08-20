import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  Play, 
  Sparkles, 
  Star, 
  Trash2, 
  FileText, 
  Layers, 
  AlertCircle,
  Hash,
  Award
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { Subject, Unit, Topic, TopicStatus, Priority } from '../../types';

export const SubjectsView: React.FC = () => {
  const { 
    subjects, 
    units, 
    topics, 
    addSubject, 
    addUnit, 
    addTopic, 
    deleteTopic, 
    quickUpdateTopicStatus, 
    updateTopicConfidence, 
    startFocusTimer, 
    setActiveView, 
    selectedSubjectId, 
    setSelectedSubjectId 
  } = useStudy();

  const activeSubject = subjects.find(s => s.id === (selectedSubjectId || subjects[0]?.id)) || subjects[0];

  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({
    'unit_toc_1': true,
    'unit_ai_1': true,
    'unit_ai_3': true,
    'unit_os_2': true,
  });

  const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState<boolean>(false);
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState<boolean>(false);
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState<boolean>(false);

  // Add Topic form state
  const [topicUnitId, setTopicUnitId] = useState<string>('');
  const [topicTitle, setTopicTitle] = useState<string>('');
  const [topicDesc, setTopicDesc] = useState<string>('');
  const [topicPriority, setTopicPriority] = useState<Priority>('high');
  const [topicEstMinutes, setTopicEstMinutes] = useState<number>(60);
  const [topicKeyFormula, setTopicKeyFormula] = useState<string>('');
  const [topicFormulaExpl, setTopicFormulaExpl] = useState<string>('');

  // Add Unit form state
  const [unitTitle, setUnitTitle] = useState<string>('');
  const [unitNumber, setUnitNumber] = useState<string>('Unit I');

  // Add Subject form state
  const [subName, setSubName] = useState<string>('');
  const [subCode, setSubCode] = useState<string>('');
  const [subDesc, setSubDesc] = useState<string>('');
  const [subColor, setSubColor] = useState<string>('#4f46e5');

  if (!activeSubject) {
    return <div className="p-8 text-center text-slate-500">No subjects created yet.</div>;
  }

  const subjectUnits = units.filter(u => u.subject_id === activeSubject.id).sort((a, b) => a.order - b.order);
  const subjectTopics = topics.filter(t => t.subject_id === activeSubject.id);

  const completedCount = subjectTopics.filter(t => t.status === 'completed' || t.status === 'mastered').length;
  const totalCount = subjectTopics.length;
  const percentComplete = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const toggleUnit = (unitId: string) => {
    setExpandedUnits(prev => ({ ...prev, [unitId]: !prev[unitId] }));
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicTitle.trim()) return;

    addTopic({
      unit_id: topicUnitId || subjectUnits[0]?.id || 'unit_1',
      subject_id: activeSubject.id,
      title: topicTitle.trim(),
      description: topicDesc.trim(),
      status: 'not_started',
      priority: topicPriority,
      difficulty: 'medium',
      estimated_minutes: topicEstMinutes,
      actual_minutes: 0,
      confidence: 1,
      order: subjectTopics.length + 1,
      keyFormula: topicKeyFormula.trim() || undefined,
      keyFormulaExplanation: topicFormulaExpl.trim() || undefined,
    });

    setIsAddTopicModalOpen(false);
    setTopicTitle('');
    setTopicDesc('');
    setTopicKeyFormula('');
    setTopicFormulaExpl('');
  };

  const handleCreateUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitTitle.trim()) return;

    addUnit({
      subject_id: activeSubject.id,
      title: unitTitle.trim(),
      unitNumber: unitNumber.trim(),
      order: subjectUnits.length + 1,
    });

    setIsAddUnitModalOpen(false);
    setUnitTitle('');
  };

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim() || !subCode.trim()) return;

    const newSub = addSubject({
      name: subName.trim(),
      code: subCode.trim().toUpperCase(),
      description: subDesc.trim(),
      icon: 'book',
      color: subColor,
      difficulty: 'Intermediate',
      target_hours: 40,
      examDate: '2026-06-30',
      examTotalMarks: 100,
      examTargetScore: 90,
    });

    setSelectedSubjectId(newSub.id);
    setIsAddSubjectModalOpen(false);
    setSubName('');
    setSubCode('');
    setSubDesc('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Subject Navigation Tabs / Pills */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          {subjects.map(sub => {
            const isSelected = sub.id === activeSubject.id;
            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSubjectId(sub.id)}
                className={`
                  px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap
                  ${isSelected
                    ? 'text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'}
                `}
                style={{ backgroundColor: isSelected ? sub.color : undefined }}
              >
                <span>{sub.code}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isSelected ? 'bg-black/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                  {sub.name}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setIsAddSubjectModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold whitespace-nowrap shrink-0 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Subject</span>
        </button>
      </div>

      {/* Active Subject Overview Header Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span 
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-white uppercase"
                style={{ backgroundColor: activeSubject.color }}
              >
                {activeSubject.code}
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {activeSubject.name}
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
              {activeSubject.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setTopicUnitId(subjectUnits[0]?.id || '');
                setIsAddTopicModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs shadow-indigo-100 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Topic</span>
            </button>
            <button
              onClick={() => setIsAddUnitModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Add Unit</span>
            </button>
          </div>
        </div>

        {/* Progress bar and metadata */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-6">
            <div>
              Syllabus Completion:{' '}
              <span className="font-bold text-slate-900 dark:text-white font-mono">
                {percentComplete}%
              </span>{' '}
              ({completedCount}/{totalCount} topics)
            </div>
            <div>
              Target Hours:{' '}
              <span className="font-bold text-slate-900 dark:text-white font-mono">
                {activeSubject.target_hours}h
              </span>
            </div>
          </div>

          <div className="w-full sm:w-64 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500" 
              style={{ width: `${percentComplete}%`, backgroundColor: activeSubject.color }}
            />
          </div>
        </div>
      </div>

      {/* Units & Topics Accordion */}
      <div className="space-y-4">
        {subjectUnits.length === 0 ? (
          <div className="p-8 text-center rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
            <p className="text-xs text-slate-500">No units added yet for this subject.</p>
            <button
              onClick={() => setIsAddUnitModalOpen(true)}
              className="mt-3 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold"
            >
              Create Unit 1
            </button>
          </div>
        ) : (
          subjectUnits.map((unit) => {
            const isExpanded = expandedUnits[unit.id] ?? true;
            const unitTopics = subjectTopics.filter(t => t.unit_id === unit.id);
            const unitDoneCount = unitTopics.filter(t => t.status === 'completed' || t.status === 'mastered').length;

            return (
              <div 
                key={unit.id}
                className="rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 overflow-hidden shadow-xs"
              >
                {/* Unit Header */}
                <div 
                  onClick={() => toggleUnit(unit.id)}
                  className="px-4 py-3.5 bg-slate-50/70 dark:bg-slate-800/60 flex items-center justify-between cursor-pointer select-none hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <button className="text-slate-400">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 font-mono">
                      {unit.unitNumber}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {unit.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="font-mono font-semibold">
                      {unitDoneCount}/{unitTopics.length} done
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setTopicUnitId(unit.id);
                        setIsAddTopicModalOpen(true);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-800"
                      title="Add Topic to this unit"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Unit Topics Table / List */}
                {isExpanded && (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {unitTopics.length === 0 ? (
                      <div className="py-4 px-6 text-xs text-slate-400 italic">
                        No topics in this unit yet.
                      </div>
                    ) : (
                      unitTopics.map((topic) => {
                        const isDone = topic.status === 'completed' || topic.status === 'mastered';
                        const isRev = topic.status === 'needs_revision';

                        return (
                          <div 
                            key={topic.id}
                            className="p-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
                          >
                            {/* Left: Checkbox, Title, Formula */}
                            <div className="space-y-1.5 flex-1 min-w-0">
                              <div className="flex items-center gap-2.5 flex-wrap">
                                <button
                                  onClick={() => quickUpdateTopicStatus(
                                    topic.id, 
                                    isDone ? 'not_started' : 'completed'
                                  )}
                                  className="text-slate-400 hover:text-emerald-600 transition-colors"
                                >
                                  {isDone ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100 dark:fill-emerald-950" />
                                  ) : (
                                    <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600" />
                                  )}
                                </button>

                                <h5 className={`text-xs font-bold truncate ${isDone ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                                  {topic.title}
                                </h5>

                                {/* Priority Badge */}
                                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                                  topic.priority === 'critical' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                                  topic.priority === 'high' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                                  'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                }`}>
                                  {topic.priority}
                                </span>

                                {/* Status Selector */}
                                <select
                                  value={topic.status}
                                  onChange={(e) => quickUpdateTopicStatus(topic.id, e.target.value as TopicStatus)}
                                  className="text-[10px] font-semibold py-0.5 px-1.5 rounded-md bg-slate-100 dark:bg-slate-800 border-none text-slate-700 dark:text-slate-300"
                                >
                                  <option value="not_started">⚪ Not Started</option>
                                  <option value="learning">🟡 Learning</option>
                                  <option value="completed">🟢 Completed</option>
                                  <option value="needs_revision">🔴 Needs Revision</option>
                                  <option value="mastered">🟣 Mastered</option>
                                </select>
                              </div>

                              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed pl-6.5">
                                {topic.description}
                              </p>

                              {/* Key Formula callout if present */}
                              {topic.keyFormula && (
                                <div className="ml-6.5 p-2 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/50 dark:border-indigo-900/40 text-[11px] flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[9px] uppercase font-bold tracking-wider text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900 px-1 py-0.2 rounded font-mono">
                                      Formula
                                    </span>
                                    <code className="font-mono font-bold text-indigo-900 dark:text-indigo-200">
                                      {topic.keyFormula}
                                    </code>
                                  </div>
                                  <span className="text-[10px] text-slate-500 dark:text-slate-400 italic truncate">
                                    {topic.keyFormulaExplanation}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Right: Confidence Meter & Focus Launch Button */}
                            <div className="flex items-center gap-4 pl-6.5 md:pl-0 shrink-0">
                              {/* Confidence 5-star rater */}
                              <div className="flex flex-col items-end">
                                <span className="text-[10px] font-semibold text-slate-400 mb-0.5">Confidence</span>
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      onClick={() => updateTopicConfidence(topic.id, star)}
                                      className="p-0.5 text-slate-300 hover:text-amber-400 transition-colors"
                                      title={`Set confidence to ${star}/5`}
                                    >
                                      <Star 
                                        className={`w-3.5 h-3.5 ${
                                          star <= topic.confidence 
                                            ? 'fill-amber-400 text-amber-400' 
                                            : 'text-slate-300 dark:text-slate-600'
                                        }`} 
                                      />
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Start Focus Timer Button */}
                              <button
                                onClick={() => {
                                  startFocusTimer(topic.subject_id, topic.id, 25);
                                  setActiveView('focus-mode');
                                }}
                                className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-600 text-indigo-700 dark:text-indigo-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-indigo-200 dark:border-indigo-800 transition-all shadow-2xs"
                              >
                                <Play className="w-3 h-3 fill-current" />
                                <span>Focus</span>
                              </button>

                              <button
                                onClick={() => deleteTopic(topic.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                title="Delete Topic"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Topic Modal */}
      {isAddTopicModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Add Syllabus Topic to {activeSubject.code}
            </h3>

            <form onSubmit={handleCreateTopic} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Unit</label>
                <select
                  value={topicUnitId}
                  onChange={(e) => setTopicUnitId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                >
                  {subjectUnits.map(u => (
                    <option key={u.id} value={u.id}>{u.unitNumber}: {u.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Topic Title</label>
                <input
                  type="text"
                  placeholder="e.g. A* Search Algorithm, Pumping Lemma, Banker's Algorithm"
                  value={topicTitle}
                  onChange={(e) => setTopicTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Description & Concepts</label>
                <textarea
                  placeholder="Summary of concepts, algorithms, theorems, or problem types covered..."
                  value={topicDesc}
                  onChange={(e) => setTopicDesc(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                  <select
                    value={topicPriority}
                    onChange={(e) => setTopicPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                  >
                    <option value="critical">Critical (Must Master)</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Estimated Mins</label>
                  <input
                    type="number"
                    value={topicEstMinutes}
                    onChange={(e) => setTopicEstMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
              </div>

              {/* Key Formula / Theorem */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Key Formula / Theorem (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. f(n) = g(n) + h(n), δ: Q × Σ → Q"
                  value={topicKeyFormula}
                  onChange={(e) => setTopicKeyFormula(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddTopicModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs"
                >
                  Add Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Unit Modal */}
      {isAddUnitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Add New Syllabus Unit</h3>
            <form onSubmit={handleCreateUnit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Unit Number</label>
                <input
                  type="text"
                  placeholder="e.g. Unit IV, Module 5"
                  value={unitNumber}
                  onChange={(e) => setUnitNumber(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Unit Title</label>
                <input
                  type="text"
                  placeholder="e.g. Heuristic Search & Adversarial Games"
                  value={unitTitle}
                  onChange={(e) => setUnitTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddUnitModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
                >
                  Create Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {isAddSubjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Create New Course / Subject</h3>
            <form onSubmit={handleCreateSubject} className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Compiler Design"
                    value={subName}
                    onChange={(e) => setSubName(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Code</label>
                  <input
                    type="text"
                    placeholder="e.g. CD"
                    value={subCode}
                    onChange={(e) => setSubCode(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono uppercase"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Lexical analysis, parsing, syntax trees, code generation"
                  value={subDesc}
                  onChange={(e) => setSubDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Color Theme</label>
                <div className="flex items-center gap-2">
                  {['#4f46e5', '#0284c7', '#16a34a', '#d97706', '#dc2626', '#9333ea'].map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSubColor(c)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${subColor === c ? 'scale-110 border-slate-900 dark:border-white ring-2 ring-indigo-500' : 'border-transparent'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddSubjectModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
                >
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
