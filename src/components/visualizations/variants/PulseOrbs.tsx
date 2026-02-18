import React from 'react';
import { GradientOverlay } from '../shared/GradientOverlay';
import { BinaryRain } from '../shared/BinaryRain';

// Central breathing orb configurations
const ORBS = [
  {
    size: 500,
    color: 'rgba(59,130,246,0.4)',
    opacity: 0.15,
    top: '25%',
    left: '30%',
    duration: 6,
    delay: 0,
  },
  {
    size: 400,
    color: 'rgba(20,184,166,0.35)',
    opacity: 0.12,
    top: '40%',
    left: '55%',
    duration: 8,
    delay: 2,
  },
  {
    size: 350,
    color: 'rgba(99,102,241,0.35)',
    opacity: 0.10,
    top: '15%',
    left: '60%',
    duration: 7,
    delay: 4,
  },
];

// Expanding pulse ring configurations
const RINGS = [
  { cx: '40%', cy: '35%', color: 'rgba(59,130,246,0.2)', duration: 4, delay: 0, size: 200 },
  { cx: '60%', cy: '50%', color: 'rgba(20,184,166,0.15)', duration: 5, delay: 1.5, size: 180 },
  { cx: '35%', cy: '60%', color: 'rgba(99,102,241,0.15)', duration: 4.5, delay: 3, size: 160 },
  { cx: '55%', cy: '30%', color: 'rgba(59,130,246,0.12)', duration: 6, delay: 2, size: 220 },
];

// Focus rings (larger, slower)
const FOCUS_RINGS = [
  { cx: '45%', cy: '45%', color: 'rgba(59,130,246,0.08)', duration: 8, delay: 0, size: 300 },
  { cx: '55%', cy: '40%', color: 'rgba(99,102,241,0.06)', duration: 10, delay: 3, size: 350 },
];

export const PulseOrbs: React.FC = () => {
  return (
    <>
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-white to-teal-50/10" />

      {/* Binary matrix — digital 0s and 1s flowing */}
      <BinaryRain
        rows={24}
        charsPerRow={80}
        baseOpacity={0.12}
        color="rgba(59,102,241,1)"
        minDuration={22}
        maxDuration={40}
      />

      {/* Focus rings (outermost layer) */}
      {FOCUS_RINGS.map((ring, i) => (
        <div
          key={`focus-${i}`}
          className="absolute rounded-full viz-focus-ring"
          style={{
            width: `${ring.size}px`,
            height: `${ring.size}px`,
            top: ring.cy,
            left: ring.cx,
            transform: 'translate(-50%, -50%)',
            border: `1px solid ${ring.color}`,
            '--focus-duration': `${ring.duration}s`,
            '--focus-delay': `${ring.delay}s`,
          } as React.CSSProperties}
        />
      ))}

      {/* Expanding pulse rings */}
      {RINGS.map((ring, i) => (
        <div
          key={`ring-${i}`}
          className="absolute rounded-full viz-pulse-ring"
          style={{
            width: `${ring.size}px`,
            height: `${ring.size}px`,
            top: ring.cy,
            left: ring.cx,
            transform: 'translate(-50%, -50%)',
            border: `1.5px solid ${ring.color}`,
            '--ring-duration': `${ring.duration}s`,
            '--ring-delay': `${ring.delay}s`,
          } as React.CSSProperties}
        />
      ))}

      {/* Breathing orbs */}
      {ORBS.map((orb, i) => (
        <div
          key={`orb-${i}`}
          className="absolute rounded-full blur-3xl viz-pulse-orb"
          style={{
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            top: orb.top,
            left: orb.left,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            '--orb-opacity': orb.opacity,
            '--pulse-duration': `${orb.duration}s`,
            '--pulse-delay': `${orb.delay}s`,
          } as React.CSSProperties}
        />
      ))}

      {/* Gradient overlay for content readability */}
      <GradientOverlay className="bg-gradient-to-b from-white/60 via-transparent to-transparent" />
    </>
  );
};
