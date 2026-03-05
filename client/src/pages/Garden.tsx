import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Lock, Plus } from "lucide-react";
import { AccessLevelBadge, UpgradeModal, useAccessControl } from "@/components/access-control";
import { useAuth } from "@/hooks/useAuth";

import { GardenContent, GardenContentType, contentTypeOptions, SortOption } from "@/components/garden/types";
import GardenSidebar from "@/components/garden/GardenSidebar";
import ContentGrid from "@/components/garden/ContentGrid";
import UploadModal from "@/components/garden/UploadModal";
import ContentDetailModal from "@/components/garden/ContentDetailModal";

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

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <GardenSidebar
        seedsData={seedsData}
        onNavigate={setLocation}
        isMobile={isMobile}
        mobileOpen={sidebarOpen}
        onMobileOpenChange={setSidebarOpen}
      />

      {/* Main Content */}
      <main className="flex-1 origami-paper-garden p-4 md:p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Origami header */}
          <div className="mb-8">
            <h1 className="font-heading text-2xl md:text-3xl text-forest tracking-tight">
              Community Garden
            </h1>
            <p className="text-base text-forest/50 mt-2 max-w-xl">
              Share your gifts freely. Offer articles, meditations, exercises, and wisdom to help others flourish.
            </p>
          </div>

          <div className="origami-crease-garden mb-8" />

          {/* Content Section */}
          <div className="space-y-6 md:space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <Button
                className="bg-forest text-white hover:bg-forest/90 rounded-button text-label whitespace-nowrap"
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
                className="flex-1 bg-white border-forest/10 rounded-input"
              />
              <Select value={selectedContentType} onValueChange={setSelectedContentType}>
                <SelectTrigger className="w-full sm:w-48 bg-white border-forest/10 rounded-input">
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
                <SelectTrigger className="w-full sm:w-44 bg-white border-forest/10 rounded-input">
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
              <div className="border border-forest/8 rounded-lg origami-paper origami-emboss p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Lock className="h-4 w-4 text-forest/30 mt-0.5 shrink-0" strokeWidth={1.5} />
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-forest">
                          Community Garden Access Required
                        </span>
                        <AccessLevelBadge accessLevel={accessInfo.accessLevel} />
                      </div>
                      <p className="text-sm text-forest/50">
                        Unlock full Garden access to share content, earn Seeds,
                        and connect with our wellness community.
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-forest text-white hover:bg-forest/90 rounded-lg whitespace-nowrap"
                    onClick={() => setShowUpgradeModal(true)}
                  >
                    Upgrade Access
                  </Button>
                </div>
              </div>
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
