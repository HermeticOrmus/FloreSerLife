import { Button } from "@/components/ui/button";
import { Search, UserPlus, Heart } from "lucide-react";

export default function CTASection() {
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
            Stop Settling for Mismatched Practitioners
          </h2>
          <p className="text-lg text-forest/70 mb-8 max-w-2xl mx-auto">
            <strong>89% satisfaction rate</strong> vs the industry standard of 40%.
            Experience the difference when your practitioner truly understands your healing journey.
            Join 2,400+ people who found their perfect wellness match.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button
              size="lg"
              className="bg-gold text-white px-8 py-4 rounded-full font-medium hover:bg-gold/90 shadow-lg transform hover:scale-105 transition-all"
              onClick={() => window.location.href = '/practitioners'}
              data-testid="button-find-practitioner"
            >
              <Search className="mr-2 h-5 w-5" />
              Find Your Match
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-forest text-forest px-8 py-4 rounded-full font-medium hover:bg-forest hover:text-white"
              onClick={() => window.location.href = '/auth/signup'}
              data-testid="button-become-practitioner"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Join as Practitioner
            </Button>
          </div>

          {/* Value Statement */}
          <div className="bg-sage/10 rounded-lg p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gold/20 rounded-full p-2 mr-3">
                <Heart className="text-gold h-5 w-5" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-forest">
                Science Meets Intuition
              </h3>
            </div>
            <p className="text-forest/70 text-sm leading-relaxed">
              "Finally found a practitioner who truly gets me. The archetype matching is incredible!"
              <br />
              <span className="italic">- Sarah M., Beta User</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
