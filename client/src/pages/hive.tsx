import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  LayoutDashboard,
  User,
  Calendar,
  MessageCircle,
  CreditCard,
  BarChart3,
  TreePine,
  Settings,
  Star,
  MapPin,
  Video,
  Users,
  Hexagon,
  Crown,
  Award,
  BookOpen,
  Heart,
  TrendingUp,
  ArrowRight,
  Leaf
} from "lucide-react";
import { ArchetypeIcons } from "@/components/icons/archetype-icons";
import { ReviewsSummary } from "@/components/reviews";
import {
  archetypeDefinitions,
  professionalCategoryDefinitions,
} from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function Hive() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArchetype, setSelectedArchetype] = useState<string>("");
  const [selectedExperience, setSelectedExperience] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300]);
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
        credentials: 'include'
      });
      if (!res.ok) return [];
      return res.json();
    }
  });

  const { data: dashboardData } = useQuery<any>({
    queryKey: ["/api/dashboard/practitioner", user?.id],
    enabled: !!user?.id && user?.roles?.includes('practitioner'),
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/practitioner/${user?.id}`, {
        credentials: 'include'
      });
      if (!res.ok) return null;
      return res.json();
    }
  });

  const { data: seedsData } = useQuery<any>({
    queryKey: ["/api/seeds/wallet", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const res = await fetch(`/api/seeds/wallet/${user?.id}`, {
        credentials: 'include'
      });
      if (!res.ok) return null;
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

  const practitioners = Array.isArray(practitionersData)
    ? practitionersData
    : (practitionersData as any)?.practitioners || [];

  const favorites = Array.isArray(favoritesData) ? favoritesData.map((f: any) => f.practitionerId) : [];

  useEffect(() => {
    document.title = "My Hive - FloreSer";
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

    const matchesPrice = !practitioner.hourlyRate ||
      (parseFloat(practitioner.hourlyRate) >= priceRange[0] &&
       parseFloat(practitioner.hourlyRate) <= priceRange[1]);

    return matchesSearch && matchesArchetype && matchesExperience && matchesCategory && matchesPrice;
  });

  const sortedPractitioners = [...filteredPractitioners].sort((a: any, b: any) => {
    switch (sortBy) {
      case "featured":
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
      default:
        return 0;
    }
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

  const sidebarNavItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: User, label: "Soul Profile", href: "/profile" },
    { icon: Calendar, label: "Sessions", href: "/sessions" },
    { icon: MessageCircle, label: "Messages", href: "/messages" },
    { icon: CreditCard, label: "Payments", href: "/payments" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
    { icon: TreePine, label: "Community Garden", href: "/garden" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  const getTierName = (seedsBalance: number) => {
    if (seedsBalance >= 2000) return "Wise Garden";
    if (seedsBalance >= 500) return "Blooming";
    if (seedsBalance >= 100) return "Sprout";
    return "Seedling";
  };

  return (
    <div className="flex min-h-screen bg-hive-bg">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 bg-hive-card-light border-r border-hive-accent/20 p-6 flex flex-col"
      >
        <div className="mb-8">
          <h2 className="text-page-heading font-heading text-hive-text-primary">
            My Hive
          </h2>
        </div>

        <nav className="space-y-1 flex-1">
          {sidebarNavItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setLocation(item.href)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-button text-body text-hive-text-primary hover:bg-hive-bg transition-colors"
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* User Badge at Bottom */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-auto"
        >
          <Card className="bg-gradient-to-br from-hive-accent-light to-hive-accent border-0 shadow-card-sm">
            <CardContent className="p-4 text-center">
              <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Hexagon className="w-6 h-6 text-white" />
              </div>
              <p className="text-caption text-white/90 mb-1">You are an</p>
              <p className="text-label font-semibold text-white">
                {seedsData ? getTierName(seedsData.seedsBalance) : "Blooming"} Pollinator
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        <div className="max-w-6xl">
          {/* Top Stats Cards */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Calendar Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-hive-card-light border-0 rounded-card shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-hive-bg rounded-card-sm p-3">
                      <Calendar className="w-6 h-6 text-hive-accent" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-body-sm text-hive-text-secondary">Today at 3:00 PM</p>
                      <p className="text-card-heading font-heading text-hive-text-primary">
                        Client: Akiya
                      </p>
                      <button
                        className="text-body-sm text-hive-accent hover:text-hive-accent-light font-medium cursor-pointer"
                        onClick={() => setLocation('/sessions')}
                      >
                        Manage Sessions
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Earnings Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-hive-accent to-hive-accent-light border-0 rounded-card shadow-card-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-label text-hive-text-on-accent mb-2">
                        Earning this week
                      </p>
                      <p className="text-stat-xl font-heading text-hive-text-on-accent">
                        +{dashboardData?.earnings || 420}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-hive-accent-light hover:bg-white/20 text-hive-text-on-accent rounded-button text-label border-0"
                      onClick={() => setLocation('/payments')}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Analytics Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <Card className="bg-hive-card-dark text-white border-0 rounded-card-lg shadow-card-lg relative overflow-hidden">
              <CardContent className="p-8">
                <h3 className="text-card-heading-lg font-heading mb-8">
                  Your Blooming Metrics
                </h3>

                <div className="grid grid-cols-3 gap-8 mb-6">
                  <div className="space-y-2">
                    <p className="text-body-sm text-white/80">Sessions completed</p>
                    <p className="text-stat-lg font-heading">
                      {dashboardData?.sessionsCompleted || 18}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-body-sm text-white/80">Favorite clients</p>
                    <p className="text-stat-md font-heading">
                      {dashboardData?.favoriteClientsPercent || 67}%
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-body-sm text-white/80">Question seed bubbles planted</p>
                    <p className="text-stat-lg font-heading">
                      {dashboardData?.questionSeeds || 34}
                    </p>
                  </div>
                </div>

                <button
                  className="text-label text-white hover:text-white/80 font-medium flex items-center gap-2 cursor-pointer"
                  onClick={() => setLocation('/analytics')}
                >
                  View Full Analytics
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Decorative Leaf */}
                <div className="absolute bottom-4 right-8 opacity-20">
                  <Leaf className="w-32 h-32 text-white" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Archetype Overview */}
          <div className="mb-8">
            <h2 className="text-section-heading font-heading text-hive-text-primary mb-6">
              Pollinator Archetypes
            </h2>
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(archetypeDefinitions).map(([key, archetype], index) => (
                <motion.div
                  key={key}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Card className="bg-hive-card-light border-0 text-center rounded-card shadow-card-sm hover:shadow-card-hover transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="mb-3 flex justify-center">
                        {getArchetypeIcon(key)}
                      </div>
                      <h3 className="text-card-subheading font-heading text-hive-text-primary mb-1">
                        {archetype.name}
                      </h3>
                      <p className="text-caption text-hive-text-secondary">
                        {archetype.scientificName}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Facilitator Filters */}
          <div className="mb-6 space-y-4">
            <h2 className="text-section-heading font-heading text-hive-text-primary">
              Browse Facilitators
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <Input
                placeholder="Search facilitators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-hive-card-light border-hive-accent/20 rounded-input"
              />
              <Select value={selectedArchetype} onValueChange={setSelectedArchetype}>
                <SelectTrigger className="bg-hive-card-light border-hive-accent/20 rounded-input">
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
                <SelectTrigger className="bg-hive-card-light border-hive-accent/20 rounded-input">
                  <SelectValue placeholder="Experience Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="rising">Rising</SelectItem>
                  <SelectItem value="evolving">Evolving</SelectItem>
                  <SelectItem value="wise">Wise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Facilitators Grid */}
          {isLoading ? (
            <div className="grid grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="bg-hive-card-light border-0 rounded-card">
                  <div className="animate-pulse">
                    <div className="h-48 bg-hive-bg rounded-t-card"></div>
                    <CardContent className="p-6">
                      <div className="h-4 bg-hive-bg rounded mb-2"></div>
                      <div className="h-4 bg-hive-bg rounded w-3/4"></div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredPractitioners.length === 0 ? (
            <Card className="bg-hive-card-light border-0 rounded-card text-center py-12">
              <CardContent>
                <Users className="w-16 h-16 text-hive-text-secondary mx-auto mb-4" />
                <h3 className="text-card-heading font-heading text-hive-text-primary mb-2">
                  No facilitators found
                </h3>
                <p className="text-body-sm text-hive-text-secondary">
                  Try adjusting your search criteria
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {sortedPractitioners.slice(0, 6).map((practitioner: any, index: number) => (
                <motion.div
                  key={practitioner.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                >
                  <Card className="bg-hive-card-light border-0 rounded-card shadow-card hover:shadow-card-hover transition-all duration-300">
                    <div className="aspect-video bg-gradient-to-br from-hive-bg to-hive-accent/10 rounded-t-card flex items-center justify-center relative">
                      <User className="w-16 h-16 text-hive-text-secondary/30" />
                      <div className="absolute top-3 right-3">
                        <button
                          onClick={(e) => handleToggleFavorite(practitioner.id, e)}
                          className="bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              favorites.includes(practitioner.id)
                                ? "fill-red-500 text-red-500"
                                : "text-hive-text-secondary"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getArchetypeIcon(practitioner.archetype)}
                          {getExperienceBadge(practitioner.experienceLevel)}
                        </div>
                        <ReviewsSummary
                          averageRating={practitioner.averageRating ? parseFloat(practitioner.averageRating) : undefined}
                          totalReviews={practitioner.totalSessions || 0}
                          isVerified={practitioner.isVerified || false}
                          size="sm"
                        />
                      </div>

                      <h3 className="text-card-heading font-heading text-hive-text-primary mb-2">
                        Facilitator #{practitioner.id.slice(-6)}
                      </h3>

                      {practitioner.bio && (
                        <p className="text-body-sm text-hive-text-secondary mb-4 line-clamp-2">
                          {practitioner.bio}
                        </p>
                      )}

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 rounded-button text-label border-hive-accent/20"
                          onClick={() => setLocation(`/practitioners/${practitioner.id}`)}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-hive-accent text-white hover:bg-hive-accent-light rounded-button text-label"
                          onClick={() => setLocation(`/book/${practitioner.id}`)}
                        >
                          <Calendar className="w-3 h-3 mr-1" />
                          Book
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
