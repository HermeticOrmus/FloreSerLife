import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Check,
  Circle,
  ChevronRight,
  FileText,
  User,
  Briefcase,
  BookOpen,
  Eye,
  Save,
  ArrowLeft,
  ArrowRight,
  Globe,
  MapPin,
  Video,
  DollarSign,
  Languages,
} from "lucide-react";
import {
  archetypeDefinitions,
  professionalCategoryDefinitions,
  categoryGroups,
} from "@shared/schema";

// ── Design tokens from spec section 8 ───────────────────────────────────────
const COLORS = {
  bgTop: "#FBF8F3",
  bgBottom: "#F2ECE4",
  surface: "#FFFCF8",
  border: "#E6DED3",
  accent: "#C9A24D",
  accentLight: "#D6B36A",
  sage: "#9FAF9A",
  text: "#3D3B36",
  textMuted: "#8A8578",
};

// ── Application stages ──────────────────────────────────────────────────────
const APPLICATION_STAGES = [
  { id: "account", label: "Account Created" },
  { id: "in-progress", label: "Application in Progress" },
  { id: "submitted", label: "Application Submitted" },
  { id: "review", label: "Review in Progress" },
  { id: "conversation", label: "Live Conversation" },
  { id: "decision", label: "Decision Pending" },
  { id: "accepted", label: "Trial Started" },
];

// ── Form sections (tabs) ────────────────────────────────────────────────────
type FormSection = "personal" | "practice" | "offerings" | "story" | "draft-profile";

interface SectionConfig {
  id: FormSection;
  label: string;
  icon: typeof User;
}

const formSections: SectionConfig[] = [
  { id: "personal", label: "Personal", icon: User },
  { id: "practice", label: "Practice", icon: Briefcase },
  { id: "offerings", label: "Offerings", icon: DollarSign },
  { id: "story", label: "Your Story", icon: BookOpen },
  { id: "draft-profile", label: "Draft Soul Profile", icon: Eye },
];

// ── Archetype type ──────────────────────────────────────────────────────────
type Archetype = "bee" | "hummingbird" | "butterfly" | "beetle";

const archetypeEmojis: Record<Archetype, string> = {
  bee: "🐝",
  hummingbird: "🐦",
  butterfly: "🦋",
  beetle: "🪲",
};

// ── Progress Tracker ────────────────────────────────────────────────────────
function ProgressTracker({ currentStage }: { currentStage: number }) {
  return (
    <div className="space-y-1.5">
      {APPLICATION_STAGES.map((stage, index) => {
        const isDone = index < currentStage;
        const isCurrent = index === currentStage;

        return (
          <div key={stage.id} className="flex items-center gap-2.5">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: isDone
                  ? COLORS.accent
                  : isCurrent
                  ? COLORS.accentLight
                  : COLORS.border,
              }}
            >
              {isDone ? (
                <Check className="w-3 h-3 text-white" />
              ) : (
                <Circle
                  className="w-2.5 h-2.5"
                  style={{
                    color: isCurrent ? "white" : COLORS.textMuted,
                  }}
                  fill={isCurrent ? "white" : "none"}
                />
              )}
            </div>
            <span
              className="text-xs"
              style={{
                color: isDone || isCurrent ? COLORS.text : COLORS.textMuted,
                fontWeight: isCurrent ? 600 : 400,
              }}
            >
              {stage.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Form field component ────────────────────────────────────────────────────
function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label
        className="text-xs uppercase tracking-wide font-medium"
        style={{ color: COLORS.textMuted }}
      >
        {label}
      </Label>
      {children}
      {hint && (
        <p className="text-[11px]" style={{ color: COLORS.textMuted }}>
          {hint}
        </p>
      )}
    </div>
  );
}

// ── Section content components ──────────────────────────────────────────────

function PersonalSection() {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold mb-1" style={{ color: COLORS.text }}>
          Personal Information
        </h3>
        <p className="text-sm" style={{ color: COLORS.textMuted }}>
          Basic information to get started. Everything here is private.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Field label="First Name">
          <Input
            placeholder="Your first name"
            className="rounded-lg"
            style={{ background: COLORS.surface, borderColor: COLORS.border }}
          />
        </Field>
        <Field label="Last Name">
          <Input
            placeholder="Your last name"
            className="rounded-lg"
            style={{ background: COLORS.surface, borderColor: COLORS.border }}
          />
        </Field>
      </div>

      <Field label="Email">
        <Input
          type="email"
          placeholder="your@email.com"
          className="rounded-lg"
          style={{ background: COLORS.surface, borderColor: COLORS.border }}
        />
      </Field>

      <Field label="Location" hint="City and country where you primarily practice">
        <div className="relative">
          <MapPin
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: COLORS.textMuted }}
          />
          <Input
            placeholder="e.g., Panama City, Panama"
            className="pl-10 rounded-lg"
            style={{ background: COLORS.surface, borderColor: COLORS.border }}
          />
        </div>
      </Field>

      <Field label="Languages Spoken" hint="Comma-separated">
        <div className="relative">
          <Languages
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: COLORS.textMuted }}
          />
          <Input
            placeholder="e.g., English, Spanish, French"
            className="pl-10 rounded-lg"
            style={{ background: COLORS.surface, borderColor: COLORS.border }}
          />
        </div>
      </Field>

      <Field label="Timezone">
        <div className="relative">
          <Globe
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: COLORS.textMuted }}
          />
          <Input
            placeholder="e.g., America/Panama (UTC-5)"
            className="pl-10 rounded-lg"
            style={{ background: COLORS.surface, borderColor: COLORS.border }}
          />
        </div>
      </Field>
    </div>
  );
}

function PracticeSection() {
  const [selectedArchetype, setSelectedArchetype] = useState<Archetype | null>(
    null
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1" style={{ color: COLORS.text }}>
          Your Practice
        </h3>
        <p className="text-sm" style={{ color: COLORS.textMuted }}>
          Tell us about your healing approach and background.
        </p>
      </div>

      {/* Archetype selection */}
      <Field label="Pollinator Archetype" hint="Which archetype resonates most with your practice?">
        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(archetypeDefinitions) as Archetype[]).map((key) => {
            const def = archetypeDefinitions[key];
            const isSelected = selectedArchetype === key;

            return (
              <button
                key={key}
                onClick={() => setSelectedArchetype(key)}
                className="p-3 rounded-lg text-left transition-all"
                style={{
                  background: isSelected ? `${COLORS.accent}15` : COLORS.surface,
                  border: `1.5px solid ${
                    isSelected ? COLORS.accent : COLORS.border
                  }`,
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{archetypeEmojis[key]}</span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: COLORS.text }}
                  >
                    {def.name}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed" style={{ color: COLORS.textMuted }}>
                  {def.scientificName}
                </p>
              </button>
            );
          })}
        </div>
      </Field>

      {/* Experience */}
      <Field label="Years of Active Practice">
        <Input
          type="number"
          placeholder="e.g., 5"
          className="rounded-lg max-w-32"
          style={{ background: COLORS.surface, borderColor: COLORS.border }}
        />
      </Field>

      {/* Professional categories */}
      <Field
        label="Professional Categories"
        hint="Select all that apply to your practice"
      >
        <div className="space-y-4">
          {Object.entries(categoryGroups).map(([groupKey, group]) => {
            const categories = Object.entries(
              professionalCategoryDefinitions
            ).filter(([, def]) => def.group === groupKey);

            if (categories.length === 0) return null;

            return (
              <div key={groupKey}>
                <p
                  className="text-xs font-medium mb-2"
                  style={{ color: group.color }}
                >
                  {group.name}
                </p>
                <div className="flex flex-wrap gap-2">
                  {categories.map(([catKey, cat]) => (
                    <button
                      key={catKey}
                      className="px-3 py-1.5 text-xs rounded-full transition-colors"
                      style={{
                        background: COLORS.surface,
                        border: `1px solid ${COLORS.border}`,
                        color: COLORS.textMuted,
                      }}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Field>

      {/* Certifications */}
      <Field label="Certifications & Training" hint="List your relevant qualifications">
        <Textarea
          placeholder="Describe your training, certifications, and credentials..."
          rows={4}
          className="rounded-lg resize-none"
          style={{ background: COLORS.surface, borderColor: COLORS.border }}
        />
      </Field>
    </div>
  );
}

function OfferingsSection() {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold mb-1" style={{ color: COLORS.text }}>
          Your Offerings
        </h3>
        <p className="text-sm" style={{ color: COLORS.textMuted }}>
          Define what you offer and how clients can work with you.
        </p>
      </div>

      <Field label="Session Types">
        <div className="space-y-3">
          <div
            className="flex items-center justify-between p-3 rounded-lg"
            style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}
          >
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4" style={{ color: COLORS.textMuted }} />
              <span className="text-sm" style={{ color: COLORS.text }}>
                Virtual Sessions
              </span>
            </div>
            <Switch />
          </div>
          <div
            className="flex items-center justify-between p-3 rounded-lg"
            style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" style={{ color: COLORS.textMuted }} />
              <span className="text-sm" style={{ color: COLORS.text }}>
                In-Person Sessions
              </span>
            </div>
            <Switch />
          </div>
        </div>
      </Field>

      <Field label="Hourly Rate (USD)" hint="Base rate for a 60-minute session">
        <div className="relative max-w-48">
          <DollarSign
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: COLORS.textMuted }}
          />
          <Input
            type="number"
            placeholder="e.g., 120"
            className="pl-10 rounded-lg"
            style={{ background: COLORS.surface, borderColor: COLORS.border }}
          />
        </div>
      </Field>

      <Field label="Session Durations Offered" hint="Select all that apply">
        <div className="flex flex-wrap gap-2">
          {[30, 45, 60, 90, 120].map((mins) => (
            <button
              key={mins}
              className="px-4 py-2 text-sm rounded-full transition-colors"
              style={{
                background: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
                color: COLORS.textMuted,
              }}
            >
              {mins} min
            </button>
          ))}
        </div>
      </Field>

      <Field label="Specializations" hint="Describe what you specialize in">
        <Textarea
          placeholder="e.g., Anxiety management, Grief support, Spiritual direction, Couples therapy..."
          rows={3}
          className="rounded-lg resize-none"
          style={{ background: COLORS.surface, borderColor: COLORS.border }}
        />
      </Field>
    </div>
  );
}

function StorySection() {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold mb-1" style={{ color: COLORS.text }}>
          Your Story
        </h3>
        <p className="text-sm" style={{ color: COLORS.textMuted }}>
          Share who you are and what draws you to this work. Be authentic -- this
          helps us understand your practice and values.
        </p>
      </div>

      <Field
        label="Your Journey"
        hint="What led you to become a facilitator? What drives your practice?"
      >
        <Textarea
          placeholder="Share your story in your own words..."
          rows={6}
          className="rounded-lg resize-none"
          style={{ background: COLORS.surface, borderColor: COLORS.border }}
        />
      </Field>

      <Field
        label="Your Approach"
        hint="How would you describe your healing philosophy?"
      >
        <Textarea
          placeholder="Describe your approach, methods, and what makes your practice unique..."
          rows={4}
          className="rounded-lg resize-none"
          style={{ background: COLORS.surface, borderColor: COLORS.border }}
        />
      </Field>

      <Field label="Why FloreSer?" hint="What draws you to this community?">
        <Textarea
          placeholder="Tell us why you want to join this ecosystem..."
          rows={3}
          className="rounded-lg resize-none"
          style={{ background: COLORS.surface, borderColor: COLORS.border }}
        />
      </Field>

      <Field label="Testimonials" hint="Optional: Share 1-3 client testimonials">
        <Textarea
          placeholder="Paste testimonials from previous clients (with their permission)..."
          rows={4}
          className="rounded-lg resize-none"
          style={{ background: COLORS.surface, borderColor: COLORS.border }}
        />
      </Field>
    </div>
  );
}

function DraftProfileSection() {
  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h3
            className="text-lg font-semibold"
            style={{ color: COLORS.text }}
          >
            Draft Soul Profile
          </h3>
          <Badge
            className="text-[10px]"
            style={{
              background: `${COLORS.accent}15`,
              color: COLORS.accent,
              border: `1px solid ${COLORS.accent}30`,
            }}
          >
            Draft -- for review only
          </Badge>
        </div>
        <p className="text-sm" style={{ color: COLORS.textMuted }}>
          This is how you'll appear to clients. Edit it until you're ready to
          submit. After acceptance, this becomes your public Soul Profile.
        </p>
      </div>

      <Field label="Display Name" hint="The name clients will see">
        <Input
          placeholder="e.g., Dr. Maya Gonzalez"
          className="rounded-lg"
          style={{ background: COLORS.surface, borderColor: COLORS.border }}
        />
      </Field>

      <Field label="Short Bio" hint="A concise introduction (2-3 sentences)">
        <Textarea
          placeholder="Write a brief introduction that captures the essence of your practice..."
          rows={3}
          className="rounded-lg resize-none"
          style={{ background: COLORS.surface, borderColor: COLORS.border }}
        />
      </Field>

      <Field label="Draft Offerings" hint="Brief description of what you offer">
        <Textarea
          placeholder="List your key offerings as clients will see them..."
          rows={3}
          className="rounded-lg resize-none"
          style={{ background: COLORS.surface, borderColor: COLORS.border }}
        />
      </Field>

      <Field label="Location (Public)">
        <Input
          placeholder="e.g., Panama City, Panama"
          className="rounded-lg"
          style={{ background: COLORS.surface, borderColor: COLORS.border }}
        />
      </Field>

      <Field label="Languages">
        <Input
          placeholder="e.g., English, Spanish"
          className="rounded-lg"
          style={{ background: COLORS.surface, borderColor: COLORS.border }}
        />
      </Field>

      <Field label="Intro Video or Image" hint="Optional: Link to a video or image">
        <Input
          placeholder="https://..."
          className="rounded-lg"
          style={{ background: COLORS.surface, borderColor: COLORS.border }}
        />
      </Field>
    </div>
  );
}

const sectionComponents: Record<FormSection, () => JSX.Element> = {
  personal: PersonalSection,
  practice: PracticeSection,
  offerings: OfferingsSection,
  story: StorySection,
  "draft-profile": DraftProfileSection,
};

// ── Main Component ──────────────────────────────────────────────────────────
export default function Application() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [activeSection, setActiveSection] =
    useState<FormSection>("personal");
  const [currentStage] = useState(1); // "Application in progress"

  useEffect(() => {
    document.title = "My Application - FloreSer";
  }, []);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isAuthenticated && !user) {
      // Allow viewing but show auth prompt
    }
  }, [isAuthenticated, user]);

  const currentIndex = formSections.findIndex((s) => s.id === activeSection);
  const ActiveContent = sectionComponents[activeSection];

  const goNext = () => {
    if (currentIndex < formSections.length - 1) {
      setActiveSection(formSections[currentIndex + 1].id);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setActiveSection(formSections[currentIndex - 1].id);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(180deg, ${COLORS.bgTop} 0%, ${COLORS.bgBottom} 100%)`,
      }}
    >
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page heading */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <h1
            className="font-heading text-3xl lg:text-4xl font-bold mb-2"
            style={{ color: COLORS.text }}
          >
            My Application
          </h1>
          <p className="text-base" style={{ color: COLORS.textMuted }}>
            Your path to becoming a Pollinator
          </p>
        </motion.div>

        {/* ── Three-Column Layout ─────────────────────────────────── */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="flex flex-col lg:flex-row gap-6 mb-16"
        >
          {/* ── LEFT: Progress Tracker ────────────────────────────── */}
          <div
            className="lg:w-[220px] flex-shrink-0 rounded-lg p-5"
            style={{
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <h4
              className="text-xs font-semibold uppercase tracking-wider mb-4"
              style={{ color: COLORS.textMuted }}
            >
              Application Status
            </h4>
            <ProgressTracker currentStage={currentStage} />

            {/* Auto-save indicator */}
            <div
              className="mt-6 pt-4 flex items-center gap-1.5"
              style={{ borderTop: `1px solid ${COLORS.border}` }}
            >
              <Save className="w-3 h-3" style={{ color: COLORS.sage }} />
              <span className="text-[11px]" style={{ color: COLORS.sage }}>
                Auto-save enabled
              </span>
            </div>
          </div>

          {/* ── CENTER: Form Content ──────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Section tabs */}
            <div
              className="flex items-center gap-1 mb-5 overflow-x-auto pb-1"
              style={{ scrollbarWidth: "none" }}
            >
              {formSections.map((section, index) => {
                const isActive = activeSection === section.id;
                const Icon = section.icon;

                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm whitespace-nowrap transition-all"
                    style={{
                      background: isActive ? COLORS.surface : "transparent",
                      border: isActive
                        ? `1px solid ${COLORS.border}`
                        : "1px solid transparent",
                      color: isActive ? COLORS.text : COLORS.textMuted,
                      fontWeight: isActive ? 600 : 400,
                      boxShadow: isActive
                        ? "0 1px 3px rgba(0,0,0,0.04)"
                        : "none",
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    {section.label}
                    {index < formSections.length - 1 && !isActive && (
                      <ChevronRight
                        className="w-3 h-3 ml-1 hidden md:block"
                        style={{ color: COLORS.border }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Form panel */}
            <div
              className="rounded-lg p-6 md:p-8"
              style={{
                background: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <ActiveContent />

              {/* Navigation buttons */}
              <div
                className="flex items-center justify-between mt-8 pt-6"
                style={{ borderTop: `1px solid ${COLORS.border}` }}
              >
                <Button
                  variant="ghost"
                  onClick={goPrev}
                  disabled={currentIndex === 0}
                  className="text-sm"
                  style={{ color: COLORS.textMuted }}
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>

                <span
                  className="text-xs hidden sm:block"
                  style={{ color: COLORS.textMuted }}
                >
                  {currentIndex + 1} of {formSections.length}
                </span>

                {currentIndex < formSections.length - 1 ? (
                  <Button
                    onClick={goNext}
                    className="text-sm text-white rounded-lg"
                    style={{ background: COLORS.accent }}
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    className="text-sm text-white rounded-lg"
                    style={{ background: COLORS.accent }}
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    Submit Application
                  </Button>
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
