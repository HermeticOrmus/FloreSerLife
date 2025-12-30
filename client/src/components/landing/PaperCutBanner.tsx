import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { papercut } from "@/assets";

type BannerVariant = 'patterned-leaf' | 'plain-sage' | 'patterned-root' | 'plain-forest';

interface PaperCutBannerProps {
  variant: BannerVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BannerVariant, {
  bg: string;
  texture: string;
  pattern?: string;
  patternOpacity?: string;
}> = {
  'patterned-leaf': {
    bg: 'bg-papercut-green-400',
    texture: papercut.textures.paperForest,
    pattern: 'bg-pattern-leaves',
    patternOpacity: 'opacity-[0.08]',
  },
  'plain-sage': {
    bg: 'bg-papercut-green-100',
    texture: papercut.textures.paperSage,
  },
  'patterned-root': {
    bg: 'bg-papercut-earth-50',
    texture: papercut.textures.paperClay,
    pattern: 'bg-pattern-roots',
    patternOpacity: 'opacity-[0.06]',
  },
  'plain-forest': {
    bg: 'bg-papercut-green-200',
    texture: papercut.textures.paperForest,  // Changed from paperSage to avoid repetition
  },
};

/**
 * Paper-cut style banner section with optional pattern overlay
 * Used to wrap landing page content sections
 */
export function PaperCutBanner({ variant, children, className }: PaperCutBannerProps) {
  const styles = variantStyles[variant];

  return (
    <section
      className={cn(
        "relative py-16 md:py-20 lg:py-24 overflow-hidden",
        className
      )}
      style={{
        backgroundImage: `url(${styles.texture})`,
        backgroundSize: '512px 512px',
        backgroundRepeat: 'repeat',
      }}
    >
      {/* Pattern overlay layer */}
      {styles.pattern && (
        <div
          className={cn(
            "absolute inset-0 pointer-events-none",
            styles.pattern,
            styles.patternOpacity
          )}
          aria-hidden="true"
        />
      )}

      {/* Paper shadow at top for depth */}
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
