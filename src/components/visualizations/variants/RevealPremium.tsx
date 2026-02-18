import React from 'react';
import { FloatingOrb } from '../shared/FloatingOrb';
import { GridMesh } from '../shared/GridMesh';
import { GradientOverlay } from '../shared/GradientOverlay';
import { BinaryRain } from '../shared/BinaryRain';

// Particle dot configurations
const PARTICLES = [
  { left: '8%', delay: 0, duration: 14, size: 4 },
  { left: '15%', delay: 3, duration: 12, size: 3 },
  { left: '25%', delay: 7, duration: 16, size: 5 },
  { left: '35%', delay: 1, duration: 11, size: 3 },
  { left: '45%', delay: 5, duration: 13, size: 4 },
  { left: '55%', delay: 9, duration: 15, size: 3 },
  { left: '65%', delay: 2, duration: 12, size: 5 },
  { left: '75%', delay: 6, duration: 14, size: 4 },
  { left: '85%', delay: 4, duration: 11, size: 3 },
  { left: '92%', delay: 8, duration: 16, size: 4 },
];

export const RevealPremium: React.FC = () => {
  return (
    <>
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50" />

      {/* Binary matrix — digital 0s and 1s flowing */}
      <BinaryRain
        rows={24}
        charsPerRow={80}
        baseOpacity={0.12}
        color="rgba(99,102,241,1)"
        minDuration={25}
        maxDuration={48}
      />

      {/* Animated floating orbs — migrated from existing recommendation background */}
      <FloatingOrb
        size={600}
        color="rgba(99,102,241,0.4)"
        opacity={0.20}
        position={{ top: '-10%', right: '-5%' }}
        duration={20}
      />
      <FloatingOrb
        size={500}
        color="rgba(59,130,246,0.4)"
        opacity={0.15}
        position={{ bottom: '-10%', left: '-5%' }}
        duration={25}
        delay={3}
        reverse
      />
      <FloatingOrb
        size={400}
        color="rgba(139,92,246,0.3)"
        opacity={0.10}
        position={{ top: '40%', left: '50%' }}
        duration={18}
        delay={6}
      />

      {/* Shimmer sweep bar */}
      <div
        className="absolute top-0 left-0 w-[120px] h-full viz-shimmer"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          '--shimmer-duration': '8s',
          '--shimmer-delay': '2s',
        } as React.CSSProperties}
      />

      {/* Rising particle dots */}
      {PARTICLES.map((p, i) => (
        <div
          key={`particle-${i}`}
          className="absolute bottom-0 rounded-full viz-particle"
          style={{
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: 'rgba(99,102,241,0.35)',
            '--particle-duration': `${p.duration}s`,
            '--particle-delay': `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}

      {/* Grid mesh with wave animation */}
      <GridMesh opacity={0.03} size={60} animate />

      {/* Gradient overlay for header/content clarity */}
      <GradientOverlay className="bg-gradient-to-b from-white/50 via-transparent to-transparent" />
    </>
  );
};
