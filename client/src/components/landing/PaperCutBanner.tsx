import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BannerVariant = 'patterned-leaf' | 'plain-sage' | 'patterned-root' | 'plain-forest';

interface PaperCutBannerProps {
  variant: BannerVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BannerVariant, {
  bg: string;
  grain: string;
}> = {
  'patterned-leaf': {
    bg: 'bg-papercut-green-400',
    grain: 'paper-grain-dark',
  },
  'plain-sage': {
    bg: 'bg-papercut-green-100',
    grain: 'paper-grain',
  },
  'patterned-root': {
    bg: 'bg-papercut-earth-50',
    grain: 'paper-grain',
  },
  'plain-forest': {
    bg: 'bg-papercut-green-200',
    grain: 'paper-grain',
  },
};

/**
 * Banner section with solid brand colors
 * Used to wrap landing page content sections
 */
export function PaperCutBanner({ variant, children, className }: PaperCutBannerProps) {
  const styles = variantStyles[variant];

  return (
    <section
      className={cn(
        "relative py-16 md:py-20 lg:py-24 overflow-hidden",
        styles.bg,
        styles.grain,
        className
      )}
    >
      {/* Subtle shadow at top for depth */}
      <div
        className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black/[0.03] to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
}

export default PaperCutBanner;
