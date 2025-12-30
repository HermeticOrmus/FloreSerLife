import { motion } from "framer-motion";
import { Flower2, Heart, Brain, Sparkles, Palette, Users } from "lucide-react";

interface GrowthMandalaProps {
  progress?: {
    body?: number;
    emotion?: number;
    mind?: number;
    spirit?: number;
    creativity?: number;
    connection?: number;
  };
}

const domains = [
  { key: "body", label: "Body", icon: Sparkles, color: "rgb(156, 125, 88)" },
  { key: "emotion", label: "Emotion", icon: Heart, color: "rgb(189, 147, 99)" },
  { key: "mind", label: "Mind", icon: Brain, color: "rgb(124, 148, 114)" },
  { key: "spirit", label: "Spirit", icon: Sparkles, color: "rgb(214, 188, 165)" },
  { key: "creativity", label: "Creativity", icon: Palette, color: "rgb(156, 125, 88)" },
  { key: "connection", label: "Connection", icon: Users, color: "rgb(189, 147, 99)" }
];

export default function GrowthMandala({ progress = {} }: GrowthMandalaProps) {
  const defaultProgress = {
    body: 0,
    emotion: 0,
    mind: 0,
    spirit: 0,
    creativity: 0,
    connection: 0,
    ...progress
  };

  // Calculate positions for 6 petals in a circle
  const petalSize = 44; // pixels
  const centerSize = 56; // pixels
  const containerSize = 200; // pixels
  const radius = 70; // distance from center in pixels

  return (
    <div
      className="relative"
      style={{ width: containerSize, height: containerSize }}
    >
      {/* 6 Petals representing the domains */}
      {domains.map((domain, i) => {
        // Start from top (-90 degrees) and go clockwise
        const angle = ((i * 60) - 90) * (Math.PI / 180);
        const x = (containerSize / 2) + radius * Math.cos(angle) - (petalSize / 2);
        const y = (containerSize / 2) + radius * Math.sin(angle) - (petalSize / 2);
        const progressValue = defaultProgress[domain.key as keyof typeof defaultProgress] || 0;
        const Icon = domain.icon;

        return (
          <motion.div
            key={domain.key}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.08, type: "spring" }}
            className="absolute group cursor-pointer"
            style={{
              top: y,
              left: x,
              width: petalSize,
              height: petalSize,
            }}
          >
            {/* Petal circle */}
            <div
              className="w-full h-full rounded-full shadow-md flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
              style={{
                backgroundColor: domain.color,
                opacity: 0.75 + (progressValue / 100) * 0.25
              }}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>

            {/* Tooltip on hover */}
            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
              <div className="bg-forest text-white text-xs px-2 py-1 rounded-md shadow-md">
                {domain.label}: {progressValue}%
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Center circle with flower */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="absolute rounded-full flex items-center justify-center shadow-lg z-10 bg-garden-accent"
        style={{
          width: centerSize,
          height: centerSize,
          top: (containerSize - centerSize) / 2,
          left: (containerSize - centerSize) / 2,
        }}
      >
        <Flower2 className="w-7 h-7 text-white" />
      </motion.div>
    </div>
  );
}
