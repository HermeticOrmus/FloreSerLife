import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, User, ArrowRight, Sparkles } from "lucide-react";
import { archetypeIcons } from "@/assets";
import { archetypeDefinitions, type Practitioner } from "@shared/schema";
import { cn } from "@/lib/utils";

type PractitionerWithUser = Practitioner & {
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
};

const archetypeStyles = {
  bee: { card: "bee" as const, badge: "bee" as const, solidBg: "bg-forest hover:bg-forest/90" },
  butterfly: { card: "butterfly" as const, badge: "butterfly" as const, solidBg: "bg-forest hover:bg-forest/90" },
  beetle: { card: "beetle" as const, badge: "beetle" as const, solidBg: "bg-forest hover:bg-forest/90" },
  hummingbird: { card: "hummingbird" as const, badge: "hummingbird" as const, solidBg: "bg-forest hover:bg-forest/90" },
};

export default function FeaturedPractitioners() {
  const [, setLocation] = useLocation();
  const { data: practitioners = [], isLoading } = useQuery<PractitionerWithUser[]>({
    queryKey: ["/api/practitioners"],
  });

  const getArchetypeIcon = (archetype: string) => {
    const iconSrc = archetypeIcons[archetype as keyof typeof archetypeIcons];
    if (iconSrc) {
      return <img src={iconSrc} alt={`${archetype} archetype`} className="w-8 h-8 object-contain" loading="lazy" width={32} height={32} />;
    }
    return <User className="w-8 h-8" />;
  };

  const getArchetypeStyle = (archetype: string) => {
    return archetypeStyles[archetype as keyof typeof archetypeStyles] || archetypeStyles.bee;
  };

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-forest/40 mb-4">
              Featured Pollinators
            </p>
            <h2 className="font-heading text-2xl md:text-3xl text-forest mb-3 tracking-tight">
              Meet the Pollinators
            </h2>
            <p className="text-base text-forest/50 max-w-lg leading-relaxed">
              Each Pollinator embodies a nature-inspired archetype, offering a distinct way of guiding shaped by presence and lived experience.
            </p>
          </div>
          <Link href="/practitioners">
            <Button
              variant="outline"
              className="hidden md:flex group border-forest/15 text-forest/70 hover:text-forest hover:bg-transparent hover:border-forest/30"
            >
              Explore All
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border border-forest/10 rounded-lg overflow-hidden">
                <div className="animate-pulse">
                  <div className="h-48 bg-forest/5" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-forest/5 rounded w-3/4" />
                    <div className="h-3 bg-forest/5 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : practitioners.length === 0 ? (
          <div className="text-center py-20 border border-forest/10 rounded-lg origami-paper origami-corner">
            <User className="w-10 h-10 text-forest/20 mx-auto mb-6" strokeWidth={1.5} />
            <h3 className="font-heading text-lg text-forest mb-3">
              Practitioners Coming Soon
            </h3>
            <p className="text-sm text-forest/50 max-w-md mx-auto mb-8 leading-relaxed">
              Our verified wellness practitioners are joining the platform.
              Check back soon to discover amazing healers ready to guide your journey.
            </p>
            <Button className="bg-forest text-white hover:bg-forest/90" onClick={() => setLocation("/alpha")}>
              <Sparkles className="w-4 h-4 mr-2" />
              Get Notified
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {practitioners.slice(0, 3).map((practitioner, index) => {
              const style = getArchetypeStyle(practitioner.archetype);
              return (
                <div
                  key={practitioner.id}
                  className="border border-forest/10 rounded-lg overflow-hidden group hover:border-forest/20 transition-colors origami-paper origami-corner origami-fold-shadow"
                >
                  <div className="aspect-[4/3] bg-forest/[0.03] flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-white border border-forest/10 flex items-center justify-center mb-3">
                        {getArchetypeIcon(practitioner.archetype)}
                      </div>
                      <Badge variant={style.badge}>
                        {archetypeDefinitions[practitioner.archetype]?.name}
                      </Badge>
                    </div>

                    {practitioner.averageRating && (
                      <div className="absolute top-4 right-4 flex items-center text-sm text-forest/60">
                        <Star className="w-3.5 h-3.5 text-gold fill-gold mr-1" />
                        {practitioner.averageRating}
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <p className="text-xs text-forest/40 mb-1 italic">
                      {archetypeDefinitions[practitioner.archetype]?.scientificName}
                    </p>

                    <h3 className="font-heading text-lg text-forest mb-2">
                      {practitioner.firstName && practitioner.lastName
                        ? `${practitioner.firstName} ${practitioner.lastName}`
                        : `Practitioner #${practitioner.id.slice(-6)}`}
                    </h3>

                    {practitioner.bio && (
                      <p className="text-sm text-forest/50 mb-4 line-clamp-2 leading-relaxed">
                        {practitioner.bio}
                      </p>
                    )}

                    {practitioner.specializations && practitioner.specializations.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {practitioner.specializations.slice(0, 3).map((spec) => (
                          <span key={spec} className="text-xs text-forest/50 border border-forest/10 rounded px-2 py-0.5">
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t border-forest/10">
                      {practitioner.hourlyRate ? (
                        <div>
                          <span className="text-xs text-forest/40">From </span>
                          <span className="text-forest">${practitioner.hourlyRate}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-forest/40">Contact for pricing</span>
                      )}
                      <Link href={`/practitioners/${practitioner.id}`}>
                        <Button
                          size="sm"
                          className={`text-white ${style.solidBg}`}
                          data-testid="button-view-profile"
                        >
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12 md:hidden">
          <Link href="/practitioners">
            <Button variant="outline" className="border-forest/15 text-forest/70">
              Explore All Practitioners
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
