import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  // Base styles with custom tokens
  "inline-flex items-center gap-1.5 rounded-badge border px-3 py-1 text-caption font-medium transition-all duration-200",
  {
    variants: {
      variant: {
        // Default - warm gold accent
        default: "border-gold/30 bg-gold/10 text-gold hover:bg-gold/20",

        // Secondary - soft earth
        secondary: "border-earth-200 bg-earth-100 text-earth-600 hover:bg-earth-200",

        // Subtle - minimal presence
        subtle: "border-sage/20 bg-sage/5 text-forest/80 hover:bg-sage/10",

        // Outline - clean border only
        outline: "border-sage/40 bg-transparent text-forest",

        // Success - gentle green
        success: "border-light-green/30 bg-light-green/10 text-forest hover:bg-light-green/20",

        // Warning - soft gold
        warning: "border-gold/40 bg-gold/15 text-earth-700 hover:bg-gold/25",

        // Destructive - softened for wellness
        destructive: "border-subtle-rose/30 bg-subtle-rose/10 text-earth-700 hover:bg-subtle-rose/20",

        // === POLLINATOR ARCHETYPE BADGES ===

        // Bee - structured warmth
        bee: [
          "border-hive-accent/40 bg-gradient-to-r from-hive-accent/20 to-hive-accent-light/20",
          "text-hive-text-primary",
          "hover:from-hive-accent/30 hover:to-hive-accent-light/30",
        ].join(" "),

        // Butterfly - transformational glow
        butterfly: [
          "border-garden-accent/30 bg-gradient-to-r from-garden-accent/15 via-gold/10 to-garden-accent-light/15",
          "text-garden-text-primary",
          "hover:from-garden-accent/25 hover:via-gold/20 hover:to-garden-accent-light/25",
        ].join(" "),

        // Beetle - grounded depth
        beetle: [
          "border-earth-400 bg-gradient-to-b from-earth-100 to-earth-200",
          "text-earth-700",
          "hover:from-earth-200 hover:to-earth-300",
        ].join(" "),

        // Hummingbird - dynamic energy
        hummingbird: [
          "border-gold/50 bg-gold/20 text-earth-800",
          "hover:bg-gold/30 hover:scale-105",
          "transition-all duration-150",
        ].join(" "),

        // === SECTION BADGES ===

        // Hive section
        hive: "border-hive-accent/30 bg-hive-accent/10 text-hive-text-primary",

        // Garden section
        garden: "border-garden-accent/30 bg-garden-accent/10 text-garden-text-primary",

        // === TIER BADGES (Seeds System) ===

        // Seedling tier
        seedling: "border-earth-300 bg-earth-100 text-earth-600",

        // Sprout tier
        sprout: "border-light-green/40 bg-light-green/15 text-forest",

        // Blooming tier
        blooming: "border-garden-accent/40 bg-garden-accent/20 text-garden-text-primary",

        // Wise Garden tier
        wiseGarden: "border-gold/50 bg-gradient-to-r from-gold/20 to-hive-accent/20 text-earth-800",
      },
      size: {
        default: "px-3 py-1 text-caption",
        sm: "px-2 py-0.5 text-[11px]",
        lg: "px-4 py-1.5 text-body-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
