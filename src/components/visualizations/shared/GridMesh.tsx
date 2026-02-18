import React from 'react';

interface GridMeshProps {
  /** Grid line opacity, default 0.03 */
  opacity?: number;
  /** Grid cell size in px, default 60 */
  size?: number;
  /** Grid line color CSS value, default "rgba(99,102,241,0.5)" (indigo) */
  color?: string;
  /** Whether to animate opacity (wave effect) */
  animate?: boolean;
}

export const GridMesh: React.FC<GridMeshProps> = ({
  opacity = 0.03,
  size = 60,
  color = 'rgba(99,102,241,0.5)',
  animate = false,
}) => {
  return (
    <div
      className={`absolute inset-0 ${animate ? 'viz-grid-wave' : ''}`}
      style={{
        opacity,
        backgroundImage: `
          linear-gradient(${color} 1px, transparent 1px),
          linear-gradient(90deg, ${color} 1px, transparent 1px)
        `,
        backgroundSize: `${size}px ${size}px`,
      }}
    />
  );
};
