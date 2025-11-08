import { Button, ButtonProps } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ActionButtonProps extends Omit<ButtonProps, "variant"> {
  variant?: "hive" | "garden";
  icon?: LucideIcon;
  children: React.ReactNode;
  animated?: boolean;
  delay?: number;
}

export function ActionButton({
  variant = "hive",
  icon: Icon,
  children,
  animated = false,
  delay = 0,
  className,
  ...props
}: ActionButtonProps) {
  const variantStyles = {
    hive: {
      primary: "bg-hive-accent hover:bg-hive-accent-light text-hive-text-on-accent",
      secondary: "bg-hive-card-light hover:bg-hive-bg text-hive-text-primary border border-hive-accent/20",
      gradient: "bg-gradient-to-br from-hive-accent to-hive-accent-light hover:opacity-90 text-hive-text-on-accent"
    },
    garden: {
      primary: "bg-garden-accent hover:bg-garden-accent/90 text-white",
      secondary: "bg-garden-card hover:bg-garden-container text-garden-text-primary border border-garden-accent/20",
      gradient: "bg-gradient-to-r from-garden-accent to-garden-accent-light hover:opacity-90 text-white"
    }
  };

  const baseStyle = variantStyles[variant].primary;

  const button = (
    <Button
      className={cn(
        "rounded-button text-label font-medium transition-all duration-300",
        baseStyle,
        className
      )}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </Button>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {button}
      </motion.div>
    );
  }

  return button;
}

// Specialized button variants
export function GradientActionButton({
  variant = "hive",
  ...props
}: ActionButtonProps) {
  const gradientStyles = {
    hive: "bg-gradient-to-br from-hive-accent to-hive-accent-light hover:opacity-90 text-hive-text-on-accent shadow-card-md",
    garden: "bg-gradient-to-r from-garden-accent to-garden-accent-light hover:opacity-90 text-white shadow-card-md"
  };

  return (
    <ActionButton
      {...props}
      variant={variant}
      className={cn(gradientStyles[variant], props.className)}
    />
  );
}

export function OutlineActionButton({
  variant = "hive",
  ...props
}: ActionButtonProps) {
  const outlineStyles = {
    hive: "bg-transparent hover:bg-hive-accent hover:text-hive-text-on-accent text-hive-accent border-2 border-hive-accent",
    garden: "bg-transparent hover:bg-garden-accent hover:text-white text-garden-accent border-2 border-garden-accent"
  };

  return (
    <ActionButton
      {...props}
      variant={variant}
      className={cn(outlineStyles[variant], props.className)}
    />
  );
}
