import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useReviewForm } from "@/hooks/useReviews";
import { motion } from "framer-motion";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ReviewModal } from "@/components/reviews/review-modal";
import { papercut } from "@/assets";

import {
  Calendar,
  Clock,
  Video,
  MapPin,
  CheckCircle,
  XCircle,
  Star,
  Flower2,
  Sparkles,
} from "lucide-react";

interface Booking {
  id: string;
  clientId: string;
  practitionerId: string;
  scheduledDatetime: string;
  duration: number;
  status: string;
  isVirtual: boolean;
  notes?: string;
  practitionerName: string;
  practitionerArchetype: string;
  clientName: string;
  hasReview: boolean;
  userRole: "client" | "practitioner" | "unknown";
}

function getArchetypeIcon(archetype?: string) {
  switch (archetype) {
    case "bee":
      return <span className="text-sm">🐝</span>;
    case "butterfly":
      return <span className="text-sm">🦋</span>;
    case "hummingbird":
      return <span className="text-sm">🐦</span>;
    case "beetle":
      return <span className="text-sm">🪲</span>;
    default:
      return <Flower2 className="w-4 h-4 text-gold" />;
  }
}

function statusBadge(status: string) {
  switch (status) {
    case "scheduled":
      return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Scheduled</Badge>;
    case "completed":
      return <Badge className="bg-green-100 text-green-700 border-green-200">Completed</Badge>;
    case "cancelled":
      return <Badge className="bg-red-100 text-red-700 border-red-200">Cancelled</Badge>;
    case "no-show":
      return <Badge className="bg-orange-100 text-orange-700 border-orange-200">No Show</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function isSessionPast(booking: Booking): boolean {
  const endTime = new Date(booking.scheduledDatetime).getTime() + booking.duration * 60000;
  return endTime < Date.now();
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

// ── Session Card ──────────────────────────────────────────────────────────────

function SessionCard({
  booking,
  onMarkComplete,
  onLeaveReview,
  onCancel,
  isCompletePending,
}: {
  booking: Booking;
  onMarkComplete?: () => void;
  onLeaveReview?: () => void;
  onCancel?: () => void;
  isCompletePending?: boolean;
}) {
  const past = isSessionPast(booking);
  const isCancelled = booking.status === "cancelled" || booking.status === "no-show";

  return (
    <Card className={`transition-shadow hover:shadow-md ${isCancelled ? "opacity-60" : ""}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          {/* Left: details */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              {getArchetypeIcon(booking.practitionerArchetype)}
              <span className="font-medium text-forest truncate">
                {booking.userRole === "practitioner"
                  ? booking.clientName
                  : booking.practitionerName}
              </span>
              {statusBadge(booking.status)}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-forest/60">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(booking.scheduledDatetime)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formatTime(booking.scheduledDatetime)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {booking.duration} min
              </span>
              <span className="flex items-center gap-1">
                {booking.isVirtual ? <Video className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                {booking.isVirtual ? "Virtual" : "In-Person"}
              </span>
            </div>

            {booking.notes && (
              <p className="text-xs text-forest/40 truncate">{booking.notes}</p>
            )}
          </div>

          {/* Right: actions */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            {/* Practitioner: mark complete on past scheduled sessions */}
            {booking.status === "scheduled" &&
              past &&
              booking.userRole === "practitioner" &&
              onMarkComplete && (
                <Button
                  size="sm"
                  onClick={onMarkComplete}
                  disabled={isCompletePending}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                  {isCompletePending ? "Completing..." : "Mark Complete"}
                </Button>
              )}

            {/* Client: leave review on completed sessions without review */}
            {booking.status === "completed" &&
              !booking.hasReview &&
              booking.userRole === "client" &&
              onLeaveReview && (
                <Button
                  size="sm"
                  onClick={onLeaveReview}
                  className="bg-gold hover:bg-gold/90 text-white"
                >
                  <Star className="w-3.5 h-3.5 mr-1.5" />
                  Leave Review
                </Button>
              )}

            {/* Show review badge if already reviewed */}
            {booking.status === "completed" && booking.hasReview && (
              <Badge className="bg-gold/10 text-gold border-gold/20">
                <Star className="w-3 h-3 mr-1 fill-gold" />
                Reviewed
              </Badge>
            )}

            {/* Cancel option for future scheduled sessions */}
            {booking.status === "scheduled" && !past && onCancel && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onCancel}
                className="text-forest/40 hover:text-red-600 text-xs"
              >
                <XCircle className="w-3 h-3 mr-1" />
                Cancel
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({ message, cta }: { message: string; cta?: React.ReactNode }) {
  return (
    <div className="text-center py-12">
      <Flower2 className="w-10 h-10 text-forest/15 mx-auto mb-3" />
      <p className="text-forest/40 text-sm mb-4">{message}</p>
      {cta}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function Sessions() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [completeDialog, setCompleteDialog] = useState<Booking | null>(null);
  const [cancelDialog, setCancelDialog] = useState<Booking | null>(null);
  const { isOpen: reviewOpen, sessionData, openReviewForm, closeReviewForm } = useReviewForm();

  useEffect(() => {
    document.title = "My Sessions - FloreSer";
  }, []);

  // Fetch bookings
  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
    enabled: !!user,
  });

  // Mark complete mutation
  const completeMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: "completed" }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to mark complete");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/seeds"] });
      toast({
        title: "Session completed",
        description: "20 Seeds awarded to both you and your client.",
      });
      setCompleteDialog(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to complete session",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Cancel mutation
  const cancelMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: "cancelled" }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to cancel session");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({ title: "Session cancelled" });
      setCancelDialog(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to cancel session",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Categorize bookings
  const now = Date.now();
  const upcoming = bookings
    .filter((b) => b.status === "scheduled" && new Date(b.scheduledDatetime).getTime() > now)
    .sort((a, b) => new Date(a.scheduledDatetime).getTime() - new Date(b.scheduledDatetime).getTime());

  const needsAction = bookings.filter(
    (b) =>
      (b.status === "scheduled" && isSessionPast(b)) ||
      (b.status === "completed" && !b.hasReview && b.userRole === "client")
  );

  const completed = bookings
    .filter((b) => b.status === "completed")
    .sort((a, b) => new Date(b.scheduledDatetime).getTime() - new Date(a.scheduledDatetime).getTime());

  const cancelled = bookings
    .filter((b) => b.status === "cancelled" || b.status === "no-show")
    .sort((a, b) => new Date(b.scheduledDatetime).getTime() - new Date(a.scheduledDatetime).getTime());

  const defaultTab = needsAction.length > 0 ? "action" : upcoming.length > 0 ? "upcoming" : "completed";

  return (
    <div
      className="min-h-screen bg-cream"
      style={{
        backgroundImage: `url(${papercut.textures.flatCream})`,
        backgroundSize: "512px 512px",
        backgroundRepeat: "repeat",
      }}
    >
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Page heading */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-forest mb-2">
            My Sessions
          </h1>
          <p className="text-forest/60 text-base">
            {bookings.length > 0
              ? `${upcoming.length} upcoming, ${completed.length} completed`
              : "Book a session to get started"}
          </p>
        </motion.div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-sage/10 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <EmptyState
            message="You don't have any sessions yet. Browse The Hive to find a facilitator and book your first session."
            cta={
              <Button
                className="rounded-full text-white bg-gold hover:bg-gold/90"
                onClick={() => setLocation("/hive")}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Browse The Hive
              </Button>
            }
          />
        ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="upcoming" className="text-xs sm:text-sm">
                  Upcoming{upcoming.length > 0 && ` (${upcoming.length})`}
                </TabsTrigger>
                <TabsTrigger value="action" className="text-xs sm:text-sm">
                  Needs Action
                  {needsAction.length > 0 && (
                    <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-gold text-white text-xs">
                      {needsAction.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="completed" className="text-xs sm:text-sm">
                  Completed{completed.length > 0 && ` (${completed.length})`}
                </TabsTrigger>
                <TabsTrigger value="cancelled" className="text-xs sm:text-sm">
                  Cancelled
                </TabsTrigger>
              </TabsList>

              {/* Upcoming */}
              <TabsContent value="upcoming" className="space-y-3">
                {upcoming.length === 0 ? (
                  <EmptyState
                    message="No upcoming sessions."
                    cta={
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLocation("/hive")}
                      >
                        Browse Facilitators
                      </Button>
                    }
                  />
                ) : (
                  upcoming.map((b) => (
                    <SessionCard
                      key={b.id}
                      booking={b}
                      onCancel={() => setCancelDialog(b)}
                    />
                  ))
                )}
              </TabsContent>

              {/* Needs Action */}
              <TabsContent value="action" className="space-y-3">
                {needsAction.length === 0 ? (
                  <EmptyState message="Nothing needs your attention right now." />
                ) : (
                  needsAction.map((b) => (
                    <SessionCard
                      key={b.id}
                      booking={b}
                      onMarkComplete={
                        b.status === "scheduled" &&
                        isSessionPast(b) &&
                        b.userRole === "practitioner"
                          ? () => setCompleteDialog(b)
                          : undefined
                      }
                      onLeaveReview={
                        b.status === "completed" &&
                        !b.hasReview &&
                        b.userRole === "client"
                          ? () =>
                              openReviewForm({
                                sessionId: b.id,
                                practitionerId: b.practitionerId,
                                practitionerName: b.practitionerName,
                              })
                          : undefined
                      }
                      isCompletePending={completeMutation.isPending}
                    />
                  ))
                )}
              </TabsContent>

              {/* Completed */}
              <TabsContent value="completed" className="space-y-3">
                {completed.length === 0 ? (
                  <EmptyState message="No completed sessions yet." />
                ) : (
                  completed.map((b) => (
                    <SessionCard
                      key={b.id}
                      booking={b}
                      onLeaveReview={
                        !b.hasReview && b.userRole === "client"
                          ? () =>
                              openReviewForm({
                                sessionId: b.id,
                                practitionerId: b.practitionerId,
                                practitionerName: b.practitionerName,
                              })
                          : undefined
                      }
                    />
                  ))
                )}
              </TabsContent>

              {/* Cancelled */}
              <TabsContent value="cancelled" className="space-y-3">
                {cancelled.length === 0 ? (
                  <EmptyState message="No cancelled sessions." />
                ) : (
                  cancelled.map((b) => <SessionCard key={b.id} booking={b} />)
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </main>

      <Footer />

      {/* Mark Complete Dialog */}
      <AlertDialog
        open={!!completeDialog}
        onOpenChange={(open) => !open && setCompleteDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark Session as Complete?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the session with{" "}
              <strong>{completeDialog?.clientName}</strong> as completed and
              award 20 Seeds to both parties.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                completeDialog && completeMutation.mutate(completeDialog.id)
              }
              className="bg-green-600 hover:bg-green-700"
            >
              {completeMutation.isPending ? "Completing..." : "Mark Complete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Dialog */}
      <AlertDialog
        open={!!cancelDialog}
        onOpenChange={(open) => !open && setCancelDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Session?</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel your session on{" "}
              {cancelDialog && formatDate(cancelDialog.scheduledDatetime)} at{" "}
              {cancelDialog && formatTime(cancelDialog.scheduledDatetime)}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Session</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                cancelDialog && cancelMutation.mutate(cancelDialog.id)
              }
              className="bg-red-600 hover:bg-red-700"
            >
              {cancelMutation.isPending ? "Cancelling..." : "Cancel Session"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Review Modal */}
      {sessionData && (
        <ReviewModal
          isOpen={reviewOpen}
          onClose={() => {
            closeReviewForm();
            queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
          }}
          sessionId={sessionData.sessionId}
          practitionerId={sessionData.practitionerId}
          practitionerName={sessionData.practitionerName}
        />
      )}
    </div>
  );
}
