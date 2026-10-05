import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useProjectStore } from '../store/useProjectStore.ts';
import { useAuthStore } from '../store/useAuthStore.ts';
import { useUIStore } from '../store/useUIStore.ts';
import { MatchBadge } from '../components/common/MatchBadge.tsx';
import { CircuitSchematicModal } from '../components/projects/CircuitSchematicModal.tsx';
import {
  Clock,
  Leaf,
  CheckCircle2,
  AlertCircle,
  Zap,
  Hammer,
  ArrowLeft,
  Heart,
  Award,
  Layers,
  Sparkles,
} from 'lucide-react';

export const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedProject, selectedProjectMatch, fetchProjectById, toggleFavorite, markCompleted, isLoading } =
    useProjectStore();
  const { isAuthenticated } = useAuthStore();
  const { showToast, openAddComponentModal } = useUIStore();

  const [schematicModalOpen, setSchematicModalOpen] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [completedSuccess, setCompletedSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProjectById(id);
    }
  }, [id, fetchProjectById]);

  if (isLoading || !selectedProject) {
    return (
      <div className="py-20 text-center text-xs text-slate-400">
        Loading project blueprint...
      </div>
    );
  }

  const match = selectedProjectMatch;
  const isReady = match?.isReadyToBuild;

  const handleMarkBuilt = async () => {
    setIsCompleting(true);
    const ok = await markCompleted(selectedProject.id);
    if (ok) {
      setCompletedSuccess(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      showToast({
        type: 'success',
        title: 'Project Build Logged!',
        message: `Diverted ${selectedProject.estimatedWasteSavedGrams}g of e-waste and reduced ${selectedProject.estimatedCO2ReductionGrams}g of CO₂!`,
      });
    }
    setIsCompleting(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          to="/recommendations"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Matching Engine</span>
        </Link>
      </div>

      {/* Hero Header */}
      <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-teal-400 mb-1">
              <span>{selectedProject.category}</span>
              <span>·</span>
              <span>{selectedProject.difficulty} Level</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {selectedProject.name}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(selectedProject.id)}
              className={`p-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 transition-colors ${
                selectedProject.isFavorite ? 'text-rose-400' : 'text-slate-400'
              }`}
              title="Bookmark"
            >
              <Heart className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={() => setSchematicModalOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center gap-1.5 border border-slate-700"
            >
              <Zap className="w-3.5 h-3.5 text-teal-400" />
              <span>Full Wiring Diagram</span>
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {selectedProject.longDescription || selectedProject.description}
        </p>

        {/* Quick Specs */}
        <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div>
            <div className="text-slate-500 text-[11px]">Build Time</div>
            <div className="text-white font-semibold flex items-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              <span>{selectedProject.estimatedTimeHours} hours</span>
            </div>
          </div>

          <div>
            <div className="text-slate-500 text-[11px]">E-Waste Saved</div>
            <div className="text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
              <Leaf className="w-3.5 h-3.5" />
              <span>{selectedProject.estimatedWasteSavedGrams}g</span>
            </div>
          </div>

          <div>
            <div className="text-slate-500 text-[11px]">CO₂ Mitigated</div>
            <div className="text-teal-300 font-semibold mt-0.5">
              {selectedProject.estimatedCO2ReductionGrams}g
            </div>
          </div>

          <div>
            <div className="text-slate-500 text-[11px]">Total Parts</div>
            <div className="text-white font-semibold mt-0.5">
              {selectedProject.requirements?.length || 0} items
            </div>
          </div>
        </div>
      </div>

      {/* Build Readiness Banner */}
      {match && (
        <div
          className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            isReady
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
              : 'bg-slate-900/80 border-slate-800 text-slate-300'
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <MatchBadge status={match.status} percentage={match.compatibilityPercentage} size="lg" />
              {isReady && (
                <span className="text-xs font-semibold text-emerald-400 uppercase font-mono">
                  — 100% Ready To Build!
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {isReady
                ? 'All required components are currently available in your hardware inventory.'
                : `You have ${match.fulfilledRequiredCount} of ${match.totalRequiredCount} required units. Missing ${match.missingComponents.length} component(s).`}
            </p>
          </div>

          {isReady ? (
            <button
              onClick={handleMarkBuilt}
              disabled={isCompleting || completedSuccess}
              className="px-4 py-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm shadow-emerald-500/20 shrink-0"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{completedSuccess ? 'Build Completed!' : 'Mark as Built & Reused'}</span>
            </button>
          ) : (
            <button
              onClick={() => openAddComponentModal()}
              className="px-3.5 py-2 rounded-lg bg-teal-400 hover:bg-teal-300 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1.5 shrink-0"
            >
              <span>Add Missing Part to Inventory</span>
            </button>
          )}
        </div>
      )}

      {/* Component Requirements Matrix (Checklist) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
          Required Bill of Materials & Inventory Audit
        </h2>

        <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950/40">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Component</th>
                <th className="py-2.5 px-3 text-center">Required</th>
                <th className="py-2.5 px-3 text-center">In Inventory</th>
                <th className="py-2.5 px-3 text-right">Missing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {selectedProject.requirements?.map((req) => {
                const availableItem = match?.availableComponents.find(
                  (a) => a.componentId === req.componentId
                );
                const missingItem = match?.missingComponents.find(
                  (m) => m.componentId === req.componentId
                );

                const isFulfilled = availableItem && availableItem.fulfilledQuantity >= req.requiredQuantity;

                return (
                  <tr key={req.id} className="hover:bg-slate-850/30 transition-colors">
                    <td className="py-2.5 px-3">
                      {isFulfilled ? (
                        <span className="text-emerald-400 flex items-center gap-1 font-mono text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Ready</span>
                        </span>
                      ) : (
                        <span className="text-amber-400 flex items-center gap-1 font-mono text-[11px]">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Needed</span>
                        </span>
                      )}
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-white">
                        {req.component?.name || req.componentId}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {req.component?.category}
                      </div>
                    </td>

                    <td className="py-2.5 px-3 text-center font-mono tabular-nums text-slate-300">
                      {req.requiredQuantity}x
                    </td>

                    <td className="py-2.5 px-3 text-center font-mono tabular-nums text-teal-400">
                      {availableItem ? `${availableItem.userAvailableQuantity}x` : '0x'}
                    </td>

                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                      {missingItem ? (
                        <span className="text-rose-400 font-semibold">
                          +{missingItem.missingQuantity}x
                        </span>
                      ) : (
                        <span className="text-emerald-400">0</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assembly Steps Sequence */}
      {selectedProject.instructions && selectedProject.instructions.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
            Assembly Sequence & Instructions
          </h2>

          <div className="space-y-3">
            {selectedProject.instructions.map((step) => (
              <div
                key={step.stepNumber}
                className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-lg flex items-start gap-3 text-xs"
              >
                <div className="w-6 h-6 rounded-md bg-teal-500/10 border border-teal-500/20 text-teal-400 font-mono font-bold flex items-center justify-center shrink-0">
                  {step.stepNumber}
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-white">{step.title}</h4>
                  <p className="text-slate-400 leading-relaxed">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schematic Viewer Modal */}
      <CircuitSchematicModal
        project={selectedProject}
        isOpen={schematicModalOpen}
        onClose={() => setSchematicModalOpen(false)}
      />
    </div>
  );
};
