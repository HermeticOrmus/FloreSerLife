/**
 * Circular Progress Component
 *
 * SVG-based circular progress indicator with nature-inspired design.
 * Used in My Garden dashboard to visualize domain progress.
 *
 * @example
 * <CircularProgress value={75} size={120} strokeWidth={8} />
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CircularProgressProps {
  /** Progress value (0-100) */
  value: number;
  /** Size of the circle in pixels */
  size?: number;
  /** Stroke width in pixels */
  strokeWidth?: number;
  /** Color theme: garden or hive */
  theme?: 'garden' | 'hive';
  /** Optional label to display in center */
  label?: string;
  /** Additional CSS classes */
  className?: string;
}

export function CircularProgress({
  value,
  size = 100,
  strokeWidth = 8,
  theme = 'garden',
  label,
  className,
}: CircularProgressProps) {
  const normalizedValue = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (normalizedValue / 100) * circumference;

  // Theme colors using CSS variables from design system
  const colors = {
    garden: {
      track: 'var(--garden-card)',      // Very light cream sections
      progress: 'var(--garden-accent)', // Warm gold
      text: 'var(--garden-text-primary)', // Dark text
    },
    hive: {
      track: 'var(--hive-card-light)',  // Soft cream
      progress: 'var(--hive-accent)',   // Golden orange
      text: 'var(--hive-text-primary)', // Dark brown
    },
  };

  const themeColors = colors[theme];

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={themeColors.track}
          strokeWidth={strokeWidth}
        />

        {/* Progress circle with animation */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={themeColors.progress}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
          }}
        />
      </svg>

      {/* Center label */}
      {label && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <span
            className="font-serif font-medium"
            style={{ color: themeColors.text, fontSize: size * 0.15 }}
          >
            {label}
          </span>
        </motion.div>
      )}
    </div>
  );
}
