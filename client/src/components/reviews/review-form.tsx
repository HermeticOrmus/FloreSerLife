import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarRating } from "@/components/ui/star-rating";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";

interface ReviewFormProps {
  sessionId: string;
  practitionerId: string;
  practitionerName: string;
  onSubmit: (reviewData: { rating: number; comment?: string }) => Promise<void>;
  onCancel?: () => void;
}

export function ReviewForm({
  sessionId,
  practitionerId,
  practitionerName,
  onSubmit,
  onCancel
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setSubmitStatus("error");
      setErrorMessage("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await onSubmit({
        rating,
        comment: comment.trim() || undefined
      });
      setSubmitStatus("success");
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === "success") {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-forest mb-2">
            Thank you for your review!
          </h3>
          <p className="text-forest/70 mb-4">
            Your feedback helps other clients and supports {practitionerName}.
          </p>
          {onCancel && (
            <Button onClick={onCancel} variant="outline" className="mt-2">
              Close
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-forest">
          Rate Your Session with {practitionerName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-forest">
              Overall Rating
            </label>
            <div className="flex items-center space-x-2">
              <StarRating
                rating={rating}
                onRatingChange={setRating}
                size="lg"
              />
              {rating > 0 && (
                <span className="text-sm text-forest/70">
                  {rating} out of 5 stars
                </span>
              )}
            </div>
          </div>

          {/* Comment Section */}
          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium text-forest">
              Share Your Experience (Optional)
            </label>
            <Textarea
              id="comment"
              placeholder="What did you appreciate about this session? How did it help you?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px] resize-none"
              maxLength={500}
            />
            <div className="text-xs text-forest/50 text-right">
              {comment.length}/500 characters
            </div>
          </div>

          {/* Error Alert */}
          {submitStatus === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {/* Submit Buttons */}
          <div className="flex space-x-3">
            <Button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className="flex-1 bg-gold hover:bg-gold/90"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}