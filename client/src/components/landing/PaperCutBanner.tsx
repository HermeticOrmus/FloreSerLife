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
  texture: string;
  fallbackBg: string;
}> = {
  'patterned-leaf': {
    texture: papercut.textures.flatForest,
    fallbackBg: 'bg-papercut-green-400',
  },
  'plain-sage': {
    texture: papercut.textures.flatSage,
    fallbackBg: 'bg-papercut-green-100',
  },
  'patterned-root': {
    texture: papercut.textures.flatCream,
    fallbackBg: 'bg-papercut-earth-50',
  },
  'plain-forest': {
    texture: papercut.textures.flatSage,
    fallbackBg: 'bg-papercut-green-200',
  },
};

/**
 * Banner section with flat paper textures
 * Used to wrap landing page content sections
 */
export function PaperCutBanner({ variant, children, className }: PaperCutBannerProps) {
  const styles = variantStyles[variant];

  return (
    <section
      className={cn(
        "relative py-16 md:py-20 lg:py-24 overflow-hidden",
        styles.fallbackBg,
        className
      )}
      style={{
        backgroundImage: `url(${styles.texture})`,
        backgroundSize: '512px 512px',
        backgroundRepeat: 'repeat',
      }}
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
