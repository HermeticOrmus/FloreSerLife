import { Badge } from "@/components/ui/badge";
import { UserPlus, Search, Calendar, Star, Heart, Sparkles } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Create Your Profile",
      subtitle: "Discover Your Archetype",
      description: "Sign up and complete your wellness profile to discover which pollinator archetype best matches your healing journey. Our system identifies your preferences, goals, and the type of guidance that resonates with you.",
      icon: UserPlus,
      details: "Archetype assessment • Wellness preferences • Healing goals • Personal matching criteria"
    },
    {
      number: 2,
      title: "Find Your Match",
      subtitle: "Connect with Verified Practitioners",
      description: "Browse our curated collection of verified wellness practitioners, perfectly matched to your archetype and needs. Filter by specializations, experience level, location, and session type to find your ideal practitioner.",
      icon: Search,
      details: "Archetype-based matching • Verified practitioners • Advanced filtering • Practitioner profiles"
    },
    {
      number: 3,
      title: "Book & Experience",
      subtitle: "Start Your Transformation",
      description: "Easily book sessions with your chosen practitioners through our seamless booking system. Enjoy meaningful connections, transformative sessions, and continue your wellness journey with ongoing support.",
      icon: Calendar,
      details: "Easy booking • Session management • Progress tracking • Ongoing support"
    }
  ];

  return (
    <section className="py-20 bg-cream/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-forest/10 text-forest rounded-full text-sm font-medium mb-4">
            <span className="mr-2">✨</span>
            Simple • Effective • Transformative
          </div>
          <h2 className="font-heading text-3xl lg:text-5xl font-bold text-forest mb-6">
            How It Works
          </h2>
          <p className="text-xl text-forest/70 max-w-4xl mx-auto mb-8">
            From discovering your unique archetype to booking transformative sessions,
            our streamlined process makes finding the perfect wellness practitioner
            simple and meaningful.
          </p>

          {/* Key Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-forest">Personalized</div>
              <div className="text-sm text-forest/60">Matching</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-forest">Verified</div>
              <div className="text-sm text-forest/60">Practitioners</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-forest">Seamless</div>
              <div className="text-sm text-forest/60">Experience</div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="inline-flex items-center px-6 py-3 bg-sage/10 text-sage rounded-full text-sm font-medium">
              <Star className="mr-2 h-4 w-4" />
              Trusted by Wellness Seekers Everywhere
            </div>
          </div>
        </div>
        
        {/* Enhanced Step Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div key={step.number} className="bg-white rounded-2xl p-8 shadow-lg border border-sage/20 hover:shadow-xl transition-all duration-300 group">
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-br from-gold/20 to-gold/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                    <IconComponent className="w-8 h-8 text-gold" />
                  </div>
                  <div className="bg-forest/5 rounded-full px-3 py-1 inline-block mb-2">
                    <span className="text-xs font-semibold text-forest/60">PHASE {step.number}</span>
                  </div>
                </div>
                
                <h3 className="font-heading text-xl font-semibold text-forest mb-2 text-center">
                  {step.title}
                </h3>
                <p className="text-sm font-medium text-gold/80 text-center mb-4">
                  {step.subtitle}
                </p>
                
                <p className="text-forest/70 leading-relaxed text-sm mb-6">
                  {step.description}
                </p>

                <div className="pt-4 border-t border-sage/10">
                  <h4 className="text-xs font-semibold text-forest/60 uppercase tracking-wide mb-2 text-center">
                    Key Activities
                  </h4>
                  <div className="space-y-1">
                    {step.details.split(' • ').map((detail, index) => (
                      <div key={index} className="flex items-center text-xs text-forest/60">
                        <div className="w-1 h-1 bg-gold rounded-full mr-2 flex-shrink-0"></div>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Value Proposition Section */}
        <div className="mt-20 text-center">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-sage/5 to-cream/30 rounded-2xl p-12 border border-sage/20">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Heart className="w-6 h-6 text-forest" />
              <h3 className="font-heading text-2xl font-bold text-forest">
                Why FloreSer Works
              </h3>
            </div>

            <p className="text-lg text-forest/70 leading-relaxed mb-8">
              Our unique archetype-based approach ensures meaningful connections between
              clients and practitioners. Experience the power of nature-inspired matching
              that goes beyond basic categories to find your perfect wellness companion.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="text-left">
                <h4 className="font-semibold text-forest mb-3 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-gold" />
                  Meaningful Connections
                </h4>
                <ul className="space-y-2 text-sm text-forest/70">
                  <li className="flex items-start">
                    <div className="w-1 h-1 bg-gold rounded-full mt-2 mr-2 flex-shrink-0"></div>
                    <span>Archetype-based compatibility for deeper resonance</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1 h-1 bg-gold rounded-full mt-2 mr-2 flex-shrink-0"></div>
                    <span>Verified practitioners with proven expertise</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1 h-1 bg-gold rounded-full mt-2 mr-2 flex-shrink-0"></div>
                    <span>Personalized matching based on your unique journey</span>
                  </li>
                </ul>
              </div>

              <div className="text-left">
                <h4 className="font-semibold text-forest mb-3 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-sage" />
                  Seamless Experience
                </h4>
                <ul className="space-y-2 text-sm text-forest/70">
                  <li className="flex items-start">
                    <div className="w-1 h-1 bg-sage rounded-full mt-2 mr-2 flex-shrink-0"></div>
                    <span>Easy booking and session management</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1 h-1 bg-sage rounded-full mt-2 mr-2 flex-shrink-0"></div>
                    <span>Secure payments and trusted platform</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1 h-1 bg-sage rounded-full mt-2 mr-2 flex-shrink-0"></div>
                    <span>Ongoing support for your wellness journey</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <Badge className="bg-gold/20 text-gold px-4 py-2">
                Trusted • Verified • Transformative
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
