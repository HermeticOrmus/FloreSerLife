import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SessionCardProps {
  title?: string;
  facilitatorName: string;
  dateTime: string;
  onEnterSession?: () => void;
  variant?: "hive" | "garden";
  className?: string;
  delay?: number;
}

export function SessionCard({
  title = "Your Next Session",
  facilitatorName,
  dateTime,
  onEnterSession,
  variant = "garden",
  className,
  delay = 0
}: SessionCardProps) {
  const variantStyles = {
    hive: {
      card: "bg-hive-card-light",
      title: "text-hive-text-primary",
      name: "text-hive-text-primary",
      date: "text-hive-text-secondary",
      button: "bg-hive-accent hover:bg-hive-accent-light text-hive-text-on-accent"
    },
    garden: {
      card: "bg-garden-card",
      title: "text-garden-text-primary",
      name: "text-garden-text-primary",
      date: "text-garden-text-secondary",
      button: "bg-garden-accent hover:bg-garden-accent/90 text-white"
    }
  };

  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
    >
      <Card className={cn(
        "border-0 rounded-card-lg shadow-card",
        styles.card,
        className
      )}>
        <CardHeader>
          <CardTitle className={cn(
            "text-card-subheading font-heading",
            styles.title
          )}>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className={cn(
              "text-card-heading font-heading",
              styles.name
            )}>
              {facilitatorName}
            </h3>
            <p className={cn("text-body-sm", styles.date)}>
              {dateTime}
            </p>
          </div>
          {onEnterSession && (
            <Button
              onClick={onEnterSession}
              className={cn(
                "w-full rounded-button text-label",
                styles.button
              )}
            >
              Enter Session
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
