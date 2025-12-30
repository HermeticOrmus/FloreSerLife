import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReviewForm } from "./review-form";
import { useReviews } from "@/hooks/useReviews";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  practitionerId: string;
  practitionerName: string;
}

export function ReviewModal({
  isOpen,
  onClose,
  sessionId,
  practitionerId,
  practitionerName,
}: ReviewModalProps) {
  const { createReview } = useReviews();

  const handleSubmit = async (reviewData: { rating: number; comment?: string }) => {
    await createReview({
      sessionId,
      practitionerId,
      ...reviewData,
    });
    // Form will show success state, user can close manually
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">Review Session</DialogTitle>
        </DialogHeader>
        <ReviewForm
          sessionId={sessionId}
          practitionerId={practitionerId}
          practitionerName={practitionerName}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}