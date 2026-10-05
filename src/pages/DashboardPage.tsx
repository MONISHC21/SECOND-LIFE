import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.ts';
import { useInventoryStore } from '../store/useInventoryStore.ts';
import { useProjectStore } from '../store/useProjectStore.ts';
import { useUIStore } from '../store/useUIStore.ts';
import { StatCard } from '../components/common/StatCard.tsx';
import { MatchBadge } from '../components/common/MatchBadge.tsx';
import {
  Cpu,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Leaf,
  ArrowRight,
  Plus,
  RefreshCw,
  Clock,
  Flame,
  Award,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, stats, fetchInventory, resetDemoInventory } = useInventoryStore();
  const { recommendations, recommendationSummary, fetchRecommendations } = useProjectStore();
  const { openAddComponentModal, showToast } = useUIStore();
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    fetchInventory();
    fetchRecommendations();
  }, [fetchInventory, fetchRecommendations]);

  const handleResetBenchmark = async () => {
    setIsResetting(true);
    const ok = await resetDemoInventory();
    if (ok) {
      await fetchRecommendations();
      showToast({
        type: 'success',
        title: 'Benchmark Reset Complete',
        message: 'Loaded: ESP32 x1, HC-SR04 x1, DC Motor x2, 18650 Battery x1, Servo x1, DHT11 x1',
      });
    }
    setIsResetting(false);
  };

  const topRecommendations = recommendations.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Banner / Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-teal-400 mb-1">
            Engineering Dashboard
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Rule-based component discovery and e-waste prevention console.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetBenchmark}
            disabled={isResetting}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-xs font-mono flex items-center gap-1.5"
            title="Reset to PS3 benchmark components: ESP32, HC-SR04, DC Motors, Battery, Servo, DHT11"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-teal-400 ${isResetting ? 'animate-spin' : ''}`} />
            <span>Reset Demo Inventory</span>
          </button>

          <button
            onClick={() => openAddComponentModal()}
            className="px-3.5 py-1.5 rounded-lg bg-teal-400 text-[#0B1220] font-semibold hover:bg-teal-300 transition-colors text-xs flex items-center gap-1.5 shadow-sm shadow-teal-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Component</span>
          </button>
        </div>
      </div>

      {/* PS3 Benchmark Callout Banner */}
      <div className="p-4 bg-teal-950/40 border border-teal-800/60 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-white">
              TechTrove 3.0 Demo Benchmark Active
            </div>
            <div className="text-slate-300 text-[11px]">
              Inventory contains 6 verified components. Matching engine calculated{' '}
              <span className="font-semibold text-teal-300">
                {recommendationSummary.readyToBuildCount} projects 100% Ready to Build
              </span>{' '}
              and {recommendationSummary.nearMatchCount} near matches.
            </div>
          </div>
        </div>

        <Link
          to="/recommendations"
          className="shrink-0 px-3 py-1.5 rounded-md bg-teal-400 text-[#0B1220] font-semibold hover:bg-teal-300 transition-colors text-xs flex items-center gap-1 font-sans"
        >
          <span>View Matches</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Components"
          value={stats.totalPhysicalQuantity}
          unit="units"
          subtitle={`${stats.totalItemTypes} distinct part types`}
          icon={Cpu}
          accent="teal"
        />

        <StatCard
          title="Projects Matched"
          value={recommendations.length}
          unit="blueprints"
          subtitle={`${recommendationSummary.readyToBuildCount} ready to build immediately`}
          icon={Sparkles}
          accent="emerald"
        />

        <StatCard
          title="E-Waste Saved"
          value={stats.totalWeightGrams}
          unit="grams"
          subtitle="Diverted from waste stream"
          icon={Leaf}
          accent="teal"
        />

        <StatCard
          title="CO₂ Mitigated"
          value={stats.totalCO2AvoidedGrams}
          unit="g CO₂"
          subtitle="Embodied manufacturing carbon"
          icon={Award}
          accent="orange"
        />
      </div>

      {/* Main Content Layout: Recommendations & Inventory Summary */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column: Top Recommended Projects (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <h2 className="text-sm font-semibold text-white">
                Projects You Can Build Right Now
              </h2>
            </div>
            <Link
              to="/recommendations"
              className="text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1"
            >
              <span>View All ({recommendations.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {topRecommendations.map((rec) => {
              const isReady = rec.status === 'READY_TO_BUILD';

              return (
                <div
                  key={rec.project.id}
                  className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-mono text-slate-400">
                          {rec.project.category}
                        </span>
                        <span className="text-slate-600">·</span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          <span>{rec.project.estimatedTimeHours}h</span>
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-white">
                        {rec.project.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {rec.project.description}
                      </p>
                    </div>

                    <div className="shrink-0 sm:text-right">
                      <MatchBadge
                        status={rec.status}
                        percentage={rec.compatibilityPercentage}
                        size="md"
                      />
                    </div>
                  </div>

                  {/* Components status row */}
                  <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 text-[11px]">
                      {isReady ? (
                        <span className="text-emerald-400 flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>All {rec.totalRequiredCount} required parts available in inventory</span>
                        </span>
                      ) : (
                        <span className="text-amber-400 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>
                            Missing:{' '}
                            <span className="text-slate-300">
                              {rec.missingComponents.map((m) => m.componentName).join(', ')}
                            </span>
                          </span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono text-slate-500">
                        Saves {rec.estimatedWasteSavedGrams}g E-Waste
                      </span>
                      <Link
                        to={`/projects/${rec.project.id}`}
                        className="px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors text-xs font-medium"
                      >
                        Open Blueprint
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Inventory Quick Glance (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-teal-400" />
              <h2 className="text-sm font-semibold text-white">Your Hardware Bin</h2>
            </div>
            <Link
              to="/inventory"
              className="text-xs text-teal-400 hover:text-teal-300 font-medium"
            >
              Manage
            </Link>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 divide-y divide-slate-800/80">
            {items.slice(0, 6).map((item) => (
              <div key={item.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <div className="text-xs font-medium text-white truncate">
                    {item.component?.name || item.componentId}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2">
                    <span>{item.component?.category}</span>
                    <span>·</span>
                    <span className="text-teal-400/80">{item.condition}</span>
                  </div>
                </div>
                <div className="text-xs font-mono font-semibold text-teal-300 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60 tabular-nums">
                  {item.quantity}x
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div className="py-6 text-center text-xs text-slate-500">
                No components added yet.
              </div>
            )}
          </div>

          {/* Quick CTA to Add */}
          <button
            onClick={() => openAddComponentModal()}
            className="w-full p-3 border border-dashed border-slate-700/80 hover:border-teal-500/50 rounded-xl text-xs text-slate-400 hover:text-teal-300 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Another Part to Bin</span>
          </button>
        </div>
      </div>
    </div>
  );
};
