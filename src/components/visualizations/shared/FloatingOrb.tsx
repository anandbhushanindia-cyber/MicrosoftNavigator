import React from 'react';
import type { OrbConfig } from '../types';

interface FloatingOrbProps extends OrbConfig {}

export const FloatingOrb: React.FC<FloatingOrbProps> = ({
  size,
  color,
  opacity,
  position,
  duration,
  delay = 0,
  reverse = false,
}) => {
  return (
    <div
      className={`absolute rounded-full blur-3xl viz-orb ${reverse ? 'viz-orb--reverse' : ''}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity,
        ...position,
        '--orb-duration': `${duration}s`,
        '--orb-delay': `${delay}s`,
      } as React.CSSProperties}
    />
  );
};
