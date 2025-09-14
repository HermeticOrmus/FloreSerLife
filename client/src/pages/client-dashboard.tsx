import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
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
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    document.title = "Client Dashboard - FloreSer";
  }, []);

  const handleQuickAction = (actionType: string) => {
    console.log('Quick action:', actionType);
    // Handle navigation or actions
    switch (actionType) {
      case 'book-session':
        // Navigate to practitioner search
        break;
      case 'browse-practitioners':
        // Navigate to practitioners page
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
            value={mockClientStats.upcomingSessions}
            description="Next session tomorrow"
            icon={Calendar}
            iconColor="text-blue-600"
          />
          <StatCard
            title="Total Sessions"
            value={mockClientStats.totalSessions}
            description="This year"
            icon={TrendingUp}
            iconColor="text-green-600"
            trend={{ value: "3 this month", isPositive: true }}
          />
          <StatCard
            title="Messages"
            value={mockClientStats.unreadMessages}
            description="Unread"
            icon={MessageSquare}
            iconColor="text-purple-600"
          />
          <StatCard
            title="Favorite Practitioners"
            value={mockClientStats.favoritePractitioners}
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
              sessions={mockUpcomingSessions}
              userType="client"
              onSessionAction={handleSessionAction}
            />
            
            <QuickActions
              userType="client"
              onAction={handleQuickAction}
            />
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