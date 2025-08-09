import { Card, CardContent } from "@/components/ui/card";
import { characters } from "@/assets";

export default function CharacterShowcase() {
  return (
    <section className="py-20 bg-gradient-to-br from-sage/10 to-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-forest mb-4">
            Meet Your Wellness Guides
          </h2>
          <p className="text-lg text-forest/70 max-w-3xl mx-auto">
            Our beloved archetype ambassadors embody the spirit of healing and transformation. 
            Let them guide you on your wellness journey.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* MAIA THE BEE */}
          <Card className="character-card bg-gradient-to-br from-yellow-50 to-amber-50 border border-gold/20 text-center overflow-hidden group hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="mb-6 relative">
                <img 
                  src={characters.maia} 
                  alt="MAIA the Bee - Community & Structure Guide" 
                  className="w-48 h-48 mx-auto object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-heading text-2xl font-bold text-forest mb-3">
                MAIA the Bee
              </h3>
              <p className="text-forest/70 leading-relaxed mb-4">
                The guardian of community and structured healing. MAIA guides you toward 
                practitioners who excel in systematic approaches, group wellness, and 
                building supportive healing communities.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="bg-gold/20 text-gold text-xs font-medium px-3 py-1 rounded-full">
                  Community Focused
                </span>
                <span className="bg-gold/20 text-gold text-xs font-medium px-3 py-1 rounded-full">
                  Structured Approach
                </span>
                <span className="bg-gold/20 text-gold text-xs font-medium px-3 py-1 rounded-full">
                  Collaborative Healing
                </span>
              </div>
            </CardContent>
          </Card>

          {/* ANGELICA THE COLIBRI */}
          <Card className="character-card bg-gradient-to-br from-emerald-50 to-teal-50 border border-sage/30 text-center overflow-hidden group hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="mb-6 relative">
                <img 
                  src={characters.angelica} 
                  alt="ANGELICA the Colibri - Energy & Adaptation Guide" 
                  className="w-48 h-48 mx-auto object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-heading text-2xl font-bold text-forest mb-3">
                ANGELICA the Colibri
              </h3>
              <p className="text-forest/70 leading-relaxed mb-4">
                The spirit of swift adaptation and energy work. ANGELICA leads you to 
                practitioners who specialize in energy healing, quick transformations, 
                and adaptive wellness solutions.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="bg-sage/20 text-sage text-xs font-medium px-3 py-1 rounded-full">
                  Energy Healing
                </span>
                <span className="bg-sage/20 text-sage text-xs font-medium px-3 py-1 rounded-full">
                  Quick Adaptation
                </span>
                <span className="bg-sage/20 text-sage text-xs font-medium px-3 py-1 rounded-full">
                  Swift Solutions
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}