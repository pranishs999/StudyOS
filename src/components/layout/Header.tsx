import React from 'react';
import { 
  Search, 
  Menu, 
  Flame, 
  Timer, 
  Pause, 
  Play, 
  Square, 
  Sparkles, 
  Bell, 
  Settings as SettingsIcon,
  BookPlus,
  Plus
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

interface HeaderProps {
  onOpenMobileMenu?: () => void;
  onOpenSearch: () => void;
  onOpenNewTopicModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenMobileMenu, 
  onOpenSearch,
  onOpenNewTopicModal 
}) => {
  const { 
    profile, 
    focusTimer, 
    pauseFocusTimer, 
    resumeFocusTimer, 
    stopFocusTimer, 
    setActiveView, 
    dueRevisionsCount,
    activeView
  } = useStudy();

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const remainingSeconds = Math.max(0, focusTimer.targetSeconds - focusTimer.elapsedSeconds);

  // Derive contextual greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return `Good morning, ${profile.name.split(' ')[0]}.`;
    if (hour < 18) return `Good afternoon, ${profile.name.split(' ')[0]}.`;
    return `Good evening, ${profile.name.split(' ')[0]}.`;
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 sm:px-8 flex items-center justify-between transition-colors shrink-0">
      {/* Left: Mobile Menu & Greeting */}
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            id="mobile-menu-btn"
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div>
          <h1 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white tracking-tight">
            {getGreeting()}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Center & Right: Search bar & Timer Pill */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="relative">
          <button
            id="global-search-trigger"
            onClick={onOpenSearch}
            className="flex items-center justify-between gap-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700/70 border-none rounded-full py-2 px-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400 w-44 sm:w-64 focus:ring-2 focus:ring-indigo-500 transition-all text-left"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">Search (Ctrl+K)</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-400">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Active Timer Pill if running */}
        {focusTimer.isActive && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold animate-pulse">
            <Timer className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span 
              onClick={() => setActiveView('focus-mode')}
              className="font-mono cursor-pointer hover:underline"
            >
              {formatTimer(remainingSeconds)}
            </span>
            {focusTimer.isPaused ? (
              <button onClick={resumeFocusTimer} className="p-0.5 hover:text-indigo-900 ml-0.5">
                <Play className="w-3 h-3 fill-current" />
              </button>
            ) : (
              <button onClick={pauseFocusTimer} className="p-0.5 hover:text-indigo-900 ml-0.5">
                <Pause className="w-3 h-3 fill-current" />
              </button>
            )}
            <button onClick={() => stopFocusTimer(true)} className="p-0.5 text-rose-500 hover:text-rose-700">
              <Square className="w-3 h-3 fill-current" />
            </button>
          </div>
        )}

        <button 
          onClick={onOpenSearch}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
          title="Command Palette"
        >
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        </button>
      </div>
    </header>
  );
};
