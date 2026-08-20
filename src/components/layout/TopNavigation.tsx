import React, { useState, useRef, useEffect } from 'react';
import { 
  GraduationCap, 
  Search, 
  ChevronDown, 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  CheckSquare, 
  Calendar, 
  BookOpen, 
  Folder, 
  Tags, 
  Microscope, 
  BookMarked, 
  Quote, 
  GitFork, 
  Network, 
  Sparkles, 
  Settings as SettingsIcon, 
  User, 
  Database, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X, 
  Timer, 
  Pause, 
  Play, 
  Square,
  HardDrive,
  Cpu
} from 'lucide-react';
import { useRouter, Link } from '../../router/RouterContext';
import { useStudy } from '../../context/StudyContext';

interface TopNavigationProps {
  onOpenQuickSearch: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({ onOpenQuickSearch }) => {
  const { pathname, navigate } = useRouter();
  const { 
    profile, 
    logout, 
    focusTimer, 
    pauseFocusTimer, 
    resumeFocusTimer, 
    stopFocusTimer, 
    vectorStatus, 
    isIndexingVectors 
  } = useStudy();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setActiveDropdown(null);
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(prev => prev === name ? null : name);
  };

  const isRouteActive = (basePath: string) => {
    if (basePath === '/dashboard') return pathname === '/dashboard' || pathname === '/';
    return pathname.startsWith(basePath);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  const remainingSeconds = Math.max(0, focusTimer.targetSeconds - focusTimer.elapsedSeconds);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 transition-colors shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* LEFT: Logo & App Title */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Mobile Hamburger Toggle */}
            <button
              id="mobile-nav-toggle"
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link 
              to="/dashboard" 
              className="flex items-center gap-2.5 group focus:outline-none"
              title="Study OS Dashboard"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-none group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Study OS
                </span>
                <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 tracking-wider uppercase leading-none mt-0.5">
                  Academic Intelligence
                </span>
              </div>
            </Link>
          </div>

          {/* CENTER: Desktop Primary Navigation */}
          <nav 
            ref={dropdownRef} 
            className="hidden lg:flex items-center gap-1 xl:gap-1.5"
            aria-label="Primary Application Navigation"
          >
            {/* 1. Dashboard */}
            <Link
              to="/dashboard"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isRouteActive('/dashboard')
                  ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>

            {/* 2. Workspace (with Dropdown) */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('workspace')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isRouteActive('/workspace')
                    ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Workspace</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'workspace' ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} />
              </button>

              {activeDropdown === 'workspace' && (
                <div className="absolute left-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Workspace</div>
                  <Link to="/workspace" className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    <span>Overview</span>
                  </Link>
                  <Link to="/workspace/documents" className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span>Documents & Markdown</span>
                  </Link>
                  <Link to="/workspace/notes" className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                    <span>Academic Notes</span>
                  </Link>
                  <Link to="/workspace/tasks" className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600">
                    <CheckSquare className="w-4 h-4 text-slate-400" />
                    <span>Task Manager</span>
                  </Link>
                  <Link to="/workspace/calendar" className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Study Calendar & Exams</span>
                  </Link>
                </div>
              )}
            </div>

            {/* 3. Library (with Dropdown) */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('library')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isRouteActive('/library')
                    ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Library</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'library' ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} />
              </button>

              {activeDropdown === 'library' && (
                <div className="absolute left-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Library</div>
                  <Link to="/library" className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                    <span>Resource Overview</span>
                  </Link>
                  <Link to="/library/documents" className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span>All Library Documents</span>
                  </Link>
                  <Link to="/library/files" className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600">
                    <HardDrive className="w-4 h-4 text-slate-400" />
                    <span>Files & Attachments</span>
                  </Link>
                  <Link to="/library/folders" className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600">
                    <Folder className="w-4 h-4 text-slate-400" />
                    <span>Folders Organization</span>
                  </Link>
                  <Link to="/library/tags" className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600">
                    <Tags className="w-4 h-4 text-slate-400" />
                    <span>Tag Taxonomy</span>
                  </Link>
                </div>
              )}
            </div>

            {/* 4. Research (with Dropdown) */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('research')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isRouteActive('/research')
                    ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Microscope className="w-3.5 h-3.5" />
                <span>Research</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'research' ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} />
              </button>

              {activeDropdown === 'research' && (
                <div className="absolute left-0 mt-2 w-54 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Research Hub</div>
                  <Link to="/research" className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600">
                    <Microscope className="w-4 h-4 text-slate-400" />
                    <span>Research Overview</span>
                  </Link>
                  <Link to="/research/projects" className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600">
                    <GitFork className="w-4 h-4 text-slate-400" />
                    <span>Projects & Workspaces</span>
                  </Link>
                  <Link to="/research/papers" className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600">
                    <BookMarked className="w-4 h-4 text-slate-400" />
                    <span>Academic Papers</span>
                  </Link>
                  <Link to="/research/references" className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600">
                    <Quote className="w-4 h-4 text-slate-400" />
                    <span>BibTeX References</span>
                  </Link>
                  <Link to="/research/citations" className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600">
                    <Sparkles className="w-4 h-4 text-slate-400" />
                    <span>Citations Matrix</span>
                  </Link>
                </div>
              )}
            </div>

            {/* 5. Knowledge (with Dropdown) */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('knowledge')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isRouteActive('/knowledge')
                    ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Network className="w-3.5 h-3.5" />
                <span>Knowledge</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'knowledge' ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} />
              </button>

              {activeDropdown === 'knowledge' && (
                <div className="absolute left-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Knowledge Graph</div>
                  <Link to="/knowledge" className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600">
                    <Network className="w-4 h-4 text-slate-400" />
                    <span>Knowledge Overview</span>
                  </Link>
                  <Link to="/knowledge/graph" className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600">
                    <Sparkles className="w-4 h-4 text-slate-400" />
                    <span>Interactive Concept Graph</span>
                  </Link>
                  <Link to="/knowledge/concepts" className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                    <span>Concepts & Entities</span>
                  </Link>
                  <Link to="/knowledge/relationships" className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600">
                    <GitFork className="w-4 h-4 text-slate-400" />
                    <span>Persisted Relationships</span>
                  </Link>
                </div>
              )}
            </div>

            {/* 6. Search */}
            <Link
              to="/search"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isRouteActive('/search')
                  ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </Link>
          </nav>

          {/* RIGHT: Quick Search, Vector Pill, Timer, User Avatar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Global Quick Search Button */}
            <button
              id="global-search-pill"
              onClick={onOpenQuickSearch}
              className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700/70 rounded-full py-1.5 px-3 text-xs text-slate-500 dark:text-slate-400 focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
              title="Open Global Search Palette (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden md:inline">Quick Search</span>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Active Focus Timer Pill */}
            {focusTimer.isActive && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold animate-pulse">
                <Timer className="w-3.5 h-3.5 text-indigo-600" />
                <span className="font-mono text-[11px]">{formatTimer(remainingSeconds)}</span>
                {focusTimer.isPaused ? (
                  <button onClick={resumeFocusTimer} className="p-0.5 hover:text-indigo-900 ml-0.5 cursor-pointer">
                    <Play className="w-2.5 h-2.5 fill-current" />
                  </button>
                ) : (
                  <button onClick={pauseFocusTimer} className="p-0.5 hover:text-indigo-900 ml-0.5 cursor-pointer">
                    <Pause className="w-2.5 h-2.5 fill-current" />
                  </button>
                )}
                <button onClick={() => stopFocusTimer(true)} className="p-0.5 text-rose-500 hover:text-rose-700 cursor-pointer">
                  <Square className="w-2.5 h-2.5 fill-current" />
                </button>
              </div>
            )}

            {/* Vector DB Status Pill */}
            <div 
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 font-mono"
              title={`Vector DB: ${vectorStatus?.totalVectors ?? 0} vectors across ${vectorStatus?.totalDocuments ?? 0} docs`}
            >
              <Cpu className={`w-3 h-3 text-indigo-600 dark:text-indigo-400 ${isIndexingVectors ? 'animate-spin' : ''}`} />
              <span className="text-[10px] font-semibold">{vectorStatus?.totalVectors ?? 0} vectors</span>
            </div>

            {/* User Account Menu Dropdown */}
            <div ref={userMenuRef} className="relative">
              <button
                id="user-account-trigger"
                onClick={() => setIsUserMenuOpen(prev => !prev)}
                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-indigo-500/30 transition-all cursor-pointer focus:outline-none"
                aria-label="User account menu"
              >
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs">
                    {profile.name ? profile.name.charAt(0).toUpperCase() : 'S'}
                  </div>
                )}
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  {/* Profile Header */}
                  <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{profile.name}</p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 truncate font-mono">{profile.email}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[10px] font-semibold">
                        {profile.major || 'Computer Science'}
                      </span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <Link to="/settings/profile" className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Student Profile</span>
                    </Link>
                    <Link to="/settings/preferences" className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                      <SettingsIcon className="w-3.5 h-3.5 text-slate-400" />
                      <span>App Preferences & Theme</span>
                    </Link>
                    <Link to="/settings/data" className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                      <Database className="w-3.5 h-3.5 text-slate-400" />
                      <span>Data, Export & Vector Store</span>
                    </Link>
                    <Link to="/settings/security" className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span>Security & Sessions</span>
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        logout();
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE NAVIGATION DRAWER */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-2 duration-150">
          <div className="space-y-1">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Main Sections</div>
            
            <Link to="/dashboard" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
              <LayoutDashboard className="w-4 h-4 text-indigo-600" />
              <span>Dashboard</span>
            </Link>

            <Link to="/workspace" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>Workspace Overview</span>
            </Link>

            <div className="pl-6 space-y-1">
              <Link to="/workspace/documents" className="block py-1 text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-600">
                • Documents & Markdown
              </Link>
              <Link to="/workspace/notes" className="block py-1 text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-600">
                • Smart Notes
              </Link>
              <Link to="/workspace/tasks" className="block py-1 text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-600">
                • Tasks
              </Link>
              <Link to="/workspace/calendar" className="block py-1 text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-600">
                • Study Calendar
              </Link>
            </div>

            <Link to="/library" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Library</span>
            </Link>

            <Link to="/research" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
              <Microscope className="w-4 h-4 text-indigo-600" />
              <span>Research Hub</span>
            </Link>

            <Link to="/knowledge" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
              <Network className="w-4 h-4 text-indigo-600" />
              <span>Knowledge Graph</span>
            </Link>

            <Link to="/search" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
              <Search className="w-4 h-4 text-indigo-600" />
              <span>Search Engine</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Settings & Account</div>
            <Link to="/settings/profile" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
              <User className="w-4 h-4 text-slate-400" />
              <span>Student Profile</span>
            </Link>
            <Link to="/settings/preferences" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
              <SettingsIcon className="w-4 h-4 text-slate-400" />
              <span>Preferences</span>
            </Link>
            <Link to="/settings/data" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
              <Database className="w-4 h-4 text-slate-400" />
              <span>Vector Database & Data</span>
            </Link>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
