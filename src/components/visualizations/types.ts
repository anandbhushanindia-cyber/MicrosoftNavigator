export type VisualizationVariant = 'hero' | 'flow' | 'focus' | 'pulse' | 'reveal';

export interface AnimatedBackgroundProps {
  variant: VisualizationVariant;
  className?: string;
}

export interface OrbConfig {
  /** Size in pixels */
  size: number;
  /** CSS radial-gradient color, e.g. "rgba(99,102,241,0.4)" */
  color: string;
  /** Opacity 0–1 */
  opacity: number;
  /** Absolute positioning values */
  position: { top?: string; left?: string; right?: string; bottom?: string };
  /** Animation duration in seconds */
  duration: number;
  /** Animation delay in seconds */
  delay?: number;
  /** Play animation in reverse */
  reverse?: boolean;
}
