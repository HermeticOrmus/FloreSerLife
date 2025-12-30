/**
 * Pollinator Icon Component
 *
 * Wrapper component for archetype icons with consistent styling
 * and optional animation effects.
 *
 * @example
 * <PollinatorIcon archetype="bee" size="md" animated />
 */

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

// Import existing icon components (using available Lucide icons)
import { Sparkles, Bird, Bug, Leaf } from 'lucide-react';

type PollinatorArchetype = 'bee' | 'hummingbird' | 'butterfly' | 'beetle';

interface PollinatorIconProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  /** Pollinator archetype */
  archetype: PollinatorArchetype;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Whether to animate on hover */
  animated?: boolean;
  /** Color theme */
  theme?: 'garden' | 'hive' | 'default';
  /** Additional CSS classes */
  className?: string;
}

// Map archetypes to icons (using Lucide icons as placeholders)
// TODO: Replace with custom SVG icons from brand assets
const archetypeIcons: Record<PollinatorArchetype, typeof Sparkles> = {
  bee: Sparkles, // Temporary - replace with actual bee icon
  hummingbird: Bird,
  butterfly: Leaf, // Temporary - replace with actual butterfly icon
  beetle: Bug,
};

// Map archetypes to colors
const archetypeColors: Record<PollinatorArchetype, string> = {
  bee: '#F4C430', // hive-honey
  hummingbird: '#E07A5F', // hive-nectar
  butterfly: '#F4C2C2', // garden-bloom
  beetle: '#8B7355', // garden-soil
};

export function PollinatorIcon({
  archetype,
  size = 'md',
  animated = true,
  theme = 'default',
  className,
  ...motionProps
}: PollinatorIconProps) {
  const IconComponent = archetypeIcons[archetype];
  const defaultColor = archetypeColors[archetype];

  // Size mappings
  const sizes = {
    sm: { container: 'w-8 h-8', icon: 16 },
    md: { container: 'w-12 h-12', icon: 24 },
    lg: { container: 'w-16 h-16', icon: 32 },
    xl: { container: 'w-24 h-24', icon: 48 },
  };

  const dimensions = sizes[size];

  // Theme colors
  const themeClasses = {
    garden: 'bg-garden-mist border-garden-leaf',
    hive: 'bg-hive-wax border-hive-amber',
    default: 'bg-white border-gray-200',
  };

  return (
    <motion.div
      className={cn(
        'relative rounded-full border-2 flex items-center justify-center',
        dimensions.container,
        themeClasses[theme],
        className
      )}
      whileHover={
        animated
          ? {
              scale: 1.1,
              rotate: 5,
              transition: { duration: 0.3 },
            }
          : undefined
      }
      {...motionProps}
    >
      <IconComponent
        size={dimensions.icon}
        style={{ color: defaultColor }}
        strokeWidth={2}
      />
    </motion.div>
  );
}
