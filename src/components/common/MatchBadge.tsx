import React from 'react';
import { RecommendationStatus } from '../../types/index.ts';

interface MatchBadgeProps {
  status: RecommendationStatus;
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
}

export const MatchBadge: React.FC<MatchBadgeProps> = ({ status, percentage, size = 'md' }) => {
  let label = 'Low Match';
  let colorClass = 'text-slate-400';
  let dotClass = 'bg-slate-500';

  if (status === 'READY_TO_BUILD' || percentage === 100) {
    label = 'Ready to Build';
    colorClass = 'text-emerald-400 font-semibold';
    dotClass = 'bg-emerald-400';
  } else if (status === 'NEAR_MATCH' || percentage >= 75) {
    label = 'Near Match';
    colorClass = 'text-teal-400 font-medium';
    dotClass = 'bg-teal-400';
  } else if (status === 'PARTIAL_MATCH' || percentage >= 50) {
    label = 'Partial Match';
    colorClass = 'text-amber-400 font-medium';
    dotClass = 'bg-amber-400';
  } else {
    label = 'Low Match';
    colorClass = 'text-slate-400';
    dotClass = 'bg-slate-500';
  }

  const textSize = size === 'sm' ? 'text-[11px]' : size === 'lg' ? 'text-sm' : 'text-xs';

  return (
    <div className={`inline-flex items-center gap-1.5 ${textSize} ${colorClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} aria-hidden="true" />
      <span className="font-mono tabular-nums">{percentage}%</span>
      <span aria-hidden="true" className="text-slate-600">·</span>
      <span>{label}</span>
    </div>
  );
};
