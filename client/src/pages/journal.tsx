import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

import {
  BookOpen,
  Sparkles,
  Clock,
  Heart,
  Lock,
  Star,
  PenLine,
} from "lucide-react";

// ── Section types ───────────────────────────────────────────────────────────
type Section = "journal" | "prepare" | "history" | "favorites";

interface SectionConfig {
  id: Section;
  label: string;
  icon: typeof BookOpen;
}

const sections: SectionConfig[] = [
  { id: "journal", label: "Journal", icon: PenLine },
  { id: "prepare", label: "Prepare with mAIa", icon: Sparkles },
  { id: "history", label: "History", icon: Clock },
  { id: "favorites", label: "Favorites", icon: Heart },
];

// ── Book spine SVG ──────────────────────────────────────────────────────────
function BookSpine() {
  return (
    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-6 z-10 pointer-events-none">
      {/* Spine shadow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.03) 30%, rgba(0,0,0,0.12) 50%, rgba(0,0,0,0.03) 70%, rgba(0,0,0,0.08) 100%)",
        }}
      />
      {/* Center crease line */}
      <div className="absolute left-1/2 top-4 bottom-4 w-px bg-forest/10 -translate-x-1/2" />
    </div>
  );
}

// ── Flowing paper hills (background) ────────────────────────────────────────
function PaperHills() {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden"
      style={{ height: 180 }}
    >
      <svg
        viewBox="0 0 1200 180"
        preserveAspectRatio="none"
        className="absolute bottom-0 w-full"
        style={{ height: 150 }}
      >
        <path
          d="M0,100 C200,40 400,80 600,50 C800,20 1000,70 1200,40 L1200,180 L0,180 Z"
          fill="#8B9D77"
          opacity="0.1"
        />
      </svg>
      <svg
        viewBox="0 0 1200 180"
        preserveAspectRatio="none"
        className="absolute bottom-0 w-full"
        style={{ height: 120 }}
      >
        <path
          d="M0,90 C300,40 500,70 700,30 C900,5 1100,50 1200,20 L1200,180 L0,180 Z"
          fill="#C4A882"
          opacity="0.08"
        />
      </svg>
    </div>
  );
}

// ── Section content components ──────────────────────────────────────────────

function JournalSection() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-8">
      <PenLine className="w-12 h-12 text-forest/20 mb-4" />
      <h3 className="font-heading text-xl text-forest/80 mb-2">
        Your Reflections
      </h3>
      <p className="text-forest/50 text-sm max-w-sm leading-relaxed mb-6">
        This is your private space to write, reflect, and grow. After each
        session, capture your thoughts, feelings, and insights here.
      </p>
      <div className="w-full max-w-md">
        <div className="border-b border-forest/10 py-3 text-left">
          <div className="flex items-center gap-2 text-forest/30 text-sm italic">
            <PenLine className="w-3.5 h-3.5" />
            Begin writing your first entry...
          </div>
        </div>
        <div className="border-b border-forest/10 py-3" />
        <div className="border-b border-forest/10 py-3" />
        <div className="border-b border-forest/10 py-3" />
      </div>
    </div>
  );
}

function PrepareSection() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-8">
      <Sparkles className="w-12 h-12 text-gold/40 mb-4" />
      <h3 className="font-heading text-xl text-forest/80 mb-2">
        Prepare with mAIa
      </h3>
      <p className="text-forest/50 text-sm max-w-sm leading-relaxed mb-4">
        Before your next session, mAIa can guide you through a gentle
        preparation -- setting intentions, reflecting on what you hope to
        explore, and arriving with clarity.
      </p>
      <div className="inline-flex items-center px-4 py-2 bg-gold/10 text-gold rounded-full text-sm font-medium">
        <Sparkles className="w-4 h-4 mr-2" />
        Coming Soon
      </div>
    </div>
  );
}

function HistorySection() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-8">
      <Clock className="w-12 h-12 text-forest/20 mb-4" />
      <h3 className="font-heading text-xl text-forest/80 mb-2">
        Session History
      </h3>
      <p className="text-forest/50 text-sm max-w-sm leading-relaxed mb-4">
        Review your past sessions, revisit your notes, and see how your journey
        has unfolded. Rate facilitators and add reflections after each session.
      </p>
      {/* Empty state with star rating hint */}
      <div className="flex items-center gap-1 text-forest/20">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} className="w-5 h-5" />
        ))}
      </div>
      <p className="text-forest/30 text-xs mt-2">
        Your session ratings will appear here
      </p>
    </div>
  );
}

function FavoritesSection() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-8">
      <Heart className="w-12 h-12 text-crimson/20 mb-4" />
      <h3 className="font-heading text-xl text-forest/80 mb-2">
        Your Favorites
      </h3>
      <p className="text-forest/50 text-sm max-w-sm leading-relaxed">
        Practitioners, articles, and resources you've saved will be gathered
        here -- your own curated collection of what resonates most.
      </p>
    </div>
  );
}

const sectionComponents: Record<Section, () => JSX.Element> = {
  journal: JournalSection,
  prepare: PrepareSection,
  history: HistorySection,
  favorites: FavoritesSection,
};

// ── Main Component ──────────────────────────────────────────────────────────
export default function Journal() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState<Section>("journal");

  useEffect(() => {
    document.title = "My Hidden Garden - FloreSer";
  }, []);

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!user) return;
  }, [user]);

  const ActiveContent = sectionComponents[activeSection];

  return (
    <div className="min-h-screen bg-cream">
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
          <div className="inline-flex items-center px-3 py-1.5 bg-forest/10 text-forest/70 rounded-full text-sm font-medium mb-4">
            <Lock className="w-3.5 h-3.5 mr-1.5" />
            Private
          </div>
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-forest">
            My Hidden Garden
          </h1>
        </motion.div>

        {/* ── The Open Book ──────────────────────────────────────────── */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="relative z-10 mb-16"
        >
          {/* Book container */}
          <div
            className="relative mx-auto rounded-lg overflow-hidden shadow-2xl"
            style={{
              maxWidth: 900,
              minHeight: 520,
            }}
          >
            {/* Book spine */}
            <BookSpine />

            <div className="flex flex-col md:flex-row min-h-[520px]">
              {/* ── Left Page: Menu ─────────────────────────────────── */}
              <div
                className="md:w-[38%] p-8 md:p-10 flex flex-col bg-cream"
              >
                {/* Subtle page relief */}
                <div
                  className="absolute inset-0 md:w-[38%] pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0.1) 0%, transparent 60%, rgba(0,0,0,0.03) 100%)",
                  }}
                />

                <div className="relative z-10 flex flex-col h-full">
                  {/* Book page ornament */}
                  <div className="flex items-center gap-2 mb-8">
                    <BookOpen className="w-5 h-5 text-forest/30" />
                    <div className="flex-1 h-px bg-forest/10" />
                  </div>

                  {/* Section menu */}
                  <nav className="space-y-3 flex-1">
                    {sections.map((section) => {
                      const isActive = activeSection === section.id;
                      const SectionIcon = section.icon;

                      return (
                        <motion.button
                          key={section.id}
                          whileHover={{ x: 3 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setActiveSection(section.id)}
                          className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-full text-left transition-all ${
                            isActive
                              ? "shadow-md bg-sage/20"
                              : "hover:bg-white/40"
                          }`}
                        >
                          <SectionIcon
                            className={`w-4.5 h-4.5 ${
                              isActive
                                ? "text-white drop-shadow-sm"
                                : "text-forest/40"
                            }`}
                          />
                          <span
                            className={`text-sm font-medium ${
                              isActive
                                ? "text-white drop-shadow-sm"
                                : "text-forest/60"
                            }`}
                          >
                            {section.label}
                          </span>
                        </motion.button>
                      );
                    })}
                  </nav>

                  {/* Bottom page ornament */}
                  <div className="flex items-center gap-2 mt-8">
                    <div className="flex-1 h-px bg-forest/10" />
                    <span className="text-[10px] text-forest/20 font-serif italic">
                      page i
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Right Page: Content Area ────────────────────────── */}
              <div
                className="md:w-[62%] p-8 md:p-10 flex flex-col min-h-[400px] md:min-h-0 bg-cream"
              >
                {/* Subtle page relief (opposite direction) */}
                <div
                  className="absolute inset-0 md:left-[38%] pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(0,0,0,0.03) 0%, transparent 40%, rgba(255,255,255,0.08) 100%)",
                  }}
                />

                <div className="relative z-10 flex flex-col h-full">
                  {/* Top ornament */}
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex-1 h-px bg-forest/10" />
                    <span className="text-xs text-forest/30 font-heading tracking-widest uppercase">
                      {sections.find((s) => s.id === activeSection)?.label}
                    </span>
                    <div className="flex-1 h-px bg-forest/10" />
                  </div>

                  {/* Active section content */}
                  <div className="flex-1 flex items-center justify-center">
                    <ActiveContent />
                  </div>

                  {/* Bottom ornament */}
                  <div className="flex items-center gap-2 mt-6">
                    <span className="text-[10px] text-forest/20 font-serif italic">
                      page ii
                    </span>
                    <div className="flex-1 h-px bg-forest/10" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Book shadow on the table */}
          <div
            className="mx-auto mt-1 rounded-full"
            style={{
              maxWidth: 850,
              height: 12,
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0.08) 0%, transparent 70%)",
            }}
          />
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
