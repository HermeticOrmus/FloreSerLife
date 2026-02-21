import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { PaperCutBanner } from "@/components/landing/PaperCutBanner";
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
import { ArchetypeIcons } from "@/components/icons/archetype-icons";
import {
  archetypeDefinitions,
  professionalCategoryDefinitions,
} from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { papercut, archetypeIcons } from "@/assets";

// Experience season derived from total sessions
function getExperienceSeason(totalSessions: number) {
  if (totalSessions >= 150) return { label: "Rooted", color: "bg-purple-100 text-purple-700" };
  if (totalSessions >= 40) return { label: "Evolving", color: "bg-blue-100 text-blue-700" };
  return { label: "Emerging", color: "bg-green-100 text-green-700" };
}

// Session type label from boolean flags
function getSessionType(isVirtual: boolean, isInPerson: boolean) {
  if (isVirtual && isInPerson) return "Hybrid";
  if (isInPerson) return "In-person";
  return "Online";
}

// Floating hexagon fragment SVG
function HexFragment({
  x,
  y,
  size,
  color,
  delay,
}: {
  x: string;
  y: string;
  size: number;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 0.15, scale: 1 }}
      transition={{ delay, duration: 0.8 }}
      className="absolute pointer-events-none"
      style={{ left: x, top: y }}
    >
      <svg width={size} height={size} viewBox="0 0 30 30">
        <polygon
          points="15,2 27,9 27,21 15,28 3,21 3,9"
          fill={color}
          stroke={color}
          strokeWidth="0.5"
          opacity="0.8"
        />
      </svg>
    </motion.div>
  );
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

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
      rising: "bg-green-100 text-green-700",
      evolving: "bg-blue-100 text-blue-700",
      wise: "bg-purple-100 text-purple-700",
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
    <div
      className="min-h-screen text-papercut-neutral-dark"
      style={{
        backgroundImage: `url(${papercut.textures.paperUI})`,
        backgroundSize: "256px 256px",
        backgroundRepeat: "repeat",
        backgroundColor: "#f5f3ef",
      }}
    >
      <Header />

      {/* Hero Panel */}
      <section className="relative overflow-hidden py-20 lg:py-24">
        {/* Layered paper curves (dunes) */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute bottom-0 left-0 right-0 h-[55%]"
            style={{
              backgroundImage: `url(${papercut.textures.paperClay})`,
              backgroundSize: "200px 200px",
              backgroundRepeat: "repeat",
              clipPath: "ellipse(85% 100% at 50% 100%)",
              opacity: 0.2,
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-[40%]"
            style={{
              backgroundImage: `url(${papercut.textures.cream})`,
              backgroundSize: "200px 200px",
              backgroundRepeat: "repeat",
              clipPath: "ellipse(70% 100% at 45% 100%)",
              opacity: 0.15,
            }}
          />
        </div>

        {/* Floating hexagon fragments */}
        <HexFragment x="10%" y="20%" size={24} color="#D4A843" delay={0.4} />
        <HexFragment x="80%" y="15%" size={18} color="#7B2D26" delay={0.6} />
        <HexFragment x="70%" y="60%" size={20} color="#8B9D77" delay={0.8} />
        <HexFragment x="15%" y="70%" size={16} color="#C4A882" delay={1.0} />
        <HexFragment x="50%" y="10%" size={14} color="#D4A843" delay={0.5} />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Small archetype icons row */}
            <div className="flex justify-center gap-4 mb-6">
              {["bee", "butterfly", "hummingbird", "beetle"].map((arch, i) => (
                <motion.div
                  key={arch}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
                  className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm shadow-md flex items-center justify-center"
                >
                  <img
                    src={archetypeIcons[arch as keyof typeof archetypeIcons]}
                    alt={arch}
                    className="w-6 h-6 object-contain"
                  />
                </motion.div>
              ))}
            </div>

            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-forest mb-4">
              The{" "}
              <span className="bg-gradient-to-r from-gold via-hive-accent to-garden-accent bg-clip-text text-transparent">
                Hive
              </span>
            </h1>
            <p className="text-xl text-forest/70 max-w-2xl mx-auto leading-relaxed">
              Discover your Pollinator &mdash; a facilitator whose presence,
              wisdom, and approach resonate with where you are now.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <PaperCutBanner variant="patterned-root">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest/40" />
              <Input
                placeholder="Search by name, specialization, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/80 border-forest/15 rounded-full"
              />
            </div>
            <Select
              value={selectedArchetype}
              onValueChange={setSelectedArchetype}
            >
              <SelectTrigger className="w-full md:w-44 bg-white/80 border-forest/15 rounded-full">
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
              <SelectTrigger className="w-full md:w-44 bg-white/80 border-forest/15 rounded-full">
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
              <SelectTrigger className="w-full md:w-40 bg-white/80 border-forest/15 rounded-full">
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
      </PaperCutBanner>

      {/* Practitioner Cards */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden shadow-md animate-pulse"
                  style={{
                    backgroundImage: `url(${papercut.textures.cream})`,
                    backgroundSize: "200px 200px",
                    backgroundRepeat: "repeat",
                  }}
                >
                  <div className="h-32 bg-forest/5" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-forest/10 rounded w-3/4" />
                    <div className="h-3 bg-forest/5 rounded w-1/2" />
                    <div className="h-3 bg-forest/5 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : sortedPractitioners.length === 0 ? (
            <div
              className="text-center py-16 rounded-2xl shadow-md"
              style={{
                backgroundImage: `url(${papercut.textures.cream})`,
                backgroundSize: "200px 200px",
                backgroundRepeat: "repeat",
              }}
            >
              <Users className="w-16 h-16 text-forest/30 mx-auto mb-4" />
              <h3 className="font-heading text-xl font-bold text-forest mb-2">
                No facilitators found
              </h3>
              <p className="text-forest/60">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <motion.div
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {sortedPractitioners.map((p: any) => {
                const sessionType = getSessionType(
                  p.isVirtual ?? true,
                  p.isInPerson ?? false
                );
                const season = getExperienceSeason(p.totalSessions || 0);
                const isFav = favorites.includes(p.id);

                return (
                  <motion.div key={p.id} variants={fadeUp}>
                    <div
                      className="rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow relative group"
                      style={{
                        backgroundImage: `url(${papercut.textures.cream})`,
                        backgroundSize: "200px 200px",
                        backgroundRepeat: "repeat",
                      }}
                    >
                      {/* Relief overlay */}
                      <div
                        className="absolute inset-0 rounded-2xl pointer-events-none"
                        style={{
                          background:
                            "linear-gradient(145deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.03) 100%)",
                        }}
                      />

                      {/* Archetype badge row */}
                      <div className="p-4 pb-0 flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-2">
                          {getExperienceBadge(p.experienceLevel)}
                          {p.isVerified && (
                            <Badge className="bg-gold/20 text-gold text-xs">
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
                                : "text-forest/30"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Hexagon portrait + archetype */}
                      <div className="flex flex-col items-center py-4 relative z-10">
                        <div
                          className="w-20 h-20 flex items-center justify-center shadow-md mb-3"
                          style={{
                            clipPath:
                              "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)",
                            backgroundImage: `url(${papercut.textures.paperClay})`,
                            backgroundSize: "100px 100px",
                            backgroundRepeat: "repeat",
                          }}
                        >
                          {getArchetypeIcon(p.archetype)}
                        </div>
                        <Badge
                          className="text-xs"
                          variant="outline"
                        >
                          {archetypeDefinitions[p.archetype]?.name || p.archetype}
                        </Badge>
                      </div>

                      {/* Profile info */}
                      <div className="px-5 pb-5 relative z-10">
                        {/* Name */}
                        <h3 className="font-heading text-lg font-bold text-forest text-center mb-1">
                          {p.firstName && p.lastName
                            ? `${p.firstName} ${p.lastName}`
                            : `Pollinator #${p.id.slice(-6)}`}
                        </h3>

                        {/* Archetype + Season */}
                        <p className="text-xs text-forest/50 text-center mb-3 italic">
                          {archetypeDefinitions[p.archetype]?.scientificName}
                        </p>

                        {/* Bio excerpt */}
                        {p.bio && (
                          <p className="text-sm text-forest/70 text-center mb-4 line-clamp-2 leading-relaxed">
                            {p.bio}
                          </p>
                        )}

                        {/* Details row */}
                        <div className="flex flex-wrap justify-center gap-2 mb-4 text-xs text-forest/60">
                          <span className="flex items-center gap-1">
                            <Video className="w-3 h-3" />
                            {sessionType}
                          </span>
                          {p.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
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

                        {/* Season + metrics */}
                        <div className="flex justify-center gap-2 mb-4">
                          <Badge className={`${season.color} text-xs`}>
                            {season.label}
                          </Badge>
                        </div>

                        {/* Price + Actions */}
                        <div className="flex items-center justify-between pt-3 border-t border-forest/10">
                          {p.hourlyRate ? (
                            <div>
                              <span className="text-xs text-forest/50">From</span>
                              <span className="font-heading font-semibold text-forest ml-1">
                                ${p.hourlyRate}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-forest/50">
                              Contact for pricing
                            </span>
                          )}
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-full text-xs border-forest/20"
                              onClick={() =>
                                setLocation(`/practitioners/${p.id}`)
                              }
                              style={{
                                backgroundImage: `url(${papercut.textures.cream})`,
                                backgroundSize: "150px 150px",
                                backgroundRepeat: "repeat",
                              }}
                            >
                              View Profile
                            </Button>
                            <Button
                              size="sm"
                              className="rounded-full text-xs text-white"
                              onClick={() => setLocation(`/book/${p.id}`)}
                              style={{
                                backgroundImage: `url(${papercut.textures.paperSage})`,
                                backgroundSize: "150px 150px",
                                backgroundRepeat: "repeat",
                              }}
                            >
                              <Calendar className="w-3 h-3 mr-1" />
                              Book
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* Bottom engraved band */}
      <section
        className="py-8 relative overflow-hidden"
        style={{
          backgroundImage: `url(${papercut.textures.paperEarth})`,
          backgroundSize: "256px 256px",
          backgroundRepeat: "repeat",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(0,0,0,0.05) 100%)",
          }}
        />
        {/* Hexagon fragments in band */}
        <HexFragment x="5%" y="20%" size={20} color="#3C3C3C" delay={0} />
        <HexFragment x="25%" y="50%" size={16} color="#C4A882" delay={0.1} />
        <HexFragment x="75%" y="30%" size={22} color="#3C3C3C" delay={0.2} />
        <HexFragment x="90%" y="60%" size={14} color="#C4A882" delay={0.3} />

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <p className="text-white/70 text-sm">
            Every Pollinator is vetted, supported, and part of a living
            ecosystem of care.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
