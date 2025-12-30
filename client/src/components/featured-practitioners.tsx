import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, User, ArrowRight, Sparkles } from "lucide-react";
import { archetypeIcons, papercut } from "@/assets";
import { archetypeDefinitions, type Practitioner } from "@shared/schema";
import { cn } from "@/lib/utils";

// Extended type to include user info from joined query
type PractitionerWithUser = Practitioner & {
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
};

// Map archetypes to their card, badge variants, and paper textures
const archetypeStyles = {
  bee: { card: "bee" as const, badge: "bee" as const, accent: "hive-accent", texture: papercut.textures.paperGold },
  butterfly: { card: "butterfly" as const, badge: "butterfly" as const, accent: "garden-accent", texture: papercut.textures.paperSage },
  beetle: { card: "beetle" as const, badge: "beetle" as const, accent: "earth-600", texture: papercut.textures.paperEarth },
  hummingbird: { card: "hummingbird" as const, badge: "hummingbird" as const, accent: "gold", texture: papercut.textures.paperGold },
};

export default function FeaturedPractitioners() {
  const { data: practitioners = [], isLoading } = useQuery<PractitionerWithUser[]>({
    queryKey: ["/api/practitioners"],
  });

  const getArchetypeIcon = (archetype: string) => {
    const iconSrc = archetypeIcons[archetype as keyof typeof archetypeIcons];
    if (iconSrc) {
      return <img src={iconSrc} alt={`${archetype} archetype`} className="w-8 h-8 object-contain drop-shadow-sm" />;
    }
    return <User className="w-8 h-8" />;
  };

  const getArchetypeStyle = (archetype: string) => {
    return archetypeStyles[archetype as keyof typeof archetypeStyles] || archetypeStyles.bee;
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Organic background with flowing shapes */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-cream/30 to-white" />

      {/* Decorative floating elements */}
      <div className="absolute top-10 right-20 w-72 h-72 bg-gradient-to-br from-garden-accent/10 to-transparent rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-10 w-56 h-56 bg-gradient-to-tl from-hive-accent/10 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-gradient-to-r from-gold/5 to-light-green/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }} />

      {/* Decorative vine on the right */}
      <div className="absolute right-0 top-0 w-24 h-full opacity-10 pointer-events-none">
        <svg viewBox="0 0 80 600" className="h-full w-full" preserveAspectRatio="none">
          <path
            d="M40,0 Q60,80 40,160 T40,320 T40,480 T40,600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-forest"
          />
          <circle cx="40" cy="120" r="6" className="text-gold fill-current animate-bloom" style={{ animationDelay: '0.3s' }} />
          <circle cx="40" cy="280" r="8" className="text-garden-accent fill-current animate-bloom" style={{ animationDelay: '0.8s' }} />
          <circle cx="40" cy="440" r="5" className="text-hive-accent fill-current animate-bloom" style={{ animationDelay: '1.3s' }} />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
          <div className="animate-petal-fade">
            <Badge variant="hummingbird" className="mb-4">
              <Sparkles className="w-3 h-3 mr-1.5" />
              Featured Pollinators
            </Badge>
            <h2 className="font-heading text-section-heading lg:text-[2.75rem] text-forest mb-4">
              Meet Our Verified
              <span className="block bg-gradient-to-r from-gold via-hive-accent to-garden-accent bg-clip-text text-transparent">
                Wellness Practitioners
              </span>
            </h2>
            <p className="text-body-lg text-forest/70 max-w-xl leading-relaxed">
              Each practitioner embodies a unique pollinator archetype, bringing their authentic
              healing presence to guide your transformational journey.
            </p>
          </div>
          <Link href="/practitioners">
            <Button
              variant="outline"
              size="lg"
              className="hidden md:flex group hover:opacity-90"
              style={{
                backgroundImage: `url(${papercut.textures.paperUI})`,
                backgroundSize: '200px 200px',
                backgroundRepeat: 'repeat',
              }}
            >
              Explore All Practitioners
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} variant="glass" className="overflow-hidden">
                <div className="animate-pulse">
                  <div className="h-48 bg-gradient-to-br from-sage/20 to-cream/50 rounded-t-card" />
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-sage/20" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-sage/20 rounded-full w-3/4" />
                        <div className="h-3 bg-sage/15 rounded-full w-1/2" />
                      </div>
                    </div>
                    <div className="h-4 bg-sage/15 rounded-full w-full" />
                    <div className="h-4 bg-sage/10 rounded-full w-2/3" />
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        ) : practitioners.length === 0 ? (
          <Card variant="glass" className="text-center py-16 px-8">
            <CardContent className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-br from-garden-accent/20 to-hive-accent/20 rounded-full flex items-center justify-center mb-6 animate-float">
                <User className="w-12 h-12 text-forest/40" />
              </div>
              <h3 className="font-heading text-card-heading text-forest mb-3">
                Practitioners Coming Soon
              </h3>
              <p className="text-body text-forest/60 max-w-md leading-relaxed">
                Our verified wellness practitioners are joining the platform.
                Check back soon to discover amazing healers ready to guide your journey.
              </p>
              <Button
                variant="hummingbird"
                className="mt-6 hover:opacity-90"
                style={{
                  backgroundImage: `url(${papercut.textures.paperGold})`,
                  backgroundSize: '200px 200px',
                  backgroundRepeat: 'repeat',
                }}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Get Notified
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {practitioners.slice(0, 3).map((practitioner, index) => {
              const style = getArchetypeStyle(practitioner.archetype);
              return (
                <Card
                  key={practitioner.id}
                  variant={style.card}
                  className={cn(
                    "overflow-hidden group animate-petal-fade",
                  )}
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {/* Archetype-themed header */}
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-cream via-white to-light-green/10 flex items-center justify-center overflow-hidden">
                    {/* Decorative background pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-gradient-to-br from-gold/30 to-transparent blur-xl" />
                      <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-gradient-to-tl from-garden-accent/30 to-transparent blur-xl" />
                    </div>

                    {/* Profile placeholder with archetype icon */}
                    <div className="relative flex flex-col items-center">
                      <div className="w-20 h-20 rounded-full bg-white/80 backdrop-blur-sm shadow-card flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300">
                        {getArchetypeIcon(practitioner.archetype)}
                      </div>
                      <Badge variant={style.badge} className="shadow-card-sm">
                        {archetypeDefinitions[practitioner.archetype]?.name}
                      </Badge>
                    </div>

                    {/* Rating badge */}
                    {practitioner.averageRating && (
                      <div className="absolute top-4 right-4 flex items-center bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-card-sm">
                        <Star className="w-4 h-4 text-gold fill-gold mr-1" />
                        <span className="text-body-sm font-semibold text-forest">
                          {practitioner.averageRating}
                        </span>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6">
                    {/* Scientific name */}
                    <p className="text-caption text-forest/50 mb-1 italic">
                      {archetypeDefinitions[practitioner.archetype]?.scientificName}
                    </p>

                    <h3 className="font-heading text-card-heading text-forest mb-2 group-hover:text-gold transition-colors">
                      {practitioner.firstName && practitioner.lastName
                        ? `${practitioner.firstName} ${practitioner.lastName}`
                        : `Practitioner #${practitioner.id.slice(-6)}`}
                    </h3>

                    {practitioner.bio && (
                      <p className="text-body-sm text-forest/70 mb-4 line-clamp-2 leading-relaxed">
                        {practitioner.bio}
                      </p>
                    )}

                    {practitioner.specializations && practitioner.specializations.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {practitioner.specializations.slice(0, 3).map((spec) => (
                          <Badge key={spec} variant="subtle" size="sm">
                            {spec}
                          </Badge>
                        ))}
                        {practitioner.specializations.length > 3 && (
                          <Badge variant="outline" size="sm">
                            +{practitioner.specializations.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t border-sage/10">
                      {practitioner.hourlyRate ? (
                        <div className="flex flex-col">
                          <span className="text-caption text-forest/50">Starting at</span>
                          <span className="font-heading font-semibold text-forest">
                            ${practitioner.hourlyRate}
                            <span className="text-body-sm font-normal text-forest/60">/session</span>
                          </span>
                        </div>
                      ) : (
                        <span className="text-body-sm text-forest/50">Contact for pricing</span>
                      )}
                      <Link href={`/practitioners/${practitioner.id}`}>
                        <Button
                          variant={style.card === "bee" ? "bee" : style.card === "butterfly" ? "butterfly" : style.card === "beetle" ? "beetle" : "hummingbird"}
                          size="sm"
                          className="rounded-full text-white hover:opacity-90"
                          data-testid="button-view-profile"
                          style={{
                            backgroundImage: `url(${style.texture})`,
                            backgroundSize: '150px 150px',
                            backgroundRepeat: 'repeat',
                          }}
                        >
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
        
        {/* Mobile CTA */}
        <div className="text-center mt-12 md:hidden">
          <Link href="/practitioners">
            <Button
              variant="hummingbird"
              size="lg"
              className="group text-white hover:opacity-90"
              style={{
                backgroundImage: `url(${papercut.textures.paperGold})`,
                backgroundSize: '200px 200px',
                backgroundRepeat: 'repeat',
              }}
            >
              Explore All Practitioners
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
