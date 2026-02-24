import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Heart, Star, Sparkles, Eye, Share2 } from "lucide-react";
import { GardenContent, contentTypeOptions, getAuthorName } from "./types";
import { archetypeIcons } from "@/assets";

interface ContentDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: GardenContent | null;
  onLike: (contentId: string) => void;
  isLiked: boolean;
  likePending: boolean;
  isAuthenticated: boolean;
}

function extractVideoId(url: string): { type: "youtube" | "vimeo"; id: string } | null {
  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) return { type: "youtube", id: ytMatch[1] };

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return { type: "vimeo", id: vimeoMatch[1] };

  return null;
}

function MediaEmbed({ url }: { url: string }) {
  const video = extractVideoId(url);

  if (video?.type === "youtube") {
    return (
      <div className="relative w-full aspect-video rounded-card overflow-hidden mb-4">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.id}`}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Video content"
        />
      </div>
    );
  }

  if (video?.type === "vimeo") {
    return (
      <div className="relative w-full aspect-video rounded-card overflow-hidden mb-4">
        <iframe
          src={`https://player.vimeo.com/video/${video.id}`}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title="Video content"
        />
      </div>
    );
  }

  // SoundCloud or generic audio URL
  if (url.includes("soundcloud.com")) {
    return (
      <div className="mb-4">
        <iframe
          width="100%"
          height="166"
          scrolling="no"
          frameBorder="no"
          allow="autoplay"
          src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%2365a30d&auto_play=false`}
          title="Audio content"
        />
      </div>
    );
  }

  // Fallback: render as a clickable link
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-garden-accent hover:underline mb-4"
    >
      View external content
    </a>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function ContentDetailModal({
  open,
  onOpenChange,
  content,
  onLike,
  isLiked,
  likePending,
  isAuthenticated,
}: ContentDetailModalProps) {
  const { toast } = useToast();

  if (!content) return null;

  const typeOption = contentTypeOptions.find(
    (opt) => opt.value === content.contentType
  );
  const archetypeKey = content.practitioner?.archetype as keyof typeof archetypeIcons | undefined;

  const handleShare = async () => {
    const url = `${window.location.origin}/garden?content=${content.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied",
        description: "Share this link with others",
      });
      // Record share interaction
      if (isAuthenticated) {
        fetch("/api/garden/interaction", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            contentId: content.id,
            interactionType: "share",
          }),
        });
      }
    } catch {
      toast({
        title: "Could not copy link",
        variant: "destructive",
      });
    }
  };

  const handleLike = () => {
    onLike(content.id);
    if (!isLiked) {
      toast({
        title: "Content liked!",
        description: "You earned the author 1 Seed!",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="border-garden-accent/30">
                  {typeOption?.label || content.contentType}
                </Badge>
                {content.isFeatured && (
                  <Badge className="bg-garden-accent text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-2xl font-heading text-garden-text-primary">
                {content.title}
              </DialogTitle>
              <div className="flex items-center gap-4 mt-3 text-sm text-garden-text-secondary flex-wrap">
                <div className="flex items-center gap-2">
                  {archetypeKey && archetypeIcons[archetypeKey] && (
                    <img
                      src={archetypeIcons[archetypeKey]}
                      alt={archetypeKey}
                      className="w-5 h-5 rounded-full"
                    />
                  )}
                  <span>{getAuthorName(content)}</span>
                </div>
                <span className="hidden sm:inline">-</span>
                <span>{formatDate(content.createdAt)}</span>
                <span className="hidden sm:inline">-</span>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-garden-accent" />
                  <span className="text-garden-accent font-medium">
                    {content.seedsReward} Seeds
                  </span>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] pr-4">
          {/* Media embed for video/audio content */}
          {content.fileUrl && <MediaEmbed url={content.fileUrl} />}

          {content.description && (
            <p className="text-lg text-garden-text-primary mb-4 font-medium leading-relaxed">
              {content.description}
            </p>
          )}

          <div className="prose prose-garden max-w-none">
            {content.content ? (
              <div className="text-garden-text-secondary leading-relaxed whitespace-pre-line">
                {content.content}
              </div>
            ) : !content.fileUrl ? (
              <p className="text-garden-text-secondary italic">
                No detailed content available.
              </p>
            ) : null}
          </div>

          {content.tags.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-garden-text-secondary mb-2">
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {content.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="border-garden-accent/20"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>

        <div className="flex items-center justify-between pt-4 border-t border-garden-accent/20 flex-wrap gap-4">
          <div className="flex items-center gap-6 text-sm text-garden-text-secondary">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{content.viewCount} views</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart
                className={`w-4 h-4 ${isLiked ? "fill-garden-accent text-garden-accent" : ""}`}
              />
              <span>{content.likeCount} likes</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleShare}
              className="rounded-button border-garden-accent/20"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button
              variant="outline"
              onClick={handleLike}
              disabled={likePending || !isAuthenticated || isLiked}
              className={`rounded-button border-garden-accent/20 ${isLiked ? "text-garden-accent" : ""}`}
            >
              <Heart
                className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`}
              />
              {isLiked ? "Liked" : "Like"}
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-button border-garden-accent/20"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
