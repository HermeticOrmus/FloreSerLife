import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { characters } from "@/assets";
import { Lightbulb, Users, Zap, Star } from "lucide-react";

export default function CharacterShowcase() {
  return (
    <section className="py-20 bg-gradient-to-br from-sage/10 to-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gold/10 text-gold rounded-full text-sm font-medium mb-4">
            <span className="mr-2">✨</span>
            Archetype Ambassadors
          </div>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-forest mb-4">
            Meet Your Alpha Research-Inspired Wellness Guides
          </h2>
          <p className="text-lg text-forest/70 max-w-4xl mx-auto">
            These archetypal ambassadors embody the spirit of our innovative pollinator-inspired approach. 
            Each character represents different healing modalities and practitioner styles, making complex 
            wellness concepts accessible and relatable for your journey.
          </p>
          <div className="mt-6 p-4 bg-cream/50 rounded-lg border border-sage/20 max-w-2xl mx-auto">
            <p className="text-sm text-forest/80 italic">
              "These archetypal guides are designed to transform abstract healing concepts into intuitive connection points. 
              They embody our vision for innovative wellness matching." 
              <span className="block mt-1 text-xs text-forest/60 font-medium">
                - Alpha Development Team, FloreSer
              </span>
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* MAIA THE BEE */}
          <Card className="character-card bg-gradient-to-br from-yellow-50 to-amber-50 border border-gold/20 overflow-hidden group hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-start space-x-6">
                <div className="mb-6 relative flex-shrink-0">
                  <img 
                    src={characters.maia} 
                    alt="MAIA the Bee - Systematic Community Healer" 
                    className="w-32 h-32 object-contain group-hover:scale-105 transition-transform duration-300"
                    data-testid="img-character-maia"
                  />
                  <div className="absolute -top-2 -right-2 bg-gold/20 backdrop-blur-sm rounded-full p-2">
                    <Users className="w-4 h-4 text-gold" />
                  </div>
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-heading text-2xl font-bold text-forest">
                      MAIA the Bee
                    </h3>
                    <Badge variant="outline" className="text-xs text-forest/60">
                      Apis Therapeuticus
                    </Badge>
                  </div>
                  <p className="text-sm text-gold/80 font-medium mb-3">
                    Systematic Community Builder Archetype
                  </p>
                  
                  <p className="text-forest/70 leading-relaxed mb-4 text-sm">
                    MAIA embodies the systematic, community-building approach to wellness. 
                    She guides you toward healers who excel in evidence-based methodologies, sustainable 
                    practice development, and collaborative wellness ecosystems.
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xs font-semibold text-forest/60 uppercase tracking-wide mb-1">
                        Key Specialties
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        <Badge className="bg-gold/20 text-gold text-xs">Nervous System Regulation</Badge>
                        <Badge className="bg-gold/20 text-gold text-xs">Community Healing</Badge>
                        <Badge className="bg-gold/20 text-gold text-xs">Sustainable Practices</Badge>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-gold/10 rounded-lg border border-gold/20">
                      <div className="flex items-center space-x-2 mb-1">
                        <Star className="w-3 h-3 text-gold" />
                        <span className="text-xs font-semibold text-forest/60">Effectiveness Insight</span>
                      </div>
                      <p className="text-xs text-forest/70">
                        MAIA represents practitioners who focus on systematic approaches to chronic condition 
                        management and building strong long-term client relationships.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ANGELICA THE COLIBRI */}
          <Card className="character-card bg-gradient-to-br from-emerald-50 to-teal-50 border border-sage/30 overflow-hidden group hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-start space-x-6">
                <div className="mb-6 relative flex-shrink-0">
                  <img 
                    src={characters.angelica} 
                    alt="ANGELICA the Colibri - Precision Energy Healer" 
                    className="w-32 h-32 object-contain group-hover:scale-105 transition-transform duration-300"
                    data-testid="img-character-angelica"
                  />
                  <div className="absolute -top-2 -right-2 bg-sage/20 backdrop-blur-sm rounded-full p-2">
                    <Zap className="w-4 h-4 text-sage" />
                  </div>
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-heading text-2xl font-bold text-forest">
                      ANGELICA the Colibri
                    </h3>
                    <Badge variant="outline" className="text-xs text-forest/60">
                      Trochilus Intuitus
                    </Badge>
                  </div>
                  <p className="text-sm text-sage/80 font-medium mb-3">
                    Precision Intuitive Healer Archetype
                  </p>
                  
                  <p className="text-forest/70 leading-relaxed mb-4 text-sm">
                    ANGELICA embodies the intuitive, precision-focused approach to healing through heightened energetic 
                    sensitivity and rapid-response protocols. She connects you with healers who excel in crisis intervention, 
                    intuitive assessment, and precise energetic healing modalities.
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xs font-semibold text-forest/60 uppercase tracking-wide mb-1">
                        Key Specialties
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        <Badge className="bg-sage/20 text-sage text-xs">Energetic Assessment</Badge>
                        <Badge className="bg-sage/20 text-sage text-xs">Crisis Intervention</Badge>
                        <Badge className="bg-sage/20 text-sage text-xs">Spiritual Guidance</Badge>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-sage/10 rounded-lg border border-sage/20">
                      <div className="flex items-center space-x-2 mb-1">
                        <Lightbulb className="w-3 h-3 text-sage" />
                        <span className="text-xs font-semibold text-forest/60">Effectiveness Insight</span>
                      </div>
                      <p className="text-xs text-forest/70">
                        ANGELICA represents practitioners who specialize in acute stress resolution 
                        and focus on providing rapid, transformative insights.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Research Foundation Section */}
        <div className="mt-16 text-center">
          <div className="max-w-3xl mx-auto bg-cream/50 rounded-xl p-8 border border-sage/20">
            <h3 className="font-heading text-xl font-bold text-forest mb-4">
              Where Science Meets Story
            </h3>
            <p className="text-forest/70 leading-relaxed mb-4">
              These archetypal ambassadors aren't just creative characters—they're inspiration-driven 
              representations of healing patterns we're exploring across cultures and modalities. 
              Each ambassador embodies different practitioner characteristics in our innovative wellness approach.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-forest/60">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4" />
                <span>Pattern Recognition</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Cultural Validation</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lightbulb className="w-4 h-4" />
                <span>Outcome Optimization</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}