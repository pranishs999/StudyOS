import React, { useState, useEffect } from 'react';
import { 
  Timer, 
  Play, 
  Pause, 
  Square, 
  Coffee, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw,
  BookOpen,
  Edit3,
  Flame,
  Music
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

export const FocusModeView: React.FC = () => {
  const { 
    focusTimer, 
    startFocusTimer, 
    pauseFocusTimer, 
    resumeFocusTimer, 
    stopFocusTimer, 
    toggleBreakMode, 
    setTimerDuration, 
    subjects, 
    topics, 
    profile, 
    triggerConfetti,
    playSound
  } = useStudy();

  const [selectedSubId, setSelectedSubId] = useState<string>(focusTimer.subjectId || subjects[0]?.id || '');
  const [selectedTopId, setSelectedTopId] = useState<string>(focusTimer.topicId || '');
  const [sessionNotes, setSessionNotes] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [ambientSound, setAmbientSound] = useState<'none' | 'whitenoise' | 'rain' | 'binaural'>('none');

  const currentSubject = subjects.find(s => s.id === selectedSubId) || subjects[0];
  const currentTopic = topics.find(t => t.id === selectedTopId);
  const subjectTopics = topics.filter(t => t.subject_id === selectedSubId);

  const remainingSeconds = Math.max(0, focusTimer.targetSeconds - focusTimer.elapsedSeconds);
  const progressPercent = focusTimer.targetSeconds > 0 
    ? Math.min(100, (focusTimer.elapsedSeconds / focusTimer.targetSeconds) * 100) 
    : 0;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const handleStart = () => {
    if (!focusTimer.isActive) {
      startFocusTimer(selectedSubId, selectedTopId || undefined, focusTimer.targetSeconds / 60 || 25);
    } else if (focusTimer.isPaused) {
      resumeFocusTimer();
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Ambient sound synthesizer loop
  useEffect(() => {
    let audioCtx: AudioContext | null = null;

    if (ambientSound !== 'none' && focusTimer.isActive && !focusTimer.isPaused) {
      try {
        audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        if (ambientSound === 'binaural') {
          // 200Hz + 210Hz (10Hz Alpha wave)
          const osc1 = audioCtx.createOscillator();
          const osc2 = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
          osc1.frequency.setValueAtTime(200, audioCtx.currentTime);
          osc2.frequency.setValueAtTime(210, audioCtx.currentTime);
          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(audioCtx.destination);
          osc1.start();
          osc2.start();
        } else {
          // White noise buffer
          const bufferSize = audioCtx.sampleRate * 2;
          const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
          }
          const whiteNoise = audioCtx.createBufferSource();
          whiteNoise.buffer = buffer;
          whiteNoise.loop = true;
          const gain = audioCtx.createGain();
          gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
          whiteNoise.connect(gain);
          gain.connect(audioCtx.destination);
          whiteNoise.start();
        }
      } catch {
        // audio restriction fallback
      }
    }

    return () => {
      if (audioCtx) {
        audioCtx.close().catch(() => {});
      }
    };
  }, [ambientSound, focusTimer.isActive, focusTimer.isPaused]);

  return (
    <div className={`space-y-6 pb-12 ${isFullscreen ? 'fixed inset-0 z-50 bg-[#f8fafc] dark:bg-[#0f172a] p-8 overflow-y-auto' : ''}`}>
      {/* Top Controls Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Deep Focus Studio</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Distraction-free environment with ambient audio and active recall prompts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Ambient Sound Selector */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-lg text-xs shadow-xs">
            <Music className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            <button
              onClick={() => setAmbientSound('none')}
              className={`px-2.5 py-1 rounded font-medium text-[11px] ${ambientSound === 'none' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold' : 'text-slate-500'}`}
            >
              Mute
            </button>
            <button
              onClick={() => setAmbientSound('binaural')}
              className={`px-2.5 py-1 rounded font-medium text-[11px] ${ambientSound === 'binaural' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-500'}`}
            >
              Alpha Wave
            </button>
            <button
              onClick={() => setAmbientSound('whitenoise')}
              className={`px-2.5 py-1 rounded font-medium text-[11px] ${ambientSound === 'whitenoise' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-500'}`}
            >
              Rain / Noise
            </button>
          </div>

          <button
            onClick={handleToggleFullscreen}
            className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Toggle Distraction-free Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: The Timer Core */}
        <div className="lg:col-span-2 p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col items-center justify-center space-y-6 text-center">
          {/* Mode Switcher Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
            <button
              onClick={() => {
                if (!focusTimer.isActive) setTimerDuration(25);
              }}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                !focusTimer.isBreak && focusTimer.targetSeconds === 25 * 60 
                  ? 'bg-indigo-600 text-white shadow-2xs font-bold' 
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              25m Focus
            </button>
            <button
              onClick={() => {
                if (!focusTimer.isActive) setTimerDuration(50);
              }}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                !focusTimer.isBreak && focusTimer.targetSeconds === 50 * 60 
                  ? 'bg-indigo-600 text-white shadow-2xs font-bold' 
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              50m Focus
            </button>
            <button
              onClick={toggleBreakMode}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                focusTimer.isBreak 
                  ? 'bg-emerald-600 text-white shadow-2xs font-bold' 
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>{focusTimer.isBreak ? 'Break Mode' : 'Take Break'}</span>
            </button>
          </div>

          {/* Large Circular Visual Progress Clock */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center my-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background Ring */}
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth="6"
                fill="transparent"
              />
              {/* Progress Ring */}
              <circle
                cx="50"
                cy="50"
                r="44"
                stroke={focusTimer.isBreak ? '#10b981' : '#4f46e5'}
                strokeWidth="6"
                strokeDasharray="276.46"
                strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-500"
              />
            </svg>

            {/* Inner Digits and Subject */}
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
              <span className="font-mono text-5xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tighter">
                {timeFormatted}
              </span>
              <div className="flex items-center gap-1.5">
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: focusTimer.isBreak ? '#10b981' : '#4f46e5' }} 
                />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  {focusTimer.isBreak ? 'REST & RECHARGE' : currentSubject?.name || 'Study Focus'}
                </span>
              </div>
              {currentTopic && !focusTimer.isBreak && (
                <span className="text-[11px] text-slate-400 dark:text-slate-500 max-w-[200px] truncate">
                  {currentTopic.title}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            {!focusTimer.isActive || focusTimer.isPaused ? (
              <button
                id="focus-play-btn"
                onClick={handleStart}
                className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-indigo-500/25 flex items-center gap-2 transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{focusTimer.isPaused ? 'Resume Focus' : 'Start Focus Block'}</span>
              </button>
            ) : (
              <button
                id="focus-pause-btn"
                onClick={pauseFocusTimer}
                className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-sm shadow-md shadow-amber-500/25 flex items-center gap-2 transition-all"
              >
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </button>
            )}

            {focusTimer.isActive && (
              <button
                id="focus-stop-btn"
                onClick={() => stopFocusTimer(true)}
                className="px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-300 font-bold text-sm flex items-center gap-2 transition-colors"
                title="Finish & Save Session"
              >
                <Square className="w-4 h-4 fill-current text-rose-500" />
                <span>Log Complete</span>
              </button>
            )}
          </div>
        </div>

        {/* Right 1 Col: Topic Target & Live Scratchpad */}
        <div className="space-y-4">
          {/* Target Subject & Topic Picker */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Target Focus Topic
              </h3>
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Subject</label>
                <select
                  value={selectedSubId}
                  onChange={(e) => {
                    setSelectedSubId(e.target.value);
                    setSelectedTopId('');
                  }}
                  disabled={focusTimer.isActive}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Topic</label>
                <select
                  value={selectedTopId}
                  onChange={(e) => setSelectedTopId(e.target.value)}
                  disabled={focusTimer.isActive}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
                >
                  <option value="">General Syllabus Block</option>
                  {subjectTopics.map(t => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Formula / Recall reminder */}
            {currentTopic?.keyFormula && (
              <div className="mt-3 p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 space-y-1">
                <span className="text-[9px] uppercase font-bold tracking-wider text-indigo-700 dark:text-indigo-300 font-mono">
                  Active Recall Prompt
                </span>
                <p className="font-mono font-bold text-xs text-indigo-900 dark:text-indigo-200">
                  {currentTopic.keyFormula}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">
                  {currentTopic.keyFormulaExplanation}
                </p>
              </div>
            )}
          </div>

          {/* Quick Scratchpad / Session Notes */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Session Scratchpad
                </h3>
              </div>
              <span className="text-[10px] text-slate-400">Jot insights</span>
            </div>

            <textarea
              placeholder="Write quick formulas, questions solved, or insights while studying..."
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              rows={4}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
