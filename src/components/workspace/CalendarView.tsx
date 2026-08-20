import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  GraduationCap, 
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useRouter } from '../../router/RouterContext';
import { useStudy } from '../../context/StudyContext';

export const CalendarView: React.FC = () => {
  const { navigate } = useRouter();
  const { 
    sessions, 
    examFleet, 
    revisions, 
    subjects, 
    addSession, 
    completeSession,
    playSound 
  } = useStudy();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddSessionModalOpen, setIsAddSessionModalOpen] = useState(false);

  // New session modal state
  const [newSubjectId, setNewSubjectId] = useState(subjects[0]?.id || '');
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newDate, setNewDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newStartTime, setNewStartTime] = useState('14:00');
  const [newDuration, setNewDuration] = useState(60);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    const sub = subjects.find(s => s.id === newSubjectId);
    addSession({
      subject_id: newSubjectId,
      topic_title: newTopicTitle.trim() || 'General Revision Block',
      subject_name: sub ? sub.name : 'Computer Science',
      subject_code: sub ? sub.code : 'CS',
      subject_color: sub ? sub.color : '#0058be',
      date: newDate,
      startTime: newStartTime,
      endTime: '15:00',
      durationMinutes: Number(newDuration),
      priority: 'high',
      status: 'scheduled',
    });

    setNewTopicTitle('');
    setIsAddSessionModalOpen(false);
    playSound('click');
  };

  // Group events by YYYY-MM-DD
  const calendarDays = useMemo(() => {
    const days: { dayNumber: number; dateStr: string; isCurrentMonth: boolean }[] = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ dayNumber: 0, dateStr: '', isCurrentMonth: false });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const monthStr = (month + 1).toString().padStart(2, '0');
      const dayStr = d.toString().padStart(2, '0');
      days.push({
        dayNumber: d,
        dateStr: `${year}-${monthStr}-${dayStr}`,
        isCurrentMonth: true,
      });
    }

    return days;
  }, [year, month, firstDayOfMonth, daysInMonth]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/workspace')}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Back to Workspace"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-purple-600" />
              <span>Study Calendar & Exam Milestones</span>
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Sync scheduled revision blocks, spaced repetition targets, and final exam dates.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-slate-900 dark:text-white min-w-32 text-center">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsAddSessionModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Session</span>
          </button>
        </div>
      </div>

      {/* Calendar Matrix Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-2 text-center pb-3 border-b border-slate-100 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-2 pt-3">
          {calendarDays.map((item, idx) => {
            if (!item.isCurrentMonth) {
              return (
                <div key={idx} className="min-h-24 p-2 rounded-xl bg-slate-50/40 dark:bg-slate-950/20 border border-transparent" />
              );
            }

            const daySessions = sessions.filter(s => s.date === item.dateStr);
            const dayExams = examFleet.filter(e => e.exam_date === item.dateStr);
            const dayRevisions = revisions.filter(r => r.due_date === item.dateStr);
            const isToday = new Date().toISOString().split('T')[0] === item.dateStr;

            return (
              <div
                key={idx}
                className={`min-h-24 p-2 rounded-xl border transition-all flex flex-col justify-between ${
                  isToday 
                    ? 'bg-indigo-50/40 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-800' 
                    : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800/80 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isToday ? 'w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center' : 'text-slate-700 dark:text-slate-300'}`}>
                    {item.dayNumber}
                  </span>
                  {dayExams.length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  )}
                </div>

                {/* Day events stack */}
                <div className="space-y-1 mt-1">
                  {dayExams.map(ex => (
                    <div
                      key={ex.id}
                      className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 truncate"
                    >
                      🎓 {ex.subject_code} Exam
                    </div>
                  ))}

                  {daySessions.slice(0, 2).map(sess => (
                    <div
                      key={sess.id}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold truncate ${
                        sess.status === 'completed' 
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 line-through'
                          : 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                      }`}
                    >
                      {sess.startTime} {sess.subject_code}
                    </div>
                  ))}

                  {dayRevisions.slice(0, 1).map(rev => (
                    <div
                      key={rev.id}
                      className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 truncate"
                    >
                      ⚡ Rev: {rev.subject_code}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Schedule Modal */}
      {isAddSessionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-150">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-purple-600" />
              <span>Schedule Study Session</span>
            </h2>

            <form onSubmit={handleCreateSession} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                <select
                  value={newSubjectId}
                  onChange={e => setNewSubjectId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Topic or Goal</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solve Chomsky Normal Form conversion exercises"
                  value={newTopicTitle}
                  onChange={e => setNewTopicTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newStartTime}
                    onChange={e => setNewStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Duration (min)</label>
                  <input
                    type="number"
                    min={15}
                    step={15}
                    value={newDuration}
                    onChange={e => setNewDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddSessionModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Confirm Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
