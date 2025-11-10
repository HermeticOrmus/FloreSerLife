/**
 * Honey Loader Component
 *
 * Honey drip animation for My Hive loading states.
 * Embodies productivity and sweet reward.
 *
 * @example
 * <HoneyLoader message="Gathering nectar..." />
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HoneyLoaderProps {
  /** Optional loading message */
  message?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

export function HoneyLoader({
  message = 'Loading...',
  size = 'md',
  className,
}: HoneyLoaderProps) {
  const sizes = {
    sm: { container: 'h-12', drop: 'w-4 h-6', pool: 'w-12 h-2', text: 'text-sm' },
    md: { container: 'h-16', drop: 'w-6 h-8', pool: 'w-16 h-3', text: 'text-base' },
    lg: { container: 'h-24', drop: 'w-8 h-12', pool: 'w-24 h-4', text: 'text-lg' },
  };

  const dimensions = sizes[size];

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      {/* Honey drip animation */}
      <div className={cn('relative flex flex-col items-center', dimensions.container)}>
        {/* Honey source (top) */}
        <div className="w-8 h-1 bg-hive-amber rounded-full" />

        {/* Dripping honey drops */}
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={cn('absolute bg-hive-honey rounded-full', dimensions.drop)}
            initial={{
              y: -10,
              opacity: 0,
              scale: 0.5,
            }}
            animate={{
              y: 50,
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1, 1, 0.8],
            }}
            transition={{
              duration: 1.5,
              delay: index * 0.5,
              repeat: Infinity,
              ease: 'easeIn',
            }}
            style={{
              top: 0,
              clipPath: 'polygon(40% 0%, 60% 0%, 50% 100%)',
            }}
          />
        ))}

        {/* Honey pool (bottom) */}
        <motion.div
          className={cn('absolute bottom-0 bg-hive-honey rounded-full', dimensions.pool)}
          animate={{
            scaleX: [1, 1.1, 1],
            scaleY: [1, 0.9, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Loading message */}
      {message && (
        <motion.p
          className={cn('font-body text-hive-gold', dimensions.text)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.3,
          }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}
