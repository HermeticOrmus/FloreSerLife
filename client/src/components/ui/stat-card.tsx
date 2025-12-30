import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  variant?: "hive" | "garden";
  className?: string;
  delay?: number;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  variant = "hive",
  className,
  delay = 0
}: StatCardProps) {
  const variantStyles = {
    hive: "bg-hive-card-light text-hive-text-primary",
    garden: "bg-garden-card text-garden-text-primary"
  };

  const labelStyles = {
    hive: "text-hive-text-secondary",
    garden: "text-garden-text-secondary"
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
    >
      <Card className={cn(
        "border-0 rounded-card shadow-card",
        variantStyles[variant],
        className
      )}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {Icon && (
              <div className={cn(
                "rounded-card-sm p-3",
                variant === "hive" ? "bg-hive-bg" : "bg-garden-container"
              )}>
                <Icon className={cn(
                  "w-6 h-6",
                  variant === "hive" ? "text-hive-accent" : "text-garden-accent"
                )} />
              </div>
            )}
            <div className="flex-1 space-y-2">
              <p className={cn("text-body-sm", labelStyles[variant])}>
                {label}
              </p>
              <p className="text-stat-lg font-heading">
                {value}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
