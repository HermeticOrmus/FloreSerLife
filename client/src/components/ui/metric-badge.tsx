import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MetricBadgeProps {
  value: string | number;
  label: string;
  icon?: LucideIcon;
  variant?: "hive" | "garden";
  size?: "sm" | "md" | "lg";
  className?: string;
  delay?: number;
}

export function MetricBadge({
  value,
  label,
  icon: Icon,
  variant = "hive",
  size = "md",
  className,
  delay = 0
}: MetricBadgeProps) {
  const sizeStyles = {
    sm: {
      value: "text-stat-md",
      label: "text-caption",
      icon: "w-4 h-4"
    },
    md: {
      value: "text-stat-lg",
      label: "text-body-sm",
      icon: "w-5 h-5"
    },
    lg: {
      value: "text-stat-xl",
      label: "text-body",
      icon: "w-6 h-6"
    }
  };

  const variantStyles = {
    hive: {
      value: "text-hive-text-primary",
      label: "text-hive-text-secondary",
      icon: "text-hive-accent"
    },
    garden: {
      value: "text-garden-text-primary",
      label: "text-garden-text-secondary",
      icon: "text-garden-accent"
    }
  };

  const sizeStyle = sizeStyles[size];
  const variantStyle = variantStyles[variant];

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay }}
      className={cn("flex flex-col items-center space-y-1", className)}
    >
      {Icon && (
        <div className="mb-2">
          <Icon className={cn(sizeStyle.icon, variantStyle.icon)} />
        </div>
      )}
      <p className={cn(
        "font-heading",
        sizeStyle.value,
        variantStyle.value
      )}>
        {value}
      </p>
      <p className={cn(
        sizeStyle.label,
        variantStyle.label
      )}>
        {label}
      </p>
    </motion.div>
  );
}
