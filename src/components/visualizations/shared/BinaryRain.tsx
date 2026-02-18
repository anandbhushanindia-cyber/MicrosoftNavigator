import React, { useMemo } from 'react';

/**
 * BinaryRain — Dense full-screen Matrix-style binary visualization
 * with oceanic wave undulation.
 *
 * Renders a wall-to-wall grid of 0s and 1s in horizontal rows.
 * Each row scrolls horizontally AND undulates vertically,
 * creating a smooth, hypnotic oceanic wave effect.
 *
 * Architecture: Two nested divs per row.
 *   Outer (viz-binary-wave-wrapper) — handles vertical wave (translateY)
 *   Inner (viz-binary-row) — handles horizontal scroll (translateX)
 * This avoids CSS transform collision (both need transform on same element).
 *
 * Subtle, elegant, stunning — IBM blue/indigo palette on white.
 * Pure CSS animations — no JS animation loop.
 */

interface BinaryRainProps {
  /** Number of horizontal rows (default 28) */
  rows?: number;
  /** Characters per row (default 80) */
  charsPerRow?: number;
  /** Base opacity for characters 0–1 (default 0.06) */
  baseOpacity?: number;
  /** Color CSS value (default indigo-blue) */
  color?: string;
  /** Minimum scroll duration in seconds (default 20) */
  minDuration?: number;
  /** Maximum scroll duration in seconds (default 45) */
  maxDuration?: number;
  /** Number of vertical columns for old-style (ignored in dense mode) */
  columns?: number;
}

// Deterministic pseudo-random from seed
function seededValue(seed: number, range: number): number {
  return (((seed * 9301 + 49297) % 233280) / 233280) * range;
}

// Generate a deterministic binary string with spaces for readability
function generateBinaryRow(seed: number, length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    // Mix of 0, 1, and occasional spaces for visual texture
    const v = seededValue(seed * 137 + i * 31, 10);
    if (v < 1.2) {
      result += ' ';
    } else if (v < 5.5) {
      result += '0';
    } else {
      result += '1';
    }
  }
  return result;
}

interface RowConfig {
  id: number;
  chars: string;          // binary string (repeated for seamless loop)
  duration: number;       // horizontal scroll speed (seconds)
  delay: number;          // scroll animation delay (seconds)
  opacity: number;        // row opacity (creates depth layers)
  fontSize: number;       // px — varies for depth
  yPercent: number;       // vertical position (%)
  glowIndices: number[];  // which chars get glow highlights
  reverse: boolean;       // scroll direction (some rows go right)
  // Oceanic wave parameters
  waveDuration: number;   // wave cycle period (seconds)
  waveDelay: number;      // negative delay for phase offset (seconds)
  waveAmplitude: number;  // vertical displacement (pixels)
}

export const BinaryRain: React.FC<BinaryRainProps> = ({
  rows = 28,
  charsPerRow = 80,
  baseOpacity = 0.06,
  color = 'rgba(59,102,241,1)',
  minDuration = 20,
  maxDuration = 45,
}) => {
  const rowConfigs = useMemo<RowConfig[]>(() => {
    // === Oceanic wave constants ===
    const WAVE_PERIOD = 8;  // seconds for one full wave cycle (slow, oceanic feel)

    const configs: RowConfig[] = [];
    for (let i = 0; i < rows; i++) {
      const seed = i + 1;
      const charCount = charsPerRow + Math.floor(seededValue(seed * 3, 30));

      // Generate chars — doubled for seamless loop scroll
      const baseChars = generateBinaryRow(seed, charCount);
      const chars = baseChars + '  ' + baseChars; // seamless loop

      // Depth layers: some rows are more prominent
      const depthLayer = seededValue(seed * 19, 3); // 0=far, 1=mid, 2=near
      const isFar = depthLayer < 1;
      const isNear = depthLayer > 2;

      const opacityMultiplier = isFar ? 0.5 : isNear ? 1.6 : 1.0;
      const fontBase = isFar ? 10 : isNear ? 15 : 12;

      // Wave amplitude varies by depth — near rows wave more, far barely move
      const waveAmplitude = isFar ? 4 : isNear ? 16 : 10;

      // Phase offset: negative delay starts each row at a different phase point.
      // Creates one full traveling wave visible across all rows at any moment.
      const waveDelay = -(i / rows) * WAVE_PERIOD;

      // Pick 2-4 random glow indices per row
      const glowCount = 2 + Math.floor(seededValue(seed * 23, 3));
      const glowIndices: number[] = [];
      for (let g = 0; g < glowCount; g++) {
        glowIndices.push(Math.floor(seededValue(seed * 100 + g * 41, charCount)));
      }

      configs.push({
        id: i,
        chars,
        duration: minDuration + seededValue(seed * 7, maxDuration - minDuration),
        delay: seededValue(seed * 13, 8), // 0-8s stagger for scroll
        opacity: baseOpacity * opacityMultiplier + seededValue(seed * 11, baseOpacity * 0.4),
        fontSize: fontBase + Math.floor(seededValue(seed * 5, 3)),
        yPercent: (i / (rows - 1)) * 100,
        glowIndices,
        reverse: seededValue(seed * 29, 10) > 7, // ~30% scroll right
        waveDuration: WAVE_PERIOD,
        waveDelay,
        waveAmplitude,
      });
    }
    return configs;
  }, [rows, charsPerRow, baseOpacity, minDuration, maxDuration]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {rowConfigs.map((row) => (
        /* Outer wrapper: absolute positioning + vertical wave undulation */
        <div
          key={row.id}
          className="absolute whitespace-nowrap viz-binary-wave-wrapper"
          style={{
            top: `${row.yPercent}%`,
            left: 0,
            '--wave-duration': `${row.waveDuration}s`,
            '--wave-delay': `${row.waveDelay}s`,
            '--wave-amplitude': `${row.waveAmplitude}px`,
          } as React.CSSProperties}
        >
          {/* Inner row: horizontal scroll */}
          <div
            className="viz-binary-row"
            style={{
              '--scroll-duration': `${row.duration}s`,
              '--scroll-delay': `${row.delay}s`,
              animationDirection: row.reverse ? 'reverse' : 'normal',
            } as React.CSSProperties}
          >
            <span
              className="inline-block font-mono select-none tracking-[0.15em]"
              style={{
                fontSize: `${row.fontSize}px`,
                lineHeight: 1.6,
                color,
                opacity: row.opacity,
              }}
            >
              {row.chars.split('').map((char, ci) => {
                const isGlow = row.glowIndices.includes(ci % Math.floor(row.chars.length / 2));
                return (
                  <span
                    key={ci}
                    className={isGlow ? 'viz-binary-glow' : ''}
                    style={
                      isGlow
                        ? ({
                            '--glow-duration': `${3 + seededValue(row.id * 100 + ci, 4)}s`,
                            '--glow-delay': `${seededValue(row.id * 50 + ci, 6)}s`,
                          } as React.CSSProperties)
                        : undefined
                    }
                  >
                    {char}
                  </span>
                );
              })}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
