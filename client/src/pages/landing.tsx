import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ArchetypeShowcase from "@/components/archetype-showcase";
import CharacterShowcase from "@/components/character-showcase";
import HowItWorks from "@/components/how-it-works";
import FeaturedPractitioners from "@/components/featured-practitioners";
import StatsSection from "@/components/stats-section";
import CTASection from "@/components/cta-section";
import { Button } from "@/components/ui/button";
import { Star, Shield, Search, Calendar, UserCheck } from "lucide-react";
import { characters } from "@/assets";

export default function Landing() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    document.title = "FloreSer - Find Your Ideal Wellness Practitioner";
  }, []);

  return (
    <div className="min-h-screen bg-cream text-forest">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-cream to-light-green/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Trust Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-gold/20 text-gold rounded-full text-sm font-medium mb-6">
                <UserCheck className="mr-2 h-4 w-4" />
                Verified Wellness Practitioners
              </div>

              <h1 className="font-heading text-4xl lg:text-6xl font-bold text-forest mb-6 leading-tight">
                Beyond Traditional Therapy:<br />
                <span className="text-gold">Nature-Inspired</span> Wellness Matching
              </h1>
              <p className="text-lg text-forest/80 mb-8 leading-relaxed">
                Stop settling for mismatched practitioners. Our revolutionary pollinator archetype system
                connects you with wellness professionals who truly understand your healing journey.
                Experience the difference when practitioner and seeker are perfectly aligned.
              </p>

              {/* Main CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  size="lg"
                  className="bg-gold text-white hover:bg-gold/90 rounded-full px-8 py-4 font-medium shadow-lg transform hover:scale-105 transition-all"
                  onClick={() => (window.location.href = isAuthenticated ? "/practitioners" : "/auth/signup")}
                  data-testid="button-find-practitioners"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Find Your Match
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-forest text-forest hover:bg-forest hover:text-white rounded-full px-8 py-4 font-medium"
                  onClick={() => (window.location.href = isAuthenticated ? "/dashboard/practitioner" : "/auth/signup")}
                  data-testid="button-become-practitioner"
                >
                  Join as Practitioner
                </Button>
              </div>

              {/* Social Proof */}
              <div className="bg-white/50 rounded-lg p-4 mb-8 border border-cream">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="font-bold text-forest text-lg">150+</div>
                      <div className="text-forest/60">Verified Practitioners</div>
                    </div>
                    <div className="w-px h-8 bg-sage/30"></div>
                    <div className="text-center">
                      <div className="font-bold text-forest text-lg">89%</div>
                      <div className="text-forest/60">Satisfaction Rate</div>
                    </div>
                    <div className="w-px h-8 bg-sage/30"></div>
                    <div className="text-center">
                      <div className="font-bold text-forest text-lg">2.4k+</div>
                      <div className="text-forest/60">Successful Matches</div>
                    </div>
                  </div>
                  <div className="text-xs text-forest/50">Updated daily</div>
                </div>
              </div>

              {/* Value Propositions */}
              <div className="bg-sage/10 rounded-lg p-6 mb-8 border border-sage/20">
                <h3 className="font-heading text-lg font-semibold text-forest mb-3">
                  Why Traditional Matchmaking Fails
                </h3>
                <p className="text-forest/70 text-sm leading-relaxed mb-4">
                  Most platforms use basic filters like location or price. We believe
                  healing is more nuanced. Our revolutionary pollinator archetype system
                  matches you based on energy, approach, and intuitive compatibility.
                </p>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-forest/80 text-sm font-medium">
                    "Finally found a practitioner who truly understood my healing journey"
                    <span className="text-forest/60">- Early adopter feedback</span>
                  </p>
                </div>
              </div>

              {/* Feature Highlights */}
              <div className="space-y-3">
                <div className="flex items-center text-sm text-forest/70">
                  <Shield className="text-gold mr-3 h-4 w-4" />
                  <span><strong className="text-forest">100% Verified</strong> - Every practitioner background-checked</span>
                </div>
                <div className="flex items-center text-sm text-forest/70">
                  <Star className="text-gold mr-3 h-4 w-4" />
                  <span><strong className="text-forest">Science-Backed Matching</strong> - Pollinator archetype system</span>
                </div>
                <div className="flex items-center text-sm text-forest/70">
                  <Calendar className="text-gold mr-3 h-4 w-4" />
                  <span><strong className="text-forest">Seamless Experience</strong> - Book, meet, grow</span>
                </div>
              </div>

              {/* Alpha Access Link - subtle */}
              <div className="mt-8 pt-6 border-t border-sage/20">
                <p className="text-xs text-forest/50">
                  Interested in contributing to our development?{" "}
                  <button
                    onClick={() => (window.location.href = "/alpha")}
                    className="text-gold hover:text-gold/80 underline"
                  >
                    Join our Alpha Program
                  </button>
                </p>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="floating-animation">
                <img
                  src={characters.angelica}
                  alt="ANGELICA the Colibri - Your wellness guide"
                  className="w-full h-auto max-w-md mx-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <ArchetypeShowcase />
      <CharacterShowcase />
      <HowItWorks />
      <FeaturedPractitioners />
      <StatsSection />
      <CTASection />
      <Footer />
    </div>
  );
}