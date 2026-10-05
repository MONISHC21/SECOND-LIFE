import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProjectStore } from '../store/useProjectStore.ts';
import { MatchBadge } from '../components/common/MatchBadge.tsx';
import { CircuitSchematicModal } from '../components/projects/CircuitSchematicModal.tsx';
import { Project } from '../types/index.ts';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Leaf,
  ArrowRight,
  Filter,
  SlidersHorizontal,
  Zap,
  HelpCircle,
} from 'lucide-react';

export const RecommendationsPage: React.FC = () => {
  const { recommendations, recommendationSummary, fetchRecommendations, isLoading } =
    useProjectStore();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortOption, setSortOption] = useState<string>('HIGHEST_MATCH');
  const [selectedProjectForModal, setSelectedProjectForModal] = useState<Project | null>(null);

  useEffect(() => {
    fetchRecommendations({
      status: statusFilter,
      sort: sortOption,
    });
  }, [fetchRecommendations, statusFilter, sortOption]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-teal-400 mb-1">
            Matching Engine Results
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Projects You Can Build
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Ranked by feasibility score based on your active physical inventory.
          </p>
        </div>

        {/* High-level status counters */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{recommendationSummary.readyToBuildCount} Ready to Build</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-teal-950/40 border border-teal-800/60 text-teal-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            <span>{recommendationSummary.nearMatchCount} Near Matches</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Filter Tabs & Sorting */}
      <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Status Filter Tabs (Segmented Controls) */}
        <div className="flex items-center gap-1 p-1 bg-slate-950/80 border border-slate-800 rounded-lg w-full md:w-auto overflow-x-auto">
          {[
            { id: 'ALL', label: 'All Projects' },
            { id: 'READY_TO_BUILD', label: 'Ready to Build (100%)' },
            { id: 'NEAR_MATCH', label: 'Near Match (75-99%)' },
            { id: 'PARTIAL_MATCH', label: 'Partial (50-74%)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                statusFilter === tab.id
                  ? 'bg-slate-800 text-teal-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-400 shrink-0 font-medium">Sort By:</span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-slate-950/80 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-teal-400 font-sans w-full md:w-auto"
          >
            <option value="HIGHEST_MATCH">Highest Compatibility %</option>
            <option value="FEWEST_MISSING">Fewest Missing Parts</option>
            <option value="TIME_SHORTEST">Shortest Build Time</option>
            <option value="WASTE_HIGHEST">Maximum E-Waste Saved</option>
          </select>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="space-y-4">
        {recommendations.map((rec) => {
          const isReady = rec.status === 'READY_TO_BUILD';
          const project = rec.project;

          return (
            <div
              key={project.id}
              className={`p-5 rounded-xl border transition-all ${
                isReady
                  ? 'bg-gradient-to-r from-emerald-950/15 via-slate-900/80 to-slate-900/60 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                {/* Project Info & Description */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-slate-300 font-medium">{project.category}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{project.estimatedTimeHours} hours</span>
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400">{project.difficulty} Difficulty</span>
                  </div>

                  <h3 className="text-base font-semibold text-white tracking-tight">
                    {project.name}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                    {project.description}
                  </p>
                </div>

                {/* Compatibility Score & Status Badge */}
                <div className="flex flex-col sm:items-end justify-between shrink-0 space-y-2">
                  <MatchBadge
                    status={rec.status}
                    percentage={rec.compatibilityPercentage}
                    size="lg"
                  />

                  {/* Compatibility Progress Bar */}
                  <div className="w-36 bg-slate-950 border border-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isReady ? 'bg-emerald-400' : 'bg-teal-400'
                      }`}
                      style={{ width: `${rec.compatibilityPercentage}%` }}
                    />
                  </div>

                  <span className="text-[11px] font-mono text-slate-500">
                    {rec.fulfilledRequiredCount} / {rec.totalRequiredCount} parts available
                  </span>
                </div>
              </div>

              {/* Component Availability Matrix */}
              <div className="mt-4 pt-4 border-t border-slate-800/80 grid md:grid-cols-2 gap-3 text-xs">
                {/* Available parts list */}
                <div className="p-3 bg-slate-950/60 border border-slate-800/60 rounded-lg space-y-1.5">
                  <div className="font-semibold text-emerald-400 text-[11px] uppercase tracking-wider flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>In Your Inventory ({rec.availableComponents.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {rec.availableComponents.map((c) => (
                      <span
                        key={c.componentId}
                        className="text-[11px] px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/50 text-emerald-200 font-mono"
                      >
                        ✓ {c.componentName} ({c.requiredQuantity}x)
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing parts list */}
                <div className="p-3 bg-slate-950/60 border border-slate-800/60 rounded-lg space-y-1.5">
                  <div className="font-semibold text-amber-400 text-[11px] uppercase tracking-wider flex items-center gap-1 font-mono">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Missing Components ({rec.missingComponents.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {rec.missingComponents.length === 0 ? (
                      <span className="text-[11px] text-emerald-300 italic">
                        No missing parts — complete BOM satisfied!
                      </span>
                    ) : (
                      rec.missingComponents.map((m) => (
                        <span
                          key={m.componentId}
                          className="text-[11px] px-2 py-0.5 rounded bg-amber-950/40 border border-amber-800/50 text-amber-200 font-mono"
                        >
                          ○ {m.componentName} (needs +{m.missingQuantity}x)
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Leaf className="w-3.5 h-3.5" />
                    <span>{project.estimatedWasteSavedGrams}g E-Waste Prevented</span>
                  </span>
                  <span>·</span>
                  <span>{project.estimatedCO2ReductionGrams}g CO₂ Avoided</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedProjectForModal(project)}
                    className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors text-xs font-medium flex items-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5 text-teal-400" />
                    <span>Quick Schematic</span>
                  </button>

                  <Link
                    to={`/projects/${project.id}`}
                    className={`px-4 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-colors ${
                      isReady
                        ? 'bg-teal-400 hover:bg-teal-300 text-[#0B1220] shadow-sm shadow-teal-500/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                  >
                    <span>{isReady ? 'Start Build Now' : 'Inspect Missing Parts'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {recommendations.length === 0 && (
          <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-xl space-y-3">
            <Sparkles className="w-8 h-8 text-slate-500 mx-auto" />
            <h3 className="text-sm font-semibold text-white">No Matching Projects Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your filter criteria or register more electronic parts in your inventory.
            </p>
          </div>
        )}
      </div>

      {/* Schematic Viewer Modal */}
      <CircuitSchematicModal
        project={selectedProjectForModal}
        isOpen={Boolean(selectedProjectForModal)}
        onClose={() => setSelectedProjectForModal(null)}
      />
    </div>
  );
};
