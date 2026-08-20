import React from 'react';
import { 
  BarChart3, 
  Flame, 
  Clock, 
  TrendingUp, 
  Award, 
  Calendar, 
  BookOpen, 
  RefreshCw, 
  GraduationCap 
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

export const AnalyticsView: React.FC = () => {
  const { 
    profile, 
    sessions, 
    subjects, 
    topics, 
    revisions, 
    todayStudyMinutes, 
    syllabusCompletionPercentage, 
    overallReadiness 
  } = useStudy();

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const mockWeeklyHours = [3.5, 4.2, 5.0, 4.8, 6.0, 5.5, (todayStudyMinutes / 60) || 4.5];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Performance & Retention Analytics</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Quantified metrics on study volume, spaced repetition retention, and syllabus momentum.
        </p>
      </div>

      {/* Top 4 Metric Summaries */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Weekly Study Total</span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white font-mono">
            {mockWeeklyHours.reduce((a, b) => a + b, 0).toFixed(1)} hrs
          </p>
          <p className="text-[10px] text-emerald-600 font-bold mt-1">
            +14% vs last week
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Study Consistency</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white font-mono">
            {profile.streakDays} Days
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            Longest: {profile.longestStreakDays} days
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Spaced Recall Retention</span>
            <RefreshCw className="w-4 h-4 text-purple-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white font-mono">
            87.4%
          </p>
          <p className="text-[10px] text-purple-600 font-bold mt-1">
            High Recall Rate
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Average Readiness</span>
            <GraduationCap className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white font-mono">
            {overallReadiness}%
          </p>
          <p className="text-[10px] text-indigo-600 font-bold mt-1">
            Passing Target: 85%
          </p>
        </div>
      </div>

      {/* Main Charts: Weekly Hours & Course Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Study Volume Bar Chart */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              7-Day Study Volume (Hours)
            </h3>
            <span className="text-xs font-mono text-slate-500">Daily Target: 5.0h</span>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2">
            {mockWeeklyHours.map((hrs, idx) => {
              const heightPercent = Math.min(100, (hrs / 6.0) * 100);
              const isToday = idx === 6;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {hrs.toFixed(1)}h
                  </span>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg h-full flex items-end overflow-hidden">
                    <div 
                      className={`w-full rounded-t-lg transition-all duration-500 ${isToday ? 'bg-indigo-600' : 'bg-indigo-400 dark:bg-indigo-500'}`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className={`text-[11px] font-semibold ${isToday ? 'text-indigo-600 font-bold' : 'text-slate-400'}`}>
                    {daysOfWeek[idx]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subject-Wise Syllabus Completion */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Course Completion & Confidence Index
          </h3>

          <div className="space-y-3 pt-1">
            {subjects.map(sub => {
              const subTopics = topics.filter(t => t.subject_id === sub.id);
              const doneCount = subTopics.filter(t => t.status === 'completed' || t.status === 'mastered').length;
              const pct = subTopics.length > 0 ? Math.round((doneCount / subTopics.length) * 100) : 0;

              return (
                <div key={sub.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span 
                        className="px-1.5 py-0.2 rounded text-[9px] font-bold text-white uppercase font-mono"
                        style={{ backgroundColor: sub.color }}
                      >
                        {sub.code}
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{sub.name}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                      {pct}% ({doneCount}/{subTopics.length})
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ width: `${pct}%`, backgroundColor: sub.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
