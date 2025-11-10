/**
 * Bloom Animation Component
 *
 * Flower unfurling animation with customizable petals.
 * Used for celebration moments and milestone achievements.
 *
 * @example
 * <BloomAnimation petalCount={6} color="garden-bloom" />
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BloomAnimationProps {
  /** Number of petals (4-12) */
  petalCount?: number;
  /** Petal color (Tailwind class or hex) */
  color?: string;
  /** Size of the bloom in pixels */
  size?: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Whether to repeat the animation */
  repeat?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function BloomAnimation({
  petalCount = 6,
  color = '#F4C2C2', // garden-bloom
  size = 120,
  duration = 1.5,
  repeat = false,
  className,
}: BloomAnimationProps) {
  // Constrain petal count to reasonable range
  const petals = Math.min(12, Math.max(4, petalCount));
  const petalAngle = 360 / petals;

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      {/* Center of flower */}
      <motion.div
        className="absolute rounded-full bg-hive-gold"
        style={{ width: size * 0.2, height: size * 0.2 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          delay: duration * 0.5,
          duration: duration * 0.3,
          ease: 'easeOut',
        }}
      />

      {/* Petals */}
      {Array.from({ length: petals }).map((_, index) => {
        const angle = index * petalAngle;
        const rotation = angle - 90; // Start from top

        return (
          <motion.div
            key={index}
            className="absolute"
            style={{
              width: size * 0.3,
              height: size * 0.5,
              transformOrigin: 'center bottom',
              top: '50%',
              left: '50%',
            }}
            initial={{
              scale: 0,
              rotate: rotation,
              x: '-50%',
              y: '-100%',
            }}
            animate={{
              scale: 1,
              rotate: rotation + (index % 2 === 0 ? 5 : -5), // Slight rotation variation
              x: '-50%',
              y: '-100%',
            }}
            transition={{
              delay: index * 0.1,
              duration: duration,
              ease: 'easeOut',
              repeat: repeat ? Infinity : 0,
              repeatType: 'reverse',
              repeatDelay: 1,
            }}
          >
            {/* Petal shape using SVG */}
            <svg
              viewBox="0 0 30 50"
              fill={color}
              className="drop-shadow-sm"
            >
              <ellipse
                cx="15"
                cy="40"
                rx="14"
                ry="30"
                className="opacity-90"
              />
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
}
