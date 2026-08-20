import React, { useState } from 'react';
import { 
  Settings, 
  RotateCcw, 
  Check, 
  Moon, 
  Sun,
  X,
  Database,
  RefreshCw,
  Cpu,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { 
    profile, 
    updateProfile, 
    isDarkMode, 
    setIsDarkMode, 
    resetToDefaultData,
    vectorStatus,
    isIndexingVectors,
    reindexAllVectors
  } = useStudy();

  const [name, setName] = useState<string>(profile.name || '');
  const [major, setMajor] = useState<string>(profile.major || '');
  const [semester, setSemester] = useState<string>(profile.semester || '');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<number>(profile.dailyGoalMinutes || 300);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [reindexSuccess, setReindexSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedMinutes = Math.max(15, Math.min(1440, Number(dailyGoalMinutes) || 300));
    updateProfile({
      name: name.trim() || profile.name,
      major: major.trim(),
      semester: semester.trim(),
      dailyGoalMinutes: sanitizedMinutes,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleTriggerReindex = async () => {
    await reindexAllVectors();
    setReindexSuccess(true);
    setTimeout(() => setReindexSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">StudyOS Preferences</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Profile Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Student Profile</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Program / Major</label>
                <input
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Current Semester</label>
                <input
                  type="text"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Daily Study Target (Minutes)</label>
                <input
                  type="number"
                  step="15"
                  value={dailyGoalMinutes}
                  onChange={(e) => setDailyGoalMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Vector Database & Semantic Intelligence Health */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-indigo-500" />
                <span>Vector Database & Semantic Intelligence</span>
              </h4>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Operational
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-2.5">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 font-semibold">Vectors Indexed</div>
                  <div className="text-sm font-bold font-mono text-indigo-600 dark:text-indigo-400">
                    {vectorStatus?.totalVectors ?? 0}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 font-semibold">Documents</div>
                  <div className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200">
                    {vectorStatus?.totalDocuments ?? 0}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 font-semibold">Dimension</div>
                  <div className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200">
                    {vectorStatus?.activeDimension ? `${vectorStatus.activeDimension}D` : '768D'}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                <span>Model: <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">{vectorStatus?.activeModel || 'gemini-embedding-2-preview'}</span></span>
                <button
                  type="button"
                  onClick={handleTriggerReindex}
                  disabled={isIndexingVectors}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-semibold text-[11px] transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${isIndexingVectors ? 'animate-spin' : ''}`} />
                  <span>{isIndexingVectors ? 'Indexing...' : reindexSuccess ? 'Re-indexed!' : 'Re-index Vectors'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Theme & Display Options */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Appearance</h4>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Theme Mode</span>
              <button
                type="button"
                onClick={() => setIsDarkMode(prev => !prev)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold cursor-pointer"
              >
                {isDarkMode ? <Moon className="w-3.5 h-3.5 text-indigo-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                <span>{isDarkMode ? 'Dark Slate' : 'Light Mode'}</span>
              </button>
            </div>
          </div>

          {/* Reset Zone */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset all topics, timetable, and study data to default exam dataset?')) {
                  resetToDefaultData();
                  onClose();
                }
              }}
              className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Sample Data</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                {isSaved ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{isSaved ? 'Saved!' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
