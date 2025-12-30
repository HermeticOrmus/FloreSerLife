import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flower2, Award, Crown, Sparkles } from "lucide-react";

interface Session {
  id: string;
  date: string;
  facilitatorName?: string;
  practitionerName?: string;
  theme?: string;
  notes?: string;
  reflection?: string;
}

interface BloomPathTimelineProps {
  sessions?: Session[];
  pollinationPoints?: number;
}

const milestones = [
  { blooms: 1, name: "First Seed Sprouted", icon: Flower2, color: "text-green-500" },
  { blooms: 3, name: "Rising Flower", icon: Sparkles, color: "text-yellow-500" },
  { blooms: 7, name: "Flourishing Path", icon: Award, color: "text-orange-500" },
  { blooms: 15, name: "Abundant Garden", icon: Crown, color: "text-purple-500" }
];

export default function BloomPathTimeline({ sessions = [], pollinationPoints = 0 }: BloomPathTimelineProps) {
  const sessionCount = sessions.length;
  const currentMilestone = milestones.filter(m => sessionCount >= m.blooms).pop();
  const nextMilestone = milestones.find(m => sessionCount < m.blooms);

  return (
    <div className="w-full">
      <Card className="bg-garden-card border-0 rounded-card shadow-card">
        <CardContent className="p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-card-heading-lg font-heading text-garden-text-primary">
                Your Bloom Path
              </h3>
              <Badge className="bg-garden-accent text-white text-label px-4 py-2 rounded-badge">
                {pollinationPoints} Pollination Points
              </Badge>
            </div>
            <p className="text-body-sm text-garden-text-secondary">
              Each session is a bloom in your journey of becoming. Hover over blooms to see your reflections.
            </p>
          </div>

          {/* Circular Vine Visualization */}
          <div className="relative w-full h-80 mb-8">
            <svg className="absolute inset-0 w-full h-full">
              {/* Circular vine path */}
              <circle
                cx="50%"
                cy="50%"
                r="35%"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="text-garden-accent/30"
              />
            </svg>

            {/* Session blooms positioned on the circle */}
            {sessions.map((session, index) => {
              const totalSessions = Math.max(sessions.length, 1);
              const angle = (index * 2 * Math.PI) / totalSessions - Math.PI / 2; // Start at top
              const radius = 35; // Percentage of container
              const x = 50 + radius * Math.cos(angle);
              const y = 50 + radius * Math.sin(angle);

              return (
                <motion.div
                  key={session.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1, type: "spring" }}
                  className="absolute group cursor-pointer z-10"
                  style={{
                    top: `${y}%`,
                    left: `${x}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  {/* Bloom */}
                  <div className="relative">
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className="w-10 h-10 bg-gradient-to-br from-garden-accent to-garden-accent-light rounded-full shadow-card flex items-center justify-center"
                    >
                      <Flower2 className="w-5 h-5 text-white" />
                    </motion.div>

                    {/* Number badge */}
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-garden-sidebar rounded-full flex items-center justify-center border-2 border-white">
                      <span className="text-[10px] font-bold text-garden-text-on-sage">
                        {index + 1}
                      </span>
                    </div>
                  </div>

                  {/* Hover tooltip */}
                  <div className="absolute top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                    <div className="bg-white rounded-card shadow-card-lg p-4 w-64 border border-garden-accent/20">
                      <div className="space-y-2">
                        <p className="text-caption text-garden-text-secondary">
                          {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <p className="text-body font-semibold text-garden-text-primary">
                          {session.facilitatorName || session.practitionerName || "Session"}
                        </p>
                        {session.theme && (
                          <p className="text-body-sm text-garden-text-secondary italic">
                            Theme: {session.theme}
                          </p>
                        )}
                        {session.reflection && (
                          <p className="text-body-sm text-garden-text-secondary line-clamp-3">
                            "{session.reflection}"
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Center milestone indicator */}
            {currentMilestone && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <div className="bg-gradient-to-br from-white to-garden-bg rounded-card p-4 shadow-card-md text-center">
                  <currentMilestone.icon className={`w-8 h-8 mx-auto mb-2 ${currentMilestone.color}`} />
                  <p className="text-caption font-semibold text-garden-text-primary">
                    {currentMilestone.name}
                  </p>
                  <p className="text-caption text-garden-text-secondary">
                    {sessionCount} blooms
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Milestone progress bar */}
          {nextMilestone && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-body-sm">
                <span className="text-garden-text-secondary">
                  Next milestone: <span className="font-medium text-garden-text-primary">{nextMilestone.name}</span>
                </span>
                <span className="text-garden-text-secondary">
                  {sessionCount} / {nextMilestone.blooms} blooms
                </span>
              </div>
              <div className="w-full h-2 bg-garden-bg rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(sessionCount / nextMilestone.blooms) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-garden-accent to-garden-accent-light"
                />
              </div>
            </div>
          )}

          {/* Empty state */}
          {sessions.length === 0 && (
            <div className="text-center py-12">
              <Flower2 className="w-16 h-16 text-garden-accent/30 mx-auto mb-4" />
              <p className="text-body text-garden-text-secondary mb-2">
                Your Bloom Path awaits
              </p>
              <p className="text-body-sm text-garden-text-secondary">
                Book your first session to plant your first bloom
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
