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
  ExamFleetItem
} from '../types';

export const initialProfile: UserProfile = {
  id: 'user_1',
  name: 'Student',
  email: 'pranishs999@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  dailyGoalMinutes: 300, // 5h 00m
  preferredSessionMinutes: 50,
  breakMinutes: 10,
  autoStartBreak: false,
  soundEnabled: true,
  theme: 'light',
  streakDays: 6,
  longestStreakDays: 14,
};

export const initialSubjects: Subject[] = [
  {
    id: 'sub_toc',
    code: 'TOC',
    name: 'Theory of Computation',
    description: 'Automata theory, formal languages, grammars, Turing machines, and computability limits.',
    icon: 'binary',
    color: '#0058be', // Deep blue
    difficulty: 'Hard',
    target_hours: 45,
    examDate: '2026-05-31',
    examTotalMarks: 100,
    examTargetScore: 90,
  },
  {
    id: 'sub_cn',
    code: 'CN',
    name: 'Computer Networks',
    description: 'OSI & TCP/IP stack, routing protocols, transport congestion control, and subnetting.',
    icon: 'network',
    color: '#d97706', // Warm amber / orange
    difficulty: 'Intermediate',
    target_hours: 40,
    examDate: '2026-06-12',
    examTotalMarks: 100,
    examTargetScore: 85,
  },
  {
    id: 'sub_os',
    code: 'OS',
    name: 'Operating Systems',
    description: 'Process management, CPU scheduling, concurrency, virtual memory, and file systems.',
    icon: 'cpu',
    color: '#16a34a', // Emerald green
    difficulty: 'Hard',
    target_hours: 50,
    examDate: '2026-06-20',
    examTotalMarks: 100,
    examTargetScore: 92,
  },
  {
    id: 'sub_dbms',
    code: 'DBMS',
    name: 'Database Management System',
    description: 'Relational algebra, SQL, normalization (1NF-BCNF), indexing, transactions, and ACID properties.',
    icon: 'database',
    color: '#dc2626', // Red / Crimson
    difficulty: 'Intermediate',
    target_hours: 35,
    examDate: '2026-07-05',
    examTotalMarks: 100,
    examTargetScore: 88,
  },
  {
    id: 'sub_ai',
    code: 'AI',
    name: 'Artificial Intelligence',
    description: 'Intelligent agents, heuristic search (A*, IDA*), adversarial games, knowledge representation, and logic.',
    icon: 'sparkles',
    color: '#9333ea', // Purple
    difficulty: 'Hard',
    target_hours: 45,
    examDate: '2026-07-18',
    examTotalMarks: 100,
    examTargetScore: 95,
  },
];

export const initialUnits: Unit[] = [
  // TOC
  { id: 'unit_toc_1', subject_id: 'sub_toc', title: 'Finite Automata & Regular Languages', unitNumber: 'Unit I', order: 1 },
  { id: 'unit_toc_2', subject_id: 'sub_toc', title: 'Context-Free Grammars & Pushdown Automata', unitNumber: 'Unit II', order: 2 },
  { id: 'unit_toc_3', subject_id: 'sub_toc', title: 'Turing Machines & Undecidability', unitNumber: 'Unit III', order: 3 },

  // AI
  { id: 'unit_ai_1', subject_id: 'sub_ai', title: 'Introduction to AI & Agent Architecture', unitNumber: 'Unit I', order: 1 },
  { id: 'unit_ai_2', subject_id: 'sub_ai', title: 'Intelligent Agents & Problem Solving', unitNumber: 'Unit II', order: 2 },
  { id: 'unit_ai_3', subject_id: 'sub_ai', title: 'Heuristic Search & Adversarial Games', unitNumber: 'Unit III', order: 3 },
  { id: 'unit_ai_4', subject_id: 'sub_ai', title: 'Knowledge Representation & First-Order Logic', unitNumber: 'Unit IV', order: 4 },

  // OS
  { id: 'unit_os_1', subject_id: 'sub_os', title: 'Processes & Threads', unitNumber: 'Unit I', order: 1 },
  { id: 'unit_os_2', subject_id: 'sub_os', title: 'CPU Scheduling & Synchronization', unitNumber: 'Unit II', order: 2 },
  { id: 'unit_os_3', subject_id: 'sub_os', title: 'Memory Management & Virtual Memory', unitNumber: 'Unit III', order: 3 },

  // CN
  { id: 'unit_cn_1', subject_id: 'sub_cn', title: 'Physical & Data Link Layers', unitNumber: 'Unit I', order: 1 },
  { id: 'unit_cn_2', subject_id: 'sub_cn', title: 'Network Layer & Routing Protocols', unitNumber: 'Unit II', order: 2 },
  { id: 'unit_cn_3', subject_id: 'sub_cn', title: 'Transport Layer & Congestion Control', unitNumber: 'Unit III', order: 3 },

  // DBMS
  { id: 'unit_dbms_1', subject_id: 'sub_dbms', title: 'ER Modeling & Relational Algebra', unitNumber: 'Unit I', order: 1 },
  { id: 'unit_dbms_2', subject_id: 'sub_dbms', title: 'SQL & Normalization Theory', unitNumber: 'Unit II', order: 2 },
  { id: 'unit_dbms_3', subject_id: 'sub_dbms', title: 'Transaction Management & Indexing', unitNumber: 'Unit III', order: 3 },
];

export const initialTopics: Topic[] = [
  // TOC Topics
  {
    id: 'top_toc_1',
    unit_id: 'unit_toc_1',
    subject_id: 'sub_toc',
    title: 'DFA and NFA Transitions & Minimization',
    description: 'Equivalence of DFA and NFA, subset construction algorithm, and Hopcroft minimization.',
    status: 'completed',
    priority: 'high',
    difficulty: 'medium',
    estimated_minutes: 60,
    actual_minutes: 65,
    confidence: 4,
    order: 1,
    lastStudiedAt: '2026-05-01',
    revisionStage: 2,
    nextRevisionDue: '2026-05-04',
    keyFormula: 'δ: Q × Σ → Q',
    keyFormulaExplanation: 'Deterministic state transition function mapping a state and symbol to a single next state.',
  },
  {
    id: 'top_toc_2',
    unit_id: 'unit_toc_1',
    subject_id: 'sub_toc',
    title: 'Pumping Lemma for Regular Languages',
    description: 'Proof technique to demonstrate non-regularity of languages using the pigeonhole principle.',
    status: 'needs_revision',
    priority: 'critical',
    difficulty: 'hard',
    estimated_minutes: 90,
    actual_minutes: 45,
    confidence: 2,
    order: 2,
    lastStudiedAt: '2026-04-28',
    revisionStage: 1,
    nextRevisionDue: '2026-05-02',
    keyFormula: 'w = xyz, |xy| ≤ p, |y| ≥ 1, xy^i z ∈ L',
    keyFormulaExplanation: 'Decomposition of long string w into xyz where y can be pumped indefinitely while staying in language L.',
  },
  {
    id: 'top_toc_3',
    unit_id: 'unit_toc_2',
    subject_id: 'sub_toc',
    title: 'Pushdown Automata & Context Free Grammars',
    description: 'Deterministic vs non-deterministic PDA, stack manipulation, and Chomsky normal form.',
    status: 'learning',
    priority: 'high',
    difficulty: 'hard',
    estimated_minutes: 90,
    actual_minutes: 30,
    confidence: 3,
    order: 3,
  },

  // AI Topics
  {
    id: 'top_ai_1',
    unit_id: 'unit_ai_1',
    subject_id: 'sub_ai',
    title: 'AI Perspectives',
    description: 'Historical approaches, symbolic vs sub-symbolic AI, and modern cognitive architectures.',
    status: 'completed',
    priority: 'medium',
    difficulty: 'easy',
    estimated_minutes: 45,
    actual_minutes: 40,
    confidence: 4,
    order: 1,
    lastStudiedAt: '2026-05-01',
    revisionStage: 2,
    nextRevisionDue: '2026-05-04',
  },
  {
    id: 'top_ai_2',
    unit_id: 'unit_ai_1',
    subject_id: 'sub_ai',
    title: 'History of AI',
    description: 'Dartmouth conference, AI winters, expert systems era, and statistical machine learning revolution.',
    status: 'completed',
    priority: 'low',
    difficulty: 'easy',
    estimated_minutes: 75,
    actual_minutes: 70,
    confidence: 5,
    order: 2,
    lastStudiedAt: '2026-04-29',
    revisionStage: 3,
    nextRevisionDue: '2026-05-06',
  },
  {
    id: 'top_ai_3',
    unit_id: 'unit_ai_1',
    subject_id: 'sub_ai',
    title: 'Foundations of AI',
    description: 'Philosophy, mathematics, economics, neuroscience, and psychology underlying agent systems.',
    status: 'learning',
    priority: 'medium',
    difficulty: 'medium',
    estimated_minutes: 120,
    actual_minutes: 55,
    confidence: 3,
    order: 3,
  },
  {
    id: 'top_ai_4',
    unit_id: 'unit_ai_2',
    subject_id: 'sub_ai',
    title: 'Intelligent Agents & PEAS Framework',
    description: 'Performance measure, Environment, Actuators, Sensors specification for agent design.',
    status: 'completed',
    priority: 'high',
    difficulty: 'medium',
    estimated_minutes: 60,
    actual_minutes: 60,
    confidence: 4,
    order: 4,
    lastStudiedAt: '2026-04-25',
    revisionStage: 3,
  },
  {
    id: 'top_ai_5',
    unit_id: 'unit_ai_3',
    subject_id: 'sub_ai',
    title: 'A* Search Algorithm & Heuristics',
    description: 'Informed graph search balancing path cost g(n) and heuristic estimation h(n) with admissibility constraints.',
    status: 'learning',
    priority: 'critical',
    difficulty: 'hard',
    estimated_minutes: 90,
    actual_minutes: 40,
    confidence: 2,
    order: 5,
    keyFormula: 'f(n) = g(n) + h(n)',
    keyFormulaExplanation: 'Evaluation function combining exact known cost from start g(n) with estimated optimistic cost to goal h(n).',
  },
  {
    id: 'top_ai_6',
    unit_id: 'unit_ai_3',
    subject_id: 'sub_ai',
    title: 'Minimax Algorithm & Alpha-Beta Pruning',
    description: 'Game tree decision making in two-player zero-sum adversarial environments with branch cutoffs.',
    status: 'not_started',
    priority: 'high',
    difficulty: 'hard',
    estimated_minutes: 90,
    actual_minutes: 0,
    confidence: 1,
    order: 6,
  },

  // OS Topics
  {
    id: 'top_os_1',
    unit_id: 'unit_os_2',
    subject_id: 'sub_os',
    title: 'CPU Scheduling Algorithms',
    description: 'FCFS, SJF, Priority scheduling algorithms, Round Robin, and context switching overhead.',
    status: 'learning',
    priority: 'high',
    difficulty: 'medium',
    estimated_minutes: 60,
    actual_minutes: 35,
    confidence: 3,
    order: 1,
    lastStudiedAt: '2026-05-01',
    revisionStage: 1,
    nextRevisionDue: '2026-05-02',
    keyFormula: 'TAT = Completion Time - Arrival Time',
    keyFormulaExplanation: 'Turnaround time (TAT) is the total elapsed time between job submission and full completion.',
  },
  {
    id: 'top_os_2',
    unit_id: 'unit_os_2',
    subject_id: 'sub_os',
    title: 'Deadlock Avoidance & Banker Algorithm',
    description: 'Resource allocation graphs, 4 Coffman conditions, safe state verification, and banker matrix operations.',
    status: 'not_started',
    priority: 'critical',
    difficulty: 'hard',
    estimated_minutes: 90,
    actual_minutes: 0,
    confidence: 1,
    order: 2,
    keyFormula: 'Need[i, j] = Max[i, j] - Allocation[i, j]',
    keyFormulaExplanation: 'Resource demand calculation checking if system state remains safe under full claims.',
  },
  {
    id: 'top_os_3',
    unit_id: 'unit_os_3',
    subject_id: 'sub_os',
    title: 'Memory Management & Paging',
    description: 'Page tables, TLB cache, address translation, page fault handling, and Belady anomaly.',
    status: 'completed',
    priority: 'high',
    difficulty: 'hard',
    estimated_minutes: 90,
    actual_minutes: 95,
    confidence: 5,
    order: 3,
  },

  // CN Topics
  {
    id: 'top_cn_1',
    unit_id: 'unit_cn_1',
    subject_id: 'sub_cn',
    title: 'OSI Model Deep Dive & Encapsulation',
    description: 'The 7-layer OSI reference model, Protocol Data Units (PDU), headers, and data encapsulation.',
    status: 'learning',
    priority: 'high',
    difficulty: 'medium',
    estimated_minutes: 60,
    actual_minutes: 25,
    confidence: 3,
    order: 1,
  },
  {
    id: 'top_cn_2',
    unit_id: 'unit_cn_2',
    subject_id: 'sub_cn',
    title: 'Subnetting & VLSM Practice',
    description: 'IPv4 address classes, CIDR notation, subnet masks calculation, and host range allocation.',
    status: 'needs_revision',
    priority: 'critical',
    difficulty: 'hard',
    estimated_minutes: 90,
    actual_minutes: 80,
    confidence: 2,
    order: 2,
    lastStudiedAt: '2026-04-20',
    revisionStage: 2,
  },
  {
    id: 'top_cn_3',
    unit_id: 'unit_cn_3',
    subject_id: 'sub_cn',
    title: 'TCP/IP Congestion Control & Flow Control',
    description: 'Sliding window protocol, AIMD algorithm, Slow Start, Congestion Avoidance, and Fast Retransmit.',
    status: 'needs_revision',
    priority: 'high',
    difficulty: 'hard',
    estimated_minutes: 75,
    actual_minutes: 40,
    confidence: 2,
    order: 3,
    lastStudiedAt: '2026-04-22',
  },

  // DBMS Topics
  {
    id: 'top_dbms_1',
    unit_id: 'unit_dbms_1',
    subject_id: 'sub_dbms',
    title: 'ER Model to Relational Mapping',
    description: 'Entity-Relationship diagrams, cardinality constraints, weak entities, and converting entities to relational schemas.',
    status: 'completed',
    priority: 'medium',
    difficulty: 'medium',
    estimated_minutes: 60,
    actual_minutes: 50,
    confidence: 4,
    order: 1,
    lastStudiedAt: '2026-04-24',
    revisionStage: 3,
    nextRevisionDue: '2026-05-01',
  },
  {
    id: 'top_dbms_2',
    unit_id: 'unit_dbms_2',
    subject_id: 'sub_dbms',
    title: 'Normalization (1NF, 2NF, 3NF, BCNF)',
    description: 'Functional dependencies, candidate key closure, lossless join decomposition, and dependency preservation.',
    status: 'needs_revision',
    priority: 'critical',
    difficulty: 'hard',
    estimated_minutes: 90,
    actual_minutes: 45,
    confidence: 2,
    order: 2,
    lastStudiedAt: '2026-04-26',
    keyFormula: 'X → Y in BCNF ⇒ X is superkey',
    keyFormulaExplanation: 'Boyce-Codd Normal Form strictly forbids functional dependencies unless the determinant is a superkey.',
  },
  {
    id: 'top_dbms_3',
    unit_id: 'unit_dbms_3',
    subject_id: 'sub_dbms',
    title: 'B-Trees & Database Indexing',
    description: 'Clustered vs non-clustered indexing, dense vs sparse indexes, and B+ Tree node splitting algorithms.',
    status: 'not_started',
    priority: 'high',
    difficulty: 'hard',
    estimated_minutes: 75,
    actual_minutes: 0,
    confidence: 1,
    order: 3,
  },
];

export const initialSessions: StudySession[] = [
  {
    id: 'sess_1',
    subject_id: 'sub_toc',
    topic_id: 'top_toc_1',
    topic_title: 'DFA/NFA Minimization',
    subject_name: 'Theory of Computation',
    subject_code: 'TOC',
    subject_color: '#0058be',
    date: '2026-05-02',
    startTime: '09:00',
    endTime: '10:00',
    durationMinutes: 60,
    actualDurationMinutes: 60,
    priority: 'high',
    status: 'completed',
    notes: 'Covered subset construction and verified with 4 state minimization examples.',
  },
  {
    id: 'sess_2',
    subject_id: 'sub_cn',
    topic_id: 'top_cn_1',
    topic_title: 'OSI Model Deep Dive',
    subject_name: 'Computer Networks',
    subject_code: 'CN',
    subject_color: '#d97706',
    date: '2026-05-02',
    startTime: '10:10',
    endTime: '11:10',
    durationMinutes: 60,
    priority: 'high',
    status: 'in_progress',
    notes: 'Focusing on transport layer protocols vs network layer encapsulation.',
  },
  {
    id: 'sess_3',
    subject_id: 'sub_os',
    topic_id: 'top_os_1',
    topic_title: 'CPU Scheduling Algorithms',
    subject_name: 'Operating Systems',
    subject_code: 'OS',
    subject_color: '#16a34a',
    date: '2026-05-02',
    startTime: '11:20',
    endTime: '12:20',
    durationMinutes: 60,
    priority: 'high',
    status: 'scheduled',
    notes: 'Solve Gantt chart numericals for Round Robin and Priority scheduling.',
  },
  {
    id: 'sess_4',
    subject_id: 'sub_dbms',
    topic_id: 'top_dbms_1',
    topic_title: 'ER Model to Relational Mapping',
    subject_name: 'Database Management System',
    subject_code: 'DBMS',
    subject_color: '#dc2626',
    date: '2026-05-02',
    startTime: '14:00',
    endTime: '15:00',
    durationMinutes: 60,
    priority: 'medium',
    status: 'scheduled',
    notes: 'Convert complex ISA hierarchies and multi-valued attributes to relations.',
  },
  {
    id: 'sess_5',
    subject_id: 'sub_ai',
    topic_id: 'top_ai_4',
    topic_title: 'Intelligent Agents Architecture',
    subject_name: 'Artificial Intelligence',
    subject_code: 'AI',
    subject_color: '#9333ea',
    date: '2026-05-02',
    startTime: '15:10',
    endTime: '16:10',
    durationMinutes: 60,
    priority: 'high',
    status: 'scheduled',
    notes: 'Utility-based agents and learning agent loop diagrams.',
  },
];

export const initialRevisions: RevisionItem[] = [
  {
    id: 'rev_1',
    topic_id: 'top_ai_1',
    subject_id: 'sub_ai',
    topic_title: 'AI Perspectives',
    topic_description: 'Historical approaches, symbolic vs sub-symbolic AI, and modern cognitive architectures.',
    subject_name: 'Artificial Intelligence',
    subject_code: 'AI',
    subject_color: '#9333ea',
    revision_stage: 2,
    intervalDays: 3,
    due_date: '2026-05-02',
    status: 'due',
    priority: 'medium',
    lastStudiedDate: '2026-04-29',
  },
  {
    id: 'rev_2',
    topic_id: 'top_os_1',
    subject_id: 'sub_os',
    topic_title: 'CPU Scheduling',
    topic_description: 'FCFS, SJF, Priority scheduling algorithms and context switching overhead.',
    subject_name: 'Operating Systems',
    subject_code: 'OS',
    subject_color: '#16a34a',
    revision_stage: 1,
    intervalDays: 1,
    due_date: '2026-05-02',
    status: 'due',
    priority: 'high',
    lastStudiedDate: '2026-05-01',
  },
  {
    id: 'rev_3',
    topic_id: 'top_dbms_1',
    subject_id: 'sub_dbms',
    topic_title: 'ER Model',
    topic_description: 'Entity-Relationship diagrams, cardinality constraints, and weak entities.',
    subject_name: 'DBMS',
    subject_code: 'DBMS',
    subject_color: '#dc2626',
    revision_stage: 3,
    intervalDays: 7,
    due_date: '2026-05-02',
    status: 'due',
    priority: 'medium',
    lastStudiedDate: '2026-04-25',
  },
  {
    id: 'rev_4',
    topic_id: 'top_cn_2',
    subject_id: 'sub_cn',
    topic_title: 'Subnetting & VLSM Calculation',
    topic_description: 'CIDR notation, subnet masks calculation, and host range allocation.',
    subject_name: 'Computer Networks',
    subject_code: 'CN',
    subject_color: '#d97706',
    revision_stage: 2,
    intervalDays: 3,
    due_date: '2026-05-03',
    status: 'due',
    priority: 'critical',
    lastStudiedDate: '2026-04-30',
  },
  {
    id: 'rev_5',
    topic_id: 'top_toc_2',
    subject_id: 'sub_toc',
    topic_title: 'Pumping Lemma for Regular Languages',
    topic_description: 'Proof technique to demonstrate non-regularity of languages using the pigeonhole principle.',
    subject_name: 'Theory of Computation',
    subject_code: 'TOC',
    subject_color: '#0058be',
    revision_stage: 1,
    intervalDays: 1,
    due_date: '2026-05-03',
    status: 'due',
    priority: 'critical',
    lastStudiedDate: '2026-05-02',
  },
];

export const initialQuestions: Question[] = [
  {
    id: 'q_ai_1',
    subject_id: 'sub_ai',
    unit_id: 'unit_ai_3',
    topic_id: 'top_ai_5',
    subject_name: 'Artificial Intelligence',
    subject_code: 'AI',
    unit_title: 'Unit III',
    topic_title: 'A* Search',
    question: 'Explain the A* Search Algorithm.',
    answer: `A* (A-Star) is an informed search algorithm used extensively in pathfinding and graph traversal. It combines features of uniform-cost search and pure heuristic search to efficiently find the optimal path from a start node to a goal node.

1. Evaluation Function:
f(n) = g(n) + h(n)
where g(n) is the exact cost from start to node n, and h(n) is the heuristic estimated cost from n to goal.

2. Optimality & Admissibility:
- In tree search, A* is optimal if h(n) is admissible (never overestimates the true cost).
- In graph search, A* is optimal if h(n) is consistent/monotonic (h(n) ≤ c(n, a, n') + h(n')).

3. Completeness:
A* is complete provided the branching factor is finite and edge costs are strictly positive (> ε > 0).`,
    hint: 'Think about how A* combines the actual cost g(n) with the estimated cost h(n), and state the condition on h(n) for optimality.',
    keyFormula: 'f(n) = g(n) + h(n)',
    formulaLabel: 'CORE FORMULA',
    formulaBreakdown: [
      { term: 'g(n)', desc: 'Cost from start node to n.' },
      { term: 'h(n)', desc: 'Estimated cost from n to goal.' }
    ],
    marks: 5,
    priority: 'high',
    difficulty: 'hard',
    status: 'practicing',
    attemptsCount: 2,
    lastConfidence: 3,
    tags: ['A*', 'Heuristics', 'Search Algorithms', 'Admissibility'],
    isPreviousExam: true,
  },
  {
    id: 'q_ai_2',
    subject_id: 'sub_ai',
    unit_id: 'unit_ai_3',
    topic_id: 'top_ai_5',
    subject_name: 'Artificial Intelligence',
    subject_code: 'AI',
    unit_title: 'Unit III',
    topic_title: 'Search Heuristics',
    question: 'Differentiate between BFS and DFS.',
    answer: `Breadth-First Search (BFS) explores neighbor nodes level-by-level using a FIFO Queue. It is complete, finds the shallowest goal first (optimal for uniform step costs), but requires O(b^d) exponential memory.

Depth-First Search (DFS) explores as deep as possible along each branch before backtracking using a LIFO Stack / recursion. It has low memory complexity O(b*m), but is not guaranteed to terminate in infinite state spaces and is non-optimal.`,
    marks: 3,
    priority: 'medium',
    difficulty: 'easy',
    status: 'confident',
    attemptsCount: 3,
    lastConfidence: 5,
    tags: ['BFS', 'DFS', 'Uninformed Search'],
  },
  {
    id: 'q_ai_3',
    subject_id: 'sub_ai',
    unit_id: 'unit_ai_3',
    topic_id: 'top_ai_5',
    subject_name: 'Artificial Intelligence',
    subject_code: 'AI',
    unit_title: 'Unit III',
    topic_title: 'Heuristics',
    question: 'What are admissibility and consistency heuristics in A* Search?',
    answer: `An admissible heuristic never overestimates the true remaining cost to the goal (i.e., h(n) ≤ h*(n)).

A consistent (or monotonic) heuristic satisfies the triangle inequality: for every node n and successor n' generated by action a, h(n) ≤ c(n, a, n') + h(n'). Every consistent heuristic is admissible, but the converse is not always true. Consistency guarantees that the f-costs along any path are monotonically non-decreasing.`,
    marks: 7,
    priority: 'high',
    difficulty: 'hard',
    status: 'not_practiced',
    attemptsCount: 0,
    tags: ['Admissibility', 'Consistency', 'Optimality'],
  },
  {
    id: 'q_os_1',
    subject_id: 'sub_os',
    unit_id: 'unit_os_2',
    topic_id: 'top_os_1',
    subject_name: 'Operating Systems',
    subject_code: 'OS',
    unit_title: 'Unit II',
    topic_title: 'CPU Scheduling',
    question: 'Explain the four necessary conditions for Deadlock and how Banker’s algorithm prevents it.',
    answer: `The 4 Coffman conditions for deadlock are:
1. Mutual Exclusion: At least one resource must be held in a non-shareable mode.
2. Hold and Wait: A process must be holding at least one resource and waiting to acquire additional resources.
3. No Preemption: Resources cannot be forcibly preempted from a process.
4. Circular Wait: A closed chain of processes exists where each holds resources requested by the next.

Banker’s algorithm runs safety checks verifying if there is at least one sequence <P1, P2, ... Pn> of process completions that does not cause the system to enter an unsafe state.`,
    marks: 10,
    priority: 'must_know',
    difficulty: 'hard',
    status: 'not_practiced',
    attemptsCount: 0,
    tags: ['Deadlock', 'Banker Algorithm', 'Coffman Conditions'],
    isPreviousExam: true,
  },
  {
    id: 'q_dbms_1',
    subject_id: 'sub_dbms',
    unit_id: 'unit_dbms_2',
    topic_id: 'top_dbms_2',
    subject_name: 'Database Management System',
    subject_code: 'DBMS',
    unit_title: 'Unit II',
    topic_title: 'Normalization',
    question: 'Explain Boyce-Codd Normal Form (BCNF) and compare it with 3NF with a concrete example.',
    answer: `A relation R is in BCNF if for every non-trivial functional dependency X → Y, X is a superkey of R.

Comparison with 3NF:
- 3NF allows X → Y if X is a superkey OR Y is a prime attribute (part of any candidate key).
- BCNF strictly eliminates the prime attribute exception.
- Every BCNF relation is in 3NF, but not every 3NF relation is in BCNF.
- 3NF always guarantees dependency preservation with lossless join, whereas BCNF may sometimes lose dependency preservation.`,
    marks: 5,
    priority: 'must_know',
    difficulty: 'hard',
    status: 'practicing',
    attemptsCount: 1,
    lastConfidence: 2,
    tags: ['Normalization', 'BCNF', '3NF', 'Functional Dependency'],
  },
  {
    id: 'q_toc_1',
    subject_id: 'sub_toc',
    unit_id: 'unit_toc_1',
    topic_id: 'top_toc_2',
    subject_name: 'Theory of Computation',
    subject_code: 'TOC',
    unit_title: 'Unit I',
    topic_title: 'Pumping Lemma',
    question: 'State and prove the Pumping Lemma for Regular Languages. Prove L = {0^n 1^n | n ≥ 0} is not regular.',
    answer: `Pumping Lemma statement: If L is regular, there exists a pumping length p ≥ 1 such that any string w ∈ L with |w| ≥ p can be partitioned as w = xyz satisfying:
1. |xy| ≤ p
2. |y| ≥ 1
3. For all i ≥ 0, xy^i z ∈ L.

Proof for L = {0^n 1^n}:
Assume L is regular with pumping length p. Choose string s = 0^p 1^p ∈ L. Since |s| = 2p ≥ p, by lemma s = xyz where |xy| ≤ p and |y| ≥ 1. Thus y must consist entirely of 0s (y = 0^k, k ≥ 1).
Pumping with i=2 gives xy^2 z = 0^(p+k) 1^p. Since k ≥ 1, the number of 0s is strictly greater than the number of 1s, so xy^2 z ∉ L, a contradiction. Hence L is non-regular.`,
    marks: 10,
    priority: 'must_know',
    difficulty: 'hard',
    status: 'practicing',
    attemptsCount: 2,
    lastConfidence: 2,
    tags: ['Pumping Lemma', 'Regular Languages', 'Proof'],
    isPreviousExam: true,
  },
];

export const initialNotes: Note[] = [
  {
    id: 'note_ai_1',
    subject_id: 'sub_ai',
    unit_id: 'unit_ai_3',
    topic_id: 'top_ai_5',
    subject_name: 'Artificial Intelligence',
    subject_code: 'AI',
    subject_color: '#9333ea',
    unit_title: 'Unit III',
    title: 'A* Search Algorithm',
    content: `# A* Search Algorithm

A* is an informed search algorithm used extensively in pathfinding and graph traversal. It combines features of uniform-cost search and pure heuristic search to efficiently find the optimal path from a start node to a goal node.

> **Core Concept**
> At each iteration of its main loop, A* needs to determine which of its paths to extend. It does so based on the cost of the path and an estimate of the cost required to extend the path all the way to the goal.

## The Evaluation Function

The algorithm selects the node according to the lowest value of the evaluation function, traditionally denoted as \`f(n)\`.

$$f(n) = g(n) + h(n)$$

*Where:*
- **g(n)** is the cost of the path from the start node to node **n**.
- **h(n)** is a heuristic function that estimates the cost of the cheapest path from **n** to the goal.

## Key Properties

- **Completeness:** Yes, if the branching factor is finite and every action has a fixed, positive cost.
- **Optimality:** Yes, provided the heuristic $h(n)$ is admissible (never overestimates the true cost).
- **Time Complexity:** Exponential in the worst case, $O(b^d)$, heavily dependent on the heuristic quality.
- **Space Complexity:** High, as it keeps all generated nodes in memory (open list).`,
    tags: ['A*', 'Search', 'Heuristics', 'Graphs'],
    is_favorite: true,
    priority: 'high',
    updated_at: 'Today, 14:32',
    relatedQuestionIds: ['q_ai_1', 'q_ai_3'],
  },
  {
    id: 'note_os_1',
    subject_id: 'sub_os',
    unit_id: 'unit_os_2',
    topic_id: 'top_os_1',
    subject_name: 'Operating Systems',
    subject_code: 'OS',
    subject_color: '#16a34a',
    unit_title: 'Unit II',
    title: 'OS Process Scheduling',
    content: `# OS Process Scheduling Algorithms

Process scheduling is the activity of the process manager that handles the removal of the running process from the CPU and the selection of another process on the basis of a particular strategy.

## Key Scheduling Metrics

- **Turnaround Time (TAT):** $TAT = Completion\\ Time - Arrival\\ Time$
- **Waiting Time (WT):** $WT = TAT - Burst\\ Time$
- **Response Time:** Time from submission to the very first response produced.

## Common Algorithms

1. **First-Come, First-Served (FCFS):** Non-preemptive, suffers from Convoy Effect.
2. **Shortest Job First (SJF):** Provably optimal for average waiting time; requires knowing burst times.
3. **Round Robin (RR):** Preemptive with time quantum $q$. Great responsiveness for time-sharing systems.`,
    tags: ['Processes', 'Scheduling', 'Gantt Chart'],
    is_favorite: true,
    priority: 'high',
    updated_at: 'Yesterday, 19:15',
  },
  {
    id: 'note_dbms_1',
    subject_id: 'sub_dbms',
    unit_id: 'unit_dbms_1',
    topic_id: 'top_dbms_1',
    subject_name: 'Database Management System',
    subject_code: 'DBMS',
    subject_color: '#dc2626',
    unit_title: 'Unit I',
    title: 'Relational Algebra',
    content: `# Relational Algebra & Calculus

Relational algebra is a procedural query language, which takes instances of relations as input and yields instances of relations as output.

## Fundamental Operations

- **Selection (σ):** Filters rows meeting a condition $\\sigma_{salary > 50000}(Employee)$.
- **Projection (π):** Filters specific columns $\\pi_{name, dept}(Employee)$.
- **Cartesian Product (⨯):** Combines every tuple with every other tuple.
- **Set Union (∪) & Difference (-):** Must be union-compatible schemas.
- **Natural Join (⋈):** Equi-join on all attributes with identical names.`,
    tags: ['Relational Algebra', 'SQL', 'DBMS'],
    is_favorite: true,
    priority: 'medium',
    updated_at: '2 days ago',
  },
];

export const initialResources: Resource[] = [
  {
    id: 'res_1',
    subject_id: 'sub_ai',
    topic_id: 'top_ai_5',
    subject_name: 'Artificial Intelligence',
    subject_code: 'AI',
    title: 'Russell & Norvig - AIMA Chapter 3 (Heuristic Search)',
    type: 'pdf',
    url: 'https://aima.cs.berkeley.edu',
    notes: 'The definitive textbook reference for A* Search optimality and monotonic heuristics.',
    tags: ['AIMA', 'Textbook', 'Search'],
    is_favorite: true,
    added_at: '2 days ago',
    sizeOrDuration: '2.4 MB',
  },
  {
    id: 'res_2',
    subject_id: 'sub_ai',
    topic_id: 'top_ai_5',
    subject_name: 'Artificial Intelligence',
    subject_code: 'AI',
    title: 'MIT 6.034: Search (Lec 2) - Winston',
    type: 'youtube',
    url: 'https://youtube.com',
    notes: 'Exceptional visual lecture detailing branch and bound with heuristics and dynamic programming.',
    tags: ['MIT', 'Lecture', 'Search'],
    is_favorite: true,
    added_at: 'Today',
    sizeOrDuration: '45 mins',
  },
  {
    id: 'res_3',
    subject_id: 'sub_toc',
    topic_id: 'top_toc_1',
    subject_name: 'Theory of Computation',
    subject_code: 'TOC',
    title: 'Sipser - Introduction to the Theory of Computation (Ch 1)',
    type: 'document',
    url: 'https://mit.edu/sipser',
    notes: 'Complete definitions for DFA, NFA, regular expressions, and pumping lemma proofs.',
    tags: ['Automata', 'Sipser', 'Theory'],
    is_favorite: true,
    added_at: '3 days ago',
    sizeOrDuration: '1.8 MB',
  },
  {
    id: 'res_4',
    subject_id: 'sub_os',
    topic_id: 'top_os_1',
    subject_name: 'Operating Systems',
    subject_code: 'OS',
    title: 'OSTEP: Three Easy Pieces - Virtualization & Scheduling',
    type: 'website',
    url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/',
    notes: 'Free online book chapters on CPU virtualization, MLFQ, and memory paging.',
    tags: ['OSTEP', 'Scheduling', 'Free'],
    is_favorite: false,
    added_at: '1 week ago',
    sizeOrDuration: 'Web Guide',
  },
];

export const initialExamFleet: ExamFleetItem[] = [
  {
    id: 'exam_toc',
    subject_id: 'sub_toc',
    subject_name: 'Theory of Computation',
    subject_code: 'TOC',
    course_code: 'CS401',
    title: 'CS401 • Final Examination',
    exam_date: '2026-05-31',
    daysRemaining: 29,
    total_marks: 100,
    target_score: 90,
    readinessScore: 72,
    syllabusCompletion: 72,
    revisionCompletion: 54,
    practiceCompletion: 61,
    consistencyScore: 80,
    isPrimary: true,
  },
  {
    id: 'exam_cn',
    subject_id: 'sub_cn',
    subject_name: 'Computer Networks',
    subject_code: 'CN',
    course_code: 'CS403',
    title: 'CS403 • Network Protocols Exam',
    exam_date: '2026-06-12',
    daysRemaining: 34,
    total_marks: 100,
    target_score: 85,
    readinessScore: 58,
    syllabusCompletion: 65,
    revisionCompletion: 48,
    practiceCompletion: 52,
    consistencyScore: 75,
  },
  {
    id: 'exam_os',
    subject_id: 'sub_os',
    subject_name: 'Operating Systems',
    subject_code: 'OS',
    course_code: 'CS402',
    title: 'CS402 • Operating Systems Finals',
    exam_date: '2026-06-20',
    daysRemaining: 41,
    total_marks: 100,
    target_score: 92,
    readinessScore: 79,
    syllabusCompletion: 88,
    revisionCompletion: 70,
    practiceCompletion: 82,
    consistencyScore: 88,
  },
  {
    id: 'exam_dbms',
    subject_id: 'sub_dbms',
    subject_name: 'Database Management System',
    subject_code: 'DBMS',
    course_code: 'CS404',
    title: 'CS404 • Database Engineering Exam',
    exam_date: '2026-07-05',
    daysRemaining: 45,
    total_marks: 100,
    target_score: 88,
    readinessScore: 48,
    syllabusCompletion: 41,
    revisionCompletion: 35,
    practiceCompletion: 42,
    consistencyScore: 65,
  },
  {
    id: 'exam_ai',
    subject_id: 'sub_ai',
    subject_name: 'Artificial Intelligence',
    subject_code: 'AI',
    course_code: 'CS405',
    title: 'CS405 • AI & Cognitive Systems',
    exam_date: '2026-07-18',
    daysRemaining: 52,
    total_marks: 100,
    target_score: 95,
    readinessScore: 54,
    syllabusCompletion: 54,
    revisionCompletion: 45,
    practiceCompletion: 50,
    consistencyScore: 70,
  },
];

// Initial Tasks
export const initialTasks: import('../types').TaskItem[] = [
  {
    id: 'task_1',
    title: 'Complete DFA minimization proof for Unit 1',
    description: 'Work through table-filling method and Myhill-Nerode equivalence theorem exercise.',
    status: 'in_progress',
    priority: 'urgent',
    dueDate: '2026-05-24',
    subject_id: 'sub_toc',
    subject_code: 'TOC',
    tags: ['Proof', 'Unit1', 'ExamPrep'],
    created_at: '2026-05-20',
    estimatedMinutes: 60,
  },
  {
    id: 'task_2',
    title: 'Solve Bankers Algorithm 5-process deadlock problems',
    description: 'Calculate Safety sequence and resource-request algorithm test with 3 resource types.',
    status: 'todo',
    priority: 'high',
    dueDate: '2026-05-25',
    subject_id: 'sub_os',
    subject_code: 'OS',
    tags: ['Deadlock', 'Bankers', 'Calculations'],
    created_at: '2026-05-21',
    estimatedMinutes: 45,
  },
  {
    id: 'task_3',
    title: 'Review TCP Reno Congestion Control window phases',
    description: 'Slow Start, Congestion Avoidance, Fast Retransmit, and Fast Recovery state diagrams.',
    status: 'todo',
    priority: 'medium',
    dueDate: '2026-05-27',
    subject_id: 'sub_cn',
    subject_code: 'CN',
    tags: ['TCP', 'Congestion', 'TransportLayer'],
    created_at: '2026-05-22',
    estimatedMinutes: 30,
  },
  {
    id: 'task_4',
    title: 'Derive BCNF decomposition on functional dependencies',
    description: 'Decompose relation R(A,B,C,D,E) with given FDs and verify lossless-join property.',
    status: 'completed',
    priority: 'high',
    dueDate: '2026-05-22',
    subject_id: 'sub_dbms',
    subject_code: 'DBMS',
    tags: ['Normalization', 'BCNF', 'Database'],
    created_at: '2026-05-19',
    completed_at: '2026-05-22',
    estimatedMinutes: 40,
  }
];

// Initial Workspace Documents
export const initialDocuments: import('../types').WorkspaceDocument[] = [
  {
    id: 'doc_1',
    title: 'Theory of Computation Comprehensive Compendium',
    content: `# Theory of Computation: Formal Languages & Automata

## 1. Regular Languages and Finite State Automata

A Deterministic Finite Automaton (DFA) is formally defined as a 5-tuple:
$$M = (Q, \\Sigma, \\delta, q_0, F)$$

Where:
- $Q$: Finite set of states
- $\\Sigma$: Alphabet (finite input symbols)
- $\\delta$: Transition function $Q \\times \\Sigma \\rightarrow Q$
- $q_0 \\in Q$: Initial start state
- $F \\subseteq Q$: Set of accept states

### The Pumping Lemma for Regular Languages
If $L$ is regular, there exists pumping length $p \\ge 1$ such that any string $s \\in L$ with $|s| \\ge p$ can be partitioned into $s = xyz$ satisfying:
1. $|y| > 0$
2. $|xy| \\le p$
3. $\\forall i \\ge 0, xy^i z \\in L$

## 2. Decidability and The Halting Problem
Alan Turing proved in 1936 that the language $A_{TM} = \\{\\langle M, w \\rangle \\mid M \\text{ is a TM that accepts } w\\}$ is undecidable using Cantor's diagonalization technique.`,
    tags: ['TOC', 'Automata', 'Cheatsheet', 'Formulas'],
    subject_id: 'sub_toc',
    subject_name: 'Theory of Computation',
    subject_code: 'TOC',
    updated_at: 'Just now',
    created_at: '2026-05-10',
    is_favorite: true,
    wordCount: 184,
    version: 3,
    status: 'published',
  },
  {
    id: 'doc_2',
    title: 'Operating Systems Concurrency & Memory Architecture',
    content: `# Operating Systems: Concurrency, Virtual Memory, and I/O

## 1. Process Synchronization & Critical Section Problem
Any valid solution to the critical section problem must satisfy three core conditions:
1. **Mutual Exclusion**: If process $P_i$ is executing in its critical section, no other process can execute in their critical sections.
2. **Progress**: If no process is in its critical section and some wish to enter, only processes not in their remainder sections can participate in deciding who enters next.
3. **Bounded Waiting**: There exists a bound on the number of times other processes are allowed to enter after a process has made a request.

### Peterson's Algorithm (Two Process Solution)
\`\`\`c
int turn;
bool flag[2];

// Process i
do {
    flag[i] = true;
    turn = j;
    while (flag[j] && turn == j); // busy wait
    
    // Critical Section
    
    flag[i] = false;
    // Remainder Section
} while (true);
\`\`\`

## 2. Paging and Effective Access Time (EAT)
Given TLB hit ratio $\\alpha$, TLB access time $\\epsilon$, and memory access time $m$:
$$EAT = (m + \\epsilon)\\alpha + (2m + \\epsilon)(1 - \\alpha)$$`,
    tags: ['OS', 'Concurrency', 'VirtualMemory', 'Formulas'],
    subject_id: 'sub_os',
    subject_name: 'Operating Systems',
    subject_code: 'OS',
    updated_at: 'Yesterday',
    created_at: '2026-05-12',
    is_favorite: true,
    wordCount: 220,
    version: 2,
    status: 'published',
  },
  {
    id: 'doc_3',
    title: 'Distributed Systems & Vector Clocks Research Notes',
    content: `# Distributed Consensus and Logical Time

## Lamport Timestamps vs Vector Clocks
Lamport logical clocks provide a partial order: $a \\rightarrow b \\implies L(a) < L(b)$, but the converse does not hold.
Vector clocks solve this by maintaining a vector of size $N$ across $N$ processes:
$$V(a) < V(b) \\iff \\forall k, V_a[k] \\le V_b[k] \\land \\exists k, V_a[k] < V_b[k]$$

## Raft Consensus Protocol
- **Leader Election**: Randomized election timers prevent split votes.
- **Log Replication**: Log matching property guarantees consistency.
- **Safety**: An elected leader contains all committed entries.`,
    tags: ['Distributed', 'Consensus', 'Raft'],
    subject_id: 'sub_cn',
    subject_name: 'Computer Networks',
    subject_code: 'CN',
    updated_at: '3 days ago',
    created_at: '2026-05-14',
    is_favorite: false,
    wordCount: 130,
    version: 1,
    status: 'draft',
  }
];

// Initial Library Folders
export const initialFolders: import('../types').LibraryFolder[] = [
  { id: 'fld_1', name: 'Exam Cheat Sheets', description: 'Quick revision formulas and summary charts', color: '#0058be', itemCount: 6, updated_at: '2026-05-20' },
  { id: 'fld_2', name: 'Past University Question Papers', description: 'Past 5 years solved TU / IOE question sets', color: '#dc2626', itemCount: 12, updated_at: '2026-05-18' },
  { id: 'fld_3', name: 'Lecture Slides & Handouts', description: 'Official professor slides and laboratory manuals', color: '#16a34a', itemCount: 8, updated_at: '2026-05-15' },
  { id: 'fld_4', name: 'Research Papers & Preprints', description: 'Seminal papers in computability and systems', color: '#9333ea', itemCount: 5, updated_at: '2026-05-19' },
];

// Initial Research Projects
export const initialResearchProjects: import('../types').ResearchProject[] = [
  {
    id: 'proj_1',
    title: 'Formal Verification of Distributed Concurrency Protocols',
    description: 'Investigating state-space explosion reduction in model checking distributed Raft and Paxos implementations.',
    status: 'active',
    tags: ['FormalMethods', 'DistributedSystems', 'Verification'],
    subject_id: 'sub_os',
    subject_code: 'OS',
    paperIds: ['paper_1', 'paper_3'],
    noteIds: ['note_1'],
    documentIds: ['doc_3'],
    leadAuthor: 'Student Researcher',
    startDate: '2026-04-01',
    dueDate: '2026-08-30',
    progressPercent: 65,
    updated_at: '2026-05-21',
  },
  {
    id: 'proj_2',
    title: 'Semantic Vector Retrieval in Academic Knowledge Graphs',
    description: 'Benchmarking dense embedding representations with Gemini embeddings for automated syllabus node discovery.',
    status: 'in_progress',
    tags: ['AI', 'VectorDB', 'InformationRetrieval'],
    subject_id: 'sub_ai',
    subject_code: 'AI',
    paperIds: ['paper_2'],
    noteIds: ['note_2'],
    documentIds: ['doc_1'],
    leadAuthor: 'Student Researcher',
    startDate: '2026-04-15',
    dueDate: '2026-09-15',
    progressPercent: 40,
    updated_at: '2026-05-22',
  }
];

// Initial Research Papers
export const initialResearchPapers: import('../types').ResearchPaper[] = [
  {
    id: 'paper_1',
    title: 'In Search of an Understandable Consensus Algorithm (Raft)',
    authors: ['Diego Ongaro', 'John Ousterhout'],
    publicationOrVenue: 'USENIX Annual Technical Conference (ATC)',
    year: 2014,
    abstract: 'Raft is a consensus algorithm for managing a replicated log. It produces a result equivalent to (multi-)Paxos, and it is as efficient as Paxos, but its structure is different: Raft separates consensus into leader election, log replication, and safety.',
    url: 'https://raft.github.io/raft.pdf',
    citationsCount: 4200,
    tags: ['Consensus', 'FaultTolerance', 'DistributedSystems'],
    notes: 'Key sections: Figure 2 is the definitive reference for Raft state machine and RPC arguments.',
    projectId: 'proj_1',
    subject_code: 'CN',
    added_at: '2026-05-15',
    isRead: true,
    doi: '10.5555/2643634.2643666',
  },
  {
    id: 'paper_2',
    title: 'Attention Is All You Need',
    authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit', 'Llion Jones', 'Aidan N. Gomez', 'Lukasz Kaiser', 'Illia Polosukhin'],
    publicationOrVenue: 'Advances in Neural Information Processing Systems (NeurIPS)',
    year: 2017,
    abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks. We propose the Transformer, a model architecture eschewing recurrence and relying entirely on an attention mechanism to draw global dependencies between input and output.',
    url: 'https://arxiv.org/abs/1706.03762',
    citationsCount: 98000,
    tags: ['DeepLearning', 'Transformers', 'NLP'],
    notes: 'Self-attention formula: Softmax(QK^T / sqrt(d_k))V. Foundational for dense embedding spaces.',
    projectId: 'proj_2',
    subject_code: 'AI',
    added_at: '2026-05-18',
    isRead: true,
    doi: '10.48550/arXiv.1706.03762',
  },
  {
    id: 'paper_3',
    title: 'Time, Clocks, and the Ordering of Events in a Distributed System',
    authors: ['Leslie Lamport'],
    publicationOrVenue: 'Communications of the ACM (CACM)',
    year: 1978,
    abstract: 'The concept of one event happening before another in a distributed system is examined, and is shown to define a partial ordering of the events. A distributed algorithm is given for synchronizing a system of logical clocks which can be used to totally order the events.',
    url: 'https://lamport.azurewebsites.net/pubs/time-clocks.pdf',
    citationsCount: 15400,
    tags: ['LogicalClocks', 'Ordering', 'LamportTimestamps'],
    notes: 'Turing Award winning paper defining the happens-before relationship.',
    projectId: 'proj_1',
    subject_code: 'OS',
    added_at: '2026-05-12',
    isRead: false,
    doi: '10.1145/359545.359563',
  }
];

// Initial Citations
export const initialCitations: import('../types').CitationItem[] = [
  {
    id: 'cite_1',
    paperId: 'paper_1',
    citeKey: 'ongaro2014raft',
    title: 'In Search of an Understandable Consensus Algorithm',
    authors: 'Ongaro, Diego and Ousterhout, John',
    venue: 'USENIX Annual Technical Conference (ATC)',
    year: 2014,
    bibtex: `@inproceedings{ongaro2014raft,
  title={In search of an understandable consensus algorithm},
  author={Ongaro, Diego and Ousterhout, John},
  booktitle={2014 USENIX Annual Technical Conference (USENIX ATC 14)},
  pages={305--319},
  year={2014}
}`,
  },
  {
    id: 'cite_2',
    paperId: 'paper_2',
    citeKey: 'vaswani2017attention',
    title: 'Attention Is All You Need',
    authors: 'Vaswani, Ashish and Shazeer, Noam and Parmar, Niki and others',
    venue: 'NeurIPS',
    year: 2017,
    bibtex: `@article{vaswani2017attention,
  title={Attention is all you need},
  author={Vaswani, Ashish and Shazeer, Noam and Parmar, Niki and Uszkoreit, Jakob and Jones, Llion and Gomez, Aidan N and Kaiser, {\\L}ukasz and Polosukhin, Illia},
  journal={Advances in neural information processing systems},
  volume={30},
  year={2017}
}`,
  },
  {
    id: 'cite_3',
    paperId: 'paper_3',
    citeKey: 'lamport1978time',
    title: 'Time, Clocks, and the Ordering of Events in a Distributed System',
    authors: 'Lamport, Leslie',
    venue: 'Communications of the ACM',
    year: 1978,
    bibtex: `@article{lamport1978time,
  title={Time, clocks, and the ordering of events in a distributed system},
  author={Lamport, Leslie},
  journal={Communications of the ACM},
  volume={21},
  number={7},
  pages={558--565},
  year={1978},
  publisher={ACM New York, NY, USA}
}`,
  }
];

// Initial Knowledge Concepts
export const initialConcepts: import('../types').KnowledgeConcept[] = [
  {
    id: 'cpt_1',
    name: 'Turing Completeness',
    summary: 'The capability of a system of computation rules to simulate any Turing machine.',
    definition: 'A computational model is Turing complete if it can compute every Turing-computable function, equivalent to General Recursive Functions and Lambda Calculus (Church-Turing Thesis).',
    category: 'Theoretical Computer Science',
    subject_id: 'sub_toc',
    subject_code: 'TOC',
    relatedConceptIds: ['cpt_2', 'cpt_5'],
    relatedNoteIds: ['note_1'],
    relatedTopicIds: ['top_toc_12', 'top_toc_14'],
    confidenceLevel: 5,
    lastReviewed: '2026-05-20',
    formula: 'M = (Q, \\Sigma, \\Gamma, \\delta, q_0, q_{accept}, q_{reject})',
  },
  {
    id: 'cpt_2',
    name: 'Pumping Lemma for Regular Languages',
    summary: 'A property possessed by all regular languages used to prove non-regularity by contradiction.',
    definition: 'For any regular language L, strings of length at least p can be divided into xyz where y can be pumped any number of times without leaving L.',
    category: 'Formal Languages & Automata',
    subject_id: 'sub_toc',
    subject_code: 'TOC',
    relatedConceptIds: ['cpt_1'],
    relatedNoteIds: ['note_1'],
    relatedTopicIds: ['top_toc_3'],
    confidenceLevel: 4,
    lastReviewed: '2026-05-21',
    formula: '\\forall i \\ge 0, xy^i z \\in L \\land |y| > 0 \\land |xy| \\le p',
  },
  {
    id: 'cpt_3',
    name: 'Deadlock & Coffman Conditions',
    summary: 'Four simultaneous conditions that permit a state of deadlock in concurrent computing.',
    definition: 'Deadlock arises iff Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait occur simultaneously among processes competing for finite non-shareable resources.',
    category: 'Operating Systems & Concurrency',
    subject_id: 'sub_os',
    subject_code: 'OS',
    relatedConceptIds: ['cpt_4'],
    relatedNoteIds: ['note_2'],
    relatedTopicIds: ['top_os_6'],
    confidenceLevel: 4,
    lastReviewed: '2026-05-19',
    formula: 'Need[i, j] = Max[i, j] - Allocation[i, j]',
  },
  {
    id: 'cpt_4',
    name: 'Virtual Memory & Demand Paging',
    summary: 'Separation of user logical memory from physical memory using secondary disk storage.',
    definition: 'Pages are loaded into physical frames only when referenced during execution; a page fault trap triggers the OS kernel to load missing pages via backing store swap.',
    category: 'Operating Systems & Memory',
    subject_id: 'sub_os',
    subject_code: 'OS',
    relatedConceptIds: ['cpt_3'],
    relatedNoteIds: ['note_2'],
    relatedTopicIds: ['top_os_8'],
    confidenceLevel: 3,
    lastReviewed: '2026-05-18',
    formula: 'EAT = (1 - p) \\times m + p \\times (\\text{Page Fault Overhead})',
  },
  {
    id: 'cpt_5',
    name: 'A* Search & Admissibility',
    summary: 'Heuristic graph traversal algorithm that finds shortest paths with optimal efficiency.',
    definition: 'A* evaluates nodes using f(n) = g(n) + h(n). If heuristic h(n) is admissible (never overestimates cost to goal) and consistent, A* is guaranteed optimal.',
    category: 'Artificial Intelligence & Search',
    subject_id: 'sub_ai',
    subject_code: 'AI',
    relatedConceptIds: ['cpt_1'],
    relatedNoteIds: [],
    relatedTopicIds: ['top_ai_3'],
    confidenceLevel: 5,
    lastReviewed: '2026-05-22',
    formula: 'f(n) = g(n) + h(n), \\quad h(n) \\le h^*(n)',
  }
];

// Initial Knowledge Relationships
export const initialRelationships: import('../types').KnowledgeRelationship[] = [
  {
    id: 'rel_1',
    sourceConceptId: 'cpt_2',
    targetConceptId: 'cpt_1',
    sourceName: 'Pumping Lemma',
    targetName: 'Turing Completeness',
    relationshipType: 'prerequisite',
    strength: 0.85,
    notes: 'Regular languages form the innermost layer of Chomsky Hierarchy leading to Turing machines.',
    isAutoGenerated: false,
  },
  {
    id: 'rel_2',
    sourceConceptId: 'cpt_3',
    targetConceptId: 'cpt_4',
    sourceName: 'Deadlock & Coffman Conditions',
    targetName: 'Virtual Memory & Demand Paging',
    relationshipType: 'component_of',
    strength: 0.78,
    notes: 'Memory allocation locks and page frame locking can lead to system-wide deadlock.',
    isAutoGenerated: false,
  },
  {
    id: 'rel_3',
    sourceConceptId: 'cpt_5',
    targetConceptId: 'cpt_1',
    sourceName: 'A* Search',
    targetName: 'Turing Completeness',
    relationshipType: 'derives_from',
    strength: 0.72,
    notes: 'State space search algorithms run on discrete Turing-equivalent transition graphs.',
    isAutoGenerated: true,
  }
];

