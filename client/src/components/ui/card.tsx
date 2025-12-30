import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva(
  // Base card styles with custom tokens
  "rounded-card bg-card text-card-foreground transition-all duration-300",
  {
    variants: {
      variant: {
        // Default - clean with warm shadows
        default: "border border-sage/20 shadow-card hover:shadow-card-hover",

        // Elevated - more prominent
        elevated: "shadow-card-md hover:shadow-card-lg border-0",

        // Flat - minimal shadow
        flat: "border border-earth-200 shadow-card-sm",

        // === SECTION VARIANTS ===

        // Hive section - warm, grounded
        hive: [
          "bg-gradient-to-br from-hive-card-light to-white",
          "border-2 border-hive-accent/20",
          "shadow-card hover:shadow-card-hover",
          "hover:border-hive-accent/30",
        ].join(" "),

        // Garden section - fresh, growing
        garden: [
          "bg-gradient-to-br from-garden-card to-white",
          "border border-garden-accent/20",
          "shadow-card-sm hover:shadow-card",
          "hover:border-garden-accent/30",
        ].join(" "),

        // Glass effect - modern glassmorphism
        glass: [
          "bg-white/60 backdrop-blur-md",
          "border border-white/30",
          "shadow-card-lg hover:shadow-card-xl",
        ].join(" "),

        // === ARCHETYPE VARIANTS ===

        // Bee - structured, hexagonal energy
        bee: [
          "bg-gradient-to-br from-hive-card-light via-white to-hive-bg/10",
          "border-2 border-hive-accent/30",
          "shadow-card hover:shadow-card-hover",
          "relative overflow-hidden",
          // Decorative hexagonal element
          "before:absolute before:top-0 before:right-0 before:w-32 before:h-32",
          "before:bg-hive-accent/5 before:rounded-full before:-translate-y-1/2 before:translate-x-1/2",
          "before:transition-transform before:duration-500 hover:before:scale-110",
        ].join(" "),

        // Butterfly - flowing, transformational
        butterfly: [
          "bg-gradient-to-br from-white via-garden-card to-garden-accent/5",
          "border border-garden-accent/20",
          "shadow-card-md hover:shadow-card-lg",
          "hover:scale-[1.01] hover:-rotate-[0.5deg]",
          "transition-all duration-500",
        ].join(" "),

        // Beetle - grounded, deep
        beetle: [
          "bg-gradient-to-b from-earth-50 to-earth-100",
          "border-2 border-earth-300",
          "shadow-inner-soft hover:shadow-card",
        ].join(" "),

        // Hummingbird - dynamic, light
        hummingbird: [
          "bg-white",
          "border border-gold/30",
          "shadow-card-lg hover:shadow-card-xl",
          "hover:scale-[1.02]",
          "transition-all duration-200",
        ].join(" "),

        // Interactive - for clickable cards
        interactive: [
          "border border-sage/20 shadow-card",
          "hover:shadow-card-hover hover:scale-[1.01]",
          "cursor-pointer active:scale-[0.99]",
        ].join(" "),
      },
      padding: {
        default: "",
        none: "",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, className }))}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Use custom typography token instead of generic
      "font-heading text-card-heading leading-none tracking-tight text-earth-800",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-body-sm text-earth-500", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants }
