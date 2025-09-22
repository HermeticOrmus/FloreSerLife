import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  TrendingUp
} from "lucide-react";
import { AccessLevelBadge, FeaturePreview, UpgradeModal, useAccessControl } from "@/components/access-control";
import { useAuth } from "@/hooks/useAuth";

type GardenContentType = "insight" | "resource" | "question" | "success_story" | "tool" | "meditation";

interface GardenContent {
  id: string;
  title: string;
  content: string;
  contentType: GardenContentType;
  authorId: string;
  authorName?: string;
  authorArchetype?: string;
  createdAt: string;
  seedsReward: number;
  isVerified: boolean;
  isPremium: boolean;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  tags: string[];
}

export default function Garden() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { accessInfo, checkPermission } = useAccessControl();
  const [selectedContentType, setSelectedContentType] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [newContent, setNewContent] = useState({
    title: "",
    content: "",
    contentType: "insight" as GardenContentType,
    tags: ""
  });

  const { data: gardenData, isLoading } = useQuery({
    queryKey: ["/api/garden/content"],
  });

  const gardenAccess = checkPermission("accessGarden");
  const uploadAccess = checkPermission("createContent");

  useEffect(() => {
    document.title = "Community Garden - FloreSer";
  }, []);

  // Mock garden content for demonstration
  const mockGardenContent: GardenContent[] = [
    {
      id: "1",
      title: "Finding Balance Through Bee Wisdom",
      content: "As a Bee archetype practitioner, I've learned that true healing comes from the steady, methodical approach of building community and creating safe spaces...",
      contentType: "insight",
      authorId: "user-1",
      authorName: "Facilitator #abc123",
      authorArchetype: "bee",
      createdAt: "2024-01-15T10:00:00Z",
      seedsReward: 25,
      isVerified: true,
      isPremium: false,
      likesCount: 24,
      commentsCount: 8,
      sharesCount: 5,
      viewsCount: 142,
      tags: ["grounding", "community", "bee-wisdom"]
    },
    {
      id: "2",
      title: "Hummingbird Healing: Quick Energy Shifts",
      content: "Three powerful techniques I use with clients to create instant energetic shifts...",
      contentType: "tool",
      authorId: "user-2",
      authorName: "Facilitator #def456",
      authorArchetype: "hummingbird",
      createdAt: "2024-01-14T15:30:00Z",
      seedsReward: 35,
      isVerified: true,
      isPremium: true,
      likesCount: 31,
      commentsCount: 12,
      sharesCount: 8,
      viewsCount: 203,
      tags: ["energy-healing", "techniques", "hummingbird"]
    },
    {
      id: "3",
      title: "Transformation Story: Butterfly Journey",
      content: "A client's incredible 6-month transformation journey through major life transitions...",
      contentType: "success_story",
      authorId: "user-3",
      authorName: "Facilitator #ghi789",
      authorArchetype: "butterfly",
      createdAt: "2024-01-13T09:15:00Z",
      seedsReward: 40,
      isVerified: true,
      isPremium: true,
      likesCount: 45,
      commentsCount: 18,
      sharesCount: 12,
      viewsCount: 287,
      tags: ["transformation", "success-story", "butterfly"]
    }
  ];

  const contentTypeOptions = [
    { value: "insight", label: "💡 Insight", description: "Share wisdom and observations" },
    { value: "resource", label: "📚 Resource", description: "Tools, books, articles" },
    { value: "question", label: "❓ Question", description: "Seek community guidance" },
    { value: "success_story", label: "🌟 Success Story", description: "Client transformation stories" },
    { value: "tool", label: "🛠️ Tool", description: "Practical techniques and methods" },
    { value: "meditation", label: "🧘 Meditation", description: "Guided practices and exercises" }
  ];

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

  const filteredContent = mockGardenContent.filter(content => {
    const matchesSearch = searchTerm === "" ||
      content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedContentType === "" || content.contentType === selectedContentType;

    return matchesSearch && matchesType;
  });

  const handleUpload = () => {
    if (!uploadAccess.allowed) {
      setShowUpgradeModal(true);
      return;
    }
    // Handle content upload logic
    console.log("Uploading content:", newContent);
    setShowUploadModal(false);
    setNewContent({ title: "", content: "", contentType: "insight", tags: "" });
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
          <p className="text-lg text-forest/70 max-w-4xl mx-auto mb-8">
            Share insights, discover resources, and grow together in our thriving community.
            Earn Seeds for valuable contributions and unlock premium content as you engage.
          </p>

          {/* Seeds Info & CTA */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
            <div className="flex items-center space-x-4 bg-white/50 rounded-full px-6 py-3">
              <Coins className="w-6 h-6 text-gold" />
              <div className="text-left">
                <div className="font-semibold text-forest">Seeds Balance</div>
                <div className="text-sm text-forest/60">
                  {isAuthenticated ? "156 Seeds" : "Sign in to view"}
                </div>
              </div>
            </div>

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
                    <p className="text-sm text-forest/60">156 / 100 Seeds to next tier</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Ready to Sprout!
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
              <SelectItem value="">All Content Types</SelectItem>
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((content) => {
              const isFacilitatorContent = content.authorArchetype;
              return (
              <Card key={content.id} className={`border-sage/20 hover:shadow-lg transition-all duration-300 overflow-hidden ${isFacilitatorContent ? 'ring-1 ring-gold/30' : ''}`}>
                {content.isPremium && (
                  <div className="bg-gradient-to-r from-gold to-yellow-500 text-white px-4 py-2 text-xs font-medium">
                    <Crown className="w-3 h-3 inline mr-1" />
                    Premium Content
                  </div>
                )}
                {isFacilitatorContent && !content.isPremium && (
                  <div className="bg-gradient-to-r from-gold/20 to-forest/20 text-forest px-4 py-2 text-xs font-medium">
                    <Award className="w-3 h-3 inline mr-1" />
                    Facilitator Wisdom
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {contentTypeOptions.find(opt => opt.value === content.contentType)?.label}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      {getSeedsIcon(content.seedsReward)}
                      <span className="text-xs font-medium text-forest">
                        {content.seedsReward} Seeds
                        {isFacilitatorContent && (
                          <span className="ml-1 text-gold">
                            (+{Math.floor(content.seedsReward * 0.5)} bonus)
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                  <CardTitle className="text-lg font-heading line-clamp-2">
                    {content.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-forest/70 text-sm mb-4 line-clamp-3">
                    {content.content}
                  </p>

                  <div className="flex items-center justify-between mb-3 text-xs text-forest/60">
                    <div className="flex items-center space-x-2">
                      <span>{getArchetypeIcon(content.authorArchetype || "")}</span>
                      <span>{content.authorName}</span>
                      {content.isVerified && (
                        <Badge className="bg-green-100 text-green-700 px-1 py-0 text-xs">
                          ✓ Verified
                        </Badge>
                      )}
                    </div>
                    <span>{new Date(content.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {content.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-forest/60 mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center">
                        <Heart className="w-3 h-3 mr-1" />
                        {content.likesCount}
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        {content.commentsCount}
                      </span>
                      <span className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {content.viewsCount}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <BookOpen className="w-3 h-3 mr-1" />
                      Read More
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Heart className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
            })}
          </div>
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
      </main>

      <Footer />
    </div>
  );
}