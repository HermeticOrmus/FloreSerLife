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

export default function Landing() {
  useEffect(() => {
    document.title = "FloreSer - Wellness Practitioners Marketplace";
  }, []);

  return (
    <div className="min-h-screen bg-cream text-forest">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-cream to-light-green/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-heading text-4xl lg:text-6xl font-bold text-forest mb-6 leading-tight">
                Discover Your Perfect{" "}
                <span className="text-gold">Wellness</span> Match
              </h1>
              <p className="text-lg text-forest/80 mb-8 leading-relaxed">
                Connect with certified wellness practitioners through our unique pollinator archetype system. 
                Find the guidance that resonates with your journey to wellbeing.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button size="lg" className="bg-gold text-white hover:bg-gold/90 rounded-full px-8 py-4 font-medium shadow-lg">
                  Find Your Practitioner
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-forest text-forest hover:bg-forest hover:text-white rounded-full px-8 py-4 font-medium"
                  onClick={() => window.location.href = '/api/login'}
                >
                  Become a Practitioner
                </Button>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex items-center space-x-8 text-sm text-forest/70">
                <div className="flex items-center">
                  <Shield className="text-gold mr-2 h-4 w-4" />
                  <span>Verified Practitioners</span>
                </div>
                <div className="flex items-center">
                  <Star className="text-gold mr-2 h-4 w-4" />
                  <span>5-Star Rated</span>
                </div>
                <div className="flex items-center">
                  <Lock className="text-gold mr-2 h-4 w-4" />
                  <span>Secure Booking</span>
                </div>
              </div>
            </div>
            
            {/* Hero Image */}
            <div className="relative">
              <div className="floating-animation">
                <img 
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                  alt="Woman meditating in peaceful natural setting" 
                  className="rounded-3xl shadow-2xl w-full h-auto"
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
