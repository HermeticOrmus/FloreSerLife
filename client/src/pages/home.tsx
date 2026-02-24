import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MessageCircle, User, TrendingUp, Leaf, ArrowRight } from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Fetch real dashboard data
  const { data: seedsData } = useQuery<any>({
    queryKey: ["/api/seeds/wallet", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const res = await fetch(`/api/seeds/wallet/${user.id}`, { credentials: "include" });
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!user?.id,
  });

  const { data: sessionsData, isError: isSessionsError } = useQuery<any>({
    queryKey: ["/api/sessions", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const role = user.roles?.includes("practitioner") ? "practitioner" : "client";
      const res = await fetch(`/api/sessions/${user.id}/${role}`, { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!user?.id,
  });

  const { data: favoritesData } = useQuery<any>({
    queryKey: ["/api/favorites"],
    queryFn: async () => {
      if (!user?.id) return [];
      const res = await fetch(`/api/favorites/${user.id}`, { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    document.title = "Dashboard - FloreSer";
  }, []);

  const sessions = Array.isArray(sessionsData) ? sessionsData : [];
  const upcomingSessions = sessions.filter((s: any) => s.status === "scheduled");
  const completedSessions = sessions.filter((s: any) => s.status === "completed");
  const favorites = Array.isArray(favoritesData) ? favoritesData : [];
  const seedsBalance = seedsData?.seedsBalance || 0;

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8">
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-forest mb-2">
            Welcome back, {user?.firstName || 'Friend'}!
          </h1>
          <p className="text-forest/60">
            Your Life-Tending journey continues here.
          </p>
        </div>

        {isSessionsError && (
          <div className="text-center py-8">
            <p className="text-destructive text-sm">Failed to load session data. Please try again later.</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-sage/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
              <Calendar className="h-4 w-4 text-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-forest">{upcomingSessions.length}</div>
              <p className="text-xs text-forest/60">
                {upcomingSessions.length === 0 ? "No upcoming sessions" : "Scheduled"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-sage/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Sessions</CardTitle>
              <TrendingUp className="h-4 w-4 text-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-forest">{completedSessions.length}</div>
              <p className="text-xs text-forest/60">Total completed</p>
            </CardContent>
          </Card>

          <Card className="border-sage/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Seeds Balance</CardTitle>
              <Leaf className="h-4 w-4 text-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-forest">{seedsBalance}</div>
              <p className="text-xs text-forest/60">{seedsData?.currentTier || "Seedling"} tier</p>
            </CardContent>
          </Card>

          <Card className="border-sage/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saved Practitioners</CardTitle>
              <User className="h-4 w-4 text-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-forest">{favorites.length}</div>
              <p className="text-xs text-forest/60">Favorites</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="border-sage/20">
              <CardHeader>
                <CardTitle className="font-heading">Recent Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                {sessions.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-sage/40 mx-auto mb-3" />
                    <p className="text-forest/60 mb-4">No sessions yet. Start your journey by booking a session with a practitioner.</p>
                    <Button
                      variant="outline"
                      className="border-gold text-gold hover:bg-gold hover:text-white"
                      onClick={() => setLocation('/practitioners')}
                    >
                      Browse Practitioners
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sessions.slice(0, 5).map((session: any) => (
                      <div key={session.id} className="flex items-center space-x-4">
                        <div className={`w-2 h-2 rounded-full ${
                          session.status === "completed" ? "bg-gold" :
                          session.status === "scheduled" ? "bg-sage" : "bg-forest/30"
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {session.status === "scheduled" ? "Upcoming" : "Completed"} session
                          </p>
                          <p className="text-xs text-forest/60">
                            {session.scheduledDatetime ? new Date(session.scheduledDatetime).toLocaleDateString() : ""}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="border-sage/20">
              <CardHeader>
                <CardTitle className="font-heading">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full"
                  onClick={() => setLocation('/practitioners')}
                >
                  Find a Practitioner
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-forest text-forest hover:bg-forest hover:text-white"
                  onClick={() => setLocation('/garden')}
                >
                  Explore the Garden
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-sage text-forest hover:bg-sage hover:text-white"
                  onClick={() => setLocation('/profile')}
                >
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
