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
  { icon: Settings, label: "Settings", href: "/profile-settings" },
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
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-body text-forest/80 hover:bg-forest/8 hover:text-forest transition-colors"
          >
            <item.icon className="w-5 h-5" strokeWidth={1.5} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto">
        <div className="border border-forest/8 rounded-lg origami-emboss p-5">
          <p className="text-sm font-heading text-forest mb-1">
            Reflections from Maia
          </p>
          <p className="text-xs text-forest/50">
            You are a{" "}
            {seedsData
              ? getTierName(seedsData.seedsBalance)
              : "Blooming"}{" "}
            Seeker
          </p>
        </div>
      </div>
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
                className="bg-white border-forest/10 origami-fold-shadow"
              >
                <Menu className="h-5 w-5 text-forest/60" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="h-full flex flex-col bg-white origami-paper-forest origami-subtle">
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
    <aside className="hidden md:flex w-64 border-r border-forest/8 flex-col bg-white origami-paper-forest origami-subtle">
      <SidebarContent seedsData={seedsData} onNavigate={onNavigate} />
    </aside>
  );
}
