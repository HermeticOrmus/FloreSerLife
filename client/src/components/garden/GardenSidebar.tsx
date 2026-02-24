import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Home,
  Calendar,
  BookOpen,
  Heart,
  BookMarked,
  Settings,
  Menu,
} from "lucide-react";
import { papercut } from "@/assets";
import { getTierName } from "./types";

interface GardenSidebarProps {
  seedsData: { seedsBalance: number } | undefined;
  onNavigate: (href: string) => void;
  isMobile: boolean;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
}

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Calendar, label: "Book Session", href: "/practitioners" },
  { icon: BookOpen, label: "My Sessions", href: "/sessions" },
  { icon: Heart, label: "Favorites", href: "/favorites" },
  { icon: BookMarked, label: "Journal", href: "/journal" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

function SidebarContent({
  seedsData,
  onNavigate,
}: Pick<GardenSidebarProps, "seedsData" | "onNavigate">) {
  return (
    <div className="relative z-10 p-6 flex flex-col flex-1">
      <div className="mb-8">
        <h2 className="text-page-heading font-heading text-forest">
          My Garden
        </h2>
      </div>

      <nav className="space-y-1 flex-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => onNavigate(item.href)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-button text-body text-forest hover:bg-garden-accent/20 transition-colors"
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-auto"
      >
        <Card className="bg-garden-container border-0 shadow-card-sm rounded-card">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="text-2xl">bee</div>
              <div>
                <p className="text-card-subheading font-heading text-garden-text-primary">
                  Reflections from Maia
                </p>
              </div>
            </div>
            <p className="text-body-sm text-garden-text-secondary">
              You are a{" "}
              {seedsData
                ? getTierName(seedsData.seedsBalance)
                : "Blooming"}{" "}
              Seeker
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function GardenSidebar({
  seedsData,
  onNavigate,
  isMobile,
  mobileOpen,
  onMobileOpenChange,
}: GardenSidebarProps) {
  if (isMobile) {
    return (
      <>
        <div className="fixed top-4 left-4 z-40 md:hidden">
          <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="bg-garden-card border-garden-accent/20 shadow-card"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div
                className="h-full flex flex-col relative"
                style={{
                  backgroundImage: `url(${papercut.textures.paperSage})`,
                  backgroundSize: "256px 256px",
                  backgroundRepeat: "repeat",
                }}
              >
                <div className="absolute inset-0 bg-cream/60" />
                <SidebarContent
                  seedsData={seedsData}
                  onNavigate={(href) => {
                    onMobileOpenChange(false);
                    onNavigate(href);
                  }}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </>
    );
  }

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="hidden md:flex w-64 border-r border-garden-accent/20 flex-col relative"
      style={{
        backgroundImage: `url(${papercut.textures.paperSage})`,
        backgroundSize: "256px 256px",
        backgroundRepeat: "repeat",
      }}
    >
      <div className="absolute inset-0 bg-cream/60" />
      <SidebarContent seedsData={seedsData} onNavigate={onNavigate} />
    </motion.aside>
  );
}
