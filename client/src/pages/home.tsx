import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MessageCircle, User, TrendingUp } from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "Dashboard - FloreSer";
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-forest mb-2">
            Welcome back, {user?.firstName || 'Friend'}!
          </h1>
          <p className="text-forest/70">
            Your Life-Tending journey continues here.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Quick Stats */}
          <Card className="border-sage/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
              <Calendar className="h-4 w-4 text-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-forest">2</div>
              <p className="text-xs text-forest/60">Next session tomorrow</p>
            </CardContent>
          </Card>

          <Card className="border-sage/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <TrendingUp className="h-4 w-4 text-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-forest">12</div>
              <p className="text-xs text-forest/60">+3 this month</p>
            </CardContent>
          </Card>

          <Card className="border-sage/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageCircle className="h-4 w-4 text-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-forest">3</div>
              <p className="text-xs text-forest/60">2 unread</p>
            </CardContent>
          </Card>

          <Card className="border-sage/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Practitioners</CardTitle>
              <User className="h-4 w-4 text-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-forest">3</div>
              <p className="text-xs text-forest/60">Saved favorites</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="border-sage/20">
              <CardHeader>
                <CardTitle className="font-heading">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Session with Sarah C. completed</p>
                      <p className="text-xs text-forest/60">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-gold rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New message from Marcus Thompson</p>
                      <p className="text-xs text-forest/60">1 week ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-sage rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Profile updated successfully</p>
                      <p className="text-xs text-forest/60">2 weeks ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="border-sage/20">
              <CardHeader>
                <CardTitle className="font-heading">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full bg-gold text-white hover:bg-gold/90"
                  onClick={() => setLocation('/hive')}
                >
                  Book New Session
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-forest text-forest hover:bg-forest hover:text-white"
                  onClick={() => setLocation('/practitioners')}
                >
                  Browse Practitioners
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-sage text-forest hover:bg-sage hover:text-white"
                  onClick={() => {
                    // Navigate to dashboard which has messages section
                    if (user?.roles?.includes('client')) {
                      setLocation('/dashboard/client');
                    } else if (user?.roles?.includes('practitioner')) {
                      setLocation('/dashboard/practitioner');
                    } else {
                      setLocation('/');
                    }
                  }}
                >
                  View Messages
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
