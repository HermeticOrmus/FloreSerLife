import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  Home,
  Calendar,
  BookOpen,
  Heart,
  BookMarked,
  Settings,
  Leaf,
  MessageCircle,
  Star,
  Plus,
  Lock,
  Crown,
  Award,
  Sparkles,
  TreePine,
  Upload,
  Eye,
  Coins,
  TrendingUp,
  ArrowRight,
  Flower2,
  Target
} from "lucide-react";
import { AccessLevelBadge, FeaturePreview, UpgradeModal, useAccessControl } from "@/components/access-control";
import { GardenGuardian } from "@/components/garden-guardian";
import { useAuth } from "@/hooks/useAuth";
import GrowthMandala from "@/components/garden/GrowthMandala";
import BloomPathTimeline from "@/components/garden/BloomPathTimeline";
import MaiaMessage from "@/components/garden/MaiaMessage";

type GardenContentType = "article" | "video" | "audio" | "exercise" | "meditation";

interface GardenContent {
  id: string;
  title: string;
  description?: string;
  content?: string;
  contentType: string;
  authorId: string;
  author?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  practitioner?: {
    archetype: string;
    experienceLevel: string;
  };
  createdAt: string;
  seedsReward: number;
  status: string;
  isFeatured: boolean;
  viewCount: number;
  likeCount: number;
  downloadCount: number;
  tags: string[];
}

export default function Garden() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { accessInfo, checkPermission } = useAccessControl();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedContentType, setSelectedContentType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState<GardenContent | null>(null);
  const [newContent, setNewContent] = useState({
    title: "",
    description: "",
    content: "",
    contentType: "article" as GardenContentType,
    tags: ""
  });

  const { data: gardenData, isLoading } = useQuery({
    queryKey: ["/api/garden/content", { page, contentType: selectedContentType }],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: "20",
        offset: String((page - 1) * 20),
        ...(selectedContentType && selectedContentType !== "all" && { contentType: selectedContentType })
      });
      const res = await fetch(`/api/garden/content?${params}`, {
        credentials: 'include'
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    }
  });

  const { data: seedsData } = useQuery({
    queryKey: ["/api/seeds/wallet", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const res = await fetch(`/api/seeds/wallet/${user?.id}`, {
        credentials: 'include'
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    }
  });

  const { data: sessionsData } = useQuery({
    queryKey: ["/api/sessions", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const res = await fetch(`/api/sessions/${user?.id}/client`, {
        credentials: 'include'
      });
      if (!res.ok) return [];
      return res.json();
    }
  });

  const gardenAccess = checkPermission("accessGarden");
  const uploadAccess = checkPermission("createContent");

  useEffect(() => {
    document.title = "My Garden - FloreSer";
  }, []);

  // Mutations
  const uploadMutation = useMutation({
    mutationFn: async (data: typeof newContent) => {
      const res = await fetch('/api/garden/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...data,
          tags: data.tags.split(',').map(t => t.trim()).filter(Boolean)
        })
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to upload content');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/garden/content"] });
      queryClient.invalidateQueries({ queryKey: ["/api/seeds/wallet"] });
      const isFacilitator = user?.roles?.includes('practitioner');
      const seedsEarned = isFacilitator ? 50 : 25;
      toast({
        title: "Content shared!",
        description: `You earned ${seedsEarned} Seeds for sharing to the Garden.`
      });
      setShowUploadModal(false);
      setNewContent({ title: "", description: "", content: "", contentType: "article", tags: "" });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const likeMutation = useMutation({
    mutationFn: async (contentId: string) => {
      const res = await fetch(`/api/garden/content/${contentId}/like`, {
        method: 'POST',
        credentials: 'include'
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/garden/content"] });
      toast({ title: "Content liked!" });
    }
  });

  const contentTypeOptions = [
    { value: "article", label: "📝 Article", description: "Written wisdom and insights" },
    { value: "video", label: "🎥 Video", description: "Video tutorials and demonstrations" },
    { value: "audio", label: "🎧 Audio", description: "Podcasts and audio guides" },
    { value: "exercise", label: "🏃 Exercise", description: "Practical exercises and techniques" },
    { value: "meditation", label: "🧘 Meditation", description: "Guided meditations and practices" }
  ];

  const gardenContent = Array.isArray(gardenData) ? gardenData : [];

  const getArchetypeIcon = (archetype: string) => {
    const icons = {
      bee: "🐝",
      hummingbird: "🦜",
      butterfly: "🦋",
      beetle: "🪲"
    };
    return icons[archetype as keyof typeof icons] || "🌟";
  };

  const filteredContent = gardenContent.filter((content: GardenContent) => {
    const matchesSearch = searchTerm === "" ||
      content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (content.description && content.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (content.content && content.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
      content.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearch;
  });

  const handleUpload = () => {
    if (!uploadAccess.allowed) {
      setShowUpgradeModal(true);
      return;
    }
    uploadMutation.mutate(newContent);
  };

  const handleLike = (contentId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like content",
        variant: "destructive"
      });
      return;
    }
    likeMutation.mutate(contentId);
  };

  const handleViewContent = (content: GardenContent) => {
    setSelectedContent(content);
    setShowDetailModal(true);
    if (isAuthenticated) {
      fetch('/api/garden/interaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          contentId: content.id,
          interactionType: 'view'
        })
      });
    }
  };

  const getAuthorName = (content: GardenContent) => {
    if (content.author?.firstName && content.author?.lastName) {
      return `${content.author.firstName} ${content.author.lastName}`;
    }
    return "Anonymous Facilitator";
  };

  const sidebarNavItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Calendar, label: "Book Session", href: "/practitioners" },
    { icon: BookOpen, label: "My Sessions", href: "/sessions" },
    { icon: Heart, label: "Favorites", href: "/favorites" },
    { icon: BookMarked, label: "Journal", href: "/journal" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  const nextSession = sessionsData && sessionsData.length > 0 ? sessionsData[0] : null;

  const getTierName = (seedsBalance: number) => {
    if (seedsBalance >= 2000) return "Wise Garden";
    if (seedsBalance >= 500) return "Blooming";
    if (seedsBalance >= 100) return "Sprout";
    return "Seedling";
  };

  return (
    <div className="flex min-h-screen bg-garden-bg">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 bg-garden-sidebar border-r border-garden-accent/20 p-6 flex flex-col"
      >
        <div className="mb-8">
          <h2 className="text-page-heading font-heading text-garden-text-on-sage">
            My Garden
          </h2>
        </div>

        <nav className="space-y-1 flex-1">
          {sidebarNavItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setLocation(item.href)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-button text-body text-garden-text-on-sage hover:bg-white/10 transition-colors"
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Reflections Card at Bottom */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-auto"
        >
          <Card className="bg-garden-container border-0 shadow-card-sm rounded-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="text-2xl">🐝</div>
                <div>
                  <p className="text-card-subheading font-heading text-garden-text-primary">
                    Reflections from Maia
                  </p>
                </div>
              </div>
              <p className="text-body-sm text-garden-text-secondary">
                You are a {seedsData ? getTierName(seedsData.seedsBalance) : "Blooming"} Seeker
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 bg-garden-container p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Top Section - Session and Growth */}
          <div className="grid grid-cols-3 gap-8 mb-12">
            {/* Left: Session Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="space-y-6">
                <h2 className="text-section-heading font-heading text-garden-text-primary">
                  Your Session
                </h2>
                <Card className="bg-garden-card border-0 rounded-card-lg shadow-card">
                  <CardHeader>
                    <CardTitle className="text-card-subheading font-heading text-garden-text-primary">
                      Your Next Session
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-card-heading font-heading text-garden-text-primary">
                        {nextSession?.practitionerName || "Angelica"}
                      </h3>
                      <p className="text-body-sm text-garden-text-secondary">
                        Apr 26 1st, 10:00 AM
                      </p>
                    </div>
                    <Button className="w-full bg-garden-accent hover:bg-garden-accent/90 rounded-button text-label">
                      Enter Session
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Center: Growth Tracker */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center justify-center"
            >
              {/* 6-Petal Growth Mandala */}
              <div className="mb-6">
                <GrowthMandala
                  progress={{
                    body: 65,
                    emotion: 45,
                    mind: 80,
                    spirit: 50,
                    creativity: 30,
                    connection: 70
                  }}
                />
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 mb-4">
                <div className="text-center">
                  <p className="text-stat-lg font-heading text-garden-text-primary">
                    {seedsData?.totalEarned || 8}
                  </p>
                  <p className="text-caption text-garden-text-secondary">Growth Path</p>
                </div>
                <div className="text-center">
                  <p className="text-stat-lg font-heading text-garden-text-primary">
                    {sessionsData?.length || 3}
                  </p>
                  <p className="text-caption text-garden-text-secondary">Signposts Earned</p>
                </div>
              </div>

              <div className="text-center space-y-1">
                <p className="text-label text-garden-text-secondary uppercase tracking-wide">
                  DISTORTIONS
                </p>
                <p className="text-body-sm text-garden-text-primary">Completed</p>
              </div>
            </motion.div>

            {/* Right: Action Cards */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <Card className="bg-garden-card border-0 rounded-card shadow-card hover:shadow-card-hover transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-card-heading font-heading text-garden-text-primary">
                      Track My Growth
                    </h3>
                    <Target className="w-5 h-5 text-garden-accent" />
                  </div>
                  <p className="text-body-sm text-garden-text-secondary mb-4">
                    Explore the Hive and discover a new guide for your journey.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full rounded-button text-label border-garden-accent/30 hover:bg-garden-accent hover:text-white"
                  >
                    Browse Pollinators
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-garden-accent-light border-0 rounded-card shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-garden-accent" />
                      <h3 className="text-card-heading font-heading text-garden-text-primary">
                        My Favorites
                      </h3>
                    </div>
                    <ArrowRight className="w-5 h-5 text-garden-accent" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-garden-card border-0 rounded-card shadow-card">
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-card-heading font-heading text-garden-text-primary">
                    Reflections from Maia
                  </h3>
                  <p className="text-body-sm text-garden-text-secondary">
                    Turning your inner garden asks for patience, presence, and care.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full rounded-button text-label border-garden-accent/30"
                    onClick={() => setLocation("/garden")}
                  >
                    View Timeline
                  </Button>
                </CardContent>
              </Card>

              {/* Character Placeholder */}
              <div className="flex justify-center">
                <div className="text-6xl">🦜</div>
              </div>
            </motion.div>
          </div>

          {/* Seeds Balance */}
          {isAuthenticated && seedsData && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <Card className="bg-gradient-to-r from-garden-accent-light to-garden-accent/20 border-0 rounded-card shadow-card-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-garden-accent rounded-full p-3">
                        <Coins className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-stat-md font-heading text-garden-text-primary">
                          {seedsData.seedsBalance}
                        </p>
                        <p className="text-body-sm text-garden-text-secondary">Seeds Balance</p>
                      </div>
                    </div>
                    <Badge className="bg-garden-accent text-white text-label px-4 py-2 rounded-badge">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {getTierName(seedsData.seedsBalance)} Pollinator
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Maia Welcome Message */}
          {isAuthenticated && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <MaiaMessage
                type={sessionsData && sessionsData.length > 0 ? "encouragement" : "welcome"}
                context={{
                  sessionsCompleted: sessionsData?.length || 0,
                  currentMilestone: sessionsData?.length >= 3 ? "Rising Flower" : undefined
                }}
              />
            </motion.div>
          )}

          {/* Bloom Path Timeline */}
          {isAuthenticated && sessionsData && sessionsData.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-12"
            >
              <BloomPathTimeline
                sessions={sessionsData.map((session: any) => ({
                  id: session.id,
                  date: session.sessionDate || session.createdAt,
                  facilitatorName: session.practitionerName,
                  practitionerName: session.practitionerName,
                  theme: session.sessionType || "Wellness Session",
                  notes: session.notes,
                  reflection: session.clientReflection
                }))}
                pollinationPoints={sessionsData.length * 10}
              />
            </motion.div>
          )}

          {/* Content Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-section-heading font-heading text-garden-text-primary">
                Community Garden Content
              </h2>
              <Button
                className="bg-garden-accent text-white hover:bg-garden-accent/90 rounded-button text-label"
                onClick={() => gardenAccess.allowed ? setShowUploadModal(true) : setShowUpgradeModal(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Share Content
              </Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-3 gap-4">
              <Input
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="col-span-2 bg-garden-card border-garden-accent/20 rounded-input"
              />
              <Select value={selectedContentType} onValueChange={setSelectedContentType}>
                <SelectTrigger className="bg-garden-card border-garden-accent/20 rounded-input">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Content Types</SelectItem>
                  {contentTypeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Access Control */}
            {!gardenAccess.allowed && (
              <Alert className="border-garden-accent/30 bg-garden-accent/5">
                <Lock className="h-4 w-4 text-garden-accent" />
                <AlertDescription className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-garden-text-primary">Community Garden Access Required</span>
                      <AccessLevelBadge accessLevel={accessInfo.accessLevel} />
                    </div>
                    <p className="text-sm text-garden-text-secondary">
                      Unlock full Garden access to share content, earn Seeds, and connect with our wellness community.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-garden-accent text-white hover:bg-garden-accent/90 rounded-button"
                    onClick={() => setShowUpgradeModal(true)}
                  >
                    Upgrade Access
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Content Grid */}
            <FeaturePreview
              isAllowed={gardenAccess.allowed}
              message="Upgrade to access our thriving Community Garden"
              currentLevel={accessInfo.accessLevel}
              requiredLevel="basic"
              feature="Community Garden access"
            >
              {isLoading ? (
                <div className="text-center py-12">
                  <TreePine className="w-12 h-12 text-garden-accent animate-pulse mx-auto mb-4" />
                  <p className="text-garden-text-secondary">Loading Garden content...</p>
                </div>
              ) : filteredContent.length === 0 ? (
                <div className="text-center py-12">
                  <Leaf className="w-12 h-12 text-garden-accent/50 mx-auto mb-4" />
                  <p className="text-garden-text-secondary">No content found. Be the first to share!</p>
                  {uploadAccess.allowed && (
                    <Button
                      className="mt-4 bg-garden-accent text-white hover:bg-garden-accent/90 rounded-button"
                      onClick={() => setShowUploadModal(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Share Content
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredContent.map((content: GardenContent, index: number) => (
                    <motion.div
                      key={content.id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                    >
                      <Card className="bg-garden-card border-0 rounded-card shadow-card hover:shadow-card-hover transition-all duration-300">
                        {content.isFeatured && (
                          <div className="bg-gradient-to-r from-garden-accent to-garden-accent-light text-white px-4 py-2 text-xs font-medium rounded-t-card">
                            <Star className="w-3 h-3 inline mr-1" />
                            Featured Content
                          </div>
                        )}
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant="outline" className="text-xs border-garden-accent/30">
                              {contentTypeOptions.find(opt => opt.value === content.contentType)?.label || content.contentType}
                            </Badge>
                            <div className="flex items-center space-x-1">
                              <Leaf className="w-3 h-3 text-garden-accent" />
                              <span className="text-xs font-medium text-garden-text-primary">
                                {content.seedsReward} Seeds
                              </span>
                            </div>
                          </div>
                          <CardTitle className="text-card-heading font-heading text-garden-text-primary line-clamp-2">
                            {content.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-4">
                          <p className="text-body-sm text-garden-text-secondary line-clamp-3">
                            {content.description || content.content || "No description available"}
                          </p>

                          <div className="flex items-center justify-between text-xs text-garden-text-secondary">
                            <div className="flex items-center gap-2">
                              {content.practitioner?.archetype && (
                                <span>{getArchetypeIcon(content.practitioner.archetype)}</span>
                              )}
                              <span className="line-clamp-1">{getAuthorName(content)}</span>
                            </div>
                          </div>

                          {content.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {content.tags.slice(0, 3).map((tag, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs border-garden-accent/20">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between text-xs text-garden-text-secondary">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                {content.likeCount}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {content.viewCount}
                              </span>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 rounded-button text-label border-garden-accent/20"
                              onClick={() => handleViewContent(content)}
                            >
                              <BookOpen className="w-3 h-3 mr-1" />
                              Read
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-button"
                              onClick={() => handleLike(content.id)}
                              disabled={likeMutation.isPending}
                            >
                              <Heart className="w-3 h-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </FeaturePreview>
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center text-garden-text-primary">
              <Leaf className="w-5 h-5 text-garden-accent mr-2" />
              Share Content to the Garden
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-garden-text-primary mb-2 block">Content Type</label>
              <Select value={newContent.contentType} onValueChange={(value) =>
                setNewContent(prev => ({ ...prev, contentType: value as GardenContentType }))
              }>
                <SelectTrigger className="bg-garden-card border-garden-accent/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {contentTypeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div>{option.label}</div>
                        <div className="text-xs text-garden-text-secondary">{option.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-garden-text-primary mb-2 block">Title</label>
              <Input
                value={newContent.title}
                onChange={(e) => setNewContent(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Give your content a compelling title..."
                className="bg-garden-card border-garden-accent/20"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-garden-text-primary mb-2 block">Description</label>
              <Input
                value={newContent.description}
                onChange={(e) => setNewContent(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief summary of your content..."
                className="bg-garden-card border-garden-accent/20"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-garden-text-primary mb-2 block">Content</label>
              <Textarea
                value={newContent.content}
                onChange={(e) => setNewContent(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Share your wisdom, insights, or resources..."
                rows={6}
                className="bg-garden-card border-garden-accent/20"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-garden-text-primary mb-2 block">Tags</label>
              <Input
                value={newContent.tags}
                onChange={(e) => setNewContent(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="healing, transformation, wisdom (comma separated)"
                className="bg-garden-card border-garden-accent/20"
              />
            </div>

            <div className="bg-garden-accent-light rounded-card p-4">
              <div className="flex items-center mb-2">
                <Coins className="w-4 h-4 text-garden-accent mr-2" />
                <span className="text-sm font-medium text-garden-text-primary">Seeds Reward</span>
              </div>
              <p className="text-xs text-garden-text-secondary">
                You'll earn 25 Seeds for this contribution, plus bonus Seeds based on community engagement!
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowUploadModal(false)} className="rounded-button">
                Cancel
              </Button>
              <Button
                className="bg-garden-accent text-white hover:bg-garden-accent/90 rounded-button"
                onClick={handleUpload}
                disabled={!newContent.title || !newContent.content}
              >
                <Upload className="w-4 h-4 mr-2" />
                Share to Garden
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentLevel={accessInfo.accessLevel}
        feature="Community Garden access"
      />

      {/* Content Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          {selectedContent && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="border-garden-accent/30">
                        {contentTypeOptions.find(opt => opt.value === selectedContent.contentType)?.label || selectedContent.contentType}
                      </Badge>
                      {selectedContent.isFeatured && (
                        <Badge className="bg-garden-accent text-white">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <DialogTitle className="text-2xl font-heading text-garden-text-primary">
                      {selectedContent.title}
                    </DialogTitle>
                    <div className="flex items-center gap-4 mt-3 text-sm text-garden-text-secondary">
                      <div className="flex items-center gap-2">
                        {selectedContent.practitioner?.archetype && (
                          <span>{getArchetypeIcon(selectedContent.practitioner.archetype)}</span>
                        )}
                        <span>{getAuthorName(selectedContent)}</span>
                      </div>
                      <span>•</span>
                      <span>{new Date(selectedContent.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-4 h-4 text-garden-accent" />
                        <span className="text-garden-accent font-medium">{selectedContent.seedsReward} Seeds</span>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <ScrollArea className="max-h-[50vh] pr-4">
                {selectedContent.description && (
                  <p className="text-lg text-garden-text-primary mb-4 font-medium">
                    {selectedContent.description}
                  </p>
                )}

                <div className="prose prose-garden max-w-none">
                  {selectedContent.content ? (
                    <p className="whitespace-pre-line text-garden-text-secondary">
                      {selectedContent.content}
                    </p>
                  ) : (
                    <p className="text-garden-text-secondary italic">No detailed content available.</p>
                  )}
                </div>

                {selectedContent.tags.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-garden-text-secondary mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedContent.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="border-garden-accent/20">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </ScrollArea>

              <div className="flex items-center justify-between pt-4 border-t border-garden-accent/20">
                <div className="flex items-center gap-6 text-sm text-garden-text-secondary">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{selectedContent.viewCount} views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    <span>{selectedContent.likeCount} likes</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleLike(selectedContent.id)}
                    disabled={likeMutation.isPending || !isAuthenticated}
                    className="rounded-button border-garden-accent/20"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Like
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowDetailModal(false)}
                    className="rounded-button border-garden-accent/20"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Garden Guardian AI */}
      <GardenGuardian />
    </div>
  );
}
