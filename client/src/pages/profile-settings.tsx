import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { papercut } from "@/assets";
import {
  User,
  Shield,
  Lock,
  CreditCard,
  Receipt,
  Flower2,
} from "lucide-react";

// Hexagonal clip-path
const HEX_CLIP =
  "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

// ── Section types ───────────────────────────────────────────────────────────
type Section =
  | "personal"
  | "confidentiality"
  | "password"
  | "subscription"
  | "billing";

interface SectionConfig {
  id: Section;
  label: string;
  icon: typeof User;
}

const sections: SectionConfig[] = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "confidentiality", label: "Confidentiality", icon: Shield },
  { id: "password", label: "Password", icon: Lock },
  { id: "subscription", label: "Subscription", icon: CreditCard },
  { id: "billing", label: "Billing", icon: Receipt },
];

// ── Growth stage hex icons (decorative) ─────────────────────────────────────
const growthStages = [
  { label: "Seed", symbol: "🌱" },
  { label: "Sprout", symbol: "🌿" },
  { label: "Bud", symbol: "🌸" },
  { label: "Bloom", symbol: "🌺" },
];

// ── Form field component ────────────────────────────────────────────────────
function FormField({
  label,
  value,
  placeholder,
  type = "text",
  disabled = false,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-forest/60 uppercase tracking-wide font-medium">
        {label}
      </Label>
      <Input
        type={type}
        defaultValue={value}
        placeholder={placeholder}
        disabled={disabled}
        className="bg-white/60 border-forest/12 text-forest focus:border-gold/40 focus:ring-gold/20 rounded-lg"
      />
    </div>
  );
}

// ── Section content components ──────────────────────────────────────────────

function PersonalInfoSection({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-lg text-forest mb-1">
          Personal Information
        </h3>
        <p className="text-forest/40 text-sm">
          Manage your name, email, and contact details.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <FormField
          label="First Name"
          value={user?.firstName || ""}
          placeholder="Your first name"
        />
        <FormField
          label="Last Name"
          value={user?.lastName || ""}
          placeholder="Your last name"
        />
      </div>

      <FormField
        label="Email"
        value={user?.email || ""}
        type="email"
        placeholder="your@email.com"
      />

      <FormField label="Location" placeholder="City, Country" />

      <FormField label="Phone" placeholder="+1 (555) 000-0000" type="tel" />
    </div>
  );
}

function ConfidentialitySection() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-lg text-forest mb-1">
          Confidentiality
        </h3>
        <p className="text-forest/40 text-sm">
          Control your privacy and data sharing preferences.
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-white/40 border border-forest/8">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-forest">
                Profile Visibility
              </p>
              <p className="text-xs text-forest/40 mt-0.5">
                Control who can see your profile information
              </p>
            </div>
            <Badge className="bg-forest/5 text-forest/60 border border-forest/10 text-xs">
              Private
            </Badge>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white/40 border border-forest/8">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-forest">
                Session History
              </p>
              <p className="text-xs text-forest/40 mt-0.5">
                Your session records are always private and encrypted
              </p>
            </div>
            <Badge className="bg-sage/20 text-forest/60 border border-sage/30 text-xs">
              Protected
            </Badge>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white/40 border border-forest/8">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-forest">
                Journal Entries
              </p>
              <p className="text-xs text-forest/40 mt-0.5">
                Your Hidden Garden reflections are never shared
              </p>
            </div>
            <Badge className="bg-sage/20 text-forest/60 border border-sage/30 text-xs">
              Protected
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

function PasswordSection() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-lg text-forest mb-1">Password</h3>
        <p className="text-forest/40 text-sm">
          Update your account password.
        </p>
      </div>

      <FormField
        label="Current Password"
        type="password"
        placeholder="Enter current password"
      />
      <FormField
        label="New Password"
        type="password"
        placeholder="Enter new password"
      />
      <FormField
        label="Confirm New Password"
        type="password"
        placeholder="Confirm new password"
      />
    </div>
  );
}

function SubscriptionSection() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-lg text-forest mb-1">
          Subscription
        </h3>
        <p className="text-forest/40 text-sm">
          Manage your FloreSer subscription plan.
        </p>
      </div>

      <div className="p-5 rounded-lg bg-white/40 border border-forest/8">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-heading text-base text-forest">Current Plan</h4>
          <Badge className="bg-gold/10 text-gold border border-gold/20 text-xs">
            Preview
          </Badge>
        </div>
        <p className="text-sm text-forest/50 mb-4">
          You're on the free preview tier. Explore the platform and discover
          how FloreSer can support your growth journey.
        </p>
        <div className="flex items-center gap-4 text-xs text-forest/40">
          <span>3 practitioner views</span>
          <span className="w-1 h-1 rounded-full bg-forest/20" />
          <span>Limited access</span>
        </div>
      </div>

      <div className="p-5 rounded-lg border-2 border-dashed border-gold/20 text-center">
        <Flower2 className="w-8 h-8 text-gold/30 mx-auto mb-2" />
        <p className="text-sm text-forest/50">
          Premium plans coming soon
        </p>
        <p className="text-xs text-forest/30 mt-1">
          Unlimited access, priority booking, and more
        </p>
      </div>
    </div>
  );
}

function BillingSection() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-lg text-forest mb-1">Billing</h3>
        <p className="text-forest/40 text-sm">
          Manage your payment methods and billing history.
        </p>
      </div>

      <div className="p-5 rounded-lg bg-white/40 border border-forest/8">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-forest">Payment Method</h4>
          <Badge className="bg-forest/5 text-forest/40 border border-forest/10 text-xs">
            None
          </Badge>
        </div>
        <p className="text-sm text-forest/40">
          No payment method on file. Add one when you're ready to subscribe.
        </p>
      </div>

      <div className="p-5 rounded-lg bg-white/40 border border-forest/8">
        <h4 className="text-sm font-medium text-forest mb-3">
          Billing History
        </h4>
        <p className="text-sm text-forest/40 text-center py-4">
          No transactions yet
        </p>
      </div>
    </div>
  );
}

const sectionComponents: Record<Section, React.ComponentType<{ user?: any }>> =
  {
    personal: PersonalInfoSection,
    confidentiality: ConfidentialitySection,
    password: PasswordSection,
    subscription: SubscriptionSection,
    billing: BillingSection,
  };

// ── Main Component ──────────────────────────────────────────────────────────
export default function ProfileSettings() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<Section>("personal");

  useEffect(() => {
    document.title = "My Profile - FloreSer";
  }, []);

  const ActiveContent = sectionComponents[activeSection];
  const avatarInitial = user?.firstName?.charAt(0) || "U";
  const userName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "User";

  return (
    <div
      className="min-h-screen text-papercut-neutral-dark"
      style={{
        backgroundImage: `url(${papercut.textures.paperUI})`,
        backgroundSize: "256px 256px",
        backgroundRepeat: "repeat",
        backgroundColor: "#f5f3ef",
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
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-forest mb-2">
            My Profile
          </h1>
          <p className="text-forest/50 text-base">Account settings</p>
        </motion.div>

        {/* ── Two-Panel Layout ─────────────────────────────────────── */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mb-16"
        >
          <div className="flex flex-col md:flex-row gap-6 max-w-5xl mx-auto">
            {/* ── LEFT: Profile Card ──────────────────────────────── */}
            <div
              className="md:w-[280px] flex-shrink-0 rounded-xl shadow-lg overflow-hidden"
              style={{
                backgroundImage: `url(${papercut.textures.flatCream})`,
                backgroundSize: "256px 256px",
                backgroundRepeat: "repeat",
              }}
            >
              <div className="relative p-6">
                {/* Subtle relief */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.03) 100%)",
                  }}
                />

                <div className="relative z-10">
                  {/* Growth stage hex icons */}
                  <div className="flex items-center justify-center gap-2 mb-5">
                    {growthStages.map((stage) => (
                      <div
                        key={stage.label}
                        className="w-8 h-8 flex items-center justify-center shadow-sm"
                        style={{
                          clipPath: HEX_CLIP,
                          backgroundImage: `url(${papercut.textures.paperSage})`,
                          backgroundSize: "60px 60px",
                          backgroundRepeat: "repeat",
                        }}
                        title={stage.label}
                      >
                        <span className="text-xs">{stage.symbol}</span>
                      </div>
                    ))}
                  </div>

                  {/* Hexagonal portrait */}
                  <div className="flex justify-center mb-4">
                    <div
                      className="w-24 h-24 flex items-center justify-center shadow-md"
                      style={{
                        clipPath: HEX_CLIP,
                        backgroundImage: `url(${papercut.textures.paperClay})`,
                        backgroundSize: "120px 120px",
                        backgroundRepeat: "repeat",
                      }}
                    >
                      <span className="text-3xl font-heading font-bold text-white drop-shadow-sm">
                        {avatarInitial}
                      </span>
                    </div>
                  </div>

                  {/* Name */}
                  <h3 className="font-heading text-lg font-semibold text-forest text-center mb-6">
                    {userName}
                  </h3>

                  {/* Section menu */}
                  <nav className="space-y-2">
                    {sections.map((section) => {
                      const isActive = activeSection === section.id;
                      const SectionIcon = section.icon;

                      return (
                        <motion.button
                          key={section.id}
                          whileHover={{ x: 2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setActiveSection(section.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-full text-left transition-all text-sm ${
                            isActive ? "shadow-md" : "hover:bg-white/40"
                          }`}
                          style={
                            isActive
                              ? {
                                  backgroundImage: `url(${papercut.textures.flatSage})`,
                                  backgroundSize: "200px 200px",
                                  backgroundRepeat: "repeat",
                                }
                              : undefined
                          }
                        >
                          <SectionIcon
                            className={`w-4 h-4 ${
                              isActive
                                ? "text-white drop-shadow-sm"
                                : "text-forest/35"
                            }`}
                          />
                          <span
                            className={
                              isActive
                                ? "text-white drop-shadow-sm font-medium"
                                : "text-forest/55"
                            }
                          >
                            {section.label}
                          </span>
                        </motion.button>
                      );
                    })}
                  </nav>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Content Panel ────────────────────────────── */}
            <div
              className="flex-1 rounded-xl shadow-lg overflow-hidden min-h-[520px]"
              style={{
                backgroundImage: `url(${papercut.textures.flatCream})`,
                backgroundSize: "256px 256px",
                backgroundRepeat: "repeat",
              }}
            >
              <div className="relative p-8 md:p-10">
                {/* Subtle relief */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 40%, rgba(0,0,0,0.02) 100%)",
                  }}
                />

                <div className="relative z-10">
                  <ActiveContent user={user} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
