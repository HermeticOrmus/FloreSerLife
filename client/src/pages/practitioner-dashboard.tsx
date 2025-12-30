import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import StatCard from "@/components/dashboard/stat-card";
import ActivityFeed from "@/components/dashboard/activity-feed";
import QuickActions from "@/components/dashboard/quick-actions";
import UpcomingSessions from "@/components/dashboard/upcoming-sessions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  MessageSquare, 
  DollarSign, 
  Users, 
  Star,
  TrendingUp,
  Clock,
  BarChart3
} from "lucide-react";

// Mock data - in real app this would come from API
const mockPractitionerStats = {
  upcomingSessions: 5,
  totalClients: 23,
  unreadMessages: 2,
  monthlyEarnings: 2840,
  averageRating: 4.8,
  completedSessions: 156
};

const mockUpcomingSessions = [
  {
    id: '1',
    clientName: 'Emma Rodriguez',
    date: '2025-01-16',
    time: '09:00',
    duration: 60,
    type: 'virtual' as const,
    status: 'confirmed' as const,
    avatar: '',
    meetingLink: 'https://meet.example.com/session-1',
    notes: 'First session - anxiety and stress management'
  },
  {
    id: '2',
    clientName: 'Michael Chen',
    date: '2025-01-16',
    time: '14:30',
    duration: 90,
    type: 'in-person' as const,
    status: 'confirmed' as const,
    avatar: '',
    location: 'Office Suite 204'
  },
  {
    id: '3',
    clientName: 'Sarah Johnson',
    date: '2025-01-17',
    time: '11:00',
    duration: 60,
    type: 'virtual' as const,
    status: 'scheduled' as const,
    avatar: ''
  }
];

const mockRecentActivity = [
  {
    id: '1',
    type: 'session' as const,
    title: 'Session completed',
    description: 'Mindfulness session with Emma Rodriguez',
    timestamp: '2 hours ago',
    status: 'completed' as const,
    metadata: { rating: 5, amount: 120 }
  },
  {
    id: '2',
    type: 'booking' as const,
    title: 'New booking',
    description: 'Michael Chen booked a session',
    timestamp: '1 day ago',
    status: 'pending' as const
  },
  {
    id: '3',
    type: 'review' as const,
    title: 'New review',
    description: 'Sarah Johnson left a 5-star review',
    timestamp: '3 days ago',
    status: undefined,
    metadata: { rating: 5 }
  },
  {
    id: '4',
    type: 'payment' as const,
    title: 'Payment received',
    description: 'Weekly earnings payout',
    timestamp: '1 week ago',
    status: 'completed' as const,
    metadata: { amount: 680 }
  }
];

export default function PractitionerDashboard() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    document.title = "Practitioner Dashboard - FloreSer";
  }, []);

  // Fetch practitioner's bookings
  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ['/api/bookings'],
    enabled: !!user,
  });

  // Transform bookings into session format
  const upcomingSessions = (bookings as any[])
    .filter((booking: any) =>
      booking.status === 'scheduled' &&
      new Date(booking.scheduledDatetime) > new Date()
    )
    .map((booking: any) => ({
      id: booking.id,
      clientName: booking.clientName || 'Client',
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

  const completedSessions = (bookings as any[])
    .filter((booking: any) => booking.status === 'completed')
    .length;

  // Calculate stats from real booking data
  const stats = {
    upcomingSessions: upcomingSessions.length,
    totalClients: mockPractitionerStats.totalClients, // TODO: calculate unique clients
    unreadMessages: mockPractitionerStats.unreadMessages,
    monthlyEarnings: (bookings as any[])
      .filter((b: any) => {
        const bookingDate = new Date(b.scheduledDatetime);
        const now = new Date();
        return bookingDate.getMonth() === now.getMonth() &&
               bookingDate.getFullYear() === now.getFullYear() &&
               b.status === 'completed';
      })
      .reduce((sum: number, b: any) => sum + (parseFloat(b.totalAmount) || 0), 0),
    averageRating: mockPractitionerStats.averageRating,
    completedSessions
  };

  const handleQuickAction = (actionType: string) => {
    console.log('Quick action:', actionType);
    // Handle navigation or actions
    switch (actionType) {
      case 'add-availability':
        setActiveSection('schedule');
        break;
      case 'view-schedule':
        setActiveSection('schedule');
        break;
      case 'client-messages':
        setActiveSection('messages');
        break;
      case 'view-analytics':
        setActiveSection('analytics');
        break;
      case 'update-profile':
        setActiveSection('profile');
        break;
      case 'session-notes':
        // Open session notes interface
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
      case 'view-details':
        // Show session details
        break;
      case 'cancel':
        // Show cancellation dialog
        break;
    }
  };

  const sidebar = (
    <DashboardSidebar 
      userType="practitioner" 
      activeSection={activeSection}
      onNavigate={setActiveSection}
    />
  );

  const actions = (
    <div className="flex space-x-3">
      <Button 
        className="bg-gold text-white hover:bg-gold/90"
        onClick={() => handleQuickAction('add-availability')}
      >
        <Clock className="w-4 h-4 mr-2" />
        Add Availability
      </Button>
      <Button 
        variant="outline"
        onClick={() => handleQuickAction('view-analytics')}
      >
        <BarChart3 className="w-4 h-4 mr-2" />
        Analytics
      </Button>
    </div>
  );

  return (
    <DashboardLayout
      title={`Welcome back, ${user?.firstName || 'Practitioner'}!`}
      subtitle="Manage your practice and connect with clients."
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
            title="Active Clients"
            value={stats.totalClients}
            description="This month"
            icon={Users}
            iconColor="text-green-600"
          />
          <StatCard
            title="Monthly Earnings"
            value={bookingsLoading ? '-' : `$${stats.monthlyEarnings.toFixed(0)}`}
            description="This month"
            icon={DollarSign}
            iconColor="text-emerald-600"
          />
          <StatCard
            title="Completed Sessions"
            value={bookingsLoading ? '-' : stats.completedSessions}
            description="All time"
            icon={TrendingUp}
            iconColor="text-green-500"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Sessions and Actions */}
          <div className="lg:col-span-2 space-y-6">
            <UpcomingSessions
              sessions={bookingsLoading ? mockUpcomingSessions : upcomingSessions}
              userType="practitioner"
              onSessionAction={handleSessionAction}
            />

            <QuickActions
              userType="practitioner"
              onAction={handleQuickAction}
            />

            {/* All Bookings Management */}
            {!bookingsLoading && (bookings as any[]).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-forest">
                    Booking Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {(bookings as any[]).slice(0, 10).map((booking: any) => {
                      const bookingDate = new Date(booking.scheduledDatetime);
                      const isPast = bookingDate < new Date();

                      return (
                        <div
                          key={booking.id}
                          className={`flex items-center justify-between p-4 rounded-lg border ${
                            isPast ? 'bg-gray-50 border-gray-200' : 'bg-sage/5 border-sage/20'
                          } hover:shadow-sm transition-shadow`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <p className="font-medium text-forest">
                                {booking.clientName || 'Client'}
                              </p>
                              <Badge
                                variant={booking.status === 'scheduled' ? 'default' : 'secondary'}
                                className={
                                  booking.status === 'scheduled' ? 'bg-gold text-white' :
                                  booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                  ''
                                }
                              >
                                {booking.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-forest/60 mt-1">
                              {bookingDate.toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                              })} at {bookingDate.toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit'
                              })} • {booking.duration} min • {booking.isVirtual ? 'Virtual' : 'In-Person'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-forest">
                              ${parseFloat(booking.totalAmount || '0').toFixed(2)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {(bookings as any[]).length > 10 && (
                    <Button
                      variant="ghost"
                      className="w-full mt-4 text-gold hover:text-gold/80"
                    >
                      View All Bookings ({(bookings as any[]).length} total)
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Activity Feed */}
          <div className="lg:col-span-1">
            <ActivityFeed
              activities={mockRecentActivity}
              userType="practitioner"
            />
          </div>
        </div>

        {/* Business Insights */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Weekly Performance */}
          <Card className="border-sage/20">
            <CardHeader>
              <CardTitle className="font-heading text-lg flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-forest/70">Sessions</span>
                  <span className="font-semibold text-forest">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-forest/70">Earnings</span>
                  <span className="font-semibold text-forest">$960</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-forest/70">New Clients</span>
                  <span className="font-semibold text-forest">2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-forest/70">Performance</span>
                  <Badge className="bg-green-100 text-green-800">
                    +15% vs last week
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card className="border-sage/20">
            <CardHeader>
              <CardTitle className="font-heading text-lg flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-500" />
                Recent Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-cream/50 rounded">
                  <div className="flex items-center mb-1">
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs text-forest/60 ml-2">2 days ago</span>
                  </div>
                  <p className="text-sm text-forest/80">
                    "Excellent session. Very insightful and helpful."
                  </p>
                  <p className="text-xs text-forest/60 mt-1">- Sarah J.</p>
                </div>
                <Button variant="ghost" size="sm" className="w-full text-gold hover:text-gold/80">
                  View All Reviews
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Availability Status */}
          <Card className="border-sage/20">
            <CardHeader>
              <CardTitle className="font-heading text-lg flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                Availability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-forest/70">Status</span>
                  <Badge className="bg-green-100 text-green-800">
                    Available
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-forest/70">Next Available</span>
                  <span className="font-semibold text-forest">Today 3:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-forest/70">Open Slots</span>
                  <span className="font-semibold text-forest">12 this week</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-gold text-gold hover:bg-gold hover:text-white"
                  onClick={() => handleQuickAction('add-availability')}
                >
                  Update Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}