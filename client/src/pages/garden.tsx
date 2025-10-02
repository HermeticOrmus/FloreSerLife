import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
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
  Leaf,
  Heart,
  MessageCircle,
  Share2,
  Star,
  Plus,
  Lock,
  Crown,
  Award,
  Sparkles,
  TreePine,
  Upload,
  Eye,
  BookOpen,
  Coins,
  Zap,
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { AccessLevelBadge, FeaturePreview, UpgradeModal, useAccessControl } from "@/components/access-control";
import { GardenGuardian } from "@/components/garden-guardian";
import { useAuth } from "@/hooks/useAuth";

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

  const gardenAccess = checkPermission("accessGarden");
  const uploadAccess = checkPermission("createContent");

  useEffect(() => {
    document.title = "Community Garden - FloreSer";
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

  const getSeedsIcon = (amount: number) => {
    if (amount >= 40) return <TreePine className="w-4 h-4 text-green-600" />;
    if (amount >= 25) return <Leaf className="w-4 h-4 text-green-500" />;
    return <Sparkles className="w-4 h-4 text-yellow-500" />;
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
    // Record view interaction
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

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500/20 to-gold/20 text-forest rounded-full text-sm font-medium mb-6">
            <Leaf className="mr-2 h-5 w-5 text-green-600" />
            Community Garden
          </div>
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-forest mb-6">
            Cultivate <span className="text-green-600">Wisdom</span> Together
          </h1>
          <p className="text-lg text-forest/70 max-w-4xl mx-auto mb-6">
            A thriving community where facilitators share insights, seekers discover resources,
            and everyone grows together. Bee facilitators especially flourish here,
            sharing their foundational wisdom and learning from the community.
          </p>

          {/* Facilitator Welcome */}
          <div className="bg-gold/10 rounded-lg p-4 mb-8 border border-gold/20 max-w-3xl mx-auto">
            <p className="text-sm text-forest text-center">
              <span className="font-semibold">🐝 New facilitators welcome!</span> The Garden is perfect
              for sharing your learning journey, connecting with mentors, and contributing
              to the collective wisdom of our Bee community.
            </p>
          </div>

          {/* Seeds Info & CTA */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
            {isAuthenticated && seedsData && (
              <div className="flex items-center space-x-4 bg-white/50 rounded-full px-6 py-3">
                <Coins className="w-6 h-6 text-gold" />
                <div className="text-left">
                  <div className="font-semibold text-forest">{seedsData.seedsBalance} Seeds</div>
                  <div className="text-sm text-forest/60">
                    {seedsData.currentTier?.name || "🌱 Seedling Pollinator"}
                  </div>
                </div>
              </div>
            )}
            {!isAuthenticated && (
              <div className="flex items-center space-x-4 bg-white/50 rounded-full px-6 py-3">
                <Coins className="w-6 h-6 text-gold" />
                <div className="text-left">
                  <div className="font-semibold text-forest">Seeds Balance</div>
                  <div className="text-sm text-forest/60">Sign in to start growing</div>
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <Button
                className="bg-green-600 text-white hover:bg-green-700 rounded-full px-6"
                onClick={() => gardenAccess.allowed ? setShowUploadModal(true) : setShowUpgradeModal(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Share Content
              </Button>
              {!gardenAccess.allowed && (
                <Button
                  variant="outline"
                  className="border-gold text-gold hover:bg-gold hover:text-white rounded-full px-6"
                  onClick={() => setShowUpgradeModal(true)}
                >
                  <Crown className="mr-2 h-4 w-4" />
                  Unlock Garden
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Access Control Info */}
        {!gardenAccess.allowed && (
          <Alert className="border-gold/30 bg-gold/5 mb-6">
            <Lock className="h-4 w-4 text-gold" />
            <AlertDescription className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-forest">Community Garden Access Required</span>
                  <AccessLevelBadge accessLevel={accessInfo.accessLevel} />
                </div>
                <p className="text-sm text-forest/70">
                  Unlock full Garden access to share content, earn Seeds, and connect with our wellness community.
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

        {/* Seeds Tier Progress */}
        {isAuthenticated && (
          <Card className="mb-8 border-green-200 bg-gradient-to-r from-green-50 to-gold/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-600 rounded-full p-2">
                    <Leaf className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-forest">
                      🌱 Seedling Pollinator
                    </h3>
                    <p className="text-sm text-forest/60">Growing with each contribution</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Growing Strong
                </Badge>
              </div>
              <div className="w-full bg-green-100 rounded-full h-2 mb-3">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: "100%" }}></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center">
                  <Eye className="w-4 h-4 text-green-600 mr-2" />
                  <span>Basic Garden access</span>
                </div>
                <div className="flex items-center">
                  <Coins className="w-4 h-4 text-gold mr-2" />
                  <span>Earn Seeds for activity</span>
                </div>
                <div className="flex items-center text-forest/60">
                  <Upload className="w-4 h-4 mr-2" />
                  <span>Unlock: Content upload</span>
                </div>
                <div className="flex items-center text-forest/60">
                  <Star className="w-4 h-4 mr-2" />
                  <span>Unlock: Premium content</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Facilitator Benefits Section */}
        {user?.roles?.includes('practitioner') && (
          <Card className="mb-8 border-gold/30 bg-gradient-to-r from-gold/5 to-cream">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gold rounded-full p-2">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-forest">
                      Facilitator Benefits
                    </h3>
                    <p className="text-sm text-forest/60">Exclusive perks for verified practitioners</p>
                  </div>
                </div>
                <Badge className="bg-gold text-white">
                  <Award className="w-3 h-3 mr-1" />
                  Verified Facilitator
                </Badge>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white/50 rounded-lg p-4 text-center">
                  <Zap className="w-8 h-8 text-gold mx-auto mb-2" />
                  <h4 className="font-semibold text-forest mb-1">2x Seeds Multiplier</h4>
                  <p className="text-xs text-forest/60">Earn double Seeds for all Garden activities</p>
                </div>
                <div className="bg-white/50 rounded-lg p-4 text-center">
                  <Star className="w-8 h-8 text-gold mx-auto mb-2" />
                  <h4 className="font-semibold text-forest mb-1">Featured Placement</h4>
                  <p className="text-xs text-forest/60">Priority visibility for your content</p>
                </div>
                <div className="bg-white/50 rounded-lg p-4 text-center">
                  <Crown className="w-8 h-8 text-gold mx-auto mb-2" />
                  <h4 className="font-semibold text-forest mb-1">Premium Content</h4>
                  <p className="text-xs text-forest/60">Create exclusive premium content</p>
                </div>
              </div>

              <div className="bg-forest/5 rounded-lg p-4">
                <h4 className="font-semibold text-forest mb-2 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-gold" />
                  Monthly Facilitator Bonus
                </h4>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-forest/70">This month: +50 Seeds for active participation</p>
                    <p className="text-xs text-forest/60">Next bonus in 12 days</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-gold text-gold hover:bg-gold hover:text-white">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Input
            placeholder="Search content, tags, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:col-span-2"
          />

          <Select value={selectedContentType} onValueChange={setSelectedContentType}>
            <SelectTrigger>
              <SelectValue placeholder="All Content Types" />
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
              <TreePine className="w-12 h-12 text-green-600 animate-pulse mx-auto mb-4" />
              <p className="text-forest/60">Loading Garden content...</p>
            </div>
          ) : filteredContent.length === 0 ? (
            <div className="text-center py-12">
              <Leaf className="w-12 h-12 text-green-600/50 mx-auto mb-4" />
              <p className="text-forest/60">No content found. Be the first to share!</p>
              {uploadAccess.allowed && (
                <Button
                  className="mt-4 bg-green-600 text-white hover:bg-green-700"
                  onClick={() => setShowUploadModal(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Share Content
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContent.map((content: GardenContent) => {
                  const isFacilitatorContent = content.practitioner?.archetype;
                  const archetype = content.practitioner?.archetype;
                  return (
                    <Card key={content.id} className={`border-sage/20 hover:shadow-lg transition-all duration-300 overflow-hidden ${isFacilitatorContent ? 'ring-1 ring-gold/30' : ''}`}>
                      {content.isFeatured && (
                        <div className="bg-gradient-to-r from-gold to-yellow-500 text-white px-4 py-2 text-xs font-medium">
                          <Star className="w-3 h-3 inline mr-1" />
                          Featured Content
                        </div>
                      )}
                      {isFacilitatorContent && !content.isFeatured && (
                        <div className="bg-gradient-to-r from-gold/20 to-forest/20 text-forest px-4 py-2 text-xs font-medium">
                          <Award className="w-3 h-3 inline mr-1" />
                          Facilitator Wisdom
                        </div>
                      )}
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            {contentTypeOptions.find(opt => opt.value === content.contentType)?.label || content.contentType}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            {getSeedsIcon(content.seedsReward)}
                            <span className="text-xs font-medium text-forest">
                              {content.seedsReward} Seeds
                            </span>
                          </div>
                        </div>
                        <CardTitle className="text-lg font-heading line-clamp-2">
                          {content.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-forest/70 text-sm mb-4 line-clamp-3">
                          {content.description || content.content || "No description available"}
                        </p>

                        <div className="flex items-center justify-between mb-3 text-xs text-forest/60">
                          <div className="flex items-center space-x-2">
                            {archetype && <span>{getArchetypeIcon(archetype)}</span>}
                            <span>{getAuthorName(content)}</span>
                            {content.status === 'approved' && (
                              <Badge className="bg-green-100 text-green-700 px-1 py-0 text-xs">
                                ✓ Verified
                              </Badge>
                            )}
                          </div>
                          <span>{new Date(content.createdAt).toLocaleDateString()}</span>
                        </div>

                        {content.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {content.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-forest/60 mb-4">
                          <div className="flex items-center space-x-3">
                            <span className="flex items-center">
                              <Heart className="w-3 h-3 mr-1" />
                              {content.likeCount}
                            </span>
                            <span className="flex items-center">
                              <Eye className="w-3 h-3 mr-1" />
                              {content.viewCount}
                            </span>
                            {content.downloadCount > 0 && (
                              <span className="flex items-center">
                                <Upload className="w-3 h-3 mr-1" />
                                {content.downloadCount}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleViewContent(content)}
                          >
                            <BookOpen className="w-3 h-3 mr-1" />
                            Read More
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(content.id)}
                            disabled={likeMutation.isPending}
                          >
                            <Heart className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Pagination */}
              {gardenContent.length >= 20 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <span className="text-sm text-forest/60">Page {page}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => p + 1)}
                    disabled={filteredContent.length < 20}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          )}
        </FeaturePreview>

        {/* Upload Modal */}
        <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Leaf className="w-5 h-5 text-green-600 mr-2" />
                Share Content to the Garden
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-forest mb-2 block">Content Type</label>
                <Select value={newContent.contentType} onValueChange={(value) =>
                  setNewContent(prev => ({ ...prev, contentType: value as GardenContentType }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <div>
                          <div>{option.label}</div>
                          <div className="text-xs text-forest/60">{option.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-forest mb-2 block">Title</label>
                <Input
                  value={newContent.title}
                  onChange={(e) => setNewContent(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Give your content a compelling title..."
                />
              </div>

              <div>
                <label className="text-sm font-medium text-forest mb-2 block">Description</label>
                <Input
                  value={newContent.description}
                  onChange={(e) => setNewContent(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief summary of your content..."
                />
              </div>

              <div>
                <label className="text-sm font-medium text-forest mb-2 block">Content</label>
                <Textarea
                  value={newContent.content}
                  onChange={(e) => setNewContent(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Share your wisdom, insights, or resources..."
                  rows={6}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-forest mb-2 block">Tags</label>
                <Input
                  value={newContent.tags}
                  onChange={(e) => setNewContent(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="healing, transformation, bee-wisdom (comma separated)"
                />
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Coins className="w-4 h-4 text-gold mr-2" />
                  <span className="text-sm font-medium text-forest">Seeds Reward</span>
                </div>
                <p className="text-xs text-forest/70">
                  You'll earn 25 Seeds for this contribution, plus bonus Seeds based on community engagement!
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-green-600 text-white hover:bg-green-700"
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
                        <Badge variant="outline">
                          {contentTypeOptions.find(opt => opt.value === selectedContent.contentType)?.label || selectedContent.contentType}
                        </Badge>
                        {selectedContent.isFeatured && (
                          <Badge className="bg-gold text-white">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        {selectedContent.practitioner?.archetype && (
                          <Badge variant="outline">
                            {getArchetypeIcon(selectedContent.practitioner.archetype)} {selectedContent.practitioner.archetype}
                          </Badge>
                        )}
                      </div>
                      <DialogTitle className="text-2xl font-heading">
                        {selectedContent.title}
                      </DialogTitle>
                      <div className="flex items-center gap-4 mt-3 text-sm text-forest/60">
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
                          <Sparkles className="w-4 h-4 text-gold" />
                          <span className="text-gold font-medium">{selectedContent.seedsReward} Seeds</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogHeader>

                <ScrollArea className="max-h-[50vh] pr-4">
                  {selectedContent.description && (
                    <p className="text-lg text-forest/80 mb-4 font-medium">
                      {selectedContent.description}
                    </p>
                  )}

                  <div className="prose prose-forest max-w-none">
                    {selectedContent.content ? (
                      <p className="whitespace-pre-line text-forest/70">
                        {selectedContent.content}
                      </p>
                    ) : (
                      <p className="text-forest/50 italic">No detailed content available.</p>
                    )}
                  </div>

                  {selectedContent.tags.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-forest/60 mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedContent.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </ScrollArea>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-6 text-sm text-forest/60">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>{selectedContent.viewCount} views</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      <span>{selectedContent.likeCount} likes</span>
                    </div>
                    {selectedContent.downloadCount > 0 && (
                      <div className="flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        <span>{selectedContent.downloadCount} downloads</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleLike(selectedContent.id)}
                      disabled={likeMutation.isPending || !isAuthenticated}
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Like
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowDetailModal(false)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>

      <Footer />

      {/* Garden Guardian AI */}
      <GardenGuardian />
    </div>
  );
}