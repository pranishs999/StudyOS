import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Share2, ArrowLeft, ZoomIn, ZoomOut, RotateCcw, Info, Sparkles, Filter } from 'lucide-react';
import { useRouter } from '../../router/RouterContext';
import { useStudy } from '../../context/StudyContext';
import { KnowledgeConcept } from '../../types';

export const KnowledgeGraphView: React.FC = () => {
  const { navigate } = useRouter();
  const { concepts, conceptRelations, subjects } = useStudy();

  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedConcept, setSelectedConcept] = useState<KnowledgeConcept | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  // Position nodes in an organic circular/clustered layout based on subject
  const nodePositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number; color: string }> = {};
    const subjectColors: Record<string, string> = {
      sub_1: '#3b82f6', // blue
      sub_2: '#8b5cf6', // purple
      sub_3: '#10b981', // green
      sub_4: '#f59e0b', // amber
    };

    const radius = 220;
    const centerX = 400;
    const centerY = 300;

    concepts.forEach((concept, index) => {
      const angle = (index / Math.max(concepts.length, 1)) * 2 * Math.PI;
      // Add slight jitter for natural topology
      const dist = radius + (index % 2 === 0 ? 30 : -20);
      positions[concept.id] = {
        x: centerX + dist * Math.cos(angle),
        y: centerY + dist * Math.sin(angle),
        color: subjectColors[concept.subject_id] || '#6366f1',
      };
    });

    return positions;
  }, [concepts]);

  const filteredConcepts = useMemo(() => {
    if (selectedSubject === 'all') return concepts;
    return concepts.filter(c => c.subject_id === selectedSubject);
  }, [concepts, selectedSubject]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'circle' || (e.target as HTMLElement).tagName === 'text') return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/knowledge')}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Back to Knowledge Hub"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-indigo-600" />
              <span>Interactive Knowledge Graph</span>
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Interactive 2D topological mapping of prerequisite dependencies and mathematical isomorphisms.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Disciplines</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
            ))}
          </select>

          <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setZoom(z => Math.min(z + 0.2, 2.5))}
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))}
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }}
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas + Detail Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* SVG Graph Canvas (8 cols) */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 h-[600px] relative overflow-hidden cursor-grab active:cursor-grabbing shadow-inner select-none"
        >
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

          <svg
            className="w-full h-full"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
            }}
          >
            {/* Edge Connections */}
            <g className="edges">
              {conceptRelations.map(rel => {
                const sourcePos = nodePositions[rel.source_id];
                const targetPos = nodePositions[rel.target_id];
                if (!sourcePos || !targetPos) return null;

                const isHighlighted =
                  selectedConcept &&
                  (selectedConcept.id === rel.source_id || selectedConcept.id === rel.target_id);

                return (
                  <g key={rel.id}>
                    <line
                      x1={sourcePos.x}
                      y1={sourcePos.y}
                      x2={targetPos.x}
                      y2={targetPos.y}
                      stroke={isHighlighted ? '#818cf8' : '#334155'}
                      strokeWidth={isHighlighted ? 2.5 : 1.2}
                      strokeDasharray={rel.relation_type === 'analogy' ? '4 4' : undefined}
                      opacity={isHighlighted ? 1 : 0.6}
                    />
                  </g>
                );
              })}
            </g>

            {/* Nodes */}
            <g className="nodes">
              {filteredConcepts.map(concept => {
                const pos = nodePositions[concept.id];
                if (!pos) return null;
                const isSelected = selectedConcept?.id === concept.id;

                return (
                  <g
                    key={concept.id}
                    className="cursor-pointer group"
                    onClick={() => setSelectedConcept(concept)}
                  >
                    {/* Outer Glow */}
                    {isSelected && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={28}
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="3"
                        className="animate-pulse"
                      />
                    )}

                    {/* Node Core */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isSelected ? 20 : 16}
                      fill={pos.color}
                      className="transition-all hover:scale-110"
                    />

                    {/* Node Label */}
                    <text
                      x={pos.x}
                      y={pos.y + 30}
                      textAnchor="middle"
                      fill="#e2e8f0"
                      fontSize="11"
                      fontWeight="bold"
                      className="pointer-events-none drop-shadow"
                    >
                      {concept.name}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Graph Legend */}
          <div className="absolute bottom-4 left-4 p-3 rounded-xl bg-slate-900/80 backdrop-blur-xs border border-slate-800 text-[10px] text-slate-400 space-y-1">
            <div className="font-bold text-slate-300 mb-1">Legend</div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Theory of Computation</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span>Operating Systems</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Linear Algebra</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Deep Learning</span>
            </div>
          </div>
        </div>

        {/* Selected Concept Info Panel (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          {selectedConcept ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                    {selectedConcept.subject_code}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    {selectedConcept.name}
                  </h3>
                </div>
                <span className="text-xs font-bold text-slate-500 capitalize">
                  {selectedConcept.complexity}
                </span>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Concept Definition
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedConcept.summary}
                </p>
              </div>

              {selectedConcept.keyTheorems && selectedConcept.keyTheorems.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Core Theorems & Principles
                  </h4>
                  <ul className="space-y-1">
                    {selectedConcept.keyTheorems.map((th, i) => (
                      <li key={i} className="text-xs text-indigo-600 dark:text-indigo-400 font-mono bg-indigo-50/60 dark:bg-indigo-950/40 p-2 rounded-lg">
                        • {th}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  <span>Student Mastery Level</span>
                  <span>{selectedConcept.masteryLevel}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${selectedConcept.masteryLevel}%` }}
                  />
                </div>
              </div>

              <div className="pt-2">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Linked Relations
                </h4>
                <div className="space-y-1.5">
                  {conceptRelations
                    .filter(r => r.source_id === selectedConcept.id || r.target_id === selectedConcept.id)
                    .map(rel => {
                      const otherId = rel.source_id === selectedConcept.id ? rel.target_id : rel.source_id;
                      const otherConcept = concepts.find(c => c.id === otherId);
                      return (
                        <div
                          key={rel.id}
                          className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300 flex items-center justify-between"
                        >
                          <span className="font-semibold">{otherConcept?.name || otherId}</span>
                          <span className="text-[10px] font-bold text-purple-600 capitalize">
                            {rel.relation_type}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400">
              <Share2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Click Any Node</h4>
              <p className="text-[11px] text-slate-400 mt-1">Select a concept on the graph to inspect formulas, theorems, and prerequisites.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
