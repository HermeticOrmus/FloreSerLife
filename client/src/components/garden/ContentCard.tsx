import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Leaf, Eye, BookOpen } from "lucide-react";
import { GardenContent, contentTypeOptions, getAuthorName } from "./types";
import { archetypeIcons } from "@/assets";

interface ContentCardProps {
  content: GardenContent;
  index: number;
  onView: (content: GardenContent) => void;
  onLike: (contentId: string) => void;
  isLiked: boolean;
  likePending: boolean;
}

export default function ContentCard({
  content,
  onView,
  onLike,
  isLiked,
  likePending,
}: ContentCardProps) {
  const typeOption = contentTypeOptions.find(
    (opt) => opt.value === content.contentType
  );

  const archetypeKey = content.practitioner?.archetype as keyof typeof archetypeIcons | undefined;

  return (
    <div className="bg-white border border-forest/8 rounded-lg origami-paper origami-corner origami-lifted h-full flex flex-col">
      {content.isFeatured && (
        <div className="bg-forest text-white px-4 py-2 text-xs font-medium rounded-t-lg flex items-center gap-1.5">
          <Leaf className="w-3.5 h-3.5" />
          Featured Content
        </div>
      )}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <Badge className="text-xs bg-forest/5 text-forest/60 border border-forest/10">
            {typeOption?.label || content.contentType}
          </Badge>
          <div className="flex items-center gap-1.5 text-forest/40">
            <Leaf className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span className="text-xs font-medium">
              {content.seedsReward} Seeds
            </span>
          </div>
        </div>
        <h3 className="text-lg font-heading text-forest line-clamp-2">
          {content.title}
        </h3>
      </div>
      <div className="px-5 pb-5 space-y-4 flex-1 flex flex-col">
        <p className="text-sm text-forest/60 line-clamp-3 leading-relaxed">
          {content.description || content.content || "No description available"}
        </p>

        <div className="flex items-center gap-2 text-xs text-forest/50">
          {archetypeKey && archetypeIcons[archetypeKey] && (
            <img
              src={archetypeIcons[archetypeKey]}
              alt={archetypeKey}
              className="w-5 h-5 rounded-full"
            />
          )}
          <span className="line-clamp-1">{getAuthorName(content)}</span>
        </div>

        {content.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {content.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-xs text-forest/50 border border-forest/10 rounded px-2 py-0.5"
              >
                #{tag}
              </span>
            ))}
            {content.tags.length > 3 && (
              <span className="text-xs text-forest/40 border border-forest/8 rounded px-2 py-0.5">
                +{content.tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-forest/8">
          <div className="flex items-center justify-between mb-3 text-xs text-forest/50">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Heart
                  className={`w-3.5 h-3.5 ${isLiked ? "fill-forest text-forest" : ""}`}
                />
                {content.likeCount}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                {content.viewCount}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 rounded-lg text-sm border-forest/10 text-forest/70 hover:bg-forest hover:text-white hover:border-forest"
              onClick={() => onView(content)}
            >
              <BookOpen className="w-3.5 h-3.5 mr-1.5" />
              Read
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-lg ${isLiked ? "text-forest" : "text-forest/30 hover:bg-forest/5"}`}
              onClick={() => onLike(content.id)}
              disabled={likePending || isLiked}
            >
              <Heart
                className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
