import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";

import {
  Calendar,
  MessageSquare,
  DollarSign,
  Star,
  TreePine,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

// Hexagonal clip-path (pointy-top)
const HEX_CLIP = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

// Archetype symbols map
function getArchetypeSymbol(archetype?: string) {
  switch (archetype) {
    case "bee": return "🐝";
    case "butterfly": return "🦋";
    case "hummingbird": return "🐦";
    case "beetle": return "🪲";
    default: return "✦";
  }
}

// ── Hex Card component ──────────────────────────────────────────────────────
interface HexCardProps {
  size: number;
  texture: string;
  label: string;
  icon: LucideIcon;
  value: string | number;
  subtext?: string;
  onClick?: () => void;
  delay?: number;
  luminous?: boolean;
}

function HexCard({
  size,
  texture,
  label,
  icon: Icon,
  value,
  subtext,
  onClick,
  delay = 0,
  luminous = false,
}: HexCardProps) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        delay,
        duration: 0.45,
        type: "spring",
        stiffness: 180,
      }}
      whileHover={{ scale: 1.06, zIndex: 20 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
      style={{ width: size, height: size }}
    >
      <div
        className="relative w-full h-full flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        style={{
          clipPath: HEX_CLIP,
          backgroundColor: texture,
        }}
      >
        {/* Paper-cut relief overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            clipPath: HEX_CLIP,
            background: luminous
              ? "linear-gradient(145deg, rgba(255,255,255,0.2) 0%, rgba(212,168,67,0.1) 50%, rgba(0,0,0,0.06) 100%)"
              : "linear-gradient(145deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(0,0,0,0.08) 100%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <Icon className="w-6 h-6 text-white mb-1.5 drop-shadow-sm group-hover:scale-110 transition-transform" />
          <span className="text-lg font-bold text-white drop-shadow-sm leading-tight">
            {value}
          </span>
          <span className="text-[11px] font-medium text-white/90 drop-shadow-sm leading-tight mt-0.5">
            {label}
          </span>
          {subtext && (
            <span className="text-[10px] text-white/70 drop-shadow-sm mt-0.5">
              {subtext}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

// ── Soul Profile hex (identity anchor, non-interactive) ─────────────────────
function SoulProfileHex({
  name,
  archetype,
  avatarInitial,
  size,
}: {
  name: string;
  archetype?: string;
  avatarInitial: string;
  size: number;
}) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 160 }}
      style={{ width: size, height: size }}
    >
      <div
        className="relative w-full h-full flex flex-col items-center justify-center shadow-lg"
        style={{
          clipPath: HEX_CLIP,
          backgroundColor: "#F5F5DC",
        }}
      >
        {/* Subtle relief */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            clipPath: HEX_CLIP,
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(0,0,0,0.05) 100%)",
          }}
        />

        <div className="relative z-10 flex flex-col items-center">
          {/* Avatar circle */}
          <div className="w-12 h-12 rounded-full bg-gold/20 border-2 border-gold/30 flex items-center justify-center mb-1.5 shadow-sm">
            <span className="text-lg font-heading font-bold text-gold">
              {avatarInitial}
            </span>
          </div>
          {/* Name */}
          <span className="text-sm font-heading font-semibold text-forest leading-tight text-center px-4">
            {name}
          </span>
          {/* Archetype symbol */}
          <span className="text-base mt-0.5" aria-label={archetype || "pollinator"}>
            {getArchetypeSymbol(archetype)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Flowing paper hills SVG (background decoration) ─────────────────────────
function PaperHills() {
  return (
    <div className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden" style={{ height: 200 }}>
      {/* Back hill - sage */}
      <svg
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        className="absolute bottom-0 w-full"
        style={{ height: 180 }}
      >
        <path
          d="M0,120 C200,40 400,90 600,60 C800,30 1000,80 1200,50 L1200,200 L0,200 Z"
          fill="#8B9D77"
          opacity="0.15"
        />
      </svg>
      {/* Front hill - clay */}
      <svg
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        className="absolute bottom-0 w-full"
        style={{ height: 140 }}
      >
        <path
          d="M0,100 C300,50 500,80 700,40 C900,10 1100,60 1200,30 L1200,200 L0,200 Z"
          fill="#C4A882"
          opacity="0.12"
        />
      </svg>
    </div>
  );
}

// ── Layout constants ────────────────────────────────────────────────────────
const CENTER_HEX = 190; // Main "My Next Session" hex
const MEDIUM_HEX = 148; // Surrounding hexes
const SOUL_HEX = 150;   // Soul Profile hex
const ECO_HEX = 140;    // Ecosystem Mode hex

// Hex positions relative to container center (desktop)
const HEX_OFFSET = 145; // Distance from center to surrounding hexes

function getHexPosition(slot: "tl" | "tr" | "bl" | "br") {
  const positions = {
    tl: { x: -HEX_OFFSET, y: -HEX_OFFSET * 0.85 },
    tr: { x: HEX_OFFSET, y: -HEX_OFFSET * 0.85 },
    bl: { x: -HEX_OFFSET, y: HEX_OFFSET * 0.85 },
    br: { x: HEX_OFFSET, y: HEX_OFFSET * 0.85 },
  };
  return positions[slot];
}

// Container must fit: soul profile offset + hex cluster + ecosystem offset
const CONTAINER_W = 750;
const CONTAINER_H = 520;
const CENTER_X = CONTAINER_W / 2 + 20; // Slight rightward shift to leave room for Soul Profile
const CENTER_Y = CONTAINER_H / 2;

// ── Hex card data ───────────────────────────────────────────────────────────
interface HiveHex {
  id: string;
  label: string;
  icon: LucideIcon;
  texture: string;
  slot: "tl" | "tr" | "bl" | "br";
  route?: string;
}

const hiveHexes: HiveHex[] = [
  {
    id: "sessions",
    label: "Sessions",
    icon: Calendar,
    texture: "#9CAF88",
    slot: "tl",
    route: "/sessions",
  },
  {
    id: "earnings",
    label: "Earnings",
    icon: DollarSign,
    texture: "#D4AF37",
    slot: "tr",
  },
  {
    id: "messages",
    label: "Messages",
    icon: MessageSquare,
    texture: "#D7C3A8",
    slot: "bl",
    route: "/messages",
  },
  {
    id: "metrics",
    label: "Practice",
    icon: BarChart3,
    texture: "#4A6741",
    slot: "br",
  },
];

// ── Main Component ──────────────────────────────────────────────────────────
export default function PractitionerDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "My Hive - FloreSer";
  }, []);

  // Fetch practitioner's bookings
  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ["/api/bookings"],
    enabled: !!user,
  });

  // Compute stats from real booking data
  const upcomingSessions = (bookings as any[]).filter(
    (b: any) =>
      b.status === "scheduled" &&
      new Date(b.scheduledDatetime) > new Date()
  );

  const completedSessions = (bookings as any[]).filter(
    (b: any) => b.status === "completed"
  ).length;

  const monthlyEarnings = (bookings as any[])
    .filter((b: any) => {
      const d = new Date(b.scheduledDatetime);
      const now = new Date();
      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear() &&
        b.status === "completed"
      );
    })
    .reduce((sum: number, b: any) => sum + (parseFloat(b.totalAmount) || 0), 0);

  // Next session details
  const nextSession = upcomingSessions.sort(
    (a: any, b: any) =>
      new Date(a.scheduledDatetime).getTime() -
      new Date(b.scheduledDatetime).getTime()
  )[0] as any | undefined;

  const nextSessionDisplay = nextSession
    ? {
        client: nextSession.clientName || "Client",
        time: new Date(nextSession.scheduledDatetime).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }),
      }
    : null;

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Get stat values for each hex
  function getHexValue(id: string): string | number {
    switch (id) {
      case "sessions":
        return bookingsLoading ? "-" : upcomingSessions.length;
      case "earnings":
        return monthlyEarnings > 0 ? `$${monthlyEarnings}` : "--";
      case "messages":
        return 0; // TODO: real unread count
      case "metrics":
        return completedSessions;
      default:
        return "-";
    }
  }

  function getHexSubtext(id: string): string {
    switch (id) {
      case "sessions":
        return "upcoming";
      case "earnings":
        return "this month";
      case "messages":
        return "unread";
      case "metrics":
        return "completed";
      default:
        return "";
    }
  }

  const handleHexClick = (route?: string) => {
    if (route) setLocation(route);
  };

  const practitionerName = user?.firstName || "Facilitator";
  const avatarInitial = user?.firstName?.charAt(0) || "F";

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 overflow-hidden">
        {/* Flowing paper hills in background */}
        <PaperHills />

        {/* Page heading */}
        <div className="text-center mb-10 relative z-10">
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-forest mb-2">
            {getGreeting()}, {practitionerName}
          </h1>
          <p className="text-forest/60 text-lg">My Hive</p>
        </div>

        {/* ── Desktop Hexagonal Hive Layout ────────────────────────────── */}
        <div className="hidden md:flex justify-center mb-16 relative z-10">
          <div
            className="relative"
            style={{ width: CONTAINER_W, height: CONTAINER_H }}
          >
            {/* Soul Profile hex - top-left, detached */}
            <div
              className="absolute"
              style={{
                left: 0,
                top: 10,
              }}
            >
              <SoulProfileHex
                name={practitionerName}
                archetype={(user as any)?.archetype}
                avatarInitial={avatarInitial}
                size={SOUL_HEX}
              />
            </div>

            {/* Center hex - My Next Session (prominent) */}
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.1,
                duration: 0.5,
                type: "spring",
                stiffness: 160,
              }}
              whileHover={{ scale: 1.05, zIndex: 20 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleHexClick("/sessions")}
              className="absolute focus:outline-none focus-visible:ring-2 focus-visible:ring-gold group"
              style={{
                width: CENTER_HEX,
                height: CENTER_HEX,
                left: CENTER_X - CENTER_HEX / 2,
                top: CENTER_Y - CENTER_HEX / 2,
              }}
            >
              <div
                className="relative w-full h-full flex flex-col items-center justify-center shadow-xl hover:shadow-2xl transition-shadow"
                style={{
                  clipPath: HEX_CLIP,
                  backgroundColor: "#A23C40",
                }}
              >
                {/* Relief overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    clipPath: HEX_CLIP,
                    background:
                      "linear-gradient(145deg, rgba(255,255,255,0.18) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)",
                  }}
                />
                <div className="relative z-10 flex flex-col items-center text-center px-5">
                  <Calendar className="w-8 h-8 text-white mb-2 drop-shadow-sm group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-bold text-white drop-shadow-sm uppercase tracking-wide">
                    My Next Session
                  </span>
                  {nextSessionDisplay ? (
                    <>
                      <span className="text-xs text-white/90 mt-1.5 drop-shadow-sm">
                        {nextSessionDisplay.client}
                      </span>
                      <span className="text-xs text-white/75 drop-shadow-sm">
                        {nextSessionDisplay.time}
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-white/70 mt-1.5 drop-shadow-sm">
                      No sessions scheduled
                    </span>
                  )}
                  {upcomingSessions.length > 0 && (
                    <Badge className="mt-2 bg-white/20 text-white text-[10px] border-0 backdrop-blur-sm">
                      {upcomingSessions.length} upcoming
                    </Badge>
                  )}
                </div>
              </div>
            </motion.button>

            {/* Surrounding hex cards */}
            {hiveHexes.map((hex, index) => {
              const pos = getHexPosition(hex.slot);

              return (
                <div
                  key={hex.id}
                  className="absolute"
                  style={{
                    left: CENTER_X - MEDIUM_HEX / 2 + pos.x,
                    top: CENTER_Y - MEDIUM_HEX / 2 + pos.y,
                  }}
                >
                  <HexCard
                    size={MEDIUM_HEX}
                    texture={hex.texture}
                    label={hex.label}
                    icon={hex.icon}
                    value={getHexValue(hex.id)}
                    subtext={getHexSubtext(hex.id)}
                    onClick={() => handleHexClick(hex.route)}
                    delay={0.2 + index * 0.08}
                  />
                </div>
              );
            })}

            {/* Ecosystem Mode hex - bottom-right, standalone */}
            <div
              className="absolute"
              style={{
                right: 10,
                bottom: 10,
              }}
            >
              <HexCard
                size={ECO_HEX}
                texture="#7D6F5E"
                label="Ecosystem"
                icon={TreePine}
                value=""
                subtext="Explore"
                onClick={() => handleHexClick("/garden")}
                delay={0.55}
                luminous
              />
            </div>

            {/* Rating star badge floating near Metrics hex */}
            {completedSessions > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
                className="absolute flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-md border border-gold/20"
                style={{
                  left: CENTER_X + HEX_OFFSET + MEDIUM_HEX / 2 - 20,
                  top: CENTER_Y + HEX_OFFSET * 0.85 + MEDIUM_HEX / 2 - 10,
                }}
              >
                <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                <span className="text-xs font-medium text-forest">4.8</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* ── Mobile Layout ────────────────────────────────────────────── */}
        <div className="md:hidden mb-12 relative z-10">
          {/* Soul Profile - centered above grid */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex justify-center mb-8"
          >
            <SoulProfileHex
              name={practitionerName}
              archetype={(user as any)?.archetype}
              avatarInitial={avatarInitial}
              size={130}
            />
          </motion.div>

          {/* My Next Session - prominent center */}
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4, type: "spring" }}
            onClick={() => handleHexClick("/sessions")}
            className="mx-auto mb-6 block focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            style={{ width: 170, height: 170 }}
          >
            <div
              className="relative w-full h-full flex flex-col items-center justify-center shadow-lg"
              style={{
                clipPath: HEX_CLIP,
                backgroundColor: "#A23C40",
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  clipPath: HEX_CLIP,
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.18) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)",
                }}
              />
              <div className="relative z-10 flex flex-col items-center text-center px-4">
                <Calendar className="w-7 h-7 text-white mb-1.5 drop-shadow-sm" />
                <span className="text-xs font-bold text-white drop-shadow-sm uppercase tracking-wide">
                  My Next Session
                </span>
                {nextSessionDisplay ? (
                  <span className="text-[11px] text-white/85 mt-1 drop-shadow-sm">
                    {nextSessionDisplay.client}
                  </span>
                ) : (
                  <span className="text-[11px] text-white/70 mt-1 drop-shadow-sm">
                    None scheduled
                  </span>
                )}
              </div>
            </div>
          </motion.button>

          {/* 2x2 grid of surrounding hex cards */}
          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
            {hiveHexes.map((hex, index) => {
              return (
                <motion.div
                  key={hex.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: 0.15 + index * 0.06,
                    duration: 0.35,
                    type: "spring",
                  }}
                  className="flex justify-center"
                >
                  <button
                    onClick={() => handleHexClick(hex.route)}
                    className="focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    style={{ width: 130, height: 130 }}
                  >
                    <div
                      className="relative w-full h-full flex flex-col items-center justify-center shadow-lg active:shadow-md transition-shadow"
                      style={{
                        clipPath: HEX_CLIP,
                        backgroundColor: hex.texture,
                      }}
                    >
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          clipPath: HEX_CLIP,
                          background:
                            "linear-gradient(145deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(0,0,0,0.08) 100%)",
                        }}
                      />
                      <div className="relative z-10 flex flex-col items-center">
                        <hex.icon className="w-6 h-6 text-white mb-1 drop-shadow-sm" />
                        <span className="text-base font-bold text-white drop-shadow-sm">
                          {getHexValue(hex.id)}
                        </span>
                        <span className="text-[10px] font-medium text-white/90 drop-shadow-sm">
                          {hex.label}
                        </span>
                      </div>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Ecosystem Mode - centered below grid */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.35, type: "spring" }}
            className="flex justify-center mt-6"
          >
            <button
              onClick={() => handleHexClick("/garden")}
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              style={{ width: 120, height: 120 }}
            >
              <div
                className="relative w-full h-full flex flex-col items-center justify-center shadow-lg active:shadow-md transition-shadow"
                style={{
                  clipPath: HEX_CLIP,
                  backgroundColor: "#7D6F5E",
                }}
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    clipPath: HEX_CLIP,
                    background:
                      "linear-gradient(145deg, rgba(255,255,255,0.2) 0%, rgba(212,168,67,0.1) 50%, rgba(0,0,0,0.06) 100%)",
                  }}
                />
                <div className="relative z-10 flex flex-col items-center">
                  <TreePine className="w-6 h-6 text-white mb-1 drop-shadow-sm" />
                  <span className="text-[11px] font-medium text-white drop-shadow-sm">
                    Ecosystem
                  </span>
                </div>
              </div>
            </button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
