import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor = "text-gold",
  trend
}: StatCardProps) {
  return (
    <Card className="border-sage/20 hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-forest/80">
          {title}
        </CardTitle>
        {Icon && <Icon className={`h-4 w-4 ${iconColor}`} />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-forest mb-1">
          {value}
        </div>
        {(description || trend) && (
          <div className="flex items-center space-x-2 text-xs">
            {description && (
              <span className="text-forest/60">
                {description}
              </span>
            )}
            {trend && (
              <span className={`font-medium ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend.isPositive ? '+' : ''}{trend.value}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}