import React from 'react';
import type { AnimatedBackgroundProps, VisualizationVariant } from './types';
import { HeroConstellation } from './variants/HeroConstellation';
import { FlowStreams } from './variants/FlowStreams';
import { ConvergeFocus } from './variants/ConvergeFocus';
import { PulseOrbs } from './variants/PulseOrbs';
import { RevealPremium } from './variants/RevealPremium';
import { useAdmin } from '../../contexts/AdminContext';
import './animations.css';

const VARIANT_MAP: Record<VisualizationVariant, React.FC> = {
  hero: HeroConstellation,
  flow: FlowStreams,
  focus: ConvergeFocus,
  pulse: PulseOrbs,
  reveal: RevealPremium,
};

/** Static image configuration per variant */
const IMAGE_CONFIG: Record<VisualizationVariant, {
  src: string;
  opacity: string;
  objectPosition: string;
  gradient: string;
}> = {
  hero: {
    src: '/media/images/first-bcg.png',
    opacity: 'opacity-90',
    objectPosition: 'object-bottom',
    gradient: 'bg-gradient-to-b from-white via-white/80 to-white/30',
  },
  flow: {
    src: '/media/images/third-bcg.png',
    opacity: 'opacity-80',
    objectPosition: 'object-center',
    gradient: 'bg-gradient-to-b from-white via-white/80 to-white/30',
  },
  focus: {
    src: '/media/images/third-bcg.png',
    opacity: 'opacity-60',
    objectPosition: 'object-center',
    gradient: 'bg-gradient-to-b from-white via-white/80 to-white/30',
  },
  pulse: {
    src: '/media/images/third-bcg.png',
    opacity: 'opacity-60',
    objectPosition: 'object-center',
    gradient: 'bg-gradient-to-b from-white via-white/80 to-white/30',
  },
  reveal: {
    src: '/media/images/second-bcg.png',
    opacity: 'opacity-50',
    objectPosition: 'object-center',
    gradient: 'bg-gradient-to-b from-white via-white/80 to-white/30',
  },
};

/**
 * Per-variant rendering mode:
 *
 *   All screens use 'image' — professional brand background images.
 *
 * The visualization layer is kept in code but disabled by default.
 * Admin override via `backgroundMode` config:
 *   0 (default) = static images on all screens
 *   1           = force all static images (same effect)
 */
type RenderMode = 'image' | 'viz' | 'both';

const VARIANT_RENDER_MODE: Record<VisualizationVariant, RenderMode> = {
  hero: 'image',    // Landing — professional brand image
  flow: 'image',    // Scenario — clean selection screen
  focus: 'image',   // SubScenario — focused selection screen
  pulse: 'image',   // Question — professional brand image
  reveal: 'image',  // Recommendation — professional brand image
};

/**
 * Reusable animated background component.
 * Renders a full-viewport, non-interactive background layer
 * that sits behind page content.
 *
 * All screens use professional brand background images by default.
 *
 * Admin override via `backgroundMode` config:
 *   0 (default) = static images on all screens
 *   1           = force all static images (same effect)
 *
 * Usage:
 *   <AnimatedBackground variant="hero" />    // Landing page
 *   <AnimatedBackground variant="flow" />    // Scenario
 *   <AnimatedBackground variant="focus" />   // SubScenario
 *   <AnimatedBackground variant="pulse" />   // Question flow
 *   <AnimatedBackground variant="reveal" />  // Recommendation
 */
export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  variant,
  className = '',
}) => {
  const { getConfig } = useAdmin();
  const backgroundMode = getConfig('backgroundMode'); // 0 = hybrid, 1 = force image

  // Determine render mode for this variant
  const mode: RenderMode = backgroundMode === 1
    ? 'image'
    : VARIANT_RENDER_MODE[variant];

  const showImage = mode === 'image' || mode === 'both';
  const showViz = mode === 'viz' || mode === 'both';

  const img = IMAGE_CONFIG[variant];
  const Component = VARIANT_MAP[variant];

  return (
    <div
      className={`fixed inset-0 pointer-events-none overflow-hidden -z-10 ${className}`}
      aria-hidden="true"
    >
      {/* Static image layer */}
      {showImage && (
        <img
          src={img.src}
          alt=""
          className={`w-full h-full object-cover ${img.objectPosition} ${img.opacity}`}
        />
      )}

      {/* Gradient overlay for image readability */}
      {showImage && (
        <div className={`absolute inset-0 ${img.gradient}`} />
      )}

      {/* Animated visualization layer */}
      {showViz && (
        <div className="absolute inset-0">
          <Component />
        </div>
      )}
    </div>
  );
};
