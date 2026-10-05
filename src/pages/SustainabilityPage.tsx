import React, { useEffect, useState } from 'react';
import { api } from '../services/api.ts';
import { StatCard } from '../components/common/StatCard.tsx';
import {
  Leaf,
  Award,
  Cpu,
  CheckCircle2,
  TreePine,
  Car,
  AlertCircle,
  TrendingUp,
  BarChart3,
} from 'lucide-react';

export const SustainabilityPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const res = await api.getSustainability();
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        // Handle error
      } finally {
        setIsLoading(false);
      }
    };
    loadMetrics();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="py-20 text-center text-xs text-slate-400 font-mono">
        Calculating environmental footprint metrics...
      </div>
    );
  }

  const { metrics, categoryBreakdown, monthlyProgression, disclaimer } = data;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 mb-1">
            Environmental Impact Analytics
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Sustainability & E-Waste Avoidance
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Quantifying materials diverted from municipal landfills through creative electronics reuse.
          </p>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Components Reused"
          value={metrics.totalComponentsReused}
          unit="units"
          subtitle="Hardware pieces diverted"
          icon={Cpu}
          accent="teal"
        />

        <StatCard
          title="E-Waste Avoided"
          value={metrics.wasteSavedKg}
          unit="kg"
          subtitle={`${metrics.wasteSavedGrams} grams physical mass`}
          icon={Leaf}
          accent="emerald"
        />

        <StatCard
          title="Embodied CO₂ Mitigated"
          value={metrics.co2ReducedKg}
          unit="kg CO₂e"
          subtitle={`${metrics.co2ReducedGrams}g greenhouse gases`}
          icon={Award}
          accent="orange"
        />

        <StatCard
          title="Completed Builds"
          value={metrics.completedProjectsCount}
          unit="projects"
          subtitle="Hardware assemblies completed"
          icon={CheckCircle2}
          accent="teal"
        />
      </div>

      {/* Real-World Equivalence Benchmarks */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <TreePine className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <div className="text-xs text-slate-400">Equivalent Carbon Absorption</div>
            <div className="text-lg font-bold font-mono text-white tabular-nums">
              {metrics.equivalentTreesPlanted} tree-years
            </div>
            <div className="text-[11px] text-slate-500">
              Equivalent to annual CO₂ sequestration of urban evergreen trees
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
            <Car className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <div className="text-xs text-slate-400">Equivalent Travel Avoided</div>
            <div className="text-lg font-bold font-mono text-white tabular-nums">
              {metrics.equivalentKmElectricCar} km
            </div>
            <div className="text-[11px] text-slate-500">
              Clean zero-emissions electric vehicle road distance offset
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Charts Section */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Category Breakdown (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Hardware Weight Reused by Category
            </h3>
            <span className="text-[11px] font-mono text-slate-500">Mass share (%)</span>
          </div>

          <div className="space-y-3">
            {categoryBreakdown.map((cat: any) => (
              <div key={cat.category} className="space-y-1 text-xs">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-slate-300">{cat.category}</span>
                  <span className="text-teal-400 tabular-nums">
                    {cat.weightGrams}g ({cat.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-950 border border-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-400"
                    style={{ width: `${Math.max(4, cat.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6-Month Reuse Timeline (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Cumulative E-Waste Avoidance Progression
            </h3>
            <span className="text-[11px] font-mono text-emerald-400">Past 6 Months</span>
          </div>

          <div className="space-y-3">
            {monthlyProgression.map((item: any) => (
              <div key={item.month} className="space-y-1 text-xs">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-slate-300 font-medium">{item.month}</span>
                  <div className="flex items-center gap-3 text-slate-400">
                    <span className="text-emerald-400 tabular-nums">{item.eWasteSavedGrams}g waste</span>
                    <span>·</span>
                    <span className="text-teal-300 tabular-nums">{item.co2SavedGrams}g CO₂</span>
                  </div>
                </div>
                <div className="w-full bg-slate-950 border border-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-teal-400"
                    style={{
                      width: `${Math.min(100, Math.max(10, (item.eWasteSavedGrams / (metrics.wasteSavedGrams || 1)) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transparent Disclaimer Notice */}
      <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl flex items-start gap-3 text-xs text-slate-400">
        <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold text-slate-300">Methodology & Transparency: </span>
          {disclaimer}
        </div>
      </div>
    </div>
  );
};
