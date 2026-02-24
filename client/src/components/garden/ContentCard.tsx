import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, Leaf, Eye, BookOpen } from "lucide-react";
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
  index,
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
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 + index * 0.05 }}
    >
      <Card className="bg-garden-card border-0 rounded-card shadow-card hover:shadow-card-hover transition-all duration-300 h-full flex flex-col">
        {content.isFeatured && (
          <div className="bg-gradient-to-r from-garden-accent to-garden-accent-light text-white px-4 py-2 text-xs font-medium rounded-t-card flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5" />
            Featured Content
          </div>
        )}
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3 mb-3">
            <Badge
              variant="outline"
              className="text-xs border-garden-accent/30 shrink-0"
            >
              {typeOption?.label || content.contentType}
            </Badge>
            <div className="flex items-center gap-1.5 text-garden-accent">
              <Leaf className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">
                {content.seedsReward} Seeds
              </span>
            </div>
          </div>
          <CardTitle className="text-card-heading font-heading text-garden-text-primary line-clamp-2">
            {content.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-4 flex-1 flex flex-col">
          <p className="text-body-sm text-garden-text-secondary line-clamp-3">
            {content.description || content.content || "No description available"}
          </p>

          <div className="flex items-center gap-2 text-xs text-garden-text-secondary">
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
                <Badge
                  key={idx}
                  variant="outline"
                  className="text-xs border-garden-accent/20 px-2 py-0.5"
                >
                  #{tag}
                </Badge>
              ))}
              {content.tags.length > 3 && (
                <Badge
                  variant="outline"
                  className="text-xs border-garden-accent/20 px-2 py-0.5"
                >
                  +{content.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          <div className="mt-auto pt-4 border-t border-garden-accent/10">
            <div className="flex items-center justify-between mb-3 text-xs text-garden-text-secondary">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <Heart
                    className={`w-3.5 h-3.5 ${isLiked ? "fill-garden-accent text-garden-accent" : ""}`}
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
                className="flex-1 rounded-button text-label border-garden-accent/20 hover:bg-garden-accent hover:text-white hover:border-garden-accent"
                onClick={() => onView(content)}
              >
                <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                Read
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-button ${isLiked ? "text-garden-accent" : "hover:bg-garden-accent/10"}`}
                onClick={() => onLike(content.id)}
                disabled={likePending || isLiked}
              >
                <Heart
                  className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}
                />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
