import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { archetypeIcons } from "@/assets";
import { archetypeDefinitions } from "@shared/schema";

export default function ArchetypeShowcase() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-forest mb-4">
            Discover Your Pollinator Archetype
          </h2>
          <p className="text-lg text-forest/70 max-w-3xl mx-auto">
            Our unique archetype system helps match you with practitioners whose approach resonates with your healing journey. 
            Each archetype represents different strengths and healing modalities.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.entries(archetypeDefinitions).map(([key, archetype]) => {
            const iconSrc = archetypeIcons[key as keyof typeof archetypeIcons];

            return (
              <Card key={key} className="archetype-card bg-gradient-to-br from-cream to-white p-8 rounded-2xl shadow-lg border border-sage/20 text-center hover:shadow-xl transition-all duration-300">
                <CardContent className="p-0">
                  <div className="bg-gold/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <img 
                      src={iconSrc} 
                      alt={`${archetype.name} archetype icon`} 
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-forest mb-3">
                    The {archetype.name}
                  </h3>
                  <p className="text-forest/70 text-sm leading-relaxed mb-4">
                    {archetype.description}
                  </p>
                  <Badge className="bg-gold/20 text-gold hover:bg-gold/30 text-xs font-medium px-3 py-1">
                    {archetype.traits.join(' • ')}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
