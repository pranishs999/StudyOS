import React from 'react';
import { 
  GraduationCap, 
  Clock, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  Sparkles, 
  Calendar, 
  FileText, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

export const ExamModeView: React.FC = () => {
  const { 
    examFleet, 
    subjects, 
    topics, 
    startFocusTimer, 
    setActiveView, 
    setSelectedSubjectId,
    selectedSubjectId 
  } = useStudy();

  const primaryExam = examFleet.find(e => e.isPrimary) || examFleet[0];
  const primarySubject = subjects.find(s => s.id === primaryExam?.subject_id);
  const primaryTopics = topics.filter(t => t.subject_id === primaryExam?.subject_id);

  const highYieldTopics = primaryTopics.filter(t => t.priority === 'critical' || t.priority === 'high');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Exam Command & Strategic Readiness</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Mathematical readiness index, high-yield topic drills, and multi-course exam timelines.
        </p>
      </div>

      {/* Primary Upcoming Exam Hero Banner */}
      {primaryExam && (
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-sm">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-rose-500 text-white uppercase font-mono tracking-wider animate-pulse">
                  T-{primaryExam.daysRemaining} DAYS REMAINING
                </span>
                <span className="text-xs font-mono text-indigo-300">
                  Exam Date: {primaryExam.exam_date}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {primaryExam.subject_name} ({primaryExam.course_code})
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Primary focus course. Target score is <strong className="text-white font-bold">{primaryExam.target_score}/{primaryExam.total_marks} Marks</strong>. Current estimated preparation is <strong className="text-emerald-400 font-bold">{primaryExam.readinessScore}%</strong>.
              </p>
            </div>

            {/* Circular Readiness Gauge & Start Prep Button */}
            <div className="flex items-center gap-6 shrink-0">
              <div className="text-center">
                <div className="text-4xl font-extrabold font-mono text-emerald-400">
                  {primaryExam.readinessScore}%
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                  Readiness Index
                </span>
              </div>

              <button
                onClick={() => {
                  startFocusTimer(primaryExam.subject_id, highYieldTopics[0]?.id, 50);
                  setActiveView('focus-mode');
                }}
                className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs shadow-xs shadow-indigo-500/30 flex items-center gap-2 transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Launch 50m Exam Sprint</span>
              </button>
            </div>
          </div>

          {/* Mathematical Readiness Formula Breakdown Sub-strip */}
          <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block">Syllabus Completion (40%)</span>
              <span className="font-mono font-bold text-slate-200">{primaryExam.syllabusCompletion}%</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Revision Coverage (25%)</span>
              <span className="font-mono font-bold text-slate-200">{primaryExam.revisionCompletion}%</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Past Paper Practice (25%)</span>
              <span className="font-mono font-bold text-slate-200">{primaryExam.practiceCompletion}%</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Consistency Index (10%)</span>
              <span className="font-mono font-bold text-slate-200">{primaryExam.consistencyScore}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Full Exam Fleet Cards Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Complete Exam Fleet Timetable
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {examFleet.map((exam) => {
            const sub = subjects.find(s => s.id === exam.subject_id);

            return (
              <div
                key={exam.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-indigo-400 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span 
                      className="px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase font-mono"
                      style={{ backgroundColor: sub?.color || '#4f46e5' }}
                    >
                      {exam.subject_code}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                      T-{exam.daysRemaining} Days
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {exam.title}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Exam Date: {exam.exam_date} • Target: {exam.target_score} Marks
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Exam Readiness</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {exam.readinessScore}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${exam.readinessScore >= 70 ? 'bg-emerald-500' : exam.readinessScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                      style={{ width: `${exam.readinessScore}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => {
                      setSelectedSubjectId(exam.subject_id);
                      setActiveView('subjects');
                    }}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    View Syllabus →
                  </button>

                  <button
                    onClick={() => {
                      startFocusTimer(exam.subject_id, undefined, 25);
                      setActiveView('focus-mode');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Focus</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* High Yield Final Revision Checklist */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              High-Yield Revision Checklist for {primaryExam.subject_name}
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Repeated 10-Mark Questions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {highYieldTopics.map((top) => (
            <div 
              key={top.id}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {top.title}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Est: {top.estimated_minutes}m • Confidence {top.confidence}/5
                </p>
              </div>

              <button
                onClick={() => {
                  startFocusTimer(top.subject_id, top.id, 25);
                  setActiveView('focus-mode');
                }}
                className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shrink-0 shadow-xs"
              >
                Drill Topic
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
