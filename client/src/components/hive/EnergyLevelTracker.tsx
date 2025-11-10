import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Battery, BatteryMedium, BatteryLow } from "lucide-react";

type EnergyLevel = "high" | "balanced" | "resting";

interface EnergyLevelTrackerProps {
  currentLevel?: EnergyLevel;
  onUpdateLevel?: (level: EnergyLevel) => void;
}

const energyLevels = [
  {
    value: "high" as const,
    label: "High Energy",
    description: "Fully available and vibrant",
    icon: Battery,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    borderColor: "border-green-300"
  },
  {
    value: "balanced" as const,
    label: "Balanced",
    description: "Steady and present",
    icon: BatteryMedium,
    color: "from-yellow-500 to-yellow-600",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
    borderColor: "border-yellow-300"
  },
  {
    value: "resting" as const,
    label: "Resting",
    description: "Honoring my need to restore",
    icon: BatteryLow,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-100",
    textColor: "text-orange-700",
    borderColor: "border-orange-300"
  }
];

export default function EnergyLevelTracker({ currentLevel = "balanced", onUpdateLevel }: EnergyLevelTrackerProps) {
  const [selectedLevel, setSelectedLevel] = useState<EnergyLevel>(currentLevel);
  const currentEnergyData = energyLevels.find(e => e.value === selectedLevel);

  const handleUpdateLevel = (level: EnergyLevel) => {
    setSelectedLevel(level);
    if (onUpdateLevel) {
      onUpdateLevel(level);
    }
  };

  return (
    <Card className="bg-hive-card-light border-0 rounded-card shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-hive-accent" />
            <CardTitle className="text-card-heading font-heading text-hive-text-primary">
              Energy Level Tracker
            </CardTitle>
          </div>
          {currentEnergyData && (
            <Badge className={`${currentEnergyData.bgColor} ${currentEnergyData.textColor} border ${currentEnergyData.borderColor}`}>
              {currentEnergyData.label}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-body-sm text-hive-text-secondary">
          Track and honor your energy levels. This helps you maintain sustainable practice and set appropriate boundaries.
        </p>

        <div className="grid gap-3">
          {energyLevels.map((level, index) => {
            const Icon = level.icon;
            const isSelected = selectedLevel === level.value;

            return (
              <motion.button
                key={level.value}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleUpdateLevel(level.value)}
                className={`
                  relative p-4 rounded-card text-left transition-all duration-300
                  ${isSelected
                    ? `${level.bgColor} border-2 ${level.borderColor} shadow-card-md`
                    : 'bg-hive-bg border-2 border-transparent hover:border-hive-accent/20 hover:shadow-card-sm'
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    ${isSelected ? `bg-gradient-to-br ${level.color}` : 'bg-hive-card-light'}
                  `}>
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-hive-text-secondary'}`} />
                  </div>

                  <div className="flex-1">
                    <p className={`text-body font-semibold ${isSelected ? level.textColor : 'text-hive-text-primary'}`}>
                      {level.label}
                    </p>
                    <p className="text-body-sm text-hive-text-secondary">
                      {level.description}
                    </p>
                  </div>

                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-card-sm"
                    >
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${level.color}`} />
                    </motion.div>
                  )}
                </div>

                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 pt-3 border-t border-hive-accent/10"
                  >
                    <p className="text-caption text-hive-text-secondary italic">
                      {level.value === "high" && "You're in a vibrant state. Great time for new sessions and creative work."}
                      {level.value === "balanced" && "You're steady and grounded. Ideal for most session work."}
                      {level.value === "resting" && "Honor this need for restoration. Consider lighter sessions or taking time off."}
                    </p>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="pt-4 border-t border-hive-accent/10">
          <p className="text-caption text-hive-text-secondary text-center italic">
            Your energy level is visible only to you and helps you maintain healthy boundaries.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
