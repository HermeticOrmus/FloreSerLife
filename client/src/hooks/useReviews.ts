import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  clientName?: string;
  clientInitials?: string;
}

interface CreateReviewData {
  sessionId: string;
  practitionerId: string;
  rating: number;
  comment?: string;
}

export function useReviews() {
  const queryClient = useQueryClient();

  // Get reviews for a practitioner
  const usePractitionerReviews = (practitionerId: string) => {
    return useQuery<Review[]>({
      queryKey: [`/api/reviews/practitioner/${practitionerId}`],
      enabled: !!practitionerId,
    });
  };

  // Get reviews by a client
  const useClientReviews = (clientId: string) => {
    return useQuery<Review[]>({
      queryKey: [`/api/reviews/client/${clientId}`],
      enabled: !!clientId,
    });
  };

  // Create a new review
  const createReviewMutation = useMutation({
    mutationFn: async (reviewData: CreateReviewData) => {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create review");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch practitioner reviews
      queryClient.invalidateQueries({
        queryKey: [`/api/reviews/practitioner/${variables.practitionerId}`]
      });

      // Invalidate practitioner profile to update rating
      queryClient.invalidateQueries({
        queryKey: ["/api/practitioners"]
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/practitioners/all"]
      });
    },
  });

  return {
    usePractitionerReviews,
    useClientReviews,
    createReview: createReviewMutation.mutateAsync,
    isCreatingReview: createReviewMutation.isPending,
  };
}

// Helper hook for review form management
export function useReviewForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionData, setSessionData] = useState<{
    sessionId: string;
    practitionerId: string;
    practitionerName: string;
  } | null>(null);

  const openReviewForm = (data: {
    sessionId: string;
    practitionerId: string;
    practitionerName: string;
  }) => {
    setSessionData(data);
    setIsOpen(true);
  };

  const closeReviewForm = () => {
    setIsOpen(false);
    setSessionData(null);
  };

  return {
    isOpen,
    sessionData,
    openReviewForm,
    closeReviewForm,
  };
}