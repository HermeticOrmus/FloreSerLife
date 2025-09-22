import React from "react";
import { StarRating } from "@/components/ui/star-rating";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ReviewsSummaryProps {
  averageRating?: number;
  totalReviews?: number;
  isVerified?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function ReviewsSummary({
  averageRating,
  totalReviews = 0,
  isVerified = false,
  className,
  size = "md"
}: ReviewsSummaryProps) {
  const rating = averageRating ? parseFloat(averageRating.toString()) : 0;

  const sizeClasses = {
    sm: {
      rating: "text-sm",
      badge: "text-xs px-2 py-1",
      star: "sm" as const
    },
    md: {
      rating: "text-base",
      badge: "text-sm px-2 py-1",
      star: "md" as const
    },
    lg: {
      rating: "text-lg",
      badge: "text-base px-3 py-1",
      star: "lg" as const
    }
  };

  const classes = sizeClasses[size];

  if (totalReviews === 0) {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <StarRating rating={0} readonly size={classes.star} />
        <span className={cn("text-forest/60", classes.rating)}>
          No reviews yet
        </span>
        {isVerified && (
          <Badge
            variant="secondary"
            className={cn("bg-gold/20 text-gold border-gold/30", classes.badge)}
          >
            Verified
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <StarRating rating={Math.round(rating)} readonly size={classes.star} />
      <span className={cn("font-medium text-forest", classes.rating)}>
        {rating.toFixed(1)}
      </span>
      <span className={cn("text-forest/60", classes.rating)}>
        ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
      </span>
      {isVerified && (
        <Badge
          variant="secondary"
          className={cn("bg-gold/20 text-gold border-gold/30", classes.badge)}
        >
          Verified
        </Badge>
      )}
    </div>
  );
}