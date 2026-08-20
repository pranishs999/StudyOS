import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  UserProfile, 
  Subject, 
  Unit, 
  Topic, 
  StudySession, 
  RevisionItem, 
  Question, 
  Note, 
  Resource, 
  ExamFleetItem,
  ActiveView,
  TopicStatus,
  Priority,
  TaskItem,
  WorkspaceDocument,
  LibraryFolder,
  ResearchProject,
  ResearchPaper,
  CitationItem,
  KnowledgeConcept,
  KnowledgeRelationship
} from '../types';
import {
  initialProfile,
  initialSubjects,
  initialUnits,
  initialTopics,
  initialSessions,
  initialRevisions,
  initialQuestions,
  initialNotes,
  initialResources,
  initialExamFleet,
  initialTasks,
  initialDocuments,
  initialFolders,
  initialResearchProjects,
  initialResearchPapers,
  initialCitations,
  initialConcepts,
  initialRelationships
} from '../data/mockData';
import { 
  indexItems, 
  deleteDocumentVector, 
  getVectorStatus, 
  VectorIndexStatusResponse,
  IndexItemPayload
} from '../services/vectorClient';

interface FocusTimerState {
  isActive: boolean;
  isPaused: boolean;
  isBreak: boolean;
  elapsedSeconds: number;
  targetSeconds: number;
  subjectId: string | null;
  topicId: string | null;
  topicTitle: string;
  subjectName: string;
  subjectColor: string;
  mode: 'pomodoro' | 'stopwatch';
  sessionStartTime?: string;
}

export interface StudyContextType {
  // Navigation & View
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  selectedSubjectId: string | null;
  setSelectedSubjectId: (id: string | null) => void;
  selectedTopicId: string | null;
  setSelectedTopicId: (id: string | null) => void;
  selectedQuestionId: string | null;
  setSelectedQuestionId: (id: string | null) => void;
  selectedNoteId: string | null;
  setSelectedNoteId: (id: string | null) => void;
  selectedDocumentId: string | null;
  setSelectedDocumentId: (id: string | null) => void;
  selectedPaperId: string | null;
  setSelectedPaperId: (id: string | null) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedConceptId: string | null;
  setSelectedConceptId: (id: string | null) => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (q: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;

  // Auth & Profile
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  login: (email: string, name?: string) => Promise<boolean>;
  register: (email: string, name: string, major?: string) => Promise<boolean>;
  logout: () => void;

  // Academic Core
  subjects: Subject[];
  addSubject: (subject: Omit<Subject, 'id'>) => Subject;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;

  units: Unit[];
  addUnit: (unit: Omit<Unit, 'id'>) => Unit;
  updateUnit: (id: string, updates: Partial<Unit>) => void;
  deleteUnit: (id: string) => void;

  topics: Topic[];
  addTopic: (topic: Omit<Topic, 'id'>) => Topic;
  updateTopic: (id: string, updates: Partial<Topic>) => void;
  deleteTopic: (id: string) => void;
  quickUpdateTopicStatus: (id: string, status: TopicStatus) => void;
  updateTopicConfidence: (id: string, confidence: number) => void;

  sessions: StudySession[];
  addSession: (session: Omit<StudySession, 'id'>) => StudySession;
  updateSession: (id: string, updates: Partial<StudySession>) => void;
  deleteSession: (id: string) => void;
  completeSession: (id: string, durationMinutes?: number) => void;

  revisions: RevisionItem[];
  completeRevision: (id: string, confidence?: number) => void;
  postponeRevision: (id: string, days?: number) => void;
  addRevisionItem: (item: Omit<RevisionItem, 'id'>) => RevisionItem;

  questions: Question[];
  addQuestion: (q: Omit<Question, 'id'>) => Question;
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  recordQuestionAttempt: (id: string, confidence: number) => void;

  notes: Note[];
  addNote: (note: Omit<Note, 'id'>) => Note;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  toggleNoteFavorite: (id: string) => void;

  resources: Resource[];
  addResource: (res: Omit<Resource, 'id'>) => Resource;
  deleteResource: (id: string) => void;
  toggleResourceFavorite: (id: string) => void;

  examFleet: ExamFleetItem[];
  updateExamFleetItem: (id: string, updates: Partial<ExamFleetItem>) => void;

  // Workspace
  tasks: TaskItem[];
  addTask: (task: Omit<TaskItem, 'id' | 'created_at'>) => TaskItem;
  updateTask: (id: string, updates: Partial<TaskItem>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompleted: (id: string) => void;

  documents: WorkspaceDocument[];
  addDocument: (doc: Omit<WorkspaceDocument, 'id' | 'created_at' | 'updated_at' | 'version'>) => WorkspaceDocument;
  updateDocument: (id: string, updates: Partial<WorkspaceDocument>) => void;
  deleteDocument: (id: string) => void;
  duplicateDocument: (id: string) => WorkspaceDocument | null;

  // Library
  folders: LibraryFolder[];
  addFolder: (folder: Omit<LibraryFolder, 'id' | 'updated_at' | 'itemCount'>) => LibraryFolder;
  deleteFolder: (id: string) => void;

  // Research
  researchProjects: ResearchProject[];
  addResearchProject: (proj: Omit<ResearchProject, 'id' | 'updated_at'>) => ResearchProject;
  updateResearchProject: (id: string, updates: Partial<ResearchProject>) => void;
  deleteResearchProject: (id: string) => void;

  researchPapers: ResearchPaper[];
  addResearchPaper: (paper: Omit<ResearchPaper, 'id' | 'added_at'>) => ResearchPaper;
  updateResearchPaper: (id: string, updates: Partial<ResearchPaper>) => void;
  deleteResearchPaper: (id: string) => void;
  togglePaperRead: (id: string) => void;

  citations: CitationItem[];
  addCitation: (cite: Omit<CitationItem, 'id'>) => CitationItem;
  deleteCitation: (id: string) => void;

  // Knowledge
  concepts: KnowledgeConcept[];
  addConcept: (cpt: Omit<KnowledgeConcept, 'id'>) => KnowledgeConcept;
  updateConcept: (id: string, updates: Partial<KnowledgeConcept>) => void;
  deleteConcept: (id: string) => void;

  relationships: KnowledgeRelationship[];
  conceptRelations: KnowledgeRelationship[];
  addRelationship: (rel: Omit<KnowledgeRelationship, 'id'>) => KnowledgeRelationship;
  deleteRelationship: (id: string) => void;

  // Focus Timer
  focusTimer: FocusTimerState;
  startFocusTimer: (subjectId: string, topicId?: string, durationMinutes?: number) => void;
  pauseFocusTimer: () => void;
  resumeFocusTimer: () => void;
  stopFocusTimer: (completed?: boolean) => void;
  toggleBreakMode: () => void;
  setTimerDuration: (minutes: number) => void;

  // Metrics
  todayStudyMinutes: number;
  syllabusCompletionPercentage: number;
  totalTopicsCount: number;
  completedTopicsCount: number;
  urgentTopicsCount: number;
  dueRevisionsCount: number;
  unpracticedQuestionsCount: number;
  overallReadiness: number;
  
  // AI Recommendations
  recommendedAction: {
    title: string;
    subject: string;
    type: 'critical_topic' | 'overdue_revision' | 'exam_prep' | 'low_confidence';
    reason: string;
    actionLabel: string;
    targetView: ActiveView;
    subjectId?: string;
    topicId?: string;
  };

  // Vector Engine
  vectorStatus: VectorIndexStatusResponse | null;
  isIndexingVectors: boolean;
  reindexAllVectors: () => Promise<void>;

  // Utilities
  triggerConfetti: () => void;
  playSound: (type: 'beep' | 'finish' | 'success' | 'click') => void;
  resetToDefaultData: () => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('study_os_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('study_os_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('study_os_theme', 'light');
    }
  }, [isDarkMode]);

  // Auth Profile
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('study_os_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...initialProfile, ...parsed, isAuthenticated: parsed.isAuthenticated ?? true };
      }
    } catch {}
    return { ...initialProfile, isAuthenticated: true };
  });

  useEffect(() => {
    localStorage.setItem('study_os_profile', JSON.stringify(profile));
  }, [profile]);

  // Navigation Selection States
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>('sub_toc');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // Primary Collections
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const saved = localStorage.getItem('study_os_subjects');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialSubjects;
  });

  const [units, setUnits] = useState<Unit[]>(() => {
    try {
      const saved = localStorage.getItem('study_os_units');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialUnits;
  });

  const [topics, setTopics] = useState<Topic[]>(() => {
    try {
      const saved = localStorage.getItem('study_os_topics');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialTopics;
  });

  const [sessions, setSessions] = useState<StudySession[]>(() => {
    try {
      const saved = localStorage.getItem('study_os_sessions');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialSessions;
  });

  const [revisions, setRevisions] = useState<RevisionItem[]>(() => {
    try {
      const saved = localStorage.getItem('study_os_revisions');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialRevisions;
  });

  const [questions, setQuestions] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem('study_os_questions');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialQuestions;
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const saved = localStorage.getItem('study_os_notes');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialNotes;
  });

  const [resources, setResources] = useState<Resource[]>(() => {
    try {
      const saved = localStorage.getItem('study_os_resources');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialResources;
  });

  const [examFleet, setExamFleet] = useState<ExamFleetItem[]>(() => {
    try {
      const saved = localStorage.getItem('study_os_exam_fleet');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialExamFleet;
  });

  // Workspace Entities
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    try {
      const saved = localStorage.getItem('study_os_tasks');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialTasks;
  });

  const [documents, setDocuments] = useState<WorkspaceDocument[]>(() => {
    try {
      const saved = localStorage.getItem('study_os_documents');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialDocuments;
  });

  const [folders, setFolders] = useState<LibraryFolder[]>(() => {
    try {
      const saved = localStorage.getItem('study_os_folders');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialFolders;
  });

  // Research Entities
  const [researchProjects, setResearchProjects] = useState<ResearchProject[]>(() => {
    try {
      const saved = localStorage.getItem('study_os_research_projects');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialResearchProjects;
  });

  const [researchPapers, setResearchPapers] = useState<ResearchPaper[]>(() => {
    try {
      const saved = localStorage.getItem('study_os_research_papers');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialResearchPapers;
  });

  const [citations, setCitations] = useState<CitationItem[]>(() => {
    try {
      const saved = localStorage.getItem('study_os_citations');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialCitations;
  });

  // Knowledge Entities
  const [concepts, setConcepts] = useState<KnowledgeConcept[]>(() => {
    try {
      const saved = localStorage.getItem('study_os_concepts');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialConcepts;
  });

  const [relationships, setRelationships] = useState<KnowledgeRelationship[]>(() => {
    try {
      const saved = localStorage.getItem('study_os_relationships');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialRelationships;
  });

  // Save collections to localStorage
  useEffect(() => { localStorage.setItem('study_os_subjects', JSON.stringify(subjects)); }, [subjects]);
  useEffect(() => { localStorage.setItem('study_os_units', JSON.stringify(units)); }, [units]);
  useEffect(() => { localStorage.setItem('study_os_topics', JSON.stringify(topics)); }, [topics]);
  useEffect(() => { localStorage.setItem('study_os_sessions', JSON.stringify(sessions)); }, [sessions]);
  useEffect(() => { localStorage.setItem('study_os_revisions', JSON.stringify(revisions)); }, [revisions]);
  useEffect(() => { localStorage.setItem('study_os_questions', JSON.stringify(questions)); }, [questions]);
  useEffect(() => { localStorage.setItem('study_os_notes', JSON.stringify(notes)); }, [notes]);
  useEffect(() => { localStorage.setItem('study_os_resources', JSON.stringify(resources)); }, [resources]);
  useEffect(() => { localStorage.setItem('study_os_exam_fleet', JSON.stringify(examFleet)); }, [examFleet]);
  useEffect(() => { localStorage.setItem('study_os_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('study_os_documents', JSON.stringify(documents)); }, [documents]);
  useEffect(() => { localStorage.setItem('study_os_folders', JSON.stringify(folders)); }, [folders]);
  useEffect(() => { localStorage.setItem('study_os_research_projects', JSON.stringify(researchProjects)); }, [researchProjects]);
  useEffect(() => { localStorage.setItem('study_os_research_papers', JSON.stringify(researchPapers)); }, [researchPapers]);
  useEffect(() => { localStorage.setItem('study_os_citations', JSON.stringify(citations)); }, [citations]);
  useEffect(() => { localStorage.setItem('study_os_concepts', JSON.stringify(concepts)); }, [concepts]);
  useEffect(() => { localStorage.setItem('study_os_relationships', JSON.stringify(relationships)); }, [relationships]);

  // Focus Timer
  const [focusTimer, setFocusTimer] = useState<FocusTimerState>({
    isActive: false,
    isPaused: false,
    isBreak: false,
    elapsedSeconds: 0,
    targetSeconds: 25 * 60,
    subjectId: null,
    topicId: null,
    topicTitle: '',
    subjectName: '',
    subjectColor: '#0058be',
    mode: 'pomodoro',
  });

  // Vector DB Status
  const [vectorStatus, setVectorStatus] = useState<VectorIndexStatusResponse | null>(null);
  const [isIndexingVectors, setIsIndexingVectors] = useState<boolean>(false);

  // Sound and FX
  const playSound = useCallback((type: 'beep' | 'finish' | 'success' | 'click') => {
    if (!profile.soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'finish') {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.6);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      } else if (type === 'success') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === 'click') {
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch {}
  }, [profile.soundEnabled]);

  const triggerConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#0058be', '#2563eb', '#16a34a', '#d97706', '#9333ea']
      });
    } catch {}
  }, []);

  // Vector Indexing helper
  const reindexAllVectors = useCallback(async () => {
    setIsIndexingVectors(true);
    try {
      const itemsToIndex: IndexItemPayload[] = [];
      const userId = profile.id || 'user_default';

      // 1. Topics
      topics.forEach(t => {
        const sub = subjects.find(s => s.id === t.subject_id);
        itemsToIndex.push({
          id: t.id,
          type: 'topic',
          title: t.title,
          content: `${t.title}. ${t.description}. ${t.keyFormula ? `Key Formula: ${t.keyFormula}. ${t.keyFormulaExplanation || ''}` : ''}`,
          subjectId: t.subject_id,
          subjectCode: sub?.code,
          tags: [sub?.code || 'ACADEMIC', t.difficulty, t.status],
        });
      });

      // 2. Questions
      questions.forEach(q => {
        itemsToIndex.push({
          id: q.id,
          type: 'question',
          title: `${q.subject_code} ${q.marks}M: ${q.question.slice(0, 60)}...`,
          content: `Question: ${q.question}\nAnswer: ${q.answer}\nFormula: ${q.keyFormula || ''}\nHint: ${q.hint || ''}`,
          subjectId: q.subject_id,
          subjectCode: q.subject_code,
          tags: [q.subject_code, `${q.marks}M`, q.difficulty],
        });
      });

      // 3. Notes
      notes.forEach(n => {
        itemsToIndex.push({
          id: n.id,
          type: 'note',
          title: n.title,
          content: `${n.title}\n${n.content}`,
          subjectId: n.subject_id,
          subjectCode: n.subject_code,
          tags: n.tags,
        });
      });

      // 4. Documents
      documents.forEach(d => {
        itemsToIndex.push({
          id: d.id,
          type: 'document',
          title: d.title,
          content: `${d.title}\n${d.content}`,
          subjectId: d.subject_id,
          subjectCode: d.subject_code,
          tags: d.tags,
        });
      });

      // 5. Research Papers
      researchPapers.forEach(p => {
        itemsToIndex.push({
          id: p.id,
          type: 'paper',
          title: p.title,
          content: `${p.title}\nAuthors: ${p.authors.join(', ')}\nVenue: ${p.publicationOrVenue} (${p.year})\nAbstract: ${p.abstract}\nNotes: ${p.notes}`,
          subjectCode: p.subject_code,
          tags: p.tags,
        });
      });

      // 6. Knowledge Concepts
      concepts.forEach(c => {
        itemsToIndex.push({
          id: c.id,
          type: 'concept',
          title: c.name,
          content: `${c.name} (${c.category})\nSummary: ${c.summary}\nDefinition: ${c.definition}\nFormula: ${c.formula || ''}`,
          subjectId: c.subject_id,
          subjectCode: c.subject_code,
          tags: [c.category, c.subject_code || 'CONCEPT'],
        });
      });

      if (itemsToIndex.length > 0) {
        await indexItems(itemsToIndex, userId);
      }

      const statusRes = await getVectorStatus();
      if (statusRes) {
        setVectorStatus(statusRes);
      }
    } catch (err) {
      console.warn('Vector re-index error:', err);
    } finally {
      setIsIndexingVectors(false);
    }
  }, [topics, questions, notes, documents, researchPapers, concepts, subjects, profile.id]);

  // Initial fetch and auto-sync
  useEffect(() => {
    getVectorStatus().then(res => {
      if (res) {
        setVectorStatus(res);
        if (res.totalVectors === 0 && (topics.length > 0 || notes.length > 0 || documents.length > 0)) {
          reindexAllVectors();
        }
      }
    }).catch(() => {});
  }, [reindexAllVectors, topics.length, notes.length, documents.length]);

  // Focus Timer Tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (focusTimer.isActive && !focusTimer.isPaused) {
      interval = setInterval(() => {
        setFocusTimer(prev => {
          const nextElapsed = prev.elapsedSeconds + 1;
          if (nextElapsed >= prev.targetSeconds) {
            playSound('finish');
            triggerConfetti();
            return {
              ...prev,
              isActive: false,
              elapsedSeconds: prev.targetSeconds,
            };
          }
          return { ...prev, elapsedSeconds: nextElapsed };
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [focusTimer.isActive, focusTimer.isPaused, playSound, triggerConfetti]);

  // Actions
  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const login = async (email: string, name?: string): Promise<boolean> => {
    setProfile(prev => ({
      ...prev,
      email: email.trim(),
      name: name?.trim() || prev.name || 'Student',
      isAuthenticated: true,
    }));
    return true;
  };

  const register = async (email: string, name: string, major?: string): Promise<boolean> => {
    setProfile(prev => ({
      ...prev,
      email: email.trim(),
      name: name.trim(),
      major: major?.trim() || prev.major,
      isAuthenticated: true,
    }));
    return true;
  };

  const logout = () => {
    setProfile(prev => ({
      ...prev,
      isAuthenticated: false,
    }));
  };

  // Subjects
  const addSubject = (subject: Omit<Subject, 'id'>): Subject => {
    const newSubject: Subject = {
      ...subject,
      id: `sub_${Date.now()}`,
    };
    setSubjects(prev => [...prev, newSubject]);
    return newSubject;
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  // Units
  const addUnit = (unit: Omit<Unit, 'id'>): Unit => {
    const newUnit: Unit = { ...unit, id: `unit_${Date.now()}` };
    setUnits(prev => [...prev, newUnit]);
    return newUnit;
  };

  const updateUnit = (id: string, updates: Partial<Unit>) => {
    setUnits(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  };

  const deleteUnit = (id: string) => {
    setUnits(prev => prev.filter(u => u.id !== id));
  };

  // Topics
  const addTopic = (topic: Omit<Topic, 'id'>): Topic => {
    const newTopic: Topic = {
      ...topic,
      id: `top_${Date.now()}`,
    };
    setTopics(prev => [...prev, newTopic]);
    return newTopic;
  };

  const updateTopic = (id: string, updates: Partial<Topic>) => {
    setTopics(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTopic = (id: string) => {
    setTopics(prev => prev.filter(t => t.id !== id));
    deleteDocumentVector(id, profile.id || 'user_default').catch(() => {});
  };

  const quickUpdateTopicStatus = (id: string, status: TopicStatus) => {
    setTopics(prev => prev.map(t => {
      if (t.id !== id) return t;
      return {
        ...t,
        status,
        lastStudiedAt: 'Today',
      };
    }));
    playSound('beep');
  };

  const updateTopicConfidence = (id: string, confidence: number) => {
    setTopics(prev => prev.map(t => t.id === id ? { ...t, confidence } : t));
  };

  // Sessions
  const addSession = (session: Omit<StudySession, 'id'>): StudySession => {
    const newSession: StudySession = {
      ...session,
      id: `sess_${Date.now()}`,
    };
    setSessions(prev => [newSession, ...prev]);
    return newSession;
  };

  const updateSession = (id: string, updates: Partial<StudySession>) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const completeSession = (id: string, durationMinutes?: number) => {
    setSessions(prev => prev.map(s => {
      if (s.id !== id) return s;
      return {
        ...s,
        status: 'completed',
        actualDurationMinutes: durationMinutes || s.durationMinutes,
      };
    }));
    triggerConfetti();
    playSound('finish');
  };

  // Revisions
  const addRevisionItem = (item: Omit<RevisionItem, 'id'>): RevisionItem => {
    const newRev: RevisionItem = {
      ...item,
      id: `rev_${Date.now()}`,
    };
    setRevisions(prev => [...prev, newRev]);
    return newRev;
  };

  const completeRevision = (id: string, confidence?: number) => {
    setRevisions(prev => prev.map(r => {
      if (r.id !== id) return r;
      const nextStage = r.revision_stage + 1;
      const nextIntervals = [1, 3, 7, 14, 30, 60];
      const nextDays = nextIntervals[Math.min(nextStage, nextIntervals.length - 1)];
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + nextDays);

      return {
        ...r,
        revision_stage: nextStage,
        intervalDays: nextDays,
        due_date: nextDate.toISOString().split('T')[0],
        status: nextStage >= 5 ? 'mastered' : 'completed',
        completed_at: new Date().toISOString(),
      };
    }));
    triggerConfetti();
    playSound('success');
  };

  const postponeRevision = (id: string, days: number = 1) => {
    setRevisions(prev => prev.map(r => {
      if (r.id !== id) return r;
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + days);
      return {
        ...r,
        due_date: nextDate.toISOString().split('T')[0],
        status: 'postponed',
      };
    }));
  };

  // Questions
  const addQuestion = (q: Omit<Question, 'id'>): Question => {
    const newQ: Question = {
      ...q,
      id: `q_${Date.now()}`,
    };
    setQuestions(prev => [newQ, ...prev]);
    return newQ;
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const deleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
    deleteDocumentVector(id, profile.id || 'user_default').catch(() => {});
  };

  const recordQuestionAttempt = (id: string, confidence: number) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== id) return q;
      const attemptsCount = q.attemptsCount + 1;
      let status = q.status;
      if (confidence >= 4) {
        status = attemptsCount >= 2 ? 'mastered' : 'confident';
      } else if (confidence >= 2) {
        status = 'practicing';
      } else {
        status = 'practicing';
      }
      return {
        ...q,
        attemptsCount,
        lastConfidence: confidence,
        status,
      };
    }));
    playSound('beep');
  };

  // Notes
  const addNote = (note: Omit<Note, 'id'>): Note => {
    const newNote: Note = {
      ...note,
      id: `note_${Date.now()}`,
    };
    setNotes(prev => [newNote, ...prev]);
    return newNote;
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates, updated_at: 'Just now' } : n));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    deleteDocumentVector(id, profile.id || 'user_default').catch(() => {});
  };

  const toggleNoteFavorite = (id: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, is_favorite: !n.is_favorite } : n));
  };

  // Resources
  const addResource = (res: Omit<Resource, 'id'>): Resource => {
    const newRes: Resource = {
      ...res,
      id: `res_${Date.now()}`,
    };
    setResources(prev => [newRes, ...prev]);
    return newRes;
  };

  const deleteResource = (id: string) => {
    setResources(prev => prev.filter(r => r.id !== id));
    deleteDocumentVector(id, profile.id || 'user_default').catch(() => {});
  };

  const toggleResourceFavorite = (id: string) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, is_favorite: !r.is_favorite } : r));
  };

  // Exam Fleet
  const updateExamFleetItem = (id: string, updates: Partial<ExamFleetItem>) => {
    setExamFleet(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  // Tasks
  const addTask = (task: Omit<TaskItem, 'id' | 'created_at'>): TaskItem => {
    const newTask: TaskItem = {
      ...task,
      id: `task_${Date.now()}`,
      created_at: new Date().toISOString().split('T')[0],
    };
    setTasks(prev => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<TaskItem>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleTaskCompleted = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const isNowCompleted = t.status !== 'completed';
      if (isNowCompleted) {
        playSound('success');
        triggerConfetti();
      }
      return {
        ...t,
        status: isNowCompleted ? 'completed' : 'todo',
        completed_at: isNowCompleted ? new Date().toISOString() : undefined,
      };
    }));
  };

  // Documents
  const addDocument = (doc: Omit<WorkspaceDocument, 'id' | 'created_at' | 'updated_at' | 'version'>): WorkspaceDocument => {
    const newDoc: WorkspaceDocument = {
      ...doc,
      id: `doc_${Date.now()}`,
      created_at: new Date().toISOString().split('T')[0],
      updated_at: 'Just now',
      version: 1,
    };
    setDocuments(prev => [newDoc, ...prev]);
    return newDoc;
  };

  const updateDocument = (id: string, updates: Partial<WorkspaceDocument>) => {
    setDocuments(prev => prev.map(d => {
      if (d.id !== id) return d;
      return {
        ...d,
        ...updates,
        updated_at: 'Just now',
        version: d.version + 1,
      };
    }));
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    deleteDocumentVector(id, profile.id || 'user_default').catch(() => {});
  };

  const duplicateDocument = (id: string): WorkspaceDocument | null => {
    const existing = documents.find(d => d.id === id);
    if (!existing) return null;
    const duplicated: WorkspaceDocument = {
      ...existing,
      id: `doc_${Date.now()}`,
      title: `${existing.title} (Copy)`,
      created_at: new Date().toISOString().split('T')[0],
      updated_at: 'Just now',
      version: 1,
    };
    setDocuments(prev => [duplicated, ...prev]);
    return duplicated;
  };

  // Folders
  const addFolder = (fld: Omit<LibraryFolder, 'id' | 'updated_at' | 'itemCount'>): LibraryFolder => {
    const newFolder: LibraryFolder = {
      ...fld,
      id: `fld_${Date.now()}`,
      updated_at: new Date().toISOString().split('T')[0],
      itemCount: 0,
    };
    setFolders(prev => [...prev, newFolder]);
    return newFolder;
  };

  const deleteFolder = (id: string) => {
    setFolders(prev => prev.filter(f => f.id !== id));
  };

  // Research Projects
  const addResearchProject = (proj: Omit<ResearchProject, 'id' | 'updated_at'>): ResearchProject => {
    const newProj: ResearchProject = {
      ...proj,
      id: `proj_${Date.now()}`,
      updated_at: 'Just now',
    };
    setResearchProjects(prev => [newProj, ...prev]);
    return newProj;
  };

  const updateResearchProject = (id: string, updates: Partial<ResearchProject>) => {
    setResearchProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates, updated_at: 'Just now' } : p));
  };

  const deleteResearchProject = (id: string) => {
    setResearchProjects(prev => prev.filter(p => p.id !== id));
  };

  // Research Papers
  const addResearchPaper = (paper: Omit<ResearchPaper, 'id' | 'added_at'>): ResearchPaper => {
    const newPaper: ResearchPaper = {
      ...paper,
      id: `paper_${Date.now()}`,
      added_at: new Date().toISOString().split('T')[0],
    };
    setResearchPapers(prev => [newPaper, ...prev]);
    return newPaper;
  };

  const updateResearchPaper = (id: string, updates: Partial<ResearchPaper>) => {
    setResearchPapers(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteResearchPaper = (id: string) => {
    setResearchPapers(prev => prev.filter(p => p.id !== id));
    deleteDocumentVector(id, profile.id || 'user_default').catch(() => {});
  };

  const togglePaperRead = (id: string) => {
    setResearchPapers(prev => prev.map(p => p.id === id ? { ...p, isRead: !p.isRead } : p));
  };

  // Citations
  const addCitation = (cite: Omit<CitationItem, 'id'>): CitationItem => {
    const newCite: CitationItem = {
      ...cite,
      id: `cite_${Date.now()}`,
    };
    setCitations(prev => [newCite, ...prev]);
    return newCite;
  };

  const deleteCitation = (id: string) => {
    setCitations(prev => prev.filter(c => c.id !== id));
  };

  // Concepts
  const addConcept = (cpt: Omit<KnowledgeConcept, 'id'>): KnowledgeConcept => {
    const newCpt: KnowledgeConcept = {
      ...cpt,
      id: `cpt_${Date.now()}`,
      lastReviewed: 'Today',
    };
    setConcepts(prev => [newCpt, ...prev]);
    return newCpt;
  };

  const updateConcept = (id: string, updates: Partial<KnowledgeConcept>) => {
    setConcepts(prev => prev.map(c => c.id === id ? { ...c, ...updates, lastReviewed: 'Today' } : c));
  };

  const deleteConcept = (id: string) => {
    setConcepts(prev => prev.filter(c => c.id !== id));
    deleteDocumentVector(id, profile.id || 'user_default').catch(() => {});
  };

  // Relationships
  const addRelationship = (rel: Omit<KnowledgeRelationship, 'id'>): KnowledgeRelationship => {
    const newRel: KnowledgeRelationship = {
      ...rel,
      id: `rel_${Date.now()}`,
    };
    setRelationships(prev => [...prev, newRel]);
    return newRel;
  };

  const deleteRelationship = (id: string) => {
    setRelationships(prev => prev.filter(r => r.id !== id));
  };

  // Focus Timer Actions
  const startFocusTimer = (subjectId: string, topicId?: string, durationMinutes: number = 25) => {
    const sub = subjects.find(s => s.id === subjectId);
    const top = topics.find(t => t.id === topicId);
    setFocusTimer({
      isActive: true,
      isPaused: false,
      isBreak: false,
      elapsedSeconds: 0,
      targetSeconds: durationMinutes * 60,
      subjectId,
      topicId: topicId || null,
      topicTitle: top ? top.title : 'Study Session',
      subjectName: sub ? sub.name : 'General Study',
      subjectColor: sub ? sub.color : '#0058be',
      mode: 'pomodoro',
      sessionStartTime: new Date().toISOString(),
    });
    playSound('beep');
  };

  const pauseFocusTimer = () => {
    setFocusTimer(prev => ({ ...prev, isPaused: true }));
  };

  const resumeFocusTimer = () => {
    setFocusTimer(prev => ({ ...prev, isPaused: false }));
  };

  const stopFocusTimer = (completed: boolean = false) => {
    if (focusTimer.isActive && focusTimer.subjectId && focusTimer.elapsedSeconds > 60) {
      const minutesSpent = Math.round(focusTimer.elapsedSeconds / 60);
      const sub = subjects.find(s => s.id === focusTimer.subjectId);
      addSession({
        subject_id: focusTimer.subjectId,
        topic_id: focusTimer.topicId || undefined,
        topic_title: focusTimer.topicTitle || 'Focus Session',
        subject_name: sub ? sub.name : 'General',
        subject_code: sub ? sub.code : 'GEN',
        subject_color: sub ? sub.color : '#0058be',
        date: new Date().toISOString().split('T')[0],
        startTime: '10:00',
        endTime: '11:00',
        durationMinutes: minutesSpent,
        actualDurationMinutes: minutesSpent,
        priority: 'high',
        status: completed ? 'completed' : 'in_progress',
        notes: `Focus timer completed: ${minutesSpent} minutes.`,
      });
    }

    setFocusTimer({
      isActive: false,
      isPaused: false,
      isBreak: false,
      elapsedSeconds: 0,
      targetSeconds: 25 * 60,
      subjectId: null,
      topicId: null,
      topicTitle: '',
      subjectName: '',
      subjectColor: '#0058be',
      mode: 'pomodoro',
    });
  };

  const toggleBreakMode = () => {
    setFocusTimer(prev => {
      const isNowBreak = !prev.isBreak;
      return {
        ...prev,
        isBreak: isNowBreak,
        elapsedSeconds: 0,
        targetSeconds: (isNowBreak ? profile.breakMinutes : profile.preferredSessionMinutes) * 60,
      };
    });
  };

  const setTimerDuration = (minutes: number) => {
    setFocusTimer(prev => ({
      ...prev,
      targetSeconds: minutes * 60,
      elapsedSeconds: 0,
    }));
  };

  // Computed Metrics
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayStudyMinutes = useMemo(() => {
    return sessions
      .filter(s => s.date === todayDateStr && s.status === 'completed')
      .reduce((acc, s) => acc + (s.actualDurationMinutes || s.durationMinutes), 0);
  }, [sessions, todayDateStr]);

  const totalTopicsCount = topics.length;
  const completedTopicsCount = topics.filter(t => t.status === 'completed' || t.status === 'mastered').length;
  const urgentTopicsCount = topics.filter(t => t.priority === 'urgent' || t.priority === 'critical' || t.confidence <= 2).length;
  const dueRevisionsCount = revisions.filter(r => r.status === 'due').length;
  const unpracticedQuestionsCount = questions.filter(q => q.status === 'not_practiced').length;

  const syllabusCompletionPercentage = useMemo(() => {
    if (totalTopicsCount === 0) return 0;
    return Math.round((completedTopicsCount / totalTopicsCount) * 100);
  }, [completedTopicsCount, totalTopicsCount]);

  const overallReadiness = useMemo(() => {
    const totalFleet = examFleet.length;
    if (totalFleet === 0) return 65;
    const sum = examFleet.reduce((acc, e) => acc + e.readinessScore, 0);
    return Math.round(sum / totalFleet);
  }, [examFleet]);

  // AI Recommendation Engine
  const recommendedAction = useMemo(() => {
    const overdueRev = revisions.find(r => r.status === 'due');
    if (overdueRev) {
      return {
        title: `Spaced Revision Due: ${overdueRev.topic_title}`,
        subject: overdueRev.subject_name,
        type: 'overdue_revision' as const,
        reason: 'Optimal recall interval triggered by forgetting curve algorithm.',
        actionLabel: 'Review Flashcards',
        targetView: 'revision-queue' as ActiveView,
        subjectId: overdueRev.subject_id,
        topicId: overdueRev.topic_id,
      };
    }

    const lowConfidenceTopic = topics.find(t => t.confidence <= 2);
    if (lowConfidenceTopic) {
      const sub = subjects.find(s => s.id === lowConfidenceTopic.subject_id);
      return {
        title: `Reinforce Weak Topic: ${lowConfidenceTopic.title}`,
        subject: sub?.name || 'Theory',
        type: 'low_confidence' as const,
        reason: 'Current self-assessed mastery is below exam readiness threshold (confidence: 2/5).',
        actionLabel: 'Open High-Yield Notes',
        targetView: 'notes' as ActiveView,
        subjectId: lowConfidenceTopic.subject_id,
        topicId: lowConfidenceTopic.id,
      };
    }

    return {
      title: 'Practice Previous University Exam Problems',
      subject: 'Theory of Computation',
      type: 'exam_prep' as const,
      reason: '10M Pumping Lemma and Turing decidability questions historically carry high exam weight.',
      actionLabel: 'Start Practice Mode',
      targetView: 'question-bank' as ActiveView,
    };
  }, [revisions, topics, subjects]);

  const resetToDefaultData = () => {
    setSubjects(initialSubjects);
    setUnits(initialUnits);
    setTopics(initialTopics);
    setSessions(initialSessions);
    setRevisions(initialRevisions);
    setQuestions(initialQuestions);
    setNotes(initialNotes);
    setResources(initialResources);
    setExamFleet(initialExamFleet);
    setTasks(initialTasks);
    setDocuments(initialDocuments);
    setFolders(initialFolders);
    setResearchProjects(initialResearchProjects);
    setResearchPapers(initialResearchPapers);
    setCitations(initialCitations);
    setConcepts(initialConcepts);
    setRelationships(initialRelationships);
    setProfile(initialProfile);
    localStorage.clear();
    playSound('click');
  };

  return (
    <StudyContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedSubjectId,
        setSelectedSubjectId,
        selectedTopicId,
        setSelectedTopicId,
        selectedQuestionId,
        setSelectedQuestionId,
        selectedNoteId,
        setSelectedNoteId,
        selectedDocumentId,
        setSelectedDocumentId,
        selectedPaperId,
        setSelectedPaperId,
        selectedProjectId,
        setSelectedProjectId,
        selectedConceptId,
        setSelectedConceptId,
        globalSearchQuery,
        setGlobalSearchQuery,
        isDarkMode,
        setIsDarkMode,

        profile,
        updateProfile,
        login,
        register,
        logout,

        subjects,
        addSubject,
        updateSubject,
        deleteSubject,

        units,
        addUnit,
        updateUnit,
        deleteUnit,

        topics,
        addTopic,
        updateTopic,
        deleteTopic,
        quickUpdateTopicStatus,
        updateTopicConfidence,

        sessions,
        addSession,
        updateSession,
        deleteSession,
        completeSession,

        revisions,
        addRevisionItem,
        completeRevision,
        postponeRevision,

        questions,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        recordQuestionAttempt,

        notes,
        addNote,
        updateNote,
        deleteNote,
        toggleNoteFavorite,

        resources,
        addResource,
        deleteResource,
        toggleResourceFavorite,

        examFleet,
        updateExamFleetItem,

        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompleted,

        documents,
        addDocument,
        updateDocument,
        deleteDocument,
        duplicateDocument,

        folders,
        addFolder,
        deleteFolder,

        researchProjects,
        addResearchProject,
        updateResearchProject,
        deleteResearchProject,

        researchPapers,
        addResearchPaper,
        updateResearchPaper,
        deleteResearchPaper,
        togglePaperRead,

        citations,
        addCitation,
        deleteCitation,

        concepts,
        addConcept,
        updateConcept,
        deleteConcept,

        relationships,
        conceptRelations: relationships,
        addRelationship,
        deleteRelationship,

        focusTimer,
        startFocusTimer,
        pauseFocusTimer,
        resumeFocusTimer,
        stopFocusTimer,
        toggleBreakMode,
        setTimerDuration,

        todayStudyMinutes,
        syllabusCompletionPercentage,
        totalTopicsCount,
        completedTopicsCount,
        urgentTopicsCount,
        dueRevisionsCount,
        unpracticedQuestionsCount,
        overallReadiness,
        recommendedAction,

        vectorStatus,
        isIndexingVectors,
        reindexAllVectors,

        triggerConfetti,
        playSound,
        resetToDefaultData,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
};
