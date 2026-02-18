import React from 'react';
import { FloatingOrb } from '../shared/FloatingOrb';
import { GradientOverlay } from '../shared/GradientOverlay';

/**
 * ConvergeFocus — SubScenario screen visualization.
 *
 * Theme: "Deep-dive / Convergence" — the user is narrowing down from
 * a broad challenge to a specific focus area.
 *
 * Visual: Radial lines converging toward a glowing center point,
 * concentric rings pulsing inward, and a breathing central orb.
 */

// 14 radial lines emanating from center outward
const RADIAL_LINES = Array.from({ length: 14 }, (_, i) => {
  const angle = (360 / 14) * i;
  const rad = (angle * Math.PI) / 180;
  const length = 42; // % of viewBox
  return {
    angle,
    x2: 50 + length * Math.cos(rad),
    y2: 50 + length * Math.sin(rad),
    delay: i * 0.35,
    duration: 5 + (i % 4),
  };
});

// Concentric rings that pulse inward
const CONVERGE_RINGS = [
  { radius: 36, opacity: 0.06, duration: 10, delay: 0 },
  { radius: 28, opacity: 0.08, duration: 8, delay: 1.5 },
  { radius: 20, opacity: 0.10, duration: 6, delay: 3 },
  { radius: 13, opacity: 0.14, duration: 5, delay: 1 },
];

export const ConvergeFocus: React.FC = () => {
  return (
    <>
      {/* Base gradient — teal-tinted to differentiate from FlowStreams */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/25 via-white to-teal-50/15" />

      {/* SVG: Radial convergence lines */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        {RADIAL_LINES.map((line, i) => (
          <line
            key={`rl-${i}`}
            x1={50}
            y1={50}
            x2={line.x2}
            y2={line.y2}
            stroke="rgba(59,130,200,0.14)"
            strokeWidth="0.15"
            className="viz-converge-line"
            style={{
              '--line-duration': `${line.duration}s`,
              '--line-delay': `${line.delay}s`,
            } as React.CSSProperties}
          />
        ))}

        {/* Small node dots at the outer ends of each line */}
        {RADIAL_LINES.map((line, i) => (
          <circle
            key={`rd-${i}`}
            cx={line.x2}
            cy={line.y2}
            r={0.8}
            fill="rgba(59,130,200,0.25)"
            className="viz-converge-line"
            style={{
              '--line-duration': `${3 + (i % 3)}s`,
              '--line-delay': `${line.delay + 1}s`,
            } as React.CSSProperties}
          />
        ))}

        {/* Gentle center glow in SVG */}
        <circle
          cx={50}
          cy={50}
          r={6}
          fill="rgba(59,130,200,0.08)"
          className="viz-pulse-orb"
          style={{
            '--orb-opacity': 0.08,
            '--pulse-duration': '8s',
            '--pulse-delay': '0s',
          } as React.CSSProperties}
        />
      </svg>

      {/* Inward-pulsing concentric rings */}
      {CONVERGE_RINGS.map((ring, i) => (
        <div
          key={`cr-${i}`}
          className="absolute rounded-full viz-converge-ring"
          style={{
            width: `${ring.radius * 2}%`,
            height: `${ring.radius * 2}%`,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            border: `1.5px solid rgba(59,130,200,${ring.opacity})`,
            '--ring-duration': `${ring.duration}s`,
            '--ring-delay': `${ring.delay}s`,
            '--ring-base-opacity': ring.opacity,
          } as React.CSSProperties}
        />
      ))}

      {/* Central focus orb */}
      <FloatingOrb
        size={280}
        color="rgba(59,130,246,0.30)"
        opacity={0.12}
        position={{ top: '38%', left: '42%' }}
        duration={12}
      />

      {/* Secondary ambient orb */}
      <FloatingOrb
        size={350}
        color="rgba(20,184,166,0.20)"
        opacity={0.06}
        position={{ top: '25%', right: '-5%' }}
        duration={18}
        delay={4}
        reverse
      />

      {/* Gradient overlay for content readability */}
      <GradientOverlay className="bg-gradient-to-b from-white via-white/50 to-white/20" />
    </>
  );
};
