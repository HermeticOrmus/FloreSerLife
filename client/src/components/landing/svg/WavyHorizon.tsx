import { cn } from "@/lib/utils";

interface WavyHorizonProps {
  className?: string;
  fillColor?: string;
}

/**
 * Paper-cut style wavy divider for hero section
 * Creates organic horizon line between hero sections
 */
export function WavyHorizon({ className, fillColor = "#6F8E72" }: WavyHorizonProps) {
  return (
    <svg
      viewBox="0 0 1440 100"
      preserveAspectRatio="none"
      className={cn("w-full h-auto", className)}
      aria-hidden="true"
    >
      {/* Drop shadow filter for paper-cut depth */}
      <defs>
        <filter id="paperShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="-3"
            stdDeviation="4"
            floodColor="rgba(86,75,58,0.15)"
          />
        </filter>
      </defs>

      {/* Wavy path with organic curves */}
      <path
        d="M0,50 Q180,20 360,50 T720,50 T1080,50 T1440,50 L1440,100 L0,100 Z"
        fill={fillColor}
        filter="url(#paperShadow)"
      />
    </svg>
  );
}

export default WavyHorizon;
