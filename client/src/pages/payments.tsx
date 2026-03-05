import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ArrowLeft, Calendar, Clock, Video, MapPin, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

interface Booking {
  id: string;
  scheduledDatetime: string;
  duration: number;
  status: string;
  isVirtual: boolean;
  practitionerName: string;
  totalAmount: string;
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

export default function Payments() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "Booking History - FloreSer";
  }, []);

  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
    enabled: !!user,
  });

  const sorted = [...bookings].sort(
    (a, b) =>
      new Date(b.scheduledDatetime).getTime() -
      new Date(a.scheduledDatetime).getTime()
  );

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl font-bold text-forest mb-2">
              Booking History
            </h1>
            <p className="text-forest/60">
              All your session bookings in one place
            </p>
          </div>

          <Alert className="mb-6 border-gold/30 bg-gold/5">
            <Info className="w-4 h-4 text-gold" />
            <AlertDescription className="text-forest/70">
              Sessions are free during the alpha preview. Payment history will
              be available when paid sessions launch.
            </AlertDescription>
          </Alert>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-sage/10 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border border-sage/20 p-12 text-center">
              <Calendar className="w-12 h-12 text-forest/15 mx-auto mb-4" />
              <h2 className="font-heading text-xl font-semibold text-forest mb-2">
                No Bookings Yet
              </h2>
              <p className="text-forest/60 mb-6 max-w-md mx-auto">
                When you book sessions with facilitators, they'll appear here.
              </p>
              <Button
                onClick={() => setLocation("/hive")}
                className="bg-forest hover:bg-forest/90"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Browse The Hive
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {sorted.map((booking) => (
                <Card key={booking.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-forest">
                            {booking.practitionerName}
                          </span>
                          {statusBadge(booking.status)}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-forest/60">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(booking.scheduledDatetime).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric", year: "numeric" }
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(booking.scheduledDatetime).toLocaleTimeString(
                              "en-US",
                              { hour: "numeric", minute: "2-digit" }
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {booking.duration} min
                          </span>
                          <span className="flex items-center gap-1">
                            {booking.isVirtual ? (
                              <Video className="w-3.5 h-3.5" />
                            ) : (
                              <MapPin className="w-3.5 h-3.5" />
                            )}
                            {booking.isVirtual ? "Virtual" : "In-Person"}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-sm font-medium text-gold">Free</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
