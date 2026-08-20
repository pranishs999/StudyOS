import React from 'react';
import { 
  Timer, 
  BookOpen, 
  RefreshCw, 
  GraduationCap, 
  Flame, 
  ArrowRight, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Sparkles, 
  AlertTriangle, 
  ChevronRight, 
  Play, 
  HelpCircle,
  FileText,
  Calendar,
  Layers,
  Plus,
  Edit3
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

export const DashboardView: React.FC = () => {
  const { 
    profile, 
    todayStudyMinutes, 
    syllabusCompletionPercentage, 
    totalTopicsCount, 
    completedTopicsCount, 
    dueRevisionsCount, 
    overallReadiness, 
    recommendedAction, 
    sessions, 
    completeSession, 
    examFleet, 
    topics, 
    subjects, 
    startFocusTimer, 
    setActiveView, 
    setSelectedSubjectId,
    quickUpdateTopicStatus
  } = useStudy();

  const todayHours = (todayStudyMinutes / 60).toFixed(1);
  const goalPercent = Math.min(100, Math.round((todayStudyMinutes / profile.dailyGoalMinutes) * 100));

  // Urgent primary exam
  const primaryExam = examFleet.find(e => e.isPrimary) || examFleet[0];

  // Weak topics (low confidence <= 2)
  const weakTopics = topics.filter(t => t.confidence <= 2).slice(0, 3);

  // Today's scheduled sessions
  const todaysSessions = sessions.filter(s => s.date === new Date().toISOString().split('T')[0] || s.status === 'in_progress');

  return (
    <div className="space-y-6 pb-12">
      {/* Top Main Grid Layout (8 cols + 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Columns: Metric Cards + Today's Study Plan + Syllabus Progress */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* 4 Sleek Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Card 1: Study Time */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-xs border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                  Study Time
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
                  {todayHours}h
                </p>
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-2">
                +14% from avg
              </div>
            </div>

            {/* Card 2: Today's Goal */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-xs border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                  Today's Goal
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
                  {goalPercent}%
                </p>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500" 
                  style={{ width: `${goalPercent}%` }} 
                />
              </div>
            </div>

            {/* Card 3: Revision Due */}
            <div 
              onClick={() => setActiveView('revision-queue')}
              className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-xs border border-slate-100 dark:border-slate-800 flex flex-col justify-between cursor-pointer hover:border-indigo-300 transition-colors"
            >
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                  Revision Due
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
                  {dueRevisionsCount}
                </p>
              </div>
              <div className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-2">
                {dueRevisionsCount > 0 ? `${dueRevisionsCount} high priority` : 'All cleared!'}
              </div>
            </div>

            {/* Card 4: Streak */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-xs border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                  Streak
                </p>
                <p className="text-2xl font-bold text-orange-500 font-mono">
                  {profile.streakDays}d 🔥
                </p>
              </div>
              <div className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                Best: {profile.longestStreakDays} days
              </div>
            </div>
          </div>

          {/* AI Recommended Focus Strip */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-slate-900 border border-indigo-100 dark:border-indigo-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-700 dark:text-indigo-400 bg-indigo-100/80 dark:bg-indigo-900/60 px-2 py-0.2 rounded-full">
                    Recommended Action
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{recommendedAction.subject}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {recommendedAction.title}
                </h4>
              </div>
            </div>

            <button
              onClick={() => {
                if (recommendedAction.subjectId) {
                  startFocusTimer(recommendedAction.subjectId, recommendedAction.topicId, 25);
                }
                setActiveView('focus-mode');
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm shadow-indigo-100 shrink-0 flex items-center gap-1.5 self-start sm:self-auto transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{recommendedAction.actionLabel}</span>
            </button>
          </div>

          {/* Today's Study Plan Section */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xs border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h2 className="font-bold text-slate-800 dark:text-white text-base">Today's Study Plan</h2>
              <button 
                onClick={() => setActiveView('study-planner')}
                className="text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:underline"
              >
                Open Timeblocks →
              </button>
            </div>

            <div className="divide-y divide-slate-50 dark:divide-slate-800/60">
              {/* Session 1: High Priority OS */}
              <div className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-950/60 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
                  OS
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    CPU Scheduling Algorithms (Round Robin & Multi-level)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Operating Systems • 60 min session</p>
                </div>
                <div className="flex gap-2 items-center shrink-0">
                  <span className="px-2 py-1 bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 text-[10px] font-bold rounded uppercase">
                    High
                  </span>
                  <button 
                    onClick={() => {
                      startFocusTimer('sub_os', undefined, 25);
                      setActiveView('focus-mode');
                    }}
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs shadow-indigo-100 transition-colors"
                  >
                    Start Focus
                  </button>
                </div>
              </div>

              {/* Session 2: AI Search */}
              <div className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/60 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                  AI
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    A* Search & Heuristic Admissibility Proofs
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Artificial Intelligence • 45 min session</p>
                </div>
                <div className="flex gap-2 items-center shrink-0">
                  <span className="px-2 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded uppercase">
                    Med
                  </span>
                  <button 
                    onClick={() => {
                      startFocusTimer('sub_ai', undefined, 45);
                      setActiveView('focus-mode');
                    }}
                    className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg transition-colors"
                  >
                    Start 45m
                  </button>
                </div>
              </div>

              {/* Session 3: Completed DBMS */}
              <div className="flex items-center gap-4 p-4 opacity-60">
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold shrink-0">
                  DB
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 line-through truncate">
                    Normalization Rules (BCNF & 3NF Lossless Join)
                  </h3>
                  <p className="text-xs text-slate-500">DBMS • Completed in 52m</p>
                </div>
                <div className="text-emerald-500 shrink-0">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border-2 border-emerald-500 flex items-center justify-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    ✓
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Syllabus Progress Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xs border border-slate-100 dark:border-slate-800 flex flex-col p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-800 dark:text-white text-base">Syllabus Progress</h2>
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                {syllabusCompletionPercentage}% Total
              </span>
            </div>

            <div className="space-y-4">
              {subjects.slice(0, 4).map((sub) => {
                const subTopics = topics.filter(t => t.subject_id === sub.id);
                const doneCount = subTopics.filter(t => t.status === 'completed' || t.status === 'mastered').length;
                const pct = subTopics.length > 0 ? Math.round((doneCount / subTopics.length) * 100) : 0;

                return (
                  <div key={sub.id} className="flex items-center gap-4">
                    <div className="w-28 text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                      {sub.name}
                    </div>
                    <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="w-10 text-xs text-right font-mono font-bold text-slate-700 dark:text-slate-300">
                      {pct}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right 4 Columns: Sleek Exam Countdown + Weekly Activity + Quick Actions */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Sleek Exam Countdown Banner */}
          {primaryExam && (
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200 dark:shadow-none relative overflow-hidden">
              <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-white/10 rounded-full" />
              <p className="text-indigo-100 text-xs font-semibold mb-1 uppercase tracking-wider">
                Exam Countdown
              </p>
              <h2 className="text-2xl font-bold mb-1 tracking-tight">
                {primaryExam.subject_name}
              </h2>
              <p className="text-4xl font-black mb-4 tracking-tight">
                {primaryExam.daysRemaining} <span className="text-lg font-normal opacity-80">DAYS LEFT</span>
              </p>
              
              <div className="bg-white/10 backdrop-blur-xs rounded-lg p-3 border border-white/10">
                <p className="text-[10px] uppercase opacity-70 mb-1 font-semibold tracking-wider">Readiness Score</p>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold font-mono">{primaryExam.readinessScore}%</span>
                  <span className="text-xs text-emerald-300 font-semibold">
                    {primaryExam.readinessScore >= 75 ? 'Target on Track' : 'Moderate Risk'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Weekly Activity Bar Chart */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xs border border-slate-100 dark:border-slate-800 p-5 flex-1 flex flex-col justify-between">
            <h2 className="font-bold text-slate-800 dark:text-white text-sm mb-4">Weekly Activity</h2>
            
            <div className="h-32 flex items-end justify-between gap-1 pb-2">
              <div className="w-full bg-indigo-100 dark:bg-indigo-950/60 rounded-xs transition-all hover:bg-indigo-300" style={{ height: '40%' }} />
              <div className="w-full bg-indigo-200 dark:bg-indigo-900/60 rounded-xs transition-all hover:bg-indigo-400" style={{ height: '65%' }} />
              <div className="w-full bg-indigo-300 dark:bg-indigo-800/80 rounded-xs transition-all hover:bg-indigo-500" style={{ height: '85%' }} />
              <div className="w-full bg-indigo-600 rounded-xs shadow-xs transition-all hover:bg-indigo-700" style={{ height: '100%' }} />
              <div className="w-full bg-indigo-400 dark:bg-indigo-700 rounded-xs transition-all hover:bg-indigo-500" style={{ height: '50%' }} />
              <div className="w-full bg-indigo-200 dark:bg-indigo-900/60 rounded-xs transition-all hover:bg-indigo-300" style={{ height: '30%' }} />
              <div className="w-full bg-indigo-100 dark:bg-indigo-950/40 rounded-xs transition-all hover:bg-indigo-200" style={{ height: '15%' }} />
            </div>

            <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-2">
              <span>MON</span>
              <span>TUE</span>
              <span>WED</span>
              <span>THU</span>
              <span>FRI</span>
              <span>SAT</span>
              <span>SUN</span>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xs border border-slate-100 dark:border-slate-800 p-5">
            <h2 className="font-bold text-slate-800 dark:text-white text-sm mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setActiveView('subjects')}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
              >
                <div className="w-8 h-8 bg-amber-50 dark:bg-amber-950/60 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold text-sm mb-2 group-hover:scale-105 transition-transform">
                  ＋
                </div>
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Add Topic</span>
              </button>

              <button 
                onClick={() => setActiveView('notes')}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
              >
                <div className="w-8 h-8 bg-purple-50 dark:bg-purple-950/60 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-sm mb-2 group-hover:scale-105 transition-transform">
                  ✎
                </div>
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">New Note</span>
              </button>

              <button 
                onClick={() => setActiveView('question-bank')}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
              >
                <div className="w-8 h-8 bg-blue-50 dark:bg-blue-950/60 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm mb-2 group-hover:scale-105 transition-transform">
                  ？
                </div>
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Question Bank</span>
              </button>

              <button 
                onClick={() => setActiveView('revision-queue')}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
              >
                <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-950/60 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-sm mb-2 group-hover:scale-105 transition-transform">
                  ⟳
                </div>
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Revise All</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
