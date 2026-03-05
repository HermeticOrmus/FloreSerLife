import { Button } from "@/components/ui/button";
import { Leaf, Plus } from "lucide-react";
import { FeaturePreview } from "@/components/access-control";
import { GardenContent } from "./types";
import ContentCard from "./ContentCard";
import ContentCardSkeleton from "./ContentCardSkeleton";

interface ContentGridProps {
  content: GardenContent[];
  isLoading: boolean;
  gardenAccess: { allowed: boolean };
  accessInfo: { accessLevel: string };
  uploadAccess: { allowed: boolean };
  likedIds: Set<string>;
  likePending: boolean;
  onView: (content: GardenContent) => void;
  onLike: (contentId: string) => void;
  onUpload: () => void;
}

export default function ContentGrid({
  content,
  isLoading,
  gardenAccess,
  accessInfo,
  uploadAccess,
  likedIds,
  likePending,
  onView,
  onLike,
  onUpload,
}: ContentGridProps) {
  return (
    <FeaturePreview
      isAllowed={gardenAccess.allowed}
      message="Upgrade to access our thriving Community Garden"
      currentLevel={accessInfo.accessLevel}
      requiredLevel="basic"
      feature="Community Garden access"
    >
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ContentCardSkeleton key={i} />
          ))}
        </div>
      ) : content.length === 0 ? (
        <div className="text-center py-16 border border-forest/8 rounded-lg origami-paper origami-corner-both origami-fold-shadow">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Leaf className="w-10 h-10 text-forest/20" strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-heading text-forest mb-2">
            The Garden Awaits Your Gifts
          </h3>
          <p className="text-sm text-forest/50 max-w-md mx-auto mb-6 leading-relaxed">
            Be the first to plant a seed. Share your wisdom, practices, or
            resources freely with the community.
          </p>
          {uploadAccess.allowed && (
            <Button
              className="bg-forest text-white hover:bg-forest/90 rounded-lg"
              onClick={onUpload}
            >
              <Plus className="w-4 h-4 mr-2" />
              Share Your First Gift
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.map((item, index) => (
            <ContentCard
              key={item.id}
              content={item}
              index={index}
              onView={onView}
              onLike={onLike}
              isLiked={likedIds.has(item.id)}
              likePending={likePending}
            />
          ))}
        </div>
      )}
    </FeaturePreview>
  );
}
