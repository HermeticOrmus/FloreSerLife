/**
 * Nature Loader Component
 *
 * Seedling sprout animation for My Garden loading states.
 * Embodies the theme of growth and patience.
 *
 * @example
 * <NatureLoader message="Tending your garden..." />
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NatureLoaderProps {
  /** Optional loading message */
  message?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

export function NatureLoader({
  message = 'Loading...',
  size = 'md',
  className,
}: NatureLoaderProps) {
  const sizes = {
    sm: { container: 'h-12', stem: 'h-8', leaf: 'w-2 h-3', text: 'text-sm' },
    md: { container: 'h-16', stem: 'h-12', leaf: 'w-3 h-4', text: 'text-base' },
    lg: { container: 'h-24', stem: 'h-20', leaf: 'w-4 h-6', text: 'text-lg' },
  };

  const dimensions = sizes[size];

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      {/* Seedling animation */}
      <div className={cn('relative flex items-end justify-center', dimensions.container)}>
        {/* Soil base */}
        <div className="absolute bottom-0 w-16 h-2 bg-garden-soil rounded-full" />

        {/* Growing stem */}
        <motion.div
          className={cn('w-1 bg-garden-stem rounded-t-full', dimensions.stem)}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{
            duration: 1.2,
            ease: 'easeOut',
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{ transformOrigin: 'bottom' }}
        />

        {/* Left leaf */}
        <motion.div
          className={cn(
            'absolute left-1/2 -translate-x-3 bg-garden-leaf rounded-tl-full rounded-br-full',
            dimensions.leaf
          )}
          initial={{ rotate: 0, opacity: 0 }}
          animate={{ rotate: -45, opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.4,
            ease: 'easeOut',
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{ top: '30%' }}
        />

        {/* Right leaf */}
        <motion.div
          className={cn(
            'absolute right-1/2 translate-x-3 bg-garden-leaf rounded-tr-full rounded-bl-full',
            dimensions.leaf
          )}
          initial={{ rotate: 0, opacity: 0 }}
          animate={{ rotate: 45, opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.6,
            ease: 'easeOut',
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{ top: '30%' }}
        />
      </div>

      {/* Loading message */}
      {message && (
        <motion.p
          className={cn('font-body text-garden-stem', dimensions.text)}
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
