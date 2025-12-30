/**
 * Paper-Cut Hexagonal Card Component
 *
 * Enhanced hexagonal card with embossed depth effect
 * for the paper-cut landing page aesthetic.
 */

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { papercut } from '@/assets';

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

// Map colors to paper textures (ensure contrast with section backgrounds)
const colorTextures: Record<HexColor, string> = {
  'deep-sage': papercut.textures.paperForest,  // Darker to contrast with sage section bg
  'olive-resin': papercut.textures.paperForest,
  'claystone': papercut.textures.paperUI,
  'forest-earth': papercut.textures.paperForest,  // Darker to contrast with sage section bg
  'dew-gold': papercut.textures.paperGold,
  'tudor-red': papercut.textures.paperCrimson,
};

const textColorClasses: Record<HexColor, string> = {
  'deep-sage': 'text-white',
  'olive-resin': 'text-white',
  'claystone': 'text-papercut-neutral-dark',
  'forest-earth': 'text-white',  // Changed to white for contrast
  'dew-gold': 'text-papercut-neutral-dark',
  'tudor-red': 'text-white',
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
        textColorClasses[color],
        'shadow-hex-emboss',
        hoverable && 'cursor-pointer',
        className
      )}
      style={{
        clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
        backgroundImage: `url(${colorTextures[color]})`,
        backgroundSize: '200px 200px',
        backgroundRepeat: 'repeat',
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
