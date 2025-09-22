import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  clientName?: string;
  clientInitials?: string;
}

interface ReviewDisplayProps {
  reviews: Review[];
  showClientInfo?: boolean;
  className?: string;
}

export function ReviewDisplay({
  reviews,
  showClientInfo = true,
  className
}: ReviewDisplayProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-forest/60">
        <p>No reviews yet.</p>
        <p className="text-sm mt-1">Be the first to share your experience!</p>
      </div>
    );
  }

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const ratingCounts = [5, 4, 3, 2, 1].map(star =>
    reviews.filter(review => review.rating === star).length
  );

  return (
    <div className={className}>
      {/* Rating Summary */}
      <div className="mb-6 p-4 bg-cream/50 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-2xl font-bold text-forest">
                {averageRating.toFixed(1)}
              </span>
              <StarRating rating={Math.round(averageRating)} readonly size="md" />
            </div>
            <p className="text-sm text-forest/70">
              Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="space-y-1">
          {ratingCounts.map((count, index) => {
            const star = 5 - index;
            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;

            return (
              <div key={star} className="flex items-center space-x-2 text-sm">
                <span className="w-8 text-forest/70">{star}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gold h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-forest/70 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                {showClientInfo && (
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gold/20 text-gold text-sm">
                      {review.clientInitials || "?"}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      {showClientInfo && review.clientName && (
                        <span className="font-medium text-forest">
                          {review.clientName}
                        </span>
                      )}
                      <StarRating rating={review.rating} readonly size="sm" />
                    </div>
                    <span className="text-xs text-forest/50">
                      {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                    </span>
                  </div>

                  {review.comment && (
                    <p className="text-forest/80 text-sm leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}