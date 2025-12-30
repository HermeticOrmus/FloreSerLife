import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import StatCard from "@/components/dashboard/stat-card";
import ActivityFeed from "@/components/dashboard/activity-feed";
import QuickActions from "@/components/dashboard/quick-actions";
import UpcomingSessions from "@/components/dashboard/upcoming-sessions";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  MessageSquare, 
  User, 
  TrendingUp, 
  Star,
  Heart
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
    document.title = "Client Dashboard - FloreSer";
  }, []);

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
      title={`Welcome back, ${user?.firstName || 'Friend'}!`}
      subtitle="Your wellness journey continues here."
      sidebar={sidebar}
      actions={actions}
    >
      <div className="space-y-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Upcoming Sessions"
            value={bookingsLoading ? '-' : stats.upcomingSessions}
            description={stats.upcomingSessions > 0 ? 'Scheduled' : 'No upcoming sessions'}
            icon={Calendar}
            iconColor="text-blue-600"
          />
          <StatCard
            title="Total Sessions"
            value={bookingsLoading ? '-' : stats.totalSessions}
            description="All time"
            icon={TrendingUp}
            iconColor="text-green-600"
          />
          <StatCard
            title="Messages"
            value={stats.unreadMessages}
            description="Unread"
            icon={MessageSquare}
            iconColor="text-purple-600"
          />
          <StatCard
            title="Favorite Practitioners"
            value={stats.favoritePractitioners}
            description="Saved"
            icon={Heart}
            iconColor="text-red-500"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Sessions and Actions */}
          <div className="lg:col-span-2 space-y-6">
            <UpcomingSessions
              sessions={bookingsLoading ? mockUpcomingSessions : upcomingSessions}
              userType="client"
              onSessionAction={handleSessionAction}
            />

            <QuickActions
              userType="client"
              onAction={handleQuickAction}
            />

            {/* Booking History */}
            {!bookingsLoading && pastSessions.length > 0 && (
              <div className="bg-white rounded-lg border border-sage/20 p-6">
                <h3 className="font-heading text-lg font-semibold text-forest mb-4">
                  Booking History
                </h3>
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
                {pastSessions.length > 5 && (
                  <Button
                    variant="ghost"
                    className="w-full mt-4 text-gold hover:text-gold/80"
                  >
                    View All History ({pastSessions.length} sessions)
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Activity Feed */}
          <div className="lg:col-span-1">
            <ActivityFeed
              activities={mockRecentActivity}
              userType="client"
            />
          </div>
        </div>

        {/* Additional Widgets */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Wellness Progress */}
          <div className="bg-gradient-to-br from-sage/10 to-light-green/10 rounded-lg p-6 border border-sage/20">
            <h3 className="font-heading text-lg font-semibold text-forest mb-3">
              Wellness Journey
            </h3>
            <p className="text-forest/70 mb-4">
              Track your progress and see how you're growing on your wellness path.
            </p>
            <Button variant="outline" className="border-sage text-sage hover:bg-sage hover:text-white">
              View Progress
            </Button>
          </div>

          {/* Recommendations */}
          <div className="bg-gradient-to-br from-gold/10 to-cream rounded-lg p-6 border border-sage/20">
            <h3 className="font-heading text-lg font-semibold text-forest mb-3">
              Recommended for You
            </h3>
            <p className="text-forest/70 mb-4">
              Discover new practitioners and services that match your wellness goals.
            </p>
            <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-white">
              Explore Recommendations
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}