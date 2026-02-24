import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { papercut } from "@/assets";
import {
  Calendar,
  MessageSquare,
  Heart,
  Search,
  Lock,
  Star,
  type LucideIcon,
} from "lucide-react";
import { TudorRose } from "@/components/icons/TudorRose";

// Garden circle card data
interface GardenCircle {
  id: string;
  title: string;
  icon: LucideIcon;
  route: string;
  bgTexture: string;
  textColor: string;
}

const gardenCircles: GardenCircle[] = [
  {
    id: "next-session",
    title: "My Next Session",
    icon: Calendar,
    route: "/sessions",
    bgTexture: "paperSage",
    textColor: "text-white",
  },
  {
    id: "book-session",
    title: "Book a Session",
    icon: Search,
    route: "/hive",
    bgTexture: "paperGold",
    textColor: "text-white",
  },
  {
    id: "favorite-pollinators",
    title: "Favorite Pollinators",
    icon: Heart,
    route: "/favorites",
    bgTexture: "paperClay",
    textColor: "text-white",
  },
  {
    id: "my-sessions",
    title: "My Sessions",
    icon: Star,
    route: "/sessions",
    bgTexture: "paperForest",
    textColor: "text-white",
  },
  {
    id: "hidden-garden",
    title: "My Hidden Garden",
    icon: Lock,
    route: "/journal",
    bgTexture: "paperEarth",
    textColor: "text-white",
  },
  {
    id: "messages",
    title: "Messages",
    icon: MessageSquare,
    route: "/garden",
    bgTexture: "paperCrimson",
    textColor: "text-white",
  },
];

// Circle positioning: 6 items in hexagonal ring
const CIRCLE_SIZE = 130; // px - same size as Tudor rose
const RING_RADIUS = 170; // px from center to each circle center

function getCirclePosition(index: number, total: number = 6) {
  // Start from top (-90 degrees), go clockwise
  const angleDeg = (index * (360 / total)) - 90;
  const angleRad = angleDeg * (Math.PI / 180);
  return {
    x: RING_RADIUS * Math.cos(angleRad),
    y: RING_RADIUS * Math.sin(angleRad),
  };
}

// Container needs to fit: ring radius + circle radius on each side
const CONTAINER_SIZE = (RING_RADIUS + CIRCLE_SIZE / 2) * 2 + 20; // +20 for shadow padding

export default function ClientDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "My Garden - FloreSer";
  }, []);

  // Fetch user's bookings for badge counts
  const { data: bookings = [] } = useQuery({
    queryKey: ["/api/bookings"],
    enabled: !!user,
  });

  const upcomingCount = (bookings as any[]).filter(
    (b: any) =>
      b.status === "scheduled" &&
      new Date(b.scheduledDatetime) > new Date()
  ).length;

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const handleCircleClick = (route: string) => {
    setLocation(route);
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Page heading */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-forest mb-2">
            {getGreeting()}, {user?.firstName || "Friend"}
          </h1>
          <p className="text-forest/60 text-lg">My Garden</p>
        </div>

        {/* Hexagonal Circle Layout - Desktop */}
        <div className="hidden md:flex justify-center mb-16">
          <div
            className="relative"
            style={{
              width: CONTAINER_SIZE,
              height: CONTAINER_SIZE,
            }}
          >
            {/* Center: Tudor Rose */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 180 }}
              className="absolute flex items-center justify-center"
              style={{
                width: CIRCLE_SIZE,
                height: CIRCLE_SIZE,
                top: CONTAINER_SIZE / 2 - CIRCLE_SIZE / 2,
                left: CONTAINER_SIZE / 2 - CIRCLE_SIZE / 2,
              }}
            >
              <div className="w-full h-full rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center border border-white/40">
                <TudorRose size={CIRCLE_SIZE - 10} />
              </div>
            </motion.div>

            {/* 6 Surrounding circles */}
            {gardenCircles.map((circle, index) => {
              const pos = getCirclePosition(index);
              const Icon = circle.icon;
              const texture =
                papercut.textures[
                  circle.bgTexture as keyof typeof papercut.textures
                ];

              return (
                <motion.button
                  key={circle.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: 0.15 + index * 0.08,
                    duration: 0.4,
                    type: "spring",
                    stiffness: 200,
                  }}
                  whileHover={{ scale: 1.08, zIndex: 10 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCircleClick(circle.route)}
                  className="absolute rounded-full flex flex-col items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-shadow group focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                  style={{
                    width: CIRCLE_SIZE,
                    height: CIRCLE_SIZE,
                    top: CONTAINER_SIZE / 2 - CIRCLE_SIZE / 2 + pos.y,
                    left: CONTAINER_SIZE / 2 - CIRCLE_SIZE / 2 + pos.x,
                    backgroundImage: `url(${texture})`,
                    backgroundSize: "200px 200px",
                    backgroundRepeat: "repeat",
                  }}
                >
                  {/* Paper-cut relief overlay */}
                  <div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(145deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(0,0,0,0.08) 100%)",
                    }}
                  />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center">
                    <Icon className={`w-7 h-7 ${circle.textColor} mb-2 drop-shadow-sm group-hover:scale-110 transition-transform`} />
                    <span className={`text-xs font-medium ${circle.textColor} text-center leading-tight px-3 drop-shadow-sm`}>
                      {circle.title}
                    </span>
                  </div>

                  {/* Badge for counts */}
                  {circle.id === "next-session" && upcomingCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-gold text-white text-xs min-w-[20px] h-5 flex items-center justify-center shadow-md z-20">
                      {upcomingCount}
                    </Badge>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Mobile Grid Layout */}
        <div className="md:hidden mb-12">
          {/* Tudor Rose - centered above grid */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex justify-center mb-8"
          >
            <div className="w-28 h-28 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center border border-white/40">
              <TudorRose size={100} />
            </div>
          </motion.div>

          {/* 2x3 Grid of circles */}
          <div className="grid grid-cols-2 gap-5 max-w-sm mx-auto">
            {gardenCircles.map((circle, index) => {
              const Icon = circle.icon;
              const texture =
                papercut.textures[
                  circle.bgTexture as keyof typeof papercut.textures
                ];

              return (
                <motion.button
                  key={circle.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: 0.1 + index * 0.06,
                    duration: 0.35,
                    type: "spring",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCircleClick(circle.route)}
                  className="relative aspect-square rounded-full flex flex-col items-center justify-center shadow-lg active:shadow-md transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  style={{
                    backgroundImage: `url(${texture})`,
                    backgroundSize: "200px 200px",
                    backgroundRepeat: "repeat",
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(145deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(0,0,0,0.08) 100%)",
                    }}
                  />
                  <div className="relative z-10 flex flex-col items-center">
                    <Icon className={`w-7 h-7 ${circle.textColor} mb-2 drop-shadow-sm`} />
                    <span className={`text-xs font-medium ${circle.textColor} text-center leading-tight px-4 drop-shadow-sm`}>
                      {circle.title}
                    </span>
                  </div>

                  {circle.id === "next-session" && upcomingCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-gold text-white text-xs min-w-[20px] h-5 flex items-center justify-center shadow-md z-20">
                      {upcomingCount}
                    </Badge>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
