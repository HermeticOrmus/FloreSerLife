import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Leaf, Heart, Flower2 } from "lucide-react";

type MessageType = "welcome" | "milestone" | "reflection" | "encouragement" | "guidance";

interface MaiaMessageProps {
  type?: MessageType;
  message?: string;
  context?: {
    userName?: string;
    sessionsCompleted?: number;
    currentMilestone?: string;
    recentActivity?: string;
  };
  variant?: "card" | "inline";
}

const messageTemplates = {
  welcome: [
    "Welcome, Dear One. Your garden is ready to bloom.",
    "Every journey begins with a single step. You've taken yours by being here.",
    "This is fertile ground for your unfolding. Take your time, breathe, and begin."
  ],
  milestone: [
    "Growth is not always loud. Sometimes it whispers through your choices.",
    "You've just planted your {count}th seed. Beautiful work.",
    "Another bloom opens in your garden. You're flourishing, Dear One.",
    "Celebrate this milestone—each one is sacred."
  ],
  reflection: [
    "What did you feel opened within you today?",
    "Tending your inner garden asks for patience, presence, and care.",
    "Your reflections are seeds that will bloom in unexpected ways.",
    "Notice how far you've come. Growth rarely announces itself."
  ],
  encouragement: [
    "Keep expanding. You're exactly where you need to be.",
    "Your next bloom opens tomorrow. Rest well tonight.",
    "You are a garden in progress—and that is enough.",
    "Trust the process. Even winter is part of the cycle."
  ],
  guidance: [
    "When unsure where to begin, let your body guide you. It knows.",
    "Sometimes we need the Bee's grounding. Sometimes the Butterfly's transformation. Trust what calls to you now.",
    "Your path is uniquely yours. There is no rush, no timeline but your own.",
    "Healing becomes flourishing when we tend to all six domains: body, emotion, mind, spirit, creativity, and connection."
  ]
};

const getRandomMessage = (type: MessageType, count?: number): string => {
  const templates = messageTemplates[type];
  const randomIndex = Math.floor(Math.random() * templates.length);
  let message = templates[randomIndex];

  if (count !== undefined) {
    message = message.replace('{count}', count.toString());
  }

  return message;
};

const iconMap = {
  welcome: Flower2,
  milestone: Sparkles,
  reflection: Heart,
  encouragement: Leaf,
  guidance: Flower2
};

const colorMap = {
  welcome: "from-garden-accent-light to-garden-accent/20",
  milestone: "from-yellow-100 to-garden-accent-light",
  reflection: "from-rose-100 to-garden-accent-light",
  encouragement: "from-green-100 to-garden-accent-light",
  guidance: "from-garden-sidebar/30 to-garden-accent-light"
};

export default function MaiaMessage({
  type = "encouragement",
  message,
  context = {},
  variant = "card"
}: MaiaMessageProps) {
  const Icon = iconMap[type];
  const displayMessage = message || getRandomMessage(type, context.sessionsCompleted);
  const gradient = colorMap[type];

  if (variant === "inline") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-start gap-3 p-4 bg-gradient-to-r from-garden-accent-light/20 to-transparent rounded-card border-l-4 border-garden-accent"
      >
        <div className="bg-garden-accent rounded-full p-2 flex-shrink-0">
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-body-sm text-garden-text-primary italic">
            {displayMessage}
          </p>
          <p className="text-caption text-garden-text-secondary mt-1">— Maia</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
    >
      <Card className={`bg-gradient-to-br ${gradient} border-0 rounded-card shadow-card`}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Maia character icon */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-garden-accent to-garden-accent-light rounded-full flex items-center justify-center shadow-card-sm">
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Message content */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <p className="text-card-subheading font-heading text-garden-text-primary">
                  Maia
                </p>
                <span className="text-caption text-garden-text-secondary">
                  Your Garden Guardian
                </span>
              </div>

              <p className="text-body text-garden-text-primary italic leading-relaxed">
                "{displayMessage}"
              </p>

              {context.currentMilestone && (
                <div className="mt-3 pt-3 border-t border-garden-accent/20">
                  <p className="text-body-sm text-garden-text-secondary">
                    Current milestone: <span className="font-medium text-garden-text-primary">
                      {context.currentMilestone}
                    </span>
                  </p>
                </div>
              )}

              {context.recentActivity && (
                <div className="mt-2">
                  <p className="text-caption text-garden-text-secondary">
                    {context.recentActivity}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
