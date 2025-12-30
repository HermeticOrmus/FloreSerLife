import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base styles with custom tokens instead of generic ones
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-button text-label font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary action - warm gold
        default: "bg-gold text-white shadow-card-sm hover:shadow-card hover:scale-[1.02] active:scale-[0.98]",

        // Destructive - softened for wellness context
        destructive: "bg-subtle-rose/80 text-earth-800 hover:bg-subtle-rose shadow-card-sm",

        // Outline - organic border feel
        outline: "border-2 border-sage/40 bg-transparent text-forest hover:bg-sage/10 hover:border-sage/60",

        // Secondary - soft earth tones
        secondary: "bg-earth-100 text-earth-700 hover:bg-earth-200 shadow-card-sm",

        // Ghost - minimal presence
        ghost: "text-forest hover:bg-sage/10 hover:text-forest/90",

        // Link - understated
        link: "text-gold underline-offset-4 hover:underline hover:text-gold/80",

        // === POLLINATOR ARCHETYPE VARIANTS ===

        // Bee - hexagonal energy, grounded warmth, structured
        bee: [
          "bg-gradient-to-br from-hive-accent to-hive-accent-light",
          "text-white font-semibold",
          "shadow-card hover:shadow-card-hover",
          "hover:scale-[1.03] active:scale-[0.98]",
          "border border-hive-accent/20",
        ].join(" "),

        // Butterfly - transformational, flowing, ethereal
        butterfly: [
          "bg-gradient-to-r from-garden-accent via-gold to-garden-accent-light",
          "text-white font-medium",
          "shadow-card-md hover:shadow-card-lg",
          "hover:scale-[1.02] hover:rotate-1 active:scale-[0.98]",
          "transition-all duration-500",
        ].join(" "),

        // Beetle - grounded, deep, foundational (rich amber-brown)
        beetle: [
          "bg-amber-700 text-white",
          "shadow-card hover:shadow-card-lg",
          "border-2 border-amber-600",
          "hover:bg-amber-600 active:bg-amber-800",
          "transition-all duration-300",
        ].join(" "),

        // Hummingbird - dynamic, quick, vibrant
        hummingbird: [
          "bg-gold text-white",
          "rounded-full shadow-card-lg",
          "hover:shadow-card-xl hover:animate-float",
          "transition-all duration-200",
          "hover:scale-[1.05] active:scale-[0.95]",
        ].join(" "),

        // === SECTION-SPECIFIC VARIANTS ===

        // Hive section primary
        hivePrimary: [
          "bg-hive-accent text-hive-text-on-accent",
          "shadow-card hover:shadow-card-hover",
          "hover:bg-hive-accent-light",
        ].join(" "),

        // Garden section primary
        gardenPrimary: [
          "bg-garden-accent text-white",
          "shadow-card hover:shadow-card-hover",
          "hover:bg-garden-accent-light",
        ].join(" "),

        // Glass effect - modern glassmorphism
        glass: [
          "bg-white/60 backdrop-blur-md",
          "text-forest border border-white/30",
          "shadow-card-lg hover:shadow-card-xl",
          "hover:bg-white/70",
        ].join(" "),
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-4 text-caption",
        lg: "h-12 px-8 text-body",
        xl: "h-14 px-10 text-body-lg font-semibold",
        icon: "h-10 w-10 rounded-full",
        iconSm: "h-8 w-8 rounded-full",
        iconLg: "h-12 w-12 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
