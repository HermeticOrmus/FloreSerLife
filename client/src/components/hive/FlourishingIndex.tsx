import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Star, Users, MessageCircle, Award, Sparkles } from "lucide-react";

interface FlourishingIndexProps {
  metrics?: {
    sessionsCompleted?: number;
    averageRating?: number;
    totalTestimonials?: number;
    clientRetentionRate?: number;
    communityContributions?: number;
  };
}

const calculateFlourishingScore = (metrics: FlourishingIndexProps['metrics'] = {}): number => {
  const {
    sessionsCompleted = 0,
    averageRating = 0,
    totalTestimonials = 0,
    clientRetentionRate = 0,
    communityContributions = 0
  } = metrics;

  // Weighted calculation
  const sessionScore = Math.min(sessionsCompleted * 2, 100);
  const ratingScore = (averageRating / 5) * 100;
  const testimonialScore = Math.min(totalTestimonials * 5, 100);
  const retentionScore = clientRetentionRate;
  const contributionScore = Math.min(communityContributions * 3, 100);

  const totalScore = (
    sessionScore * 0.3 +
    ratingScore * 0.25 +
    testimonialScore * 0.2 +
    retentionScore * 0.15 +
    contributionScore * 0.1
  );

  return Math.round(Math.min(totalScore, 100));
};

const getFlourishingLevel = (score: number): { name: string; color: string; icon: any; description: string } => {
  if (score >= 90) {
    return {
      name: "Abundant Garden",
      color: "from-purple-500 to-purple-600",
      icon: Award,
      description: "You're creating extraordinary impact in the ecosystem"
    };
  } else if (score >= 70) {
    return {
      name: "Full Bloom",
      color: "from-orange-500 to-orange-600",
      icon: Sparkles,
      description: "Your practice is flourishing beautifully"
    };
  } else if (score >= 50) {
    return {
      name: "Growing Strong",
      color: "from-yellow-500 to-yellow-600",
      icon: TrendingUp,
      description: "You're developing a vibrant practice"
    };
  } else {
    return {
      name: "New Sprout",
      color: "from-green-500 to-green-600",
      icon: Star,
      description: "Your journey is just beginning—every bloom starts here"
    };
  }
};

export default function FlourishingIndex({ metrics = {} }: FlourishingIndexProps) {
  const score = calculateFlourishingScore(metrics);
  const level = getFlourishingLevel(score);
  const Icon = level.icon;

  const metricCards = [
    {
      label: "Sessions",
      value: metrics.sessionsCompleted || 0,
      icon: Users,
      impact: "Session impact",
      percentage: Math.min((metrics.sessionsCompleted || 0) * 2, 100)
    },
    {
      label: "Avg Rating",
      value: (metrics.averageRating || 0).toFixed(1),
      icon: Star,
      impact: "Client satisfaction",
      percentage: ((metrics.averageRating || 0) / 5) * 100
    },
    {
      label: "Testimonials",
      value: metrics.totalTestimonials || 0,
      icon: MessageCircle,
      impact: "Community voice",
      percentage: Math.min((metrics.totalTestimonials || 0) * 5, 100)
    },
    {
      label: "Retention",
      value: `${metrics.clientRetentionRate || 0}%`,
      icon: TrendingUp,
      impact: "Lasting connections",
      percentage: metrics.clientRetentionRate || 0
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-hive-card-dark to-hive-accent-light border-0 rounded-card-lg shadow-card-lg overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-card-heading-lg font-heading text-white">
            Flourishing Index
          </CardTitle>
          <Badge className={`bg-gradient-to-r ${level.color} text-white border-0 text-label px-4 py-2`}>
            {score}/100
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score visualization */}
        <div className="relative">
          <div className="flex items-center justify-center mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className={`w-32 h-32 rounded-full bg-gradient-to-br ${level.color} flex items-center justify-center shadow-card-lg relative`}
            >
              <div className="absolute inset-2 bg-white/20 rounded-full" />
              <div className="absolute inset-4 bg-white/10 rounded-full" />
              <Icon className="w-12 h-12 text-white z-10" />
            </motion.div>
          </div>

          <div className="text-center mb-6">
            <h3 className="text-card-heading font-heading text-white mb-1">
              {level.name}
            </h3>
            <p className="text-body-sm text-white/80">
              {level.description}
            </p>
          </div>

          {/* Progress bar */}
          <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
              className={`h-full bg-gradient-to-r ${level.color} rounded-full relative`}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </motion.div>
          </div>
        </div>

        {/* Metric breakdown */}
        <div className="grid grid-cols-2 gap-4">
          {metricCards.map((metric, index) => {
            const MetricIcon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-card p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-white/20 rounded-full p-2">
                    <MetricIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-caption text-white/70">{metric.label}</p>
                    <p className="text-card-heading font-heading text-white">
                      {metric.value}
                    </p>
                  </div>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.percentage}%` }}
                    transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                    className="h-full bg-white/40 rounded-full"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Insight text */}
        <div className="pt-4 border-t border-white/10">
          <p className="text-body-sm text-white/80 text-center italic">
            Your Flourishing Index is a holistic measure of your impact, presence, and contribution to our ecosystem.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
