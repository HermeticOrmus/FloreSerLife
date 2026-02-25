import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { papercut } from "@/assets";

import {
  Calendar,
  Clock,
  Globe,
  Video,
  MapPin,
  CalendarPlus,
  Sparkles,
  RefreshCw,
  X,
  FileText,
  Flower2,
} from "lucide-react";

// Hexagonal clip-path for portrait frames
const HEX_CLIP =
  "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

// Archetype icon helper
function getArchetypeIcon(archetype?: string) {
  switch (archetype) {
    case "bee":
      return <span className="text-lg">🐝</span>;
    case "butterfly":
      return <span className="text-lg">🦋</span>;
    case "hummingbird":
      return <span className="text-lg">🐦</span>;
    case "beetle":
      return <span className="text-lg">🪲</span>;
    default:
      return <Flower2 className="w-5 h-5 text-gold" />;
  }
}

// Flowing paper hills background
function PaperHills() {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden"
      style={{ height: 200 }}
    >
      <svg
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        className="absolute bottom-0 w-full"
        style={{ height: 170 }}
      >
        <path
          d="M0,110 C200,40 400,85 600,55 C800,25 1000,75 1200,45 L1200,200 L0,200 Z"
          fill="#8B9D77"
          opacity="0.12"
        />
      </svg>
      <svg
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        className="absolute bottom-0 w-full"
        style={{ height: 130 }}
      >
        <path
          d="M0,95 C300,45 500,75 700,35 C900,8 1100,55 1200,25 L1200,200 L0,200 Z"
          fill="#C4A882"
          opacity="0.09"
        />
      </svg>
    </div>
  );
}

// ── Detail row component ────────────────────────────────────────────────────
function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-forest/8 last:border-b-0">
      <Icon className="w-4 h-4 text-forest/35 flex-shrink-0" />
      <span className="text-xs text-forest/50 w-20 flex-shrink-0">{label}</span>
      <span className="text-sm text-forest/80 font-medium">{value}</span>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function Sessions() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "My Next Session - FloreSer";
  }, []);

  // Fetch user's bookings
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["/api/bookings"],
    enabled: !!user,
  });

  // Find the next upcoming session
  const upcomingSessions = (bookings as any[])
    .filter(
      (b: any) =>
        b.status === "scheduled" &&
        new Date(b.scheduledDatetime) > new Date()
    )
    .sort(
      (a: any, b: any) =>
        new Date(a.scheduledDatetime).getTime() -
        new Date(b.scheduledDatetime).getTime()
    );

  const nextSession = upcomingSessions[0] as any | undefined;

  // Format session details
  const sessionDate = nextSession
    ? new Date(nextSession.scheduledDatetime)
    : null;

  const formattedDate = sessionDate
    ? sessionDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const formattedTime = sessionDate
    ? sessionDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

  const duration = nextSession?.duration || 60;

  return (
    <div
      className="min-h-screen bg-cream"
      style={{
        backgroundImage: `url(${papercut.textures.flatCream})`,
        backgroundSize: '512px 512px',
        backgroundRepeat: 'repeat',
      }}
    >
      <Header />

      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 overflow-hidden">
        <PaperHills />

        {/* Page heading */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8 relative z-10"
        >
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-forest mb-2">
            My Next Session
          </h1>
          <p className="text-forest/60 text-base">
            {nextSession ? "Your sanctuary awaits" : "No upcoming sessions"}
          </p>
        </motion.div>

        {/* ── Two-Panel Layout ─────────────────────────────────────── */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="relative z-10 mb-16"
        >
          <div className="flex flex-col md:flex-row gap-6 max-w-5xl mx-auto">
            {/* ── LEFT: Session Info Panel ─────────────────────────── */}
            <div
              className="md:w-[340px] flex-shrink-0 rounded-xl shadow-lg overflow-hidden bg-cream"
              style={{
                backgroundImage: `url(${papercut.textures.flatSage})`,
                backgroundSize: '512px 512px',
                backgroundRepeat: 'repeat',
              }}
            >
              {/* Subtle relief overlay */}
              <div
                className="absolute inset-0 pointer-events-none rounded-xl"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.03) 100%)",
                }}
              />

              <div className="relative z-10 p-7">
                {nextSession ? (
                  <>
                    {/* Facilitator profile */}
                    <div className="flex flex-col items-center mb-6">
                      {/* Pollinator icon row */}
                      <div className="flex items-center gap-2 mb-3">
                        {getArchetypeIcon(nextSession.practitionerArchetype)}
                      </div>

                      {/* Hexagonal portrait */}
                      <div
                        className="w-20 h-20 flex items-center justify-center shadow-md mb-3 bg-earth-200"
                        style={{
                          clipPath: HEX_CLIP,
                        }}
                      >
                        <span className="text-2xl font-heading font-bold text-white drop-shadow-sm">
                          {(nextSession.practitionerName || "F")
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      </div>

                      {/* Name */}
                      <h3 className="font-heading text-lg font-semibold text-forest text-center">
                        {nextSession.practitionerName || "Your Facilitator"}
                      </h3>
                    </div>

                    {/* Session details */}
                    <div className="space-y-0">
                      <DetailRow
                        icon={Calendar}
                        label="Date"
                        value={formattedDate}
                      />
                      <DetailRow
                        icon={Clock}
                        label="Time"
                        value={formattedTime}
                      />
                      <DetailRow
                        icon={Globe}
                        label="Timezone"
                        value={
                          Intl.DateTimeFormat().resolvedOptions().timeZone
                        }
                      />
                      <DetailRow
                        icon={Clock}
                        label="Length"
                        value={`${duration} minutes`}
                      />
                      <DetailRow
                        icon={nextSession.isVirtual ? Video : MapPin}
                        label="Type"
                        value={
                          nextSession.isVirtual ? "Virtual" : "In-person"
                        }
                      />
                    </div>

                    {/* Action buttons */}
                    <div className="mt-6 space-y-3">
                      {nextSession.isVirtual && (
                        <Button
                          className="w-full text-white bg-forest hover:bg-forest/90 rounded-full"
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Join Session
                        </Button>
                      )}

                      <button className="w-full flex items-center justify-center gap-2 text-sm text-forest/60 hover:text-forest transition-colors py-2">
                        <CalendarPlus className="w-3.5 h-3.5" />
                        Add to Calendar
                      </button>

                      <Button
                        variant="outline"
                        className="w-full rounded-full border-gold/30 text-gold hover:bg-gold/10"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Prepare with mAIa
                      </Button>
                    </div>

                    {/* Notes section */}
                    {nextSession.notes && (
                      <div className="mt-6 pt-5 border-t border-forest/8">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-3.5 h-3.5 text-forest/35" />
                          <span className="text-xs text-forest/50 font-medium uppercase tracking-wide">
                            Session Notes
                          </span>
                        </div>
                        <p className="text-sm text-forest/60 leading-relaxed">
                          {nextSession.notes}
                        </p>
                      </div>
                    )}

                    {/* Reschedule / Cancel */}
                    <div className="mt-6 pt-4 border-t border-forest/8 flex items-center justify-center gap-6">
                      <button className="flex items-center gap-1.5 text-xs text-forest/40 hover:text-forest/60 transition-colors">
                        <RefreshCw className="w-3 h-3" />
                        Reschedule
                      </button>
                      <button className="flex items-center gap-1.5 text-xs text-forest/40 hover:text-crimson/60 transition-colors">
                        <X className="w-3 h-3" />
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  /* No session state */
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Calendar className="w-12 h-12 text-forest/15 mb-4" />
                    <h3 className="font-heading text-lg text-forest/70 mb-2">
                      No Upcoming Session
                    </h3>
                    <p className="text-forest/40 text-sm mb-6 max-w-xs">
                      When you book a session with a facilitator, your next
                      appointment details will appear here.
                    </p>
                    <Button
                      className="rounded-full text-white bg-gold hover:bg-gold/90"
                      onClick={() => setLocation("/hive")}
                    >
                      Browse The Hive
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT: Sacred Call Space ─────────────────────────── */}
            <div
              className="flex-1 rounded-xl shadow-lg overflow-hidden min-h-[480px] bg-cream"
              style={{
                backgroundImage: `url(${papercut.textures.flatCream})`,
                backgroundSize: '512px 512px',
                backgroundRepeat: 'repeat',
              }}
            >
              {/* Subtle parchment relief */}
              <div
                className="absolute inset-0 pointer-events-none rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 40%, rgba(0,0,0,0.02) 100%)",
                }}
              />

              <div className="relative z-10 h-full flex flex-col items-center justify-center p-10 text-center">
                {nextSession ? (
                  <>
                    {/* Sacred space indicator */}
                    <motion.div
                      animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.3, 0.5, 0.3],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="mb-8"
                    >
                      <div className="w-24 h-24 rounded-full border border-gold/15 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full border border-gold/20 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-gold/10" />
                        </div>
                      </div>
                    </motion.div>

                    <h3 className="font-heading text-xl text-forest/40 mb-3">
                      Your Sacred Space
                    </h3>
                    <p className="text-forest/30 text-sm max-w-md leading-relaxed mb-6">
                      This space will open when your session begins. Take a
                      breath, set your intention, and arrive fully present.
                    </p>

                    {/* Upcoming session count */}
                    {upcomingSessions.length > 1 && (
                      <Badge className="bg-forest/5 text-forest/40 border border-forest/10 text-xs">
                        {upcomingSessions.length - 1} more session
                        {upcomingSessions.length - 1 > 1 ? "s" : ""}{" "}
                        scheduled
                      </Badge>
                    )}
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-forest/10 flex items-center justify-center mb-6">
                      <Flower2 className="w-8 h-8 text-forest/15" />
                    </div>
                    <h3 className="font-heading text-xl text-forest/35 mb-3">
                      A Space Awaits
                    </h3>
                    <p className="text-forest/25 text-sm max-w-sm leading-relaxed">
                      When you have an upcoming session, this parchment becomes
                      your sacred call space -- a calm sanctuary for connection
                      and growth.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
