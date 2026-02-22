/**
 * Hexagon Grid Component
 *
 * Displays 6 hexagonal cards in a responsive grid layout
 * with staggered reveal animation.
 */

import { motion } from 'framer-motion';
import { PaperCutHexCard } from '@/components/nature/PaperCutHexCard';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface HexItem {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  color: 'deep-sage' | 'olive-resin' | 'claystone' | 'forest-earth' | 'dew-gold' | 'tudor-red';
}

interface HexagonGridProps {
  items: HexItem[];
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

export function HexagonGrid({ items, className }: HexagonGridProps) {
  return (
    <motion.div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8',
        'max-w-5xl mx-auto px-4',
        className
      )}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      {items.map((item) => (
        <motion.div
          key={item.id}
          variants={itemVariants}
          className="flex justify-center"
        >
          <PaperCutHexCard
            color={item.color}
            className="w-48 h-52 md:w-56 md:h-60"
          >
            <item.icon className="w-10 h-10 mb-3 drop-shadow-sm text-inherit" />
            <h3 className="font-heading text-card-heading mb-2 drop-shadow-sm text-inherit">
              {item.title}
            </h3>
            <p className="text-body-sm drop-shadow-sm leading-relaxed text-inherit">
              {item.description}
            </p>
          </PaperCutHexCard>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default HexagonGrid;
