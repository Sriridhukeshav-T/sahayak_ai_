import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface DemoBadgeProps {
  className?: string;
  showTooltip?: boolean;
}

export const DemoBadge: React.FC<DemoBadgeProps> = ({ className = '', showTooltip = true }) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/80 shadow-xs ${className}`}
      title={showTooltip ? 'Some data in this prototype is synthetic and intended for SIH demonstration. Production deployment connects to verified government scheme and authorized channel-partner databases.' : undefined}
    >
      <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
      <span>Demo Data</span>
    </div>
  );
};
