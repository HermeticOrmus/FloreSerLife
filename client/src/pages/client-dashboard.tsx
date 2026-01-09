import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import StatCard from "@/components/dashboard/stat-card";
import ActivityFeed from "@/components/dashboard/activity-feed";
import UpcomingSessions from "@/components/dashboard/upcoming-sessions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { papercut, characters } from "@/assets";
import {
  Calendar,
  MessageSquare,
  User,
  TrendingUp,
  Star,
  Heart,
  Sparkles,
  Search,
  Leaf,
  ArrowRight,
  Bot,
  RefreshCw,
  Sprout
} from "lucide-react";

// Mock data - in real app this would come from API
const mockClientStats = {
  upcomingSessions: 2,
  totalSessions: 12,
  unreadMessages: 3,
  favoritePractitioners: 3
};

const mockUpcomingSessions = [
  {
    id: '1',
    practitionerName: 'Sarah C.',
    date: '2025-01-16',
    time: '14:00',
    duration: 60,
    type: 'virtual' as const,
    status: 'confirmed' as const,
    avatar: '',
    meetingLink: 'https://meet.example.com/session-1',
    notes: 'Follow-up on wellness techniques'
  },
  {
    id: '2',
    practitionerName: 'Marcus Thompson',
    date: '2025-01-18',
    time: '10:30',
    duration: 90,
    type: 'in-person' as const,
    status: 'scheduled' as const,
    avatar: '',
    location: 'Wellness Center, Downtown'
  }
];

const mockRecentActivity = [
  {
    id: '1',
    type: 'session' as const,
    title: 'Session completed',
    description: 'Mindfulness session with Sarah C.',
    timestamp: '2 days ago',
    status: 'completed' as const,
    metadata: { rating: 5 }
  },
  {
    id: '2',
    type: 'message' as const,
    title: 'New message',
    description: 'Marcus Thompson sent you a message',
    timestamp: '1 week ago',
    status: undefined
  },
  {
    id: '3',
    type: 'booking' as const,
    title: 'Session booked',
    description: 'Upcoming session with Sarah C.',
    timestamp: '2 weeks ago',
    status: 'pending' as const
  }
];

export default function ClientDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    document.title = "My Garden - FloreSer";
  }, []);

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Garden-themed welcome message based on session count
  const getWelcomeMessage = () => {
    const sessionCount = stats.totalSessions;
    if (sessionCount === 0) {
      return "Your garden awaits its first bloom. Take your time - every journey begins with a single seed.";
    } else if (sessionCount < 3) {
      return "Your wellness garden is beginning to sprout. Each session helps your growth take root.";
    } else if (sessionCount < 10) {
      return "Beautiful growth is happening in your garden. The seeds you've planted are flourishing.";
    } else {
      return "Your garden is in full bloom. Your dedication to wellness is inspiring.";
    }
  };

  // Fetch user's bookings
  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ['/api/bookings'],
    enabled: !!user,
  });

  // Transform bookings into session format for UpcomingSessions component
  const upcomingSessions = (bookings as any[])
    .filter((booking: any) =>
      booking.status === 'scheduled' &&
      new Date(booking.scheduledDatetime) > new Date()
    )
    .map((booking: any) => ({
      id: booking.id,
      practitionerName: booking.practitionerName || 'Practitioner',
      date: new Date(booking.scheduledDatetime).toLocaleDateString(),
      time: new Date(booking.scheduledDatetime).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      }),
      duration: booking.duration,
      type: (booking.isVirtual ? 'virtual' : 'in-person') as 'virtual' | 'in-person',
      status: booking.status as 'scheduled' | 'confirmed' | 'pending' | 'cancelled',
      meetingLink: booking.isVirtual ? 'https://floreser.life/sessions' : undefined
    }));

  const pastSessions = (bookings as any[])
    .filter((booking: any) =>
      booking.status === 'completed' ||
      new Date(booking.scheduledDatetime) < new Date()
    )
    .sort((a: any, b: any) =>
      new Date(b.scheduledDatetime).getTime() - new Date(a.scheduledDatetime).getTime()
    );

  // Calculate stats from real booking data
  const stats = {
    upcomingSessions: upcomingSessions.length,
    totalSessions: (bookings as any[]).length,
    unreadMessages: mockClientStats.unreadMessages, // TODO: fetch from API
    favoritePractitioners: mockClientStats.favoritePractitioners // TODO: fetch from API
  };

  const handleQuickAction = (actionType: string) => {
    console.log('Quick action:', actionType);
    // Handle navigation or actions
    switch (actionType) {
      case 'book-session':
        setLocation('/hive');
        break;
      case 'browse-practitioners':
        setLocation('/practitioners');
        break;
      case 'view-messages':
        setActiveSection('messages');
        break;
      case 'update-profile':
        setActiveSection('profile');
        break;
    }
  };

  const handleSessionAction = (sessionId: string, action: string) => {
    console.log('Session action:', { sessionId, action });
    // Handle session-specific actions
    switch (action) {
      case 'join-meeting':
        // Open meeting link
        break;
      case 'send-message':
        // Open message composer
        break;
      case 'cancel':
        // Show cancellation dialog
        break;
    }
  };

  const sidebar = (
    <DashboardSidebar 
      userType="client" 
      activeSection={activeSection}
      onNavigate={setActiveSection}
    />
  );

  const actions = (
    <div className="flex space-x-3">
      <Button 
        className="bg-gold text-white hover:bg-gold/90"
        onClick={() => handleQuickAction('book-session')}
      >
        <Calendar className="w-4 h-4 mr-2" />
        Book Session
      </Button>
      <Button 
        variant="outline"
        onClick={() => handleQuickAction('browse-practitioners')}
      >
        Find Practitioners
      </Button>
    </div>
  );

  return (
    <DashboardLayout
      title={`${getGreeting()}, ${user?.firstName || 'Friend'}`}
      subtitle="Welcome to your garden"
      sidebar={sidebar}
      actions={actions}
    >
      <div className="space-y-8">
        {/* Welcome Banner with Garden Theme */}
        <div
          className="relative rounded-2xl overflow-hidden p-8"
          style={{
            backgroundImage: `url(${papercut.textures.paperSage})`,
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat',
          }}
        >
          {/* Decorative overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(0,0,0,0.05) 100%)',
            }}
          />
          <div className="relative flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <img
                src={papercut.heroTransparent.sproutLeaves}
                alt="Growing sprout"
                className="w-24 h-24 object-contain"
              />
            </div>
            <div className="text-center md:text-left">
              <h2 className="font-heading text-2xl font-bold text-white mb-2">
                My Garden
              </h2>
              <p className="text-white/90 text-lg leading-relaxed max-w-xl">
                {getWelcomeMessage()}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview - Compact */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Upcoming"
            value={bookingsLoading ? '-' : stats.upcomingSessions}
            description="Sessions scheduled"
            icon={Calendar}
            iconColor="text-sage"
          />
          <StatCard
            title="Sessions"
            value={bookingsLoading ? '-' : stats.totalSessions}
            description="Total attended"
            icon={Sprout}
            iconColor="text-green-600"
          />
          <StatCard
            title="Messages"
            value={stats.unreadMessages}
            description={stats.unreadMessages > 0 ? 'Unread' : 'All caught up'}
            icon={MessageSquare}
            iconColor="text-gold"
          />
          <StatCard
            title="Favorites"
            value={stats.favoritePractitioners}
            description="Facilitators saved"
            icon={Heart}
            iconColor="text-rose-500"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Sessions and mAIa */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Sessions or Empty State */}
            {!bookingsLoading && upcomingSessions.length === 0 ? (
              <Card className="border-sage/20 overflow-hidden">
                <div
                  className="p-8 text-center"
                  style={{
                    backgroundImage: `url(${papercut.textures.cream})`,
                    backgroundSize: '200px 200px',
                    backgroundRepeat: 'repeat',
                  }}
                >
                  <div className="max-w-md mx-auto">
                    <div className="relative inline-block mb-6">
                      <Leaf className="w-16 h-16 text-sage/60" />
                      <Sparkles className="w-6 h-6 text-gold absolute -top-1 -right-1" />
                    </div>
                    <h3 className="font-heading text-xl font-semibold text-forest mb-3">
                      Your garden is ready to grow
                    </h3>
                    <p className="text-forest/70 mb-6 leading-relaxed">
                      Find a facilitator who resonates with your wellness journey.
                      Each session plants a seed of transformation.
                    </p>
                    <Button
                      className="bg-gold text-white hover:bg-gold/90 rounded-full px-8"
                      onClick={() => setLocation('/hive')}
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Find a Facilitator
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <UpcomingSessions
                sessions={bookingsLoading ? mockUpcomingSessions : upcomingSessions}
                userType="client"
                onSessionAction={handleSessionAction}
              />
            )}

            {/* Continue with mAIa Section */}
            <Card className="border-sage/20 overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="flex-shrink-0 p-6 flex items-center justify-center bg-gradient-to-br from-gold/10 to-sage/10">
                  <img
                    src={characters.maia}
                    alt="mAIa - Your wellness guide"
                    className="w-32 h-32 object-contain"
                  />
                </div>
                <div className="flex-1 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Bot className="w-5 h-5 text-gold" />
                    <h3 className="font-heading text-lg font-semibold text-forest">
                      Continue with mAIa
                    </h3>
                    <Badge className="bg-gold/20 text-gold text-xs">
                      AI Guide
                    </Badge>
                  </div>
                  <p className="text-forest/70 mb-4 leading-relaxed">
                    mAIa is here to help you navigate your wellness journey.
                    Chat with her to discover your archetype, find facilitators,
                    or get personalized guidance.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      className="border-gold text-gold hover:bg-gold hover:text-white"
                      onClick={() => setLocation('/garden')}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Chat with mAIa
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-forest/70 hover:text-forest"
                      onClick={() => setLocation('/alpha')}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Retake Quiz
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Messages Preview */}
            <Card className="border-sage/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="font-heading text-lg">Messages</CardTitle>
                  {stats.unreadMessages > 0 && (
                    <Badge className="bg-gold text-white text-xs">
                      {stats.unreadMessages} new
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gold hover:text-gold/80"
                  onClick={() => handleQuickAction('view-messages')}
                >
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent>
                {stats.unreadMessages > 0 ? (
                  <div className="space-y-3">
                    <p className="text-forest/70">
                      You have {stats.unreadMessages} unread message{stats.unreadMessages > 1 ? 's' : ''} from your facilitators.
                    </p>
                    <Button
                      className="bg-sage text-white hover:bg-sage/90"
                      onClick={() => handleQuickAction('view-messages')}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Open Messages
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <MessageSquare className="w-10 h-10 text-sage/40 mx-auto mb-2" />
                    <p className="text-forest/60 text-sm">No new messages</p>
                    <p className="text-forest/40 text-xs mt-1">
                      Messages from your facilitators will appear here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Actions and Activity */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions Card */}
            <Card className="border-sage/20">
              <CardHeader>
                <CardTitle className="font-heading text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start bg-gold text-white hover:bg-gold/90"
                  onClick={() => handleQuickAction('browse-practitioners')}
                >
                  <Search className="w-4 h-4 mr-3" />
                  Find a Facilitator
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-sage/30 hover:bg-sage/5"
                  onClick={() => handleQuickAction('view-messages')}
                >
                  <MessageSquare className="w-4 h-4 mr-3" />
                  View Messages
                  {stats.unreadMessages > 0 && (
                    <Badge className="ml-auto bg-gold/20 text-gold text-xs">
                      {stats.unreadMessages}
                    </Badge>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-sage/30 hover:bg-sage/5"
                  onClick={() => handleQuickAction('update-profile')}
                >
                  <User className="w-4 h-4 mr-3" />
                  My Profile
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-sage/30 hover:bg-sage/5"
                  onClick={() => setLocation('/garden')}
                >
                  <Leaf className="w-4 h-4 mr-3" />
                  Community Garden
                </Button>
              </CardContent>
            </Card>

            {/* Activity Feed */}
            <ActivityFeed
              activities={mockRecentActivity}
              userType="client"
            />
          </div>
        </div>

        {/* Booking History - Only show if there are past sessions */}
        {!bookingsLoading && pastSessions.length > 0 && (
          <Card className="border-sage/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-heading text-lg">Your Journey</CardTitle>
              {pastSessions.length > 5 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gold hover:text-gold/80"
                >
                  View All ({pastSessions.length})
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pastSessions.slice(0, 5).map((booking: any) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 bg-sage/5 rounded-lg hover:bg-sage/10 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-forest">
                        {booking.practitionerName || 'Practitioner'}
                      </p>
                      <p className="text-sm text-forest/60">
                        {new Date(booking.scheduledDatetime).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })} at {new Date(booking.scheduledDatetime).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                      <p className="text-sm text-forest/60 mt-1">
                        {booking.duration} min
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bottom Widgets */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Wellness Progress */}
          <Card
            className="border-sage/20 overflow-hidden"
            style={{
              backgroundImage: `url(${papercut.textures.cream})`,
              backgroundSize: '200px 200px',
              backgroundRepeat: 'repeat',
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-sage/20">
                  <TrendingUp className="w-6 h-6 text-sage" />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-lg font-semibold text-forest mb-2">
                    Wellness Journey
                  </h3>
                  <p className="text-forest/70 text-sm mb-4">
                    Track your progress and see how your garden grows over time.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-sage text-sage hover:bg-sage hover:text-white"
                  >
                    View Progress
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Explore More */}
          <Card
            className="border-sage/20 overflow-hidden"
            style={{
              backgroundImage: `url(${papercut.textures.paperGold})`,
              backgroundSize: '200px 200px',
              backgroundRepeat: 'repeat',
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-white/30">
                  <Star className="w-6 h-6 text-forest" />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-lg font-semibold text-forest mb-2">
                    Discover More
                  </h3>
                  <p className="text-forest/80 text-sm mb-4">
                    Explore new facilitators and services aligned with your path.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-forest/50 text-forest hover:bg-forest hover:text-white"
                    onClick={() => setLocation('/practitioners')}
                  >
                    Explore
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}