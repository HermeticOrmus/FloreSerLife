import { useEffect } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ArchetypeShowcase from "@/components/archetype-showcase";
import CharacterShowcase from "@/components/character-showcase";
import HowItWorks from "@/components/how-it-works";
import FeaturedPractitioners from "@/components/featured-practitioners";
import StatsSection from "@/components/stats-section";
import CTASection from "@/components/cta-section";
import { Button } from "@/components/ui/button";
import { Star, Shield, Lock } from "lucide-react";
import { characters } from "@/assets";

export default function Landing() {
  useEffect(() => {
    document.title = "FloreSer Alpha - Shaping the Future of Wellness";
  }, []);

  return (
    <div className="min-h-screen bg-cream text-forest">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-cream to-light-green/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Alpha Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-gold/20 text-gold rounded-full text-sm font-medium mb-6">
                <span className="mr-2">✨</span>
                Welcome to FloreSer Alpha
              </div>
              
              <h1 className="font-heading text-4xl lg:text-6xl font-bold text-forest mb-6 leading-tight">
                Shape the Future of{" "}
                <span className="text-gold">Wellness</span> Connection
              </h1>
              <p className="text-lg text-forest/80 mb-8 leading-relaxed">
                You're among the first to experience our innovative pollinator archetype system. 
                As a founding member, your insights will help us create a meaningful wellness 
                marketplace designed to transform connections.
              </p>
              
              {/* Alpha CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button 
                  size="lg" 
                  className="bg-gold text-white hover:bg-gold/90 rounded-full px-8 py-4 font-medium shadow-lg"
                  onClick={() => window.location.href = '/survey'}
                  data-testid="button-start-alpha-survey"
                >
                  Start Your Alpha Journey
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-forest text-forest hover:bg-forest hover:text-white rounded-full px-8 py-4 font-medium"
                  onClick={() => window.location.href = '/survey'}
                  data-testid="button-help-build-platform"
                >
                  Help Build the Platform
                </Button>
              </div>
              
              {/* Alpha Value Proposition */}
              <div className="bg-sage/10 rounded-lg p-6 mb-8 border border-sage/20">
                <h3 className="font-heading text-lg font-semibold text-forest mb-2">
                  Your Alpha Participation Is Valued At $500+
                </h3>
                <p className="text-forest/70 text-sm leading-relaxed">
                  Professional consultation fees for wellness platform development typically cost hundreds. 
                  Your insights as a founding member are invaluable to creating something truly innovative.
                </p>
              </div>
              
              {/* Alpha Indicators */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-forest/70">
                <div className="flex items-center">
                  <Shield className="text-gold mr-2 h-4 w-4" />
                  <span>Founding Member Access</span>
                </div>
                <div className="flex items-center">
                  <Star className="text-gold mr-2 h-4 w-4" />
                  <span>Co-Creator Benefits</span>
                </div>
                <div className="flex items-center">
                  <Lock className="text-gold mr-2 h-4 w-4" />
                  <span>Exclusive Alpha Features</span>
                </div>
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
