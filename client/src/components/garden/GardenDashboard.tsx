import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Target, ArrowRight } from "lucide-react";
import GrowthMandala from "./GrowthMandala";

interface GardenDashboardProps {
  nextSession: {
    practitionerName?: string;
    scheduledDatetime?: string;
  } | null;
  seedsData: { seedsBalance: number } | undefined;
  sessionsData: any[] | undefined;
  gardenContentCount: number;
  onNavigate: (href: string) => void;
}

function computeMandalaProgress(
  seedsBalance: number,
  sessionCount: number,
  contentCount: number
) {
  // Derive approximate progress from real data
  // Body: sessions contribute to physical wellness awareness
  const body = Math.min(100, sessionCount * 12);
  // Emotion: sessions + seeds show emotional engagement
  const emotion = Math.min(100, sessionCount * 8 + Math.floor(seedsBalance / 50));
  // Mind: content interactions show intellectual engagement
  const mind = Math.min(100, contentCount * 15 + sessionCount * 5);
  // Spirit: overall participation
  const spirit = Math.min(100, Math.floor(seedsBalance / 30) + sessionCount * 6);
  // Creativity: content creation
  const creativity = Math.min(100, contentCount * 20);
  // Connection: community engagement (seeds earned implies interaction)
  const connection = Math.min(100, Math.floor(seedsBalance / 20) + contentCount * 10);

  return { body, emotion, mind, spirit, creativity, connection };
}

export default function GardenDashboard({
  nextSession,
  seedsData,
  sessionsData,
  gardenContentCount,
  onNavigate,
}: GardenDashboardProps) {
  const sessionCount = sessionsData?.length || 0;
  const seedsBalance = seedsData?.seedsBalance || 0;
  const mandalaProgress = computeMandalaProgress(
    seedsBalance,
    sessionCount,
    gardenContentCount
  );

  const allZero = Object.values(mandalaProgress).every((v) => v === 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
      {/* Left: Session Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="space-y-6">
          <h2 className="text-section-heading font-heading text-garden-text-primary">
            Your Session
          </h2>
          {nextSession ? (
            <Card className="bg-garden-card border-0 rounded-card-lg shadow-card">
              <CardHeader>
                <CardTitle className="text-card-subheading font-heading text-garden-text-primary">
                  Your Next Session
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-card-heading font-heading text-garden-text-primary">
                    {nextSession.practitionerName}
                  </h3>
                  {nextSession.scheduledDatetime && (
                    <p className="text-body-sm text-garden-text-secondary">
                      {new Date(nextSession.scheduledDatetime).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  )}
                </div>
                <Button
                  className="w-full bg-garden-accent hover:bg-garden-accent/90 rounded-button text-label"
                  onClick={() => onNavigate("/sessions")}
                >
                  View Session Details
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-garden-card border-0 rounded-card-lg shadow-card">
              <CardContent className="py-8 text-center space-y-4">
                <p className="text-body text-garden-text-secondary">
                  No upcoming sessions yet
                </p>
                <Button
                  variant="outline"
                  className="border-garden-accent/30 hover:bg-garden-accent hover:text-white rounded-button text-label"
                  onClick={() => onNavigate("/practitioners")}
                >
                  Browse Practitioners
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </motion.div>

      {/* Center: Growth Tracker */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col items-center justify-center"
      >
        <div className="mb-6">
          <GrowthMandala progress={mandalaProgress} />
        </div>

        {allZero && (
          <p className="text-body-sm text-garden-text-secondary text-center mb-2 max-w-[200px]">
            Book sessions and share content to grow your mandala
          </p>
        )}

        <div className="flex items-center justify-center gap-12 mt-4">
          <div className="text-center">
            <p className="text-3xl font-heading text-garden-text-primary">
              {seedsBalance}
            </p>
            <p className="text-xs text-garden-text-secondary mt-1">Seeds</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-heading text-garden-text-primary">
              {sessionCount}
            </p>
            <p className="text-xs text-garden-text-secondary mt-1">Sessions</p>
          </div>
        </div>
      </motion.div>

      {/* Right: Action Cards */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <Card className="bg-garden-card border-0 rounded-card shadow-card hover:shadow-card-hover transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-card-heading font-heading text-garden-text-primary">
                Track My Growth
              </h3>
              <Target className="w-5 h-5 text-garden-accent" />
            </div>
            <p className="text-body-sm text-garden-text-secondary mb-4">
              Explore the Hive and discover a new guide for your journey.
            </p>
            <Button
              variant="outline"
              className="w-full rounded-button text-label border-garden-accent/30 hover:bg-garden-accent hover:text-white"
              onClick={() => onNavigate("/hive")}
            >
              Browse Pollinators
            </Button>
          </CardContent>
        </Card>

        <Card
          className="bg-garden-accent-light border-0 rounded-card shadow-card hover:shadow-card-hover transition-shadow cursor-pointer"
          onClick={() => onNavigate("/favorites")}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-garden-accent" />
                <h3 className="text-card-heading font-heading text-garden-text-primary">
                  My Favorites
                </h3>
              </div>
              <ArrowRight className="w-5 h-5 text-garden-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-garden-card border-0 rounded-card shadow-card">
          <CardContent className="p-6 space-y-3">
            <h3 className="text-card-heading font-heading text-garden-text-primary">
              Reflections from Maia
            </h3>
            <p className="text-body-sm text-garden-text-secondary">
              Turning your inner garden asks for patience, presence, and care.
            </p>
            <Button
              variant="outline"
              className="w-full rounded-button text-label border-garden-accent/30 hover:bg-garden-accent hover:text-white"
              onClick={() => onNavigate("/journal")}
            >
              View Timeline
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
