import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Star,
  MapPin,
  Video,
  User,
  Users,
  Hexagon,
  Crown,
  Award,
  Calendar,
  BookOpen,
  Heart,
  Clock,
  TrendingUp,
  Filter,
  X,
  Sparkles
} from "lucide-react";
import { ArchetypeIcons } from "@/components/icons/archetype-icons";
import { ReviewsSummary } from "@/components/reviews";
import {
  archetypeDefinitions,
  professionalCategoryDefinitions,
  categoryGroups
} from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function Hive() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArchetype, setSelectedArchetype] = useState<string>("");
  const [selectedExperience, setSelectedExperience] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300]);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: practitionersData, isLoading } = useQuery<any>({
    queryKey: ["/api/practitioners/all"],
  });

  const { data: favoritesData } = useQuery<any>({
    queryKey: ["/api/favorites", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const res = await fetch(`/api/favorites/${user?.id}`, {
        credentials: 'include'
      });
      if (!res.ok) return [];
      return res.json();
    }
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (practitionerId: string) => {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ practitionerId })
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      toast({ title: "Favorites updated!" });
    }
  });

  // Handle both old format (array) and new format (object with access info)
  const practitioners = Array.isArray(practitionersData)
    ? practitionersData
    : (practitionersData as any)?.practitioners || [];

  const favorites = Array.isArray(favoritesData) ? favoritesData.map((f: any) => f.practitionerId) : [];

  useEffect(() => {
    document.title = "The Hive - Facilitator Community - FloreSer";
  }, []);

  const filteredPractitioners = practitioners.filter((practitioner: any) => {
    const matchesSearch = searchTerm === "" ||
      practitioner.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      practitioner.specializations?.some((spec: string) =>
        spec.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      practitioner.professionalCategories?.some((cat: string) =>
        (professionalCategoryDefinitions as any)[cat]?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesArchetype = selectedArchetype === "" ||
      practitioner.archetype === selectedArchetype;

    const matchesExperience = selectedExperience === "" ||
      practitioner.experienceLevel === selectedExperience;

    const matchesCategory = selectedCategory === "" ||
      practitioner.professionalCategories?.includes(selectedCategory);

    const matchesGroup = selectedGroup === "" ||
      practitioner.professionalCategories?.some((cat: string) =>
        (professionalCategoryDefinitions as any)[cat]?.group === selectedGroup
      );

    const matchesPrice = !practitioner.hourlyRate ||
      (parseFloat(practitioner.hourlyRate) >= priceRange[0] &&
       parseFloat(practitioner.hourlyRate) <= priceRange[1]);

    return matchesSearch && matchesArchetype && matchesExperience && matchesCategory && matchesGroup && matchesPrice;
  });

  // Sort practitioners
  const sortedPractitioners = [...filteredPractitioners].sort((a: any, b: any) => {
    switch (sortBy) {
      case "featured":
        // Featured first, then by rating
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return parseFloat(b.averageRating || 0) - parseFloat(a.averageRating || 0);
      case "rating":
        return parseFloat(b.averageRating || 0) - parseFloat(a.averageRating || 0);
      case "price-low":
        return parseFloat(a.hourlyRate || 9999) - parseFloat(b.hourlyRate || 9999);
      case "price-high":
        return parseFloat(b.hourlyRate || 0) - parseFloat(a.hourlyRate || 0);
      case "experience":
        const expOrder = { wise: 3, evolving: 2, rising: 1 };
        return (expOrder[b.experienceLevel as keyof typeof expOrder] || 0) -
               (expOrder[a.experienceLevel as keyof typeof expOrder] || 0);
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "sessions":
        return (b.totalSessions || 0) - (a.totalSessions || 0);
      default:
        return 0;
    }
  });

  const activeFiltersCount = [
    selectedArchetype,
    selectedExperience,
    selectedCategory,
    selectedGroup,
    searchTerm
  ].filter(Boolean).length + (priceRange[0] > 0 || priceRange[1] < 300 ? 1 : 0);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedArchetype("");
    setSelectedExperience("");
    setSelectedCategory("");
    setSelectedGroup("");
    setPriceRange([0, 300]);
  };

  const getArchetypeIcon = (archetype: string) => {
    switch (archetype) {
      case 'bee': return <ArchetypeIcons.Bee className="w-6 h-6" />;
      case 'hummingbird': return <ArchetypeIcons.Hummingbird className="w-6 h-6" />;
      case 'butterfly': return <ArchetypeIcons.Butterfly className="w-6 h-6" />;
      case 'beetle': return <ArchetypeIcons.Beetle className="w-6 h-6" />;
      default: return <User className="w-6 h-6" />;
    }
  };

  const getExperienceBadge = (level: string) => {
    const badgeStyles = {
      rising: "bg-green-100 text-green-700 border-green-200",
      evolving: "bg-blue-100 text-blue-700 border-blue-200",
      wise: "bg-purple-100 text-purple-700 border-purple-200"
    };

    const icons = {
      rising: <Star className="w-3 h-3 mr-1" />,
      evolving: <Award className="w-3 h-3 mr-1" />,
      wise: <Crown className="w-3 h-3 mr-1" />
    };

    return (
      <Badge className={`${badgeStyles[level as keyof typeof badgeStyles]} text-xs border`}>
        {icons[level as keyof typeof icons]}
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </Badge>
    );
  };

  const handleToggleFavorite = (practitionerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save favorites",
        variant: "destructive"
      });
      return;
    }
    toggleFavoriteMutation.mutate(practitionerId);
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gold/20 to-forest/20 text-forest rounded-full text-sm font-medium mb-6">
            <Hexagon className="mr-2 h-5 w-5 text-gold" />
            Welcome to The Hive
          </div>
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-forest mb-6">
            Meet Our <span className="text-gold">Facilitator Community</span>
          </h1>
          <p className="text-lg text-forest/70 max-w-4xl mx-auto mb-6">
            The Hive is where our wellness facilitators come together to share wisdom,
            collaborate on healing approaches, and support each other's growth. From new
            facilitators starting their journey in the Bee community to experienced practitioners
            across all archetypes.
          </p>

          {/* New Facilitator Encouragement */}
          <div className="bg-gold/10 rounded-lg p-4 mb-8 border border-gold/20 max-w-4xl mx-auto">
            <p className="text-sm text-forest text-center">
              <span className="font-semibold">🐝 Considering facilitation?</span> Browse our Bee facilitators
              to see your future community - a supportive space where you can learn, grow, and develop
              your foundational wellness skills alongside mentors and peers.
            </p>
          </div>

          {/* Community Values */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-white/30 rounded-lg p-6 text-center">
              <h3 className="font-heading text-xl font-semibold text-forest mb-4">
                A Community United by Purpose
              </h3>
              <p className="text-forest/70 leading-relaxed">
                Our facilitators come from diverse backgrounds and healing traditions, yet they share
                a common commitment: to meet each person where they are with compassion, skill, and
                authentic presence. Here, you'll find practitioners who honor the sacred nature of
                healing work and approach each connection with reverence and care.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-gold text-white hover:bg-gold/90 rounded-full px-8 py-4 font-medium"
              onClick={() => setLocation("/auth/signup")}
            >
              <Users className="mr-2 h-5 w-5" />
              Join The Hive
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-forest text-forest hover:bg-forest hover:text-white rounded-full px-8 py-4 font-medium"
              onClick={() => setLocation("/practitioners")}
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Book a Session
            </Button>
          </div>
        </div>

        {/* Archetype Overview */}
        <div className="mb-12">
          <h2 className="font-heading text-2xl font-bold text-forest mb-6 text-center">
            Our Four Pollinator Archetypes
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {Object.entries(archetypeDefinitions).map(([key, archetype]) => (
              <Card key={key} className="border-sage/20 text-center hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-center">
                    {getArchetypeIcon(key)}
                  </div>
                  <h3 className="font-heading font-semibold text-forest mb-2">
                    {archetype.name}
                  </h3>
                  <p className="text-sm text-forest/60 mb-3">
                    {archetype.scientificName}
                  </p>
                  <p className="text-sm text-forest/70">
                    {archetype.approach}
                  </p>
                </CardContent>
              </Card>
            ))}
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
              <SelectItem value="all">All Archetypes</SelectItem>
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
              <SelectItem value="all">All Experience Levels</SelectItem>
              <SelectItem value="rising">Rising</SelectItem>
              <SelectItem value="evolving">Evolving</SelectItem>
              <SelectItem value="wise">Wise</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Facilitators Grid */}
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
              <Users className="w-16 h-16 text-sage mx-auto mb-4" />
              <h3 className="font-heading text-xl font-semibold text-forest mb-2">
                No facilitators found
              </h3>
              <p className="text-forest/70">
                Try adjusting your search criteria or browse all facilitators
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPractitioners.map((practitioner: any) => (
              <Card key={practitioner.id} className="border-sage/20 hover:shadow-lg transition-all duration-300 facilitator-card">
                <div className="aspect-video bg-gradient-to-br from-cream to-light-green/20 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                  <User className="w-16 h-16 text-forest/30" />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-gold/90 text-white">
                      <Hexagon className="w-3 h-3 mr-1" />
                      Hive Member
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getArchetypeIcon(practitioner.archetype)}
                      <div className="flex flex-col space-y-1">
                        <Badge variant="secondary" className="bg-gold/20 text-gold hover:bg-gold/30 text-xs">
                          {(archetypeDefinitions as any)[practitioner.archetype]?.name}
                        </Badge>
                        {getExperienceBadge(practitioner.experienceLevel)}
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
                    Facilitator #{practitioner.id.slice(-6)}
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
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Session
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Community Benefits Section */}
        <div className="mt-16 bg-gradient-to-br from-forest/5 to-gold/5 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl font-bold text-forest mb-4">
              Why Join The Hive?
            </h2>
            <p className="text-forest/70 max-w-2xl mx-auto">
              Our facilitator community offers exclusive benefits and opportunities
              for professional growth and meaningful connections.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gold/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-gold" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-forest mb-2">
                Peer Learning Network
              </h3>
              <p className="text-sm text-forest/70">
                Connect with like-minded facilitators, share best practices, and learn
                from diverse healing approaches across all archetypes.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gold/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Star className="w-8 h-8 text-gold" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-forest mb-2">
                Professional Recognition
              </h3>
              <p className="text-sm text-forest/70">
                Build your reputation through our verification system, client reviews,
                and archetype-based matching that highlights your unique strengths.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gold/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Hexagon className="w-8 h-8 text-gold" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-forest mb-2">
                Exclusive Resources
              </h3>
              <p className="text-sm text-forest/70">
                Access facilitator-only content, advanced training materials, and
                early access to new platform features and opportunities.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}