import { useEffect, useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { usePageMeta } from "@/hooks/usePageMeta";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Lock, Plus } from "lucide-react";
import { AccessLevelBadge, UpgradeModal, useAccessControl } from "@/components/access-control";
import { useAuth } from "@/hooks/useAuth";
import { papercut } from "@/assets";

import { GardenContent, GardenContentType, contentTypeOptions, SortOption } from "@/components/garden/types";
import GardenSidebar from "@/components/garden/GardenSidebar";
import GardenDashboard from "@/components/garden/GardenDashboard";
import SeedsBalance from "@/components/garden/SeedsBalance";
import ContentGrid from "@/components/garden/ContentGrid";
import UploadModal from "@/components/garden/UploadModal";
import ContentDetailModal from "@/components/garden/ContentDetailModal";
import BloomPathTimeline from "@/components/garden/BloomPathTimeline";
import MaiaMessage from "@/components/garden/MaiaMessage";

export default function Garden() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { accessInfo, checkPermission } = useAccessControl();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();

  // UI state
  const [selectedContentType, setSelectedContentType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("recent");
  const [page, setPage] = useState(1);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState<GardenContent | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [likedIds, setLikedIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem("garden-liked-ids");
      return stored ? new Set<string>(JSON.parse(stored) as string[]) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });

  // Queries
  const { data: gardenData, isLoading } = useQuery({
    queryKey: ["/api/garden/content", { page, contentType: selectedContentType }],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: "20",
        offset: String((page - 1) * 20),
        ...(selectedContentType && selectedContentType !== "all" && { contentType: selectedContentType }),
      });
      const res = await fetch(`/api/garden/content?${params}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
  });

  const { data: seedsData } = useQuery({
    queryKey: ["/api/seeds/wallet", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const res = await fetch(`/api/seeds/wallet/${user?.id}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
  });

  const { data: sessionsData } = useQuery({
    queryKey: ["/api/sessions", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const res = await fetch(`/api/sessions/${user?.id}/client`, {
        credentials: "include",
      });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const gardenAccess = checkPermission("accessGarden");
  const uploadAccess = checkPermission("createContent");

  usePageMeta(
    "Community Garden - FloreSer",
    "Explore wellness content, articles, and resources shared by the FloreSer community.",
    "/garden"
  );

  // Fix: extract content array from API response object
  const gardenContent: GardenContent[] = useMemo(() => {
    if (Array.isArray(gardenData?.content)) return gardenData.content;
    if (Array.isArray(gardenData)) return gardenData;
    return [];
  }, [gardenData]);

  // Filter and sort content
  const filteredContent = useMemo(() => {
    let results = gardenContent.filter((content) => {
      if (searchTerm === "") return true;
      const term = searchTerm.toLowerCase();
      return (
        content.title.toLowerCase().includes(term) ||
        (content.description && content.description.toLowerCase().includes(term)) ||
        (content.content && content.content.toLowerCase().includes(term)) ||
        content.tags.some((tag) => tag.toLowerCase().includes(term))
      );
    });

    // Sort
    switch (sortOption) {
      case "liked":
        results = [...results].sort((a, b) => b.likeCount - a.likeCount);
        break;
      case "viewed":
        results = [...results].sort((a, b) => b.viewCount - a.viewCount);
        break;
      case "recent":
      default:
        results = [...results].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    return results;
  }, [gardenContent, searchTerm, sortOption]);

  // Mutations
  const uploadMutation = useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      content: string;
      contentType: GardenContentType;
      tags: string;
      fileUrl: string;
    }) => {
      const body: Record<string, unknown> = {
        title: data.title,
        description: data.description,
        content: data.content,
        contentType: data.contentType,
        tags: data.tags.split(",").map((t) => t.trim()).filter(Boolean),
      };
      if (data.fileUrl) {
        body.fileUrl = data.fileUrl;
      }
      const res = await fetch("/api/garden/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to upload content");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/garden/content"] });
      queryClient.invalidateQueries({ queryKey: ["/api/seeds/wallet"] });
      const isFacilitator = user?.roles?.includes("practitioner");
      const seedsEarned = isFacilitator ? 50 : 25;
      toast({
        title: "Content shared!",
        description: `You earned ${seedsEarned} Seeds for sharing to the Garden.`,
      });
      setShowUploadModal(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const likeMutation = useMutation({
    mutationFn: async (contentId: string) => {
      const res = await fetch(`/api/garden/content/${contentId}/like`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: (_data, contentId) => {
      queryClient.invalidateQueries({ queryKey: ["/api/garden/content"] });
      // Track liked state
      setLikedIds((prev) => {
        const next = new Set<string>(Array.from(prev));
        next.add(contentId);
        localStorage.setItem("garden-liked-ids", JSON.stringify(Array.from(next)));
        return next;
      });
    },
  });

  // Handlers
  const handleUpload = (data: Parameters<typeof uploadMutation.mutate>[0]) => {
    if (!uploadAccess.allowed) {
      setShowUpgradeModal(true);
      return;
    }
    uploadMutation.mutate(data);
  };

  const handleLike = (contentId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like content",
        variant: "destructive",
      });
      return;
    }
    if (likedIds.has(contentId)) return;
    likeMutation.mutate(contentId);
  };

  const handleViewContent = (content: GardenContent) => {
    setSelectedContent(content);
    setShowDetailModal(true);
    if (isAuthenticated) {
      fetch("/api/garden/interaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          contentId: content.id,
          interactionType: "view",
        }),
      });
    }
  };

  // Derived state
  const nextSession =
    sessionsData && sessionsData.length > 0 ? sessionsData[0] : null;

  // Contextual Maia message type
  const maiaType = useMemo(() => {
    const sessionCount = sessionsData?.length || 0;
    const visitCount = parseInt(localStorage.getItem("garden-visit-count") || "0", 10);
    if (sessionCount === 0 && visitCount <= 1) return "welcome" as const;
    if (sessionCount >= 7) return "milestone" as const;
    if (sessionCount >= 3) return "reflection" as const;
    return "encouragement" as const;
  }, [sessionsData]);

  // Track visits
  useEffect(() => {
    const count = parseInt(localStorage.getItem("garden-visit-count") || "0", 10);
    localStorage.setItem("garden-visit-count", String(count + 1));
  }, []);

  return (
    <div
      className="flex min-h-screen"
      style={{
        backgroundImage: `url(${papercut.textures.paperUI})`,
        backgroundSize: "256px 256px",
        backgroundRepeat: "repeat",
      }}
    >
      {/* Sidebar */}
      <GardenSidebar
        seedsData={seedsData}
        onNavigate={setLocation}
        isMobile={isMobile}
        mobileOpen={sidebarOpen}
        onMobileOpenChange={setSidebarOpen}
      />

      {/* Main Content */}
      <main className="flex-1 bg-garden-container p-4 md:p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Dashboard: session, mandala, actions */}
          <GardenDashboard
            nextSession={nextSession}
            seedsData={seedsData}
            sessionsData={sessionsData}
            gardenContentCount={gardenContent.length}
            onNavigate={setLocation}
          />

          {/* Seeds Balance */}
          {isAuthenticated && seedsData && (
            <SeedsBalance seedsData={seedsData} />
          )}

          {/* Divider */}
          <div className="mb-8">
            <img
              src={papercut.dividers.wavyHorizonTransparent}
              alt=""
              className="w-full h-auto opacity-40"
            />
          </div>

          {/* Maia Welcome Message */}
          {isAuthenticated && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <MaiaMessage
                type={maiaType}
                context={{
                  sessionsCompleted: sessionsData?.length || 0,
                  currentMilestone:
                    sessionsData?.length >= 7
                      ? "Flourishing Path"
                      : sessionsData?.length >= 3
                        ? "Rising Flower"
                        : undefined,
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
              className="mb-8 md:mb-12"
            >
              <BloomPathTimeline
                sessions={sessionsData.map((session: any) => ({
                  id: session.id,
                  date: session.sessionDate || session.createdAt,
                  facilitatorName: session.practitionerName,
                  practitionerName: session.practitionerName,
                  theme: session.sessionType || "Wellness Session",
                  notes: session.notes,
                  reflection: session.clientReflection,
                }))}
                pollinationPoints={sessionsData.length * 10}
              />
            </motion.div>
          )}

          {/* Content Section */}
          <div className="space-y-6 md:space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-section-heading font-heading text-garden-text-primary">
                  Community Garden
                </h2>
                <p className="text-body text-garden-text-secondary max-w-xl">
                  A place to share your gifts freely with the community. Offer
                  articles, meditations, exercises, and wisdom to help others
                  flourish on their journey.
                </p>
              </div>
              <Button
                className="bg-garden-accent text-white hover:bg-garden-accent/90 rounded-button text-label whitespace-nowrap"
                onClick={() =>
                  gardenAccess.allowed
                    ? setShowUploadModal(true)
                    : setShowUpgradeModal(true)
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Share Your Gift
              </Button>
            </div>

            {/* Filters + Sort */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-garden-card border-garden-accent/20 rounded-input"
              />
              <Select value={selectedContentType} onValueChange={setSelectedContentType}>
                <SelectTrigger className="w-full sm:w-48 bg-garden-card border-garden-accent/20 rounded-input">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Content Types</SelectItem>
                  {contentTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortOption} onValueChange={(v) => setSortOption(v as SortOption)}>
                <SelectTrigger className="w-full sm:w-44 bg-garden-card border-garden-accent/20 rounded-input">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="liked">Most Liked</SelectItem>
                  <SelectItem value="viewed">Most Viewed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Access Control Alert */}
            {!gardenAccess.allowed && (
              <Alert className="border-garden-accent/30 bg-garden-accent/5">
                <Lock className="h-4 w-4 text-garden-accent" />
                <AlertDescription className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-garden-text-primary">
                        Community Garden Access Required
                      </span>
                      <AccessLevelBadge accessLevel={accessInfo.accessLevel} />
                    </div>
                    <p className="text-sm text-garden-text-secondary">
                      Unlock full Garden access to share content, earn Seeds,
                      and connect with our wellness community.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-garden-accent text-white hover:bg-garden-accent/90 rounded-button whitespace-nowrap"
                    onClick={() => setShowUpgradeModal(true)}
                  >
                    Upgrade Access
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Content Grid */}
            <ContentGrid
              content={filteredContent}
              isLoading={isLoading}
              gardenAccess={gardenAccess}
              accessInfo={accessInfo}
              uploadAccess={uploadAccess}
              likedIds={likedIds}
              likePending={likeMutation.isPending}
              onView={handleViewContent}
              onLike={handleLike}
              onUpload={() => setShowUploadModal(true)}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      <UploadModal
        open={showUploadModal}
        onOpenChange={setShowUploadModal}
        onUpload={handleUpload}
        isPending={uploadMutation.isPending}
      />

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentLevel={accessInfo.accessLevel}
        feature="Community Garden access"
      />

      <ContentDetailModal
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
        content={selectedContent}
        onLike={handleLike}
        isLiked={selectedContent ? likedIds.has(selectedContent.id) : false}
        likePending={likeMutation.isPending}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
}
