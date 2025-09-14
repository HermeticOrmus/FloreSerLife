import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MapPin, Video, User } from "lucide-react";
import { ArchetypeIcons } from "@/components/icons/archetype-icons";
import { archetypeDefinitions, type Practitioner } from "@shared/schema";

export default function Practitioners() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArchetype, setSelectedArchetype] = useState<string>("");
  const [selectedExperience, setSelectedExperience] = useState<string>("");

  const { data: practitioners = [], isLoading } = useQuery<Practitioner[]>({
    queryKey: ["/api/practitioners/all"],
  });

  useEffect(() => {
    document.title = "Find Practitioners - FloreSer";
  }, []);

  const filteredPractitioners = practitioners.filter(practitioner => {
    const matchesSearch = searchTerm === "" || 
      practitioner.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      practitioner.specializations?.some(spec => 
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
            <span className="mr-2">🔬</span>
            Research-Backed Practitioner Matching
          </div>
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-forest mb-4">
            Discover Your Ideal Wellness Practitioner
          </h1>
          <p className="text-lg text-forest/70 max-w-3xl">
            Experience our innovative pollinator archetype system in action. Each practitioner 
            has been classified using our nature-inspired approach, helping you find 
            optimal compatibility with your wellness needs and preferred healing approaches.
          </p>
          <div className="mt-4 flex items-center space-x-6 text-sm text-forest/60">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gold rounded-full"></div>
              <span>4 Nature-Inspired Archetype Classifications</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-sage rounded-full"></div>
              <span>Innovative Matching System</span>
            </div>
          </div>
        </div>

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
              {Object.entries(archetypeDefinitions).map(([key, archetype]) => (
                <SelectItem key={key} value={key}>
                  {archetype.name}
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
            {filteredPractitioners.map((practitioner) => (
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
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {practitioner.specializations.slice(0, 3).map((spec, index) => (
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

                  <div className="flex justify-between items-center">
                    {practitioner.hourlyRate && (
                      <span className="font-semibold text-forest">
                        ${practitioner.hourlyRate}/session
                      </span>
                    )}
                    <Button className="bg-gold text-white hover:bg-gold/90 rounded-full px-6">
                      Book Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
