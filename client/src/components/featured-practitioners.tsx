import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, User, ArrowRight } from "lucide-react";
import { archetypeIcons } from "@/assets";
import { archetypeDefinitions, type Practitioner } from "@shared/schema";

export default function FeaturedPractitioners() {
  const { data: practitioners = [], isLoading } = useQuery<Practitioner[]>({
    queryKey: ["/api/practitioners"],
  });

  const getArchetypeIcon = (archetype: string) => {
    const iconSrc = archetypeIcons[archetype as keyof typeof archetypeIcons];
    if (iconSrc) {
      return <img src={iconSrc} alt={`${archetype} archetype`} className="w-6 h-6 object-contain" />;
    }
    return <User className="w-6 h-6" />;
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <div className="inline-flex items-center px-4 py-2 bg-forest/10 text-forest rounded-full text-sm font-medium mb-4">
              <span className="mr-2">⭐</span>
              Featured Practitioners
            </div>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-forest mb-4">
              Meet Our Verified Practitioners
            </h2>
            <p className="text-lg text-forest/70">
              Discover our carefully curated wellness practitioners, each bringing unique
              expertise and deep commitment to your healing journey.
            </p>
          </div>
          <Link href="/practitioners">
            <Button variant="ghost" className="hidden md:flex text-gold hover:text-gold/80 font-medium">
              View All Practitioners <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="border-sage/20">
                <div className="animate-pulse">
                  <div className="h-48 bg-sage/20 rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-sage/20 rounded mb-2"></div>
                    <div className="h-4 bg-sage/20 rounded w-3/4"></div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        ) : practitioners.length === 0 ? (
          <Card className="border-sage/20 text-center py-12">
            <CardContent>
              <User className="w-16 h-16 text-sage mx-auto mb-4" />
              <h3 className="font-heading text-xl font-semibold text-forest mb-2">
                Practitioners Coming Soon
              </h3>
              <p className="text-forest/70">
                Our verified wellness practitioners are joining the platform.
                Check back soon to discover amazing healers in your area.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {practitioners.slice(0, 3).map((practitioner) => (
              <Card key={practitioner.id} className="practitioner-card bg-white rounded-2xl shadow-lg border border-sage/20 overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="aspect-video bg-gradient-to-br from-cream to-light-green/20 flex items-center justify-center">
                  <User className="w-16 h-16 text-forest/30" />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getArchetypeIcon(practitioner.archetype)}
                      <div className="flex flex-col space-y-1">
                        <Badge variant="secondary" className="bg-gold/20 text-gold hover:bg-gold/30 text-xs">
                          {archetypeDefinitions[practitioner.archetype]?.name} Archetype
                        </Badge>
                        <Badge variant="outline" className="text-xs text-forest/60 border-sage/30">
                          {archetypeDefinitions[practitioner.archetype]?.scientificName}
                        </Badge>
                      </div>
                    </div>
                    {practitioner.averageRating && (
                      <div className="flex items-center text-gold">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium ml-1">
                          {practitioner.averageRating}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-heading text-lg font-semibold text-forest mb-2">
                    Practitioner #{practitioner.id.slice(-6)}
                  </h3>
                  
                  {practitioner.bio && (
                    <p className="text-forest/70 text-sm mb-3 line-clamp-2">
                      {practitioner.bio}
                    </p>
                  )}

                  {practitioner.specializations && practitioner.specializations.length > 0 && (
                    <p className="text-forest/60 text-xs mb-4">
                      Specializing in {practitioner.specializations.slice(0, 2).join(', ')}
                      {practitioner.specializations.length > 2 && ' and more'}
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center">
                    {practitioner.hourlyRate && (
                      <span className="font-semibold text-forest">
                        ${practitioner.hourlyRate}/session
                      </span>
                    )}
                    <Link href={`/practitioners/${practitioner.id}`}>
                      <Button
                        className="bg-gold/20 text-gold hover:bg-gold/30 rounded-full px-4 py-2 text-sm"
                        data-testid="button-view-profile"
                      >
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        <div className="text-center mt-8 md:hidden">
          <Link href="/practitioners">
            <Button variant="outline" className="border-forest text-forest hover:bg-forest hover:text-white">
              View All Practitioners
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
