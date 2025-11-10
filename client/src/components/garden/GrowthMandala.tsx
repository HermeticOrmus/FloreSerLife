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
  { key: "spirit", label: "Spirit", icon: Sparkles, color: "rgb(156, 125, 88)" },
  { key: "creativity", label: "Creativity", icon: Palette, color: "rgb(214, 188, 165)" },
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

  return (
    <div className="relative w-48 h-48">
      {/* Center circle with flower */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 bg-garden-accent rounded-full flex items-center justify-center shadow-card-md z-10"
        >
          <Flower2 className="w-8 h-8 text-white" />
        </motion.div>
      </div>

      {/* 6 Petals representing the domains */}
      {domains.map((domain, i) => {
        const angle = (i * 60 * Math.PI) / 180; // 60 degrees apart for 6 petals
        const radius = 40; // Distance from center
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);
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
              top: `${y}%`,
              left: `${x}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {/* Petal circle */}
            <div
              className="w-14 h-14 rounded-full shadow-card flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-card-md"
              style={{
                backgroundColor: domain.color,
                opacity: 0.7 + (progressValue / 100) * 0.3
              }}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>

            {/* Tooltip on hover */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
              <div className="bg-garden-text-primary text-white text-caption px-3 py-1 rounded-badge shadow-card">
                {domain.label}: {progressValue}%
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Connecting lines (optional decorative element) */}
      <svg className="absolute inset-0 w-full h-full -z-10" style={{ opacity: 0.1 }}>
        {domains.map((_, i) => {
          const angle1 = (i * 60 * Math.PI) / 180;
          const angle2 = ((i + 1) % 6 * 60 * Math.PI) / 180;
          const radius = 40;
          const x1 = 50 + radius * Math.cos(angle1);
          const y1 = 50 + radius * Math.sin(angle1);
          const x2 = 50 + radius * Math.cos(angle2);
          const y2 = 50 + radius * Math.sin(angle2);

          return (
            <line
              key={i}
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke="currentColor"
              strokeWidth="1"
              className="text-garden-accent"
            />
          );
        })}
      </svg>
    </div>
  );
}
