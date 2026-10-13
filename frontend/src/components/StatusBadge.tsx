import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = status.toUpperCase();

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  // Red (Emergency/High Risk)
  if (['ACTIVE', 'CRITICAL', 'HIGH', 'REJECTED'].includes(normalized)) {
    colorClasses = 'bg-red-50 text-red-700 border-red-200';
  }
  // Green (Safe / Verified / Resolved)
  else if (['VERIFIED', 'RESOLVED', 'COMPLETED', 'LOW', 'SAFE'].includes(normalized)) {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }
  // Amber (Warnings / Under Review / Responding)
  else if (['UNDER_REVIEW', 'MEDIUM', 'RESPONDING', 'ACKNOWLEDGED', 'CAUTION'].includes(normalized)) {
    colorClasses = 'bg-amber-50 text-amber-800 border-amber-200';
  }
  // Blue (Info / Submissions / Active non-emergency)
  else if (['SUBMITTED', 'PLANNED', 'INFO', 'SYSTEM'].includes(normalized)) {
    colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center font-medium rounded border ${colorClasses} ${sizeClasses}`}
    >
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {normalized.replace('_', ' ')}
    </span>
  );
};
