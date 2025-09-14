import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { archetypeIcons } from "@/assets";
import { archetypeDefinitions } from "@shared/schema";
import { Microscope, Users, BookOpen, Award, TrendingUp, Globe } from "lucide-react";

export default function ArchetypeShowcase() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-forest/10 text-forest rounded-full text-sm font-medium mb-4">
            <span className="mr-2">🔬</span>
            Innovative Alpha Practitioner Categorization System
          </div>
          <h2 className="font-heading text-3xl lg:text-5xl font-bold text-forest mb-6">
            An Innovative Pollinator-Inspired Archetype System
          </h2>
          <p className="text-xl text-forest/70 max-w-4xl mx-auto mb-8">
            We're developing an innovative classification system inspired by nature's most effective 
            pollinators to help optimize healing connections in our alpha wellness platform.
          </p>
          
          {/* Alpha Development Highlights */}
          <div className="grid md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2 text-forest/70">
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">Community-Driven Development</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-forest/70">
              <BookOpen className="w-5 h-5" />
              <span className="text-sm font-medium">Innovative Approach</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-forest/70">
              <Globe className="w-5 h-5" />
              <span className="text-sm font-medium">Nature-Inspired Framework</span>
            </div>
          </div>

          {/* Alpha Vision Statement */}
          <div className="max-w-4xl mx-auto">
            <div className="p-6 bg-gradient-to-br from-gold/10 to-sage/10 rounded-lg border border-sage/20">
              <p className="text-center text-forest/80 italic leading-relaxed">
                "Our pollinator-inspired approach represents a fresh perspective on wellness connections. 
                As alpha users help us refine this innovative system, we're exploring how nature's most 
                efficient pollinators can inspire better practitioner-client matching."
              </p>
            </div>
          </div>

          {/* Development Approach */}
          <div className="mt-8 p-6 bg-cream/50 rounded-xl border border-sage/20 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Microscope className="w-5 h-5 text-forest" />
              <span className="text-sm font-semibold text-forest">Alpha Development</span>
            </div>
            <p className="text-sm text-forest/70">
              Our classification system draws inspiration from natural pollinator efficiency patterns. 
              Alpha users are helping us explore how these concepts can enhance wellness connections.
            </p>
          </div>
        </div>
        
        {/* Enhanced Archetype Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {Object.entries(archetypeDefinitions).map(([key, archetype]) => {
            const iconSrc = archetypeIcons[key as keyof typeof archetypeIcons];

            return (
              <Card key={key} className="archetype-card bg-gradient-to-br from-cream to-white rounded-2xl shadow-lg border border-sage/20 hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-6">
                    <div className="bg-gold/10 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <img 
                        src={iconSrc} 
                        alt={`${archetype.name} archetype icon`} 
                        className="w-10 h-10 object-contain"
                        data-testid={`img-archetype-${key}`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-heading text-xl font-bold text-forest">
                          The {archetype.name}
                        </h3>
                        <Badge variant="outline" className="text-xs text-forest/60">
                          {archetype.scientificName}
                        </Badge>
                      </div>
                      <p className="text-forest/80 text-sm leading-relaxed mb-4">
                        {archetype.description}
                      </p>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-xs font-semibold text-forest/60 uppercase tracking-wide mb-1">
                            Core Methodology
                          </h4>
                          <p className="text-xs text-forest/70 leading-relaxed">
                            {archetype.methodology}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="text-xs font-semibold text-forest/60 uppercase tracking-wide mb-1">
                            Key Specialties
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {archetype.specialties.slice(0, 3).map((specialty, index) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-sage/10 text-sage hover:bg-sage/20">
                                {specialty.split(' ')[0]}
                              </Badge>
                            ))}
                            {archetype.specialties.length > 3 && (
                              <Badge variant="secondary" className="text-xs bg-sage/10 text-sage">
                                +{archetype.specialties.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-semibold text-forest/60 uppercase tracking-wide mb-1">
                            Core Traits
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {archetype.traits.map((trait, index) => (
                              <Badge key={index} className="bg-gold/20 text-gold hover:bg-gold/30 text-xs">
                                {trait}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 p-3 bg-cream/50 rounded-lg border border-sage/10">
                          <div className="flex items-center space-x-2 mb-1">
                            <TrendingUp className="w-3 h-3 text-forest/60" />
                            <span className="text-xs font-semibold text-forest/60">Research Insight</span>
                          </div>
                          <p className="text-xs text-forest/70 leading-relaxed">
                            {archetype.researchInsights}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action Section */}
        <div className="text-center bg-gradient-to-br from-sage/5 to-cream/30 rounded-2xl p-12 border border-sage/20">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Award className="w-6 h-6 text-gold" />
              <h3 className="font-heading text-2xl font-bold text-forest">
                Alpha Testing Phase: Help Validate the Future
              </h3>
            </div>
            <p className="text-forest/70 mb-6 leading-relaxed">
              As an alpha member, you'll experience this innovative matching system firsthand and help us refine 
              our approach that aims to improve how people connect with wellness practitioners.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gold text-white hover:bg-gold/90 rounded-full px-8" data-testid="button-join-alpha">
                Join Alpha Testing
              </Button>
              <Button variant="outline" className="border-forest text-forest hover:bg-forest/5 rounded-full px-8" data-testid="button-learn-methodology">
                Learn About Our Methodology
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
