import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StarRating({
  rating,
  onRatingChange,
  readonly = false,
  size = "md",
  className
}: StarRatingProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  const handleStarClick = (starIndex: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starIndex + 1);
    }
  };

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {[...Array(5)].map((_, index) => (
        <button
          key={index}
          type="button"
          className={cn(
            "transition-colors",
            readonly ? "cursor-default" : "cursor-pointer hover:scale-110",
            !readonly && "focus:outline-none focus:ring-2 focus:ring-gold/50 rounded"
          )}
          onClick={() => handleStarClick(index)}
          disabled={readonly}
        >
          <Star
            className={cn(
              sizeClasses[size],
              "transition-colors",
              index < rating
                ? "fill-gold text-gold"
                : "fill-gray-200 text-gray-200"
            )}
          />
        </button>
      ))}
    </div>
  );
}