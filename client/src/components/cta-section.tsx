import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, Heart } from "lucide-react";

export default function CTASection() {
  const [, setLocation] = useLocation();
  return (
    <section className="py-20 bg-gradient-to-br from-cream to-light-green/30">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        {/* Main CTA */}
        <div className="bg-white/50 rounded-2xl p-8 mb-8 border border-gold/20 shadow-lg">
          <div className="inline-flex items-center px-4 py-2 bg-gold text-white rounded-full text-sm font-medium mb-4">
            <span className="mr-2">🌸</span>
            Start Your Journey
          </div>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-forest mb-6">
            Your Wellness Journey Starts Here
          </h2>
          <p className="text-lg text-forest/70 mb-8 max-w-2xl mx-auto">
            Whether you're seeking healing support or ready to begin facilitating,
            FloreSer welcomes you. Find practitioners who resonate with your journey,
            or discover your calling as a facilitator in our supportive Bee community.
            Every path starts with a single step.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button
              size="lg"
              className="bg-gold text-white px-8 py-4 rounded-full font-medium hover:bg-gold/90 shadow-lg transform hover:scale-105 transition-all"
              onClick={() => setLocation('/practitioners')}
              data-testid="button-find-practitioner"
            >
              <Search className="mr-2 h-5 w-5" />
              Find Your Match
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-forest text-forest px-8 py-4 rounded-full font-medium hover:bg-forest hover:text-white"
              onClick={() => setLocation('/auth/signup')}
              data-testid="button-become-practitioner"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Begin Facilitating
            </Button>
          </div>

          {/* Dual Path Value Statement */}
          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <div className="bg-sage/10 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="bg-sage/20 rounded-full p-2 mr-3">
                  <Search className="text-sage h-4 w-4" />
                </div>
                <h3 className="font-semibold text-forest text-sm">For Seekers</h3>
              </div>
              <p className="text-forest/70 text-xs leading-relaxed">
                Find practitioners whose energy and approach truly resonate with your healing journey.
                Our archetype system ensures meaningful connections.
              </p>
            </div>
            <div className="bg-gold/10 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="bg-gold/20 rounded-full p-2 mr-3">
                  <Heart className="text-gold h-4 w-4" />
                </div>
                <h3 className="font-semibold text-forest text-sm">For New Facilitators</h3>
              </div>
              <p className="text-forest/70 text-xs leading-relaxed">
                Start your facilitator journey with the Bee archetype - a welcoming community
                designed to support your growth from day one.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
