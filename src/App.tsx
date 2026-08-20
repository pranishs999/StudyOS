/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StudyProvider, useStudy } from './context/StudyContext';
import { RouterProvider, useRouter } from './router/RouterContext';
import { TopNavigation } from './components/layout/TopNavigation';

// Core Views
import { DashboardView } from './components/dashboard/DashboardView';
import { WorkspaceOverview } from './components/workspace/WorkspaceOverview';
import { DocumentEditorView } from './components/workspace/DocumentEditorView';
import { TaskManagerView } from './components/workspace/TaskManagerView';
import { CalendarView } from './components/workspace/CalendarView';
import { NotesView } from './components/notes/NotesView';
import { PlannerView } from './components/planner/PlannerView';
import { SubjectsView } from './components/subjects/SubjectsView';
import { FocusModeView } from './components/focus/FocusModeView';
import { RevisionQueueView } from './components/revision/RevisionQueueView';
import { QuestionBankView } from './components/questions/QuestionBankView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { ExamModeView } from './components/exam/ExamModeView';

// Library Views
import { LibraryOverview } from './components/library/LibraryOverview';
import { LibraryFilesView } from './components/library/LibraryFilesView';
import { LibraryFoldersView } from './components/library/LibraryFoldersView';
import { LibraryTagsView } from './components/library/LibraryTagsView';

// Research Hub Views
import { ResearchOverview } from './components/research/ResearchOverview';
import { ResearchProjectsView } from './components/research/ResearchProjectsView';
import { ResearchPapersView } from './components/research/ResearchPapersView';
import { ResearchCitationsView } from './components/research/ResearchCitationsView';

// Knowledge Graph Views
import { KnowledgeOverview } from './components/knowledge/KnowledgeOverview';
import { KnowledgeGraphView } from './components/knowledge/KnowledgeGraphView';
import { KnowledgeConceptsView } from './components/knowledge/KnowledgeConceptsView';
import { KnowledgeInsightsView } from './components/knowledge/KnowledgeInsightsView';

// Global Modals
import { GlobalSearchModal } from './components/search/GlobalSearchModal';
import { SettingsModal } from './components/settings/SettingsModal';

const MainLayout: React.FC = () => {
  const { pathname, matchRoute } = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Dynamic route dispatcher
  const renderRouteView = () => {
    // 1. Dashboard Routes
    if (pathname === '/' || pathname === '/dashboard') {
      return <DashboardView />;
    }

    // 2. Workspace Routes
    if (pathname === '/workspace') {
      return <WorkspaceOverview />;
    }

    // Document routes (e.g., /workspace/documents or /workspace/documents/:documentId)
    const docMatch = matchRoute('/workspace/documents/:documentId');
    if (docMatch || pathname === '/workspace/documents' || pathname === '/library/documents') {
      return <DocumentEditorView documentIdParam={docMatch?.params.documentId} />;
    }

    if (pathname === '/workspace/tasks') {
      return <TaskManagerView />;
    }

    if (pathname === '/workspace/calendar') {
      return <CalendarView />;
    }

    if (pathname === '/workspace/notes') {
      return <NotesView />;
    }

    if (pathname === '/workspace/sessions' || pathname === '/workspace/planner') {
      return <PlannerView />;
    }

    if (pathname === '/workspace/focus') {
      return <FocusModeView />;
    }

    if (pathname === '/workspace/quizzes' || pathname === '/workspace/exams') {
      return <ExamModeView />;
    }

    if (pathname === '/workspace/questions') {
      return <QuestionBankView />;
    }

    if (pathname === '/workspace/syllabus' || pathname === '/workspace/matrix') {
      return <SubjectsView />;
    }

    if (pathname === '/workspace/flashcards' || pathname === '/workspace/revisions') {
      return <RevisionQueueView />;
    }

    if (pathname === '/workspace/analytics') {
      return <AnalyticsView />;
    }

    // 3. Library Routes
    if (pathname === '/library') {
      return <LibraryOverview />;
    }

    if (pathname === '/library/files') {
      return <LibraryFilesView />;
    }

    if (pathname === '/library/folders') {
      return <LibraryFoldersView />;
    }

    if (pathname === '/library/tags') {
      return <LibraryTagsView />;
    }

    // 4. Research Hub Routes
    if (pathname === '/research') {
      return <ResearchOverview />;
    }

    if (pathname === '/research/projects') {
      return <ResearchProjectsView />;
    }

    if (pathname === '/research/papers') {
      return <ResearchPapersView />;
    }

    if (pathname === '/research/references' || pathname === '/research/citations') {
      return <ResearchCitationsView />;
    }

    // 5. Knowledge Graph Routes
    if (pathname === '/knowledge') {
      return <KnowledgeOverview />;
    }

    if (pathname === '/knowledge/graph' || pathname === '/knowledge/relations') {
      return <KnowledgeGraphView />;
    }

    if (pathname === '/knowledge/concepts') {
      return <KnowledgeConceptsView />;
    }

    if (pathname === '/knowledge/insights') {
      return <KnowledgeInsightsView />;
    }

    // Settings fallback
    if (pathname === '/settings' || pathname === '/workspace/settings') {
      return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center max-w-lg mx-auto my-12 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2">Study OS Settings & Preferences</h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
            Manage your AI embeddings cache, database sync, audio feedback, and study schedule parameters.
          </p>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            Configure Settings
          </button>
        </div>
      );
    }

    // Default 404 / root fallback
    return <DashboardView />;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-150 selection:bg-indigo-500 selection:text-white">
      {/* Persistent Top Navigation Bar */}
      <TopNavigation 
        onOpenQuickSearch={() => setIsSearchOpen(true)} 
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderRouteView()}
      </main>

      {/* Global Modals */}
      <GlobalSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
};

export default function App() {
  return (
    <RouterProvider>
      <StudyProvider>
        <MainLayout />
      </StudyProvider>
    </RouterProvider>
  );
}

