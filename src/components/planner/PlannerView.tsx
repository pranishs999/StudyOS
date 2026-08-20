import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  Timer, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Play, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Check
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { StudySession, Priority } from '../../types';

export const PlannerView: React.FC = () => {
  const { 
    sessions, 
    addSession, 
    updateSession, 
    deleteSession, 
    completeSession, 
    subjects, 
    topics, 
    startFocusTimer,
    setActiveView 
  } = useStudy();

  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // New session modal form state
  const [formSubjectId, setFormSubjectId] = useState<string>(subjects[0]?.id || '');
  const [formTopicId, setFormTopicId] = useState<string>('');
  const [formStartTime, setFormStartTime] = useState<string>('14:00');
  const [formDuration, setFormDuration] = useState<number>(50);
  const [formPriority, setFormPriority] = useState<Priority>('high');
  const [formNotes, setFormNotes] = useState<string>('');

  const currentSubjectTopics = topics.filter(t => t.subject_id === formSubjectId);

  const filteredSessions = sessions.filter(s => {
    const matchesDate = s.date === selectedDate;
    const matchesSubject = selectedSubjectFilter === 'all' || s.subject_id === selectedSubjectFilter;
    return matchesDate && matchesSubject;
  });

  const totalPlannedMinutes = filteredSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalCompletedMinutes = filteredSessions
    .filter(s => s.status === 'completed')
    .reduce((acc, s) => acc + (s.actualDurationMinutes || s.durationMinutes), 0);

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    const sub = subjects.find(s => s.id === formSubjectId);
    const top = topics.find(t => t.id === formTopicId);
    if (!sub) return;

    // Calculate end time with safe fallbacks
    const parts = (formStartTime || '14:00').split(':').map(Number);
    const startH = Number.isFinite(parts[0]) ? Math.max(0, Math.min(23, parts[0])) : 14;
    const startM = Number.isFinite(parts[1]) ? Math.max(0, Math.min(59, parts[1])) : 0;
    const safeDuration = Math.max(15, Math.min(360, Number(formDuration) || 50));
    const endTotalMins = startH * 60 + startM + safeDuration;
    const endH = Math.floor(endTotalMins / 60) % 24;
    const endM = endTotalMins % 60;
    const startTimeStr = `${startH.toString().padStart(2, '0')}:${startM.toString().padStart(2, '0')}`;
    const endTimeStr = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;

    addSession({
      subject_id: formSubjectId,
      topic_id: formTopicId || undefined,
      topic_title: top ? top.title : `${sub.name} Review Block`,
      subject_name: sub.name,
      subject_code: sub.code,
      subject_color: sub.color,
      date: selectedDate,
      startTime: startTimeStr,
      endTime: endTimeStr,
      durationMinutes: safeDuration,
      priority: formPriority,
      status: 'scheduled',
      notes: formNotes.trim() || 'Planned study block.',
    });

    setIsModalOpen(false);
    setFormNotes('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Date Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Study Planner & Timeblocks</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Organize high-retention focus blocks around syllabus priorities.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs shadow-indigo-200 dark:shadow-none transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Study Block</span>
          </button>
        </div>
      </div>

      {/* Filter and Metrics Strip */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        {/* Subject Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedSubjectFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedSubjectFilter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Courses
          </button>
          {subjects.map(sub => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubjectFilter(sub.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedSubjectFilter === sub.id
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {sub.code}
            </button>
          ))}
        </div>

        {/* Day's Time Budget */}
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <div>
            Planned: <span className="text-slate-900 dark:text-white font-mono font-bold">{(totalPlannedMinutes / 60).toFixed(1)}h</span>
          </div>
          <div>
            Completed: <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">{(totalCompletedMinutes / 60).toFixed(1)}h</span>
          </div>
        </div>
      </div>

      {/* Scheduled Time Blocks List */}
      <div className="space-y-3">
        {filteredSessions.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
            <CalendarIcon className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No study blocks planned for {selectedDate}</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Add dedicated 25m or 50m focus blocks to stay ahead of upcoming exam deadlines.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule First Block</span>
            </button>
          </div>
        ) : (
          filteredSessions
            .sort((a, b) => a.startTime.localeCompare(b.startTime))
            .map((session) => {
              const isCompleted = session.status === 'completed';
              const isInProgress = session.status === 'in_progress';

              return (
                <div
                  key={session.id}
                  className={`
                    p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4
                    ${isCompleted 
                      ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-80' 
                      : isInProgress 
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700 shadow-xs' 
                        : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-xs hover:border-slate-200'}
                  `}
                >
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <button
                      onClick={() => completeSession(session.id)}
                      className="mt-0.5 sm:mt-0 text-slate-400 hover:text-emerald-600 transition-colors"
                      title={isCompleted ? 'Completed' : 'Mark as complete'}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100 dark:fill-emerald-950" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono uppercase">
                          {session.subject_code}
                        </span>
                        <h4 className={`text-sm font-bold truncate ${isCompleted ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                          {session.topic_title}
                        </h4>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          session.priority === 'critical' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                          session.priority === 'high' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                          'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {session.priority.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5" />
                          {session.startTime} - {session.endTime} ({session.durationMinutes} mins)
                        </span>
                        <span>•</span>
                        <span className="truncate italic">{session.notes}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {!isCompleted && (
                      <button
                        onClick={() => {
                          startFocusTimer(session.subject_id, session.topic_id, session.durationMinutes);
                          setActiveView('focus-mode');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{isInProgress ? 'Resume Timer' : 'Start Focus'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => deleteSession(session.id)}
                      className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      title="Delete block"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
        )}
      </div>

      {/* Add Session Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Plan Study Block</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSession} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                <select
                  value={formSubjectId}
                  onChange={(e) => {
                    setFormSubjectId(e.target.value);
                    setFormTopicId('');
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Topic (Optional)</label>
                <select
                  value={formTopicId}
                  onChange={(e) => setFormTopicId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
                >
                  <option value="">General Course Review Block</option>
                  {currentSubjectTopics.map(t => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Duration</label>
                  <select
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                  >
                    <option value={25}>25 mins (1 Pomodoro)</option>
                    <option value={50}>50 mins (Deep Focus)</option>
                    <option value={75}>75 mins (Extended)</option>
                    <option value={100}>100 mins (Double Block)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                <div className="flex gap-2">
                  {(['medium', 'high', 'critical'] as Priority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormPriority(p)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${
                        formPriority === p 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Session Goal / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Solve 3 past-paper questions, memorize theorem..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs"
                >
                  Schedule Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
