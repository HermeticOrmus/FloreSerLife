import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Video, Clock, Calendar, Star, ArrowLeft } from "lucide-react";
import { ArchetypeIcons } from "@/components/icons/archetype-icons";
import { ReviewsSummary, ReviewDisplay } from "@/components/reviews";
import { useReviews } from "@/hooks/useReviews";
import { archetypeDefinitions, type Practitioner } from "@shared/schema";

export default function PractitionerProfile() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const practitionerId = params.id;

  const { data: practitioners = [], isLoading } = useQuery<Practitioner[]>({
    queryKey: ["/api/practitioners/all"],
  });

  const { usePractitionerReviews } = useReviews();
  const { data: reviews = [], isLoading: reviewsLoading } = usePractitionerReviews(practitionerId || "");

  const practitioner = practitioners.find(p => p.id === practitionerId);

  useEffect(() => {
    if (practitioner) {
      document.title = `Practitioner Profile - FloreSer`;
    }
  }, [practitioner]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-sage/20 rounded w-1/4 mb-6"></div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div className="h-64 bg-sage/20 rounded-lg"></div>
                <div className="h-32 bg-sage/20 rounded-lg"></div>
              </div>
              <div className="space-y-6">
                <div className="h-48 bg-sage/20 rounded-lg"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!practitioner) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-heading font-bold text-forest mb-4">
                Practitioner Not Found
              </h2>
              <p className="text-forest/70 mb-6">
                The practitioner you're looking for doesn't exist or has been removed.
              </p>
              <Button
                onClick={() => setLocation("/practitioners")}
                className="bg-gold hover:bg-gold/90"
              >
                Browse All Practitioners
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const archetype = archetypeDefinitions[practitioner.archetype];
  const getArchetypeIcon = (archetypeType: string) => {
    switch (archetypeType) {
      case 'bee': return <ArchetypeIcons.Bee className="w-6 h-6" />;
      case 'hummingbird': return <ArchetypeIcons.Hummingbird className="w-6 h-6" />;
      case 'butterfly': return <ArchetypeIcons.Butterfly className="w-6 h-6" />;
      case 'beetle': return <ArchetypeIcons.Beetle className="w-6 h-6" />;
      default: return <Star className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => setLocation("/practitioners")}
          className="mb-6 text-forest hover:bg-forest/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Practitioners
        </Button>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Practitioner Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarFallback className="bg-gold/20 text-gold text-xl">
                      {practitioner.id.slice(-2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getArchetypeIcon(practitioner.archetype)}
                      <h1 className="font-heading text-2xl font-bold text-forest">
                        Practitioner #{practitioner.id.slice(-6)}
                      </h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <Badge className="bg-gold/20 text-gold border-gold/30">
                        {archetype.name} Archetype
                      </Badge>
                      <Badge variant="outline" className="text-forest/60">
                        {archetype.scientificName}
                      </Badge>
                      <Badge variant="outline" className="text-forest/60">
                        {practitioner.experienceLevel === 'rising' ? 'Rising Pollinator' :
                         practitioner.experienceLevel === 'evolving' ? 'Evolving Pollinator' :
                         'Wise Pollinator'}
                      </Badge>
                    </div>

                    <ReviewsSummary
                      averageRating={practitioner.averageRating ? parseFloat(practitioner.averageRating) : undefined}
                      totalReviews={practitioner.totalSessions || 0}
                      isVerified={practitioner.isVerified || false}
                      size="lg"
                      className="mb-4"
                    />

                    <div className="flex items-center space-x-4 text-sm text-forest/70">
                      {practitioner.location && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {practitioner.location}
                        </div>
                      )}
                      {practitioner.isVirtual && (
                        <div className="flex items-center">
                          <Video className="w-4 h-4 mr-1" />
                          Virtual Sessions
                        </div>
                      )}
                      {practitioner.hourlyRate && (
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          ${practitioner.hourlyRate}/hour
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
                <TabsTrigger value="approach">Approach</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-forest">About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {practitioner.bio ? (
                      <p className="text-forest/80 leading-relaxed">{practitioner.bio}</p>
                    ) : (
                      <p className="text-forest/60 italic">No bio available yet.</p>
                    )}
                  </CardContent>
                </Card>

                {practitioner.specializations && practitioner.specializations.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-forest">Specializations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {practitioner.specializations.map((spec, index) => (
                          <Badge key={index} variant="outline">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-forest">Client Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {reviewsLoading ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-4 bg-sage/20 rounded w-1/4 mb-2"></div>
                            <div className="h-16 bg-sage/20 rounded"></div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <ReviewDisplay reviews={reviews} showClientInfo={true} />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="approach" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-forest">{archetype.name} Approach</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-forest mb-2">Description</h4>
                      <p className="text-forest/80">{archetype.fullDescription}</p>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold text-forest mb-2">Methodology</h4>
                      <p className="text-forest/80">{archetype.methodology}</p>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold text-forest mb-2">Core Traits</h4>
                      <div className="flex flex-wrap gap-2">
                        {archetype.traits.map((trait, index) => (
                          <Badge key={index} variant="secondary" className="bg-gold/20 text-gold">
                            {trait}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold text-forest mb-2">Specialties</h4>
                      <ul className="space-y-1">
                        {archetype.specialties.map((specialty, index) => (
                          <li key={index} className="text-forest/80 text-sm">
                            • {specialty}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-forest">Book a Session</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className="w-full bg-gold hover:bg-gold/90"
                  onClick={() => setLocation(`/book/${practitionerId}`)}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Session
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setLocation('/messages')}
                >
                  Send Message
                </Button>

                {practitioner.hourlyRate && (
                  <div className="text-center text-sm text-forest/70">
                    Starting at ${practitioner.hourlyRate}/hour
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-forest">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-forest/70">Total Sessions</span>
                  <span className="font-medium text-forest">{practitioner.totalSessions || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-forest/70">Experience Level</span>
                  <span className="font-medium text-forest capitalize">{practitioner.experienceLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-forest/70">Response Time</span>
                  <span className="font-medium text-forest">Within 24hrs</span>
                </div>
                {(practitioner.isVerified || false) && (
                  <div className="flex justify-between">
                    <span className="text-forest/70">Verification</span>
                    <Badge className="bg-gold/20 text-gold border-gold/30">
                      Verified
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}