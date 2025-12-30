import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  // Base input styles with custom tokens
  [
    "flex h-11 w-full rounded-input border bg-white px-4 py-2",
    "text-body text-earth-800 placeholder:text-earth-400",
    "transition-all duration-300",
    "file:border-0 file:bg-transparent file:text-body-sm file:font-medium file:text-forest",
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-earth-50",
  ].join(" "),
  {
    variants: {
      variant: {
        // Default - clean with nature-inspired focus
        default: [
          "border-sage/30",
          "focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20",
          "hover:border-sage/50",
        ].join(" "),

        // Hive section - warm focus
        hive: [
          "border-hive-accent/30 bg-hive-card-light/30",
          "focus:outline-none focus:border-hive-accent focus:ring-2 focus:ring-hive-accent/20",
          "hover:border-hive-accent/50",
        ].join(" "),

        // Garden section - fresh focus
        garden: [
          "border-garden-accent/30 bg-garden-card/30",
          "focus:outline-none focus:border-garden-accent focus:ring-2 focus:ring-garden-accent/20",
          "hover:border-garden-accent/50",
        ].join(" "),

        // Search - rounded with subtle styling
        search: [
          "rounded-full border-earth-200 bg-earth-50/50 pl-10",
          "focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 focus:bg-white",
          "hover:bg-white hover:border-earth-300",
        ].join(" "),

        // Ghost - minimal presence
        ghost: [
          "border-transparent bg-transparent",
          "focus:outline-none focus:bg-sage/5 focus:border-sage/20",
          "hover:bg-sage/5",
        ].join(" "),

        // Glass - glassmorphism effect
        glass: [
          "border-white/30 bg-white/40 backdrop-blur-sm",
          "focus:outline-none focus:border-white/60 focus:ring-2 focus:ring-white/30 focus:bg-white/60",
          "hover:bg-white/50",
        ].join(" "),
      },
      inputSize: {
        default: "h-11 px-4 text-body",
        sm: "h-9 px-3 text-body-sm",
        lg: "h-13 px-5 text-body-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
)

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, inputSize, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, inputSize, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
