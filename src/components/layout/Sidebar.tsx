import React from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  BookOpen, 
  Timer, 
  RefreshCw, 
  HelpCircle, 
  FileText, 
  FolderOpen, 
  BarChart3, 
  GraduationCap, 
  Settings, 
  Sparkles,
  Flame,
  CheckCircle2,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Plus
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { ActiveView } from '../../types';

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
  onOpenSettings?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen, onOpenSettings }) => {
  const { 
    activeView, 
    setActiveView, 
    dueRevisionsCount, 
    urgentTopicsCount, 
    unpracticedQuestionsCount,
    profile, 
    isDarkMode, 
    setIsDarkMode,
    updateProfile,
    todayStudyMinutes,
    startFocusTimer,
    subjects
  } = useStudy();

  const navItems: { id: ActiveView; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'study-planner', label: 'Planner', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'subjects', label: 'Subjects', icon: <BookOpen className="w-4 h-4" />, badge: urgentTopicsCount > 0 ? urgentTopicsCount : undefined, badgeColor: 'bg-amber-500 text-white' },
    { id: 'focus-mode', label: 'Focus Timer', icon: <Timer className="w-4 h-4" /> },
    { id: 'revision-queue', label: 'Revision Queue', icon: <RefreshCw className="w-4 h-4" />, badge: dueRevisionsCount > 0 ? dueRevisionsCount : undefined, badgeColor: 'bg-indigo-600 text-white' },
    { id: 'question-bank', label: 'Questions', icon: <HelpCircle className="w-4 h-4" />, badge: unpracticedQuestionsCount > 0 ? unpracticedQuestionsCount : undefined, badgeColor: 'bg-rose-500 text-white' },
    { id: 'notes', label: 'Smart Notes', icon: <FileText className="w-4 h-4" /> },
    { id: 'resources', label: 'Resources', icon: <FolderOpen className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'exam-mode', label: 'Exam Command', icon: <GraduationCap className="w-4 h-4" /> },
  ];

  const handleNavClick = (view: ActiveView) => {
    setActiveView(view);
    if (setMobileOpen) setMobileOpen(false);
  };

  const todayHours = (todayStudyMinutes / 60).toFixed(1);
  const goalHours = (profile.dailyGoalMinutes / 60).toFixed(1);
  const progressPercent = Math.min(100, Math.round((todayStudyMinutes / profile.dailyGoalMinutes) * 100));

  return (
    <aside 
      id="app-sidebar"
      className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 
        flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      {/* Top Header & Brand */}
      <div>
        <div className="p-6 flex items-center gap-3">
          <div 
            onClick={() => handleNavClick('dashboard')}
            className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-base shadow-sm shadow-indigo-200 dark:shadow-none cursor-pointer"
          >
            S
          </div>
          <span 
            onClick={() => handleNavClick('dashboard')}
            className="text-xl font-bold tracking-tight text-slate-800 dark:text-white cursor-pointer"
          >
            StudyOS
          </span>
        </div>

        {/* Navigation */}
        <nav className="px-4 space-y-1 mt-1">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`
                  w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left
                  ${isActive 
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-xs border-2 flex items-center justify-center ${isActive ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-600 dark:bg-indigo-400' : 'border-slate-400 dark:border-slate-500'}`}>
                    {isActive && <div className="w-1.5 h-1.5 bg-white rounded-xs" />}
                  </div>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${item.badgeColor || 'bg-indigo-600 text-white'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Daily Progress & User Profile */}
      <div className="mt-auto">
        {/* Goal Progress Card */}
        <div className="p-3 mx-4 mb-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-medium text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider">Today's Goal</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
              {progressPercent}%
            </span>
          </div>
          <div className="w-full bg-slate-200/80 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1">
            <div 
              className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            <div className="flex items-center gap-1 font-semibold text-orange-500">
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
              <span>{profile.streakDays}d 🔥</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {todayHours}h / {goalHours}h
            </span>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div 
            onClick={() => {
              if (onOpenSettings) onOpenSettings();
              else handleNavClick('settings');
            }}
            className="flex items-center gap-3 cursor-pointer group flex-1 min-w-0"
          >
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800 shadow-sm flex items-center justify-center font-bold text-slate-600 dark:text-slate-200 overflow-hidden">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                profile.name.charAt(0)
              )}
            </div>
            <div className="truncate">
              <p className="text-sm font-semibold text-slate-800 dark:text-white truncate group-hover:text-indigo-600 transition-colors">
                {profile.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {profile.major || 'Pro Plan'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              id="toggle-theme-btn"
              onClick={() => setIsDarkMode(prev => !prev)}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              id="toggle-sound-btn"
              onClick={() => updateProfile({ soundEnabled: !profile.soundEnabled })}
              title={profile.soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {profile.soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-500" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
