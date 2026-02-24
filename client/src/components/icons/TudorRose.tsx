/**
 * TudorRose SVG Component
 *
 * A paper-cut style Tudor rose used as a brand element across FloreSer.
 * The rose has three layers:
 *   - Outer petals: Deep Tudor red (#7B2D26)
 *   - Inner petals: Creamy white (#FFF5E1), offset 36 degrees
 *   - Center: Warm gold (#D4A843) with lighter gold highlight (#E8C06A)
 *
 * Used in the client dashboard (upright) and the about page (rotated).
 */

interface TudorRoseProps {
  /** Overall SVG size in pixels. Defaults to 130. */
  size?: number;
  /** Optional rotation in degrees (e.g. -25 for the "laid on its side" variant). */
  rotation?: number;
  /** Extra CSS class applied to the root <svg>. */
  className?: string;
  /** Unique prefix for SVG filter IDs to avoid collisions when multiple roses render. */
  filterId?: string;
}

// Color tokens for the Tudor Rose layers
const TUDOR_RED = "#7B2D26";     // Outer petals - deep Tudor red
const PETAL_CREAM = "#FFF5E1";   // Inner petals - creamy white
const CENTER_GOLD = "#D4A843";   // Center disc - warm gold
const CENTER_HIGHLIGHT = "#E8C06A"; // Center highlight - lighter gold

export function TudorRose({
  size = 130,
  rotation,
  className = "drop-shadow-md",
  filterId = "tudorPetalShadow",
}: TudorRoseProps) {
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.42;
  const innerR = size * 0.28;
  const centerR = size * 0.13;

  // Generate a teardrop petal path centered at origin, pointing upward
  const petal = (r: number, width: number) => {
    const tipY = -r;
    const cpX = width * 0.6;
    const cpY = -r * 0.5;
    return `M 0,0 C ${cpX},${cpY} ${cpX * 0.8},${tipY * 0.85} 0,${tipY} C ${-cpX * 0.8},${tipY * 0.85} ${-cpX},${cpY} 0,0 Z`;
  };

  const outerPetalPath = petal(outerR, outerR * 0.55);
  const innerPetalPath = petal(innerR, innerR * 0.5);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={rotation != null ? { transform: `rotate(${rotation}deg)` } : undefined}
    >
      <defs>
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#00000020" />
        </filter>
      </defs>

      {/* Outer petals - deep Tudor red */}
      <g transform={`translate(${cx}, ${cy})`} filter={`url(#${filterId})`}>
        {[0, 72, 144, 216, 288].map((angle) => (
          <path
            key={`outer-${angle}`}
            d={outerPetalPath}
            transform={`rotate(${angle})`}
            fill={TUDOR_RED}
            opacity="0.95"
          />
        ))}
      </g>

      {/* Inner petals - creamy white, rotated 36 degrees */}
      <g transform={`translate(${cx}, ${cy})`} filter={`url(#${filterId})`}>
        {[36, 108, 180, 252, 324].map((angle) => (
          <path
            key={`inner-${angle}`}
            d={innerPetalPath}
            transform={`rotate(${angle})`}
            fill={PETAL_CREAM}
            opacity="0.95"
          />
        ))}
      </g>

      {/* Golden center */}
      <circle
        cx={cx}
        cy={cy}
        r={centerR}
        fill={CENTER_GOLD}
        filter={`url(#${filterId})`}
      />
      <circle cx={cx} cy={cy} r={centerR * 0.5} fill={CENTER_HIGHLIGHT} opacity="0.6" />
    </svg>
  );
}
