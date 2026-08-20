export type Priority = 'low' | 'medium' | 'high' | 'critical' | 'urgent';

export type TopicStatus = 'not_started' | 'learning' | 'completed' | 'needs_revision' | 'mastered';

export type SessionStatus = 'scheduled' | 'in_progress' | 'completed' | 'missed' | 'skipped';

export type QuestionStatus = 'not_practiced' | 'practicing' | 'confident' | 'mastered';

export type ResourceType = 'youtube' | 'pdf' | 'website' | 'document' | 'image' | 'link' | 'file';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  major?: string;
  semester?: string;
  dailyGoalMinutes: number; // e.g. 300 (5 hours)
  preferredSessionMinutes: number; // e.g. 50 or 25
  breakMinutes: number; // e.g. 10 or 5
  autoStartBreak: boolean;
  soundEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
  streakDays: number;
  longestStreakDays: number;
  isAuthenticated?: boolean;
}

export interface Subject {
  id: string;
  code: string; // e.g. "TOC", "CS-401"
  name: string;
  description: string;
  icon: string; // Lucide icon or material symbol name
  color: string; // Hex color or Tailwind accent
  difficulty: 'Beginner' | 'Intermediate' | 'Hard' | 'Extreme';
  target_hours: number;
  examDate: string; // ISO date string e.g. "2026-05-31"
  examTotalMarks: number;
  examTargetScore: number;
}

export interface Unit {
  id: string;
  subject_id: string;
  title: string;
  unitNumber: string; // e.g. "Unit I", "Unit II"
  order: number;
}

export interface Topic {
  id: string;
  unit_id: string;
  subject_id: string;
  title: string;
  description: string;
  status: TopicStatus;
  priority: Priority;
  difficulty: 'easy' | 'medium' | 'hard';
  estimated_minutes: number;
  actual_minutes: number;
  confidence: number; // 1 to 5
  order: number;
  lastStudiedAt?: string;
  revisionStage?: number; // 0 (none), 1 (1d), 2 (3d), 3 (7d), 4 (14d), 5 (30d), 6 (mastered)
  nextRevisionDue?: string;
  keyFormula?: string;
  keyFormulaExplanation?: string;
}

export interface StudySession {
  id: string;
  subject_id: string;
  topic_id?: string;
  topic_title: string;
  subject_name: string;
  subject_code: string;
  subject_color: string;
  date: string; // YYYY-MM-DD
  startTime: string; // "09:00"
  endTime: string; // "10:00"
  durationMinutes: number;
  actualDurationMinutes?: number;
  priority: Priority;
  status: SessionStatus;
  notes?: string;
}

export interface RevisionItem {
  id: string;
  topic_id: string;
  subject_id: string;
  topic_title: string;
  topic_description: string;
  subject_name: string;
  subject_code: string;
  subject_color: string;
  revision_stage: number; // 1 to 5
  intervalDays: number; // 1, 3, 7, 14, 30
  due_date: string; // YYYY-MM-DD
  completed_at?: string;
  status: 'due' | 'completed' | 'postponed' | 'mastered';
  priority: Priority;
  lastStudiedDate: string;
}

export interface Question {
  id: string;
  subject_id: string;
  unit_id: string;
  topic_id: string;
  subject_name: string;
  subject_code: string;
  unit_title: string;
  topic_title: string;
  question: string;
  answer: string;
  hint?: string;
  keyFormula?: string;
  formulaLabel?: string;
  formulaBreakdown?: { term: string; desc: string }[];
  marks: 2 | 3 | 5 | 7 | 10;
  priority: Priority | 'must_know';
  difficulty: 'easy' | 'medium' | 'hard';
  status: QuestionStatus;
  attemptsCount: number;
  lastConfidence?: number;
  tags?: string[];
  isPreviousExam?: boolean;
}

export interface Note {
  id: string;
  subject_id: string;
  unit_id: string;
  topic_id?: string;
  subject_name: string;
  subject_code: string;
  subject_color: string;
  unit_title: string;
  title: string;
  content: string; // Markdown / Rich content
  tags: string[];
  is_favorite: boolean;
  priority: Priority;
  updated_at: string;
  relatedQuestionIds?: string[];
}

export interface Resource {
  id: string;
  subject_id: string;
  topic_id?: string;
  subject_name: string;
  subject_code: string;
  title: string;
  type: ResourceType;
  url: string;
  notes?: string;
  tags: string[];
  is_favorite: boolean;
  added_at: string;
  sizeOrDuration?: string;
  folderId?: string;
}

export interface ExamFleetItem {
  id: string;
  subject_id: string;
  subject_name: string;
  subject_code: string;
  course_code: string; // "CS401"
  title: string;
  exam_date: string;
  daysRemaining: number;
  total_marks: number;
  target_score: number;
  readinessScore: number;
  syllabusCompletion: number;
  revisionCompletion: number;
  practiceCompletion: number;
  consistencyScore: number;
  isPrimary?: boolean;
}

// Workspace Document
export interface WorkspaceDocument {
  id: string;
  title: string;
  content: string;
  folderId?: string;
  tags: string[];
  subject_id?: string;
  subject_name?: string;
  subject_code?: string;
  updated_at: string;
  created_at: string;
  is_favorite?: boolean;
  wordCount: number;
  version: number;
  status: 'draft' | 'published' | 'archived';
}

// Workspace Task
export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: Priority;
  dueDate: string; // YYYY-MM-DD
  subject_id?: string;
  subject_code?: string;
  tags: string[];
  created_at: string;
  completed_at?: string;
  estimatedMinutes?: number;
}

// Library Folder & Tag
export interface LibraryFolder {
  id: string;
  name: string;
  description?: string;
  color?: string;
  parentId?: string;
  itemCount: number;
  updated_at: string;
}

// Research Project
export interface ResearchProject {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'in_progress' | 'completed' | 'planning';
  tags: string[];
  subject_id?: string;
  subject_code?: string;
  paperIds: string[];
  noteIds: string[];
  documentIds: string[];
  leadAuthor?: string;
  startDate: string;
  dueDate?: string;
  progressPercent: number;
  updated_at: string;
}

// Research Paper
export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  publicationOrVenue: string;
  year: number;
  abstract: string;
  url?: string;
  pdfUrl?: string;
  citationsCount: number;
  tags: string[];
  notes: string;
  projectId?: string;
  subject_code?: string;
  added_at: string;
  isRead: boolean;
  doi?: string;
}

// Research Citation & Reference
export interface CitationItem {
  id: string;
  paperId?: string;
  citeKey: string; // e.g. "shannon1948mathematical"
  title: string;
  authors: string;
  venue: string;
  year: number;
  volume?: string;
  pages?: string;
  doi?: string;
  bibtex: string;
}

// Knowledge Concept
export interface KnowledgeConcept {
  id: string;
  name: string;
  summary: string;
  definition: string;
  category: string;
  subject_id: string;
  subject_name?: string;
  subject_code?: string;
  complexity?: 'foundational' | 'intermediate' | 'advanced';
  keyTheorems?: string[];
  tags?: string[];
  masteryLevel?: number;
  relatedConceptIds: string[];
  relatedNoteIds: string[];
  relatedTopicIds: string[];
  confidenceLevel: number; // 1-5
  lastReviewed?: string;
  formula?: string;
}

// Knowledge Relationship
export interface KnowledgeRelationship {
  id: string;
  sourceConceptId: string;
  targetConceptId: string;
  source_id?: string;
  target_id?: string;
  sourceName: string;
  targetName: string;
  relationshipType: 'prerequisite' | 'derives_from' | 'analogous_to' | 'component_of' | 'contrast_with';
  relation_type?: string;
  strength: number; // 0.0 - 1.0
  notes?: string;
  isAutoGenerated?: boolean;
}

export type ActiveView = 
  | 'dashboard'
  | 'study-planner'
  | 'subjects'
  | 'focus-mode'
  | 'revision-queue'
  | 'question-bank'
  | 'notes'
  | 'resources'
  | 'analytics'
  | 'exam-mode'
  | 'settings'
  | 'help';
