import { useState, useEffect, useRef, useCallback } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type MaiaSpriteState = "idle" | "thinking" | "greeting";

interface MaiaSpriteProps {
  state: MaiaSpriteState;
  size?: number; // Display size in px (default 40)
  className?: string;
  /** Called when a non-looping animation (greeting) finishes */
  onAnimationEnd?: () => void;
}

// ---------------------------------------------------------------------------
// Static frame imports via Vite glob
// ---------------------------------------------------------------------------

const idleFrames: Record<string, { default: string }> = import.meta.glob(
  "../assets/animations/maia/idle/frame_*.png",
  { eager: true }
);
const thinkingFrames: Record<string, { default: string }> = import.meta.glob(
  "../assets/animations/maia/thinking/frame_*.png",
  { eager: true }
);
const greetingFrames: Record<string, { default: string }> = import.meta.glob(
  "../assets/animations/maia/greeting/frame_*.png",
  { eager: true }
);

/** Sort glob results by filename and extract URL strings */
function resolveFrames(glob: Record<string, { default: string }>): string[] {
  return Object.entries(glob)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, mod]) => mod.default);
}

const FRAMES: Record<MaiaSpriteState, string[]> = {
  idle: resolveFrames(idleFrames),
  thinking: resolveFrames(thinkingFrames),
  greeting: resolveFrames(greetingFrames),
};

const FRAME_INTERVAL_MS = 200; // 5 FPS

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MaiaSprite({
  state,
  size = 40,
  className = "",
  onAnimationEnd,
}: MaiaSpriteProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stateRef = useRef(state);

  // Reset frame index when state changes
  useEffect(() => {
    stateRef.current = state;
    setFrameIndex(0);
  }, [state]);

  const tick = useCallback(() => {
    setFrameIndex((prev) => {
      const frames = FRAMES[stateRef.current];
      if (!frames || frames.length === 0) return 0;

      const next = prev + 1;

      // Greeting plays once then signals completion
      if (stateRef.current === "greeting" && next >= frames.length) {
        onAnimationEnd?.();
        return frames.length - 1; // hold last frame
      }

      return next % frames.length;
    });
  }, [onAnimationEnd]);

  // Animation loop
  useEffect(() => {
    intervalRef.current = setInterval(tick, FRAME_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [tick]);

  const frames = FRAMES[state];
  if (!frames || frames.length === 0) return null;

  const src = frames[Math.min(frameIndex, frames.length - 1)];

  return (
    <img
      src={src}
      alt={`mAIa ${state}`}
      width={size}
      height={size}
      className={className}
      style={{
        imageRendering: "pixelated",
        width: size,
        height: size,
      }}
      draggable={false}
    />
  );
}
