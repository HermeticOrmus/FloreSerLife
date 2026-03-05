import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Calendar,
  Heart,
  Star,
  MapPin,
  Video,
  Users,
  Search,
  Shield,
  Award,
  Crown,
} from "lucide-react";
import {
  archetypeDefinitions,
  professionalCategoryDefinitions,
} from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { archetypeIcons } from "@/assets";

// Experience season derived from total sessions
function getExperienceSeason(totalSessions: number) {
  if (totalSessions >= 150) return { label: "Rooted", color: "bg-gold/10 text-gold border border-gold/20" };
  if (totalSessions >= 40) return { label: "Evolving", color: "bg-forest/5 text-forest/60 border border-forest/10" };
  return { label: "Emerging", color: "bg-forest/[0.03] text-forest/50 border border-forest/8" };
}

// Session type label from boolean flags
function getSessionType(isVirtual: boolean, isInPerson: boolean) {
  if (isVirtual && isInPerson) return "Hybrid";
  if (isInPerson) return "In-person";
  return "Online";
}

export default function Hive() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArchetype, setSelectedArchetype] = useState<string>("");
  const [selectedExperience, setSelectedExperience] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("featured");
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
        credentials: "include",
      });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (practitionerId: string) => {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ practitionerId }),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      toast({ title: "Favorites updated!" });
    },
  });

  const practitioners = Array.isArray(practitionersData)
    ? practitionersData
    : (practitionersData as any)?.practitioners || [];

  const favorites = Array.isArray(favoritesData)
    ? favoritesData.map((f: any) => f.practitionerId)
    : [];

  useEffect(() => {
    document.title = "The Hive - FloreSer";
  }, []);

  const filteredPractitioners = practitioners.filter((p: any) => {
    const matchesSearch =
      searchTerm === "" ||
      p.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.specializations?.some((s: string) =>
        s.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      p.professionalCategories?.some(
        (cat: string) =>
          (professionalCategoryDefinitions as any)[cat]?.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );

    const matchesArchetype =
      selectedArchetype === "" || p.archetype === selectedArchetype;

    const matchesExperience =
      selectedExperience === "" || p.experienceLevel === selectedExperience;

    const matchesCategory =
      selectedCategory === "" ||
      p.professionalCategories?.includes(selectedCategory);

    return matchesSearch && matchesArchetype && matchesExperience && matchesCategory;
  });

  const sortedPractitioners = [...filteredPractitioners].sort(
    (a: any, b: any) => {
      switch (sortBy) {
        case "rating":
          return (
            parseFloat(b.averageRating || 0) -
            parseFloat(a.averageRating || 0)
          );
        case "price-low":
          return (
            parseFloat(a.hourlyRate || 9999) -
            parseFloat(b.hourlyRate || 9999)
          );
        case "price-high":
          return (
            parseFloat(b.hourlyRate || 0) - parseFloat(a.hourlyRate || 0)
          );
        case "experience":
          const expOrder = { wise: 3, evolving: 2, rising: 1 };
          return (
            (expOrder[b.experienceLevel as keyof typeof expOrder] || 0) -
            (expOrder[a.experienceLevel as keyof typeof expOrder] || 0)
          );
        default: // featured
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return (
            parseFloat(b.averageRating || 0) -
            parseFloat(a.averageRating || 0)
          );
      }
    }
  );

  const handleToggleFavorite = (practitionerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save favorites",
        variant: "destructive",
      });
      return;
    }
    toggleFavoriteMutation.mutate(practitionerId);
  };

  const getArchetypeIcon = (archetype: string) => {
    const iconSrc = archetypeIcons[archetype as keyof typeof archetypeIcons];
    if (iconSrc) {
      return (
        <img
          src={iconSrc}
          alt={archetype}
          className="w-8 h-8 object-contain"
        />
      );
    }
    return <User className="w-8 h-8" />;
  };

  const getExperienceBadge = (level: string) => {
    const styles: Record<string, string> = {
      rising: "bg-forest/[0.03] text-forest/50 border border-forest/8",
      evolving: "bg-forest/5 text-forest/60 border border-forest/10",
      wise: "bg-gold/10 text-gold border border-gold/20",
    };
    const icons: Record<string, React.ReactNode> = {
      rising: <Star className="w-3 h-3 mr-1" />,
      evolving: <Award className="w-3 h-3 mr-1" />,
      wise: <Crown className="w-3 h-3 mr-1" />,
    };

    return (
      <Badge className={`${styles[level] || ""} text-xs`}>
        {icons[level]}
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-white origami-paper-hive">
      <Header />

      {/* Hero */}
      <section className="py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          {/* Archetype icons */}
          <div className="flex justify-center gap-4 mb-8">
            {["bee", "butterfly", "hummingbird", "beetle"].map((arch) => (
              <div
                key={arch}
                className="w-10 h-10 rounded-full bg-white border border-forest/8 origami-fold-shadow flex items-center justify-center"
              >
                <img
                  src={archetypeIcons[arch as keyof typeof archetypeIcons]}
                  alt={arch}
                  className="w-6 h-6 object-contain"
                />
              </div>
            ))}
          </div>

          <p className="text-xs tracking-[0.2em] uppercase text-forest/40 mb-4">
            Pollinator Directory
          </p>

          <h1 className="font-heading text-3xl md:text-4xl text-forest mb-4 tracking-tight">
            The Hive
          </h1>
          <p className="text-base md:text-lg text-forest/50 max-w-2xl mx-auto leading-relaxed">
            Discover your Pollinator — a facilitator whose presence,
            wisdom, and approach resonate with where you are now.
          </p>
        </div>
      </section>

      <div className="origami-crease-hive" />

      {/* Search & Filters */}
      <section className="py-10 origami-paper-cream origami-subtle">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest/30" strokeWidth={1.5} />
              <Input
                placeholder="Search by name, specialization, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-forest/10 rounded-lg"
              />
            </div>
            <Select
              value={selectedArchetype}
              onValueChange={setSelectedArchetype}
            >
              <SelectTrigger className="w-full md:w-44 bg-white border-forest/10 rounded-lg">
                <SelectValue placeholder="Archetype" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Archetypes</SelectItem>
                {Object.entries(archetypeDefinitions).map(([key, arch]) => (
                  <SelectItem key={key} value={key}>
                    {arch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedExperience}
              onValueChange={setSelectedExperience}
            >
              <SelectTrigger className="w-full md:w-44 bg-white border-forest/10 rounded-lg">
                <SelectValue placeholder="Experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="rising">Rising</SelectItem>
                <SelectItem value="evolving">Evolving</SelectItem>
                <SelectItem value="wise">Wise</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-40 bg-white border-forest/10 rounded-lg">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price-low">Price: Low</SelectItem>
                <SelectItem value="price-high">Price: High</SelectItem>
                <SelectItem value="experience">Most Experienced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <div className="origami-crease-hive" />

      {/* Practitioner Cards */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg overflow-hidden bg-white border border-forest/8 origami-paper origami-corner origami-fold-shadow animate-pulse"
                >
                  <div className="h-32 bg-forest/[0.03]" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-forest/5 rounded w-3/4" />
                    <div className="h-3 bg-forest/[0.03] rounded w-1/2" />
                    <div className="h-3 bg-forest/[0.03] rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : sortedPractitioners.length === 0 ? (
            <div className="text-center py-16 rounded-lg bg-white border border-forest/8 origami-paper origami-corner-both origami-fold-shadow-md">
              <Users className="w-12 h-12 text-forest/20 mx-auto mb-4" strokeWidth={1.5} />
              <h3 className="font-heading text-xl text-forest mb-2">
                No facilitators found
              </h3>
              <p className="text-sm text-forest/50">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedPractitioners.map((p: any) => {
                const sessionType = getSessionType(
                  p.isVirtual ?? true,
                  p.isInPerson ?? false
                );
                const season = getExperienceSeason(p.totalSessions || 0);
                const isFav = favorites.includes(p.id);

                return (
                  <div
                    key={p.id}
                    className="rounded-lg overflow-hidden bg-white border border-forest/8 origami-paper origami-corner origami-lifted"
                  >
                    {/* Archetype badge row */}
                    <div className="p-4 pb-0 flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-2">
                        {getExperienceBadge(p.experienceLevel)}
                        {p.isVerified && (
                          <Badge className="bg-gold/10 text-gold/80 text-xs border border-gold/20">
                            <Shield className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <button
                        onClick={(e) => handleToggleFavorite(p.id, e)}
                        className="p-2 rounded-full hover:bg-forest/5 transition-colors"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            isFav
                              ? "fill-red-500 text-red-500"
                              : "text-forest/20"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Hexagon portrait + archetype */}
                    <div className="flex flex-col items-center py-4 relative z-10">
                      <div
                        className="w-20 h-20 flex items-center justify-center mb-3 bg-forest/[0.03] origami-emboss"
                        style={{
                          clipPath:
                            "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)",
                        }}
                      >
                        {getArchetypeIcon(p.archetype)}
                      </div>
                      <Badge
                        className="text-xs bg-forest/5 text-forest/60 border border-forest/10"
                        variant="outline"
                      >
                        {archetypeDefinitions[p.archetype]?.name || p.archetype}
                      </Badge>
                    </div>

                    {/* Profile info */}
                    <div className="px-5 pb-5 relative z-10 mx-3 mb-3 rounded-lg origami-emboss py-4">
                      {/* Name */}
                      <h3 className="font-heading text-lg text-forest text-center mb-1">
                        {p.firstName && p.lastName
                          ? `${p.firstName} ${p.lastName}`
                          : `Pollinator #${p.id.slice(-6)}`}
                      </h3>

                      {/* Archetype scientific name */}
                      <p className="text-xs text-forest/40 text-center mb-3 italic">
                        {archetypeDefinitions[p.archetype]?.scientificName}
                      </p>

                      {/* Bio excerpt */}
                      {p.bio && (
                        <p className="text-sm text-forest/60 text-center mb-4 line-clamp-2 leading-relaxed">
                          {p.bio}
                        </p>
                      )}

                      {/* Details row */}
                      <div className="flex flex-wrap justify-center gap-2 mb-4 text-xs text-forest/50">
                        <span className="flex items-center gap-1">
                          <Video className="w-3 h-3" strokeWidth={1.5} />
                          {sessionType}
                        </span>
                        {p.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" strokeWidth={1.5} />
                            {p.location}
                          </span>
                        )}
                        {p.averageRating && (
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-gold fill-gold" />
                            {parseFloat(p.averageRating).toFixed(1)}
                          </span>
                        )}
                      </div>

                      {/* Season badge */}
                      <div className="flex justify-center gap-2 mb-4">
                        <Badge className={`${season.color} text-xs`}>
                          {season.label}
                        </Badge>
                      </div>

                      {/* Price + Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-forest/8">
                        {p.hourlyRate ? (
                          <div>
                            <span className="text-xs text-forest/40">From</span>
                            <span className="font-heading text-forest ml-1">
                              ${p.hourlyRate}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-forest/40">
                            Contact for pricing
                          </span>
                        )}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-lg text-xs border-forest/10 text-forest/70 hover:bg-forest/5"
                            onClick={() =>
                              setLocation(`/practitioners/${p.id}`)
                            }
                          >
                            View Profile
                          </Button>
                          <Button
                            size="sm"
                            className="rounded-lg text-xs text-white bg-forest hover:bg-forest/90"
                            onClick={() => setLocation(`/book/${p.id}`)}
                          >
                            <Calendar className="w-3 h-3 mr-1" />
                            Book
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <div className="origami-crease-warm" />

      {/* Bottom band */}
      <section className="py-10 origami-paper-earth origami-subtle">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <p className="text-sm text-forest/50">
            Every Pollinator is vetted, supported, and part of a living
            ecosystem of care.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
