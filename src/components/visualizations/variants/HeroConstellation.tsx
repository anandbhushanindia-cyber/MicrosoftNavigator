import React from 'react';
import { GradientOverlay } from '../shared/GradientOverlay';
import { BinaryRain } from '../shared/BinaryRain';

/**
 * HeroConstellation — Landing screen visualization.
 *
 * Theme: "Digital Transformation" — a dense wall-to-wall matrix of
 * flowing 0s and 1s, evoking the raw fabric of digital data.
 *
 * Rows scroll horizontally at different speeds, creating layered
 * depth and a smooth, hypnotic motion reminiscent of The Matrix.
 *
 * Subtle blue/indigo palette on white — elegant and stunning.
 */

export const HeroConstellation: React.FC = () => {
  return (
    <>
      {/* Base gradient — soft warm undertone */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/30" />

      {/* Dense Binary Matrix — the main visual */}
      <BinaryRain
        rows={30}
        charsPerRow={90}
        baseOpacity={0.07}
        color="rgba(59,102,241,1)"
        minDuration={20}
        maxDuration={45}
      />

      {/* Gradient overlay for content readability */}
      <GradientOverlay className="bg-gradient-to-b from-white via-white/60 to-transparent" />
    </>
  );
};
