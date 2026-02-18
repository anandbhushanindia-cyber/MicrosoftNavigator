import React from 'react';

interface GradientOverlayProps {
  /** Tailwind gradient classes, e.g. "bg-gradient-to-b from-white via-white/60 to-transparent" */
  className: string;
}

export const GradientOverlay: React.FC<GradientOverlayProps> = ({ className }) => {
  return <div className={`absolute inset-0 ${className}`} />;
};
