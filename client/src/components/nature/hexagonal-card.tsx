/**
 * Hexagonal Card Component
 *
 * Card with hexagonal shape using CSS clip-path.
 * Used in My Hive dashboard for facilitator-focused content.
 *
 * @example
 * <HexagonalCard variant="honey">
 *   <h3>Calendar</h3>
 *   <p>3 sessions today</p>
 * </HexagonalCard>
 */

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface HexagonalCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  /** Content to display inside the card */
  children: ReactNode;
  /** Visual variant based on hive theme */
  variant?: 'honey' | 'amber' | 'comb' | 'default';
  /** Optional hover animation */
  hoverable?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function HexagonalCard({
  children,
  variant = 'default',
  hoverable = true,
  className,
  ...motionProps
}: HexagonalCardProps) {
  // Variant styles
  const variantClasses = {
    honey: 'bg-hive-honey text-gray-900',
    amber: 'bg-hive-amber text-gray-900',
    comb: 'bg-hive-comb text-gray-800',
    default: 'bg-white border-2 border-hive-gold/20 text-gray-900',
  };

  return (
    <motion.div
      className={cn(
        'relative p-6',
        variantClasses[variant],
        hoverable && 'cursor-pointer transition-all duration-300',
        className
      )}
      style={{
        clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
      }}
      whileHover={
        hoverable
          ? {
              scale: 1.05,
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
      <div className="h-full flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </motion.div>
  );
}
