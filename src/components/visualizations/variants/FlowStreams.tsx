import React from 'react';
import { FloatingOrb } from '../shared/FloatingOrb';
import { GradientOverlay } from '../shared/GradientOverlay';

// Stream configurations — each ribbon has unique visual personality
const STREAMS = [
  {
    width: 280,
    height: '140vh',
    gradient: 'linear-gradient(180deg, rgba(59,130,246,0.12) 0%, rgba(99,102,241,0.08) 50%, transparent 100%)',
    top: '-20%',
    left: '10%',
    angle: -25,
    duration: 22,
    delay: 0,
    blur: 60,
  },
  {
    width: 200,
    height: '130vh',
    gradient: 'linear-gradient(180deg, rgba(99,102,241,0.10) 0%, rgba(139,92,246,0.06) 50%, transparent 100%)',
    top: '-15%',
    left: '35%',
    angle: -30,
    duration: 28,
    delay: 4,
    blur: 50,
  },
  {
    width: 320,
    height: '150vh',
    gradient: 'linear-gradient(180deg, rgba(139,92,246,0.08) 0%, rgba(59,130,246,0.05) 50%, transparent 100%)',
    top: '-25%',
    left: '60%',
    angle: -20,
    duration: 18,
    delay: 8,
    blur: 70,
  },
  {
    width: 180,
    height: '120vh',
    gradient: 'linear-gradient(180deg, rgba(59,130,246,0.06) 0%, rgba(99,102,241,0.10) 50%, transparent 100%)',
    top: '-10%',
    left: '80%',
    angle: -35,
    duration: 25,
    delay: 2,
    blur: 45,
  },
];

export const FlowStreams: React.FC = () => {
  return (
    <>
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20" />

      {/* Flowing ribbon streams */}
      {STREAMS.map((stream, i) => (
        <div
          key={`stream-${i}`}
          className="absolute viz-flow-stream"
          style={{
            width: `${stream.width}px`,
            height: stream.height,
            background: stream.gradient,
            top: stream.top,
            left: stream.left,
            filter: `blur(${stream.blur}px)`,
            borderRadius: '50%',
            '--stream-duration': `${stream.duration}s`,
            '--stream-delay': `${stream.delay}s`,
            '--flow-angle': `${stream.angle}deg`,
          } as React.CSSProperties}
        />
      ))}

      {/* Secondary undulating layers for depth */}
      <div
        className="absolute inset-0 viz-flow-undulate"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 30% 40%, rgba(59,130,246,0.04) 0%, transparent 70%)',
          '--undulate-duration': '10s',
        } as React.CSSProperties}
      />
      <div
        className="absolute inset-0 viz-flow-undulate"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 70% 60%, rgba(99,102,241,0.03) 0%, transparent 70%)',
          '--undulate-duration': '14s',
        } as React.CSSProperties}
      />

      {/* Floating orbs */}
      <FloatingOrb
        size={500}
        color="rgba(59,130,246,0.30)"
        opacity={0.08}
        position={{ top: '-5%', right: '-8%' }}
        duration={20}
      />
      <FloatingOrb
        size={400}
        color="rgba(99,102,241,0.25)"
        opacity={0.06}
        position={{ bottom: '10%', left: '-5%' }}
        duration={24}
        delay={5}
        reverse
      />

      {/* Gradient overlay for content readability */}
      <GradientOverlay className="bg-gradient-to-b from-white via-white/50 to-white/20" />
    </>
  );
};
