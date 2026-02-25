/**
 * Paper-Cut Hexagonal Card Component
 *
 * Enhanced hexagonal card with embossed depth effect
 * for the paper-cut landing page aesthetic.
 */

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type HexColor = 'deep-sage' | 'olive-resin' | 'claystone' | 'forest-earth' | 'dew-gold' | 'tudor-red';

interface PaperCutHexCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  color?: HexColor;
  hoverable?: boolean;
  className?: string;
}

const colorClasses: Record<HexColor, string> = {
  'deep-sage': '',
  'olive-resin': '',
  'claystone': '',
  'forest-earth': '',
  'dew-gold': '',
  'tudor-red': '',
};

// Map colors to solid CSS background colors (replaces paper texture images)
const colorTextures: Record<HexColor, string> = {
  'deep-sage': '#4A6741',
  'olive-resin': '#6E7B60',
  'claystone': '#D7C3A8',
  'forest-earth': '#4A6741',
  'dew-gold': '#D4AF37',
  'tudor-red': '#A23C40',
};

// Text colors for contrast - using CSS variables from design system
const textColors: Record<HexColor, string> = {
  'deep-sage': 'var(--background-cream)',
  'olive-resin': 'var(--background-cream)',
  'claystone': 'var(--primary-forest)',
  'forest-earth': 'var(--background-cream)',
  'dew-gold': 'var(--primary-forest)',
  'tudor-red': 'var(--background-cream)',
};

export function PaperCutHexCard({
  children,
  color = 'deep-sage',
  hoverable = true,
  className,
  ...motionProps
}: PaperCutHexCardProps) {
  return (
    <motion.div
      className={cn(
        'relative p-8',
        colorClasses[color],
        'shadow-hex-emboss',
        hoverable && 'cursor-pointer',
        className
      )}
      style={{
        clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
        backgroundColor: colorTextures[color],
        color: textColors[color],
      }}
      whileHover={
        hoverable
          ? {
              scale: 1.05,
              y: -4,
              transition: { duration: 0.2 },
            }
          : undefined
      }
      whileTap={
        hoverable
          ? {
              scale: 0.98,
              transition: { duration: 0.1 },
            }
          : undefined
      }
      {...motionProps}
    >
      {/* Embossed highlight layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(0,0,0,0.08) 100%)',
        }}
        aria-hidden="true"
      />

      <div className="relative h-full flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </motion.div>
  );
}

export default PaperCutHexCard;
