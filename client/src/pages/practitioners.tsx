import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MapPin, Video, User } from "lucide-react";
import { ArchetypeIcons } from "@/components/icons/archetype-icons";
import { ReviewsSummary } from "@/components/reviews";
import { AccessLevelBadge, FeaturePreview, UpgradeModal, UsageProgress } from "@/components/access-control";
import { archetypeDefinitions, type Practitioner } from "@shared/schema";

export default function Practitioners() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArchetype, setSelectedArchetype] = useState<string>("");
  const [selectedExperience, setSelectedExperience] = useState<string>("");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [, setLocation] = useLocation();

  const { data: practitionersData, isLoading } = useQuery<any>({
    queryKey: ["/api/practitioners/all"],
  });

  // Handle both old format (array) and new format (object with access info)
  const practitioners = Array.isArray(practitionersData)
    ? practitionersData
    : (practitionersData as any)?.practitioners || [];

  const accessInfo = !Array.isArray(practitionersData) ? (practitionersData as any)?.accessInfo : null;

  useEffect(() => {
    document.title = "Find Practitioners - FloreSer";
  }, []);

  const filteredPractitioners = practitioners.filter((practitioner: any) => {
    const matchesSearch = searchTerm === "" ||
      practitioner.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      practitioner.specializations?.some((spec: string) =>
        spec.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesArchetype = selectedArchetype === "" || 
      practitioner.archetype === selectedArchetype;
    
    const matchesExperience = selectedExperience === "" || 
      practitioner.experienceLevel === selectedExperience;

    return matchesSearch && matchesArchetype && matchesExperience;
  });

  const getArchetypeIcon = (archetype: string) => {
    switch (archetype) {
      case 'bee': return <ArchetypeIcons.Bee className="w-6 h-6" />;
      case 'hummingbird': return <ArchetypeIcons.Hummingbird className="w-6 h-6" />;
      case 'butterfly': return <ArchetypeIcons.Butterfly className="w-6 h-6" />;
      case 'beetle': return <ArchetypeIcons.Beetle className="w-6 h-6" />;
      default: return <User className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-forest/10 text-forest rounded-full text-sm font-medium mb-4">
            <span className="mr-2">🌸</span>
            Connect • Learn • Grow Together
          </div>
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-forest mb-4">
            Find Your Wellness Community
          </h1>
          <p className="text-lg text-forest/70 max-w-3xl mb-6">
            Whether you're seeking healing support or ready to start your facilitator journey,
            our nature-inspired archetype system helps you find your perfect match.
            Each practitioner embodies one of four unique approaches to wellness.
          </p>

          {/* Dual Path Guidance */}
          <div className="grid md:grid-cols-2 gap-4 mb-6 max-w-4xl">
            <div className="bg-sage/10 rounded-lg p-4 border border-sage/20">
              <h3 className="font-semibold text-forest mb-2">🔍 Seeking Support?</h3>
              <p className="text-sm text-forest/80">
                Browse practitioners by archetype to find someone whose approach resonates with your healing journey.
                <span className="font-semibold text-gold"> Bee practitioners</span> are especially welcoming for first-time seekers.
              </p>
            </div>
            <div className="bg-gold/10 rounded-lg p-4 border border-gold/20">
              <h3 className="font-semibold text-forest mb-2">🐝 Ready to Facilitate?</h3>
              <p className="text-sm text-forest/80">
                Explore <span className="font-semibold text-gold">Bee practitioners</span> to see your future community!
                This archetype welcomes new facilitators and provides mentorship for developing foundational skills.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-sm text-forest/60">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gold rounded-full"></div>
              <span>Bee: Perfect for beginners & experienced alike</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-sage rounded-full"></div>
              <span>Other archetypes: For experienced practitioners</span>
            </div>
          </div>
        </div>

        {/* Access Control Info */}
        {accessInfo && accessInfo.upgradeRequired && (
          <Alert className="border-gold/30 bg-gold/5 mb-6">
            <Star className="h-4 w-4 text-gold" />
            <AlertDescription className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-forest">
                    Showing {accessInfo.shown} of {accessInfo.total} practitioners
                  </span>
                  <AccessLevelBadge accessLevel={accessInfo.accessLevel} />
                </div>
                <p className="text-sm text-forest/70">
                  Upgrade to see all {accessInfo.total} verified practitioners and unlock full platform features.
                </p>
              </div>
              <Button
                size="sm"
                className="bg-gold text-white hover:bg-gold/90"
                onClick={() => setShowUpgradeModal(true)}
              >
                Upgrade Access
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Input
            placeholder="Search by specialization or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:col-span-2"
          />
          
          <Select value={selectedArchetype} onValueChange={setSelectedArchetype}>
            <SelectTrigger>
              <SelectValue placeholder="All Archetypes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Archetypes</SelectItem>
              <SelectItem value="bee">
                🐝 Bee (Perfect for New Facilitators)
              </SelectItem>
              {Object.entries(archetypeDefinitions)
                .filter(([key]) => key !== 'bee')
                .map(([key, archetype]) => (
                  <SelectItem key={key} value={key}>
                    {archetype.name} (Experienced Practitioners)
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Select value={selectedExperience} onValueChange={setSelectedExperience}>
            <SelectTrigger>
              <SelectValue placeholder="All Experience Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Experience Levels</SelectItem>
              <SelectItem value="rising">Rising</SelectItem>
              <SelectItem value="evolving">Evolving</SelectItem>
              <SelectItem value="wise">Wise</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
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
        ) : filteredPractitioners.length === 0 ? (
          <Card className="border-sage/20 text-center py-12">
            <CardContent>
              <User className="w-16 h-16 text-sage mx-auto mb-4" />
              <h3 className="font-heading text-xl font-semibold text-forest mb-2">
                No practitioners found
              </h3>
              <p className="text-forest/70">
                Try adjusting your search criteria or browse all practitioners
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPractitioners.map((practitioner: any) => (
              <Card key={practitioner.id} className="border-sage/20 hover:shadow-lg transition-all duration-300 practitioner-card">
                <div className="aspect-video bg-gradient-to-br from-cream to-light-green/20 rounded-t-lg flex items-center justify-center">
                  <User className="w-16 h-16 text-forest/30" />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getArchetypeIcon(practitioner.archetype)}
                      <div className="flex flex-col space-y-1">
                        <Badge variant="secondary" className="bg-gold/20 text-gold hover:bg-gold/30 text-xs">
                          {(archetypeDefinitions as any)[practitioner.archetype]?.name} Archetype
                        </Badge>
                        <Badge variant="outline" className="text-xs text-forest/60 border-sage/30">
                          {(archetypeDefinitions as any)[practitioner.archetype]?.scientificName}
                        </Badge>
                      </div>
                    </div>
                    <ReviewsSummary
                      averageRating={practitioner.averageRating ? parseFloat(practitioner.averageRating) : undefined}
                      totalReviews={practitioner.totalSessions || 0}
                      isVerified={practitioner.isVerified || false}
                      size="sm"
                    />
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
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {practitioner.specializations.slice(0, 3).map((spec: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                        {practitioner.specializations.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{practitioner.specializations.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4 text-sm text-forest/60">
                    <div className="flex items-center">
                      {practitioner.isVirtual && <Video className="w-4 h-4 mr-1" />}
                      {practitioner.isInPerson && <MapPin className="w-4 h-4 mr-1" />}
                      <span>
                        {practitioner.isVirtual && practitioner.isInPerson 
                          ? "Virtual & In-Person"
                          : practitioner.isVirtual 
                          ? "Virtual Only"
                          : "In-Person Only"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3">
                    {practitioner.hourlyRate && (
                      <div className="text-center">
                        <span className="font-semibold text-forest text-lg">
                          ${practitioner.hourlyRate}/session
                        </span>
                      </div>
                    )}
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setLocation(`/practitioners/${practitioner.id}`)}
                      >
                        View Profile
                      </Button>
                      <Button
                        className="flex-1 bg-gold text-white hover:bg-gold/90"
                        onClick={() => setLocation(`/book/${practitioner.id}`)}
                      >
                        Book Session
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentLevel={accessInfo?.accessLevel || "preview"}
        feature="unlimited practitioner viewing"
      />
    </div>
  );
}
