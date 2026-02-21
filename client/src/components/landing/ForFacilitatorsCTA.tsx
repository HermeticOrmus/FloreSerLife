import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Heart, Sparkles } from "lucide-react";
import { papercut } from "@/assets";

export default function ForFacilitatorsCTA() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();

  const handleBecomeFacilitator = () => {
    if (isAuthenticated) {
      // If already a practitioner, go to dashboard; otherwise go to onboarding
      setLocation(user?.roles?.includes('practitioner') ? "/dashboard/practitioner" : "/become-facilitator");
    } else {
      setLocation("/auth/signup");
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-cream to-sage/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-4 py-2 bg-gold/20 text-gold rounded-full text-sm font-medium mb-6">
            <Heart className="mr-2 h-4 w-4" />
            For Healers & Guides
          </div>

          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-forest mb-6">
            For Facilitators
          </h2>

          <div className="text-lg text-forest/80 leading-relaxed mb-8 max-w-3xl mx-auto space-y-4">
            <p>
              Are you a guide, facilitator, or catalyst?
              <br />You carry a spark &mdash; a wisdom shaped by time, experience, and your own path of becoming.
            </p>
            <p>
              At <strong>FloreSer.Life</strong>, facilitators are not listings.
              <br />They are <strong>Pollinators</strong> &mdash; vital contributors to a living ecosystem of shared growth, care, and presence.
            </p>
            <p>
              If you guide with integrity,
              <br />offer your work with respect,
              <br />and wish to grow within a thoughtful, curated field,
              <br />we invite you to join the Hive.
            </p>
          </div>

          <Button
            size="lg"
            className="text-white hover:opacity-90 rounded-full px-8 shadow-lg transform hover:scale-105 transition-all"
            onClick={handleBecomeFacilitator}
            style={{
              backgroundImage: `url(${papercut.textures.paperGold})`,
              backgroundSize: '200px 200px',
              backgroundRepeat: 'repeat',
            }}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Become a Pollinator
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
