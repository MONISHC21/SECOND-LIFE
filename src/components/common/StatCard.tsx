import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon?: LucideIcon;
  accent?: 'teal' | 'emerald' | 'orange' | 'slate';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  accent = 'teal',
}) => {
  const accentClasses = {
    teal: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    slate: 'text-slate-400 bg-slate-800/40 border-slate-700/40',
  }[accent];

  return (
    <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg hover:border-slate-700/80 transition-colors">
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-xs font-medium text-slate-400">{title}</span>
        {Icon && (
          <div className={`w-7 h-7 rounded-md border flex items-center justify-center ${accentClasses}`}>
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-bold font-mono tabular-nums text-white tracking-tight">
          {value}
        </span>
        {unit && <span className="text-xs text-slate-400 font-medium">{unit}</span>}
      </div>

      {subtitle && (
        <div className="mt-1 text-[11px] text-slate-500 truncate">
          {subtitle}
        </div>
      )}
    </div>
  );
};
