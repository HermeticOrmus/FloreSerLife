import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles } from "lucide-react";

export default function ForFacilitatorsCTA() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();

  const handleBecomeFacilitator = () => {
    if (isAuthenticated) {
      setLocation(user?.roles?.includes('practitioner') ? "/dashboard/practitioner" : "/become-facilitator");
    } else {
      setLocation("/auth/signup");
    }
  };

  return (
    <section className="py-24 md:py-32 origami-paper origami-overlay-graphite">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <p className="text-xs tracking-[0.2em] uppercase text-forest/40 mb-6">
          For Healers & Guides
        </p>

        <h2 className="font-heading text-2xl md:text-3xl text-forest mb-8 tracking-tight">
          For Facilitators
        </h2>

        <div className="text-base text-forest/60 leading-relaxed mb-10 space-y-4">
          <p>
            Are you a guide, facilitator, or catalyst?
            You carry a spark — a wisdom shaped by time, experience, and your own path of becoming.
          </p>
          <p>
            At <span className="text-forest/80">FloreSer.Life</span>, facilitators are not listings.
            They are <span className="text-forest/80">Pollinators</span> — vital contributors to a living ecosystem of shared growth, care, and presence.
          </p>
          <p>
            If you guide with integrity, offer your work with respect,
            and wish to grow within a thoughtful, curated field,
            we invite you to join the Hive.
          </p>
        </div>

        <Button
          size="lg"
          className="bg-forest text-white hover:bg-forest/90 px-10 py-6 text-base font-medium tracking-wide transition-colors"
          onClick={handleBecomeFacilitator}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Become a Pollinator
        </Button>
      </div>
    </section>
  );
}
