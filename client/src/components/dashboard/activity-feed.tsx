import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  MessageSquare, 
  Star, 
  UserCheck, 
  DollarSign,
  Clock,
  CheckCircle
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: 'session' | 'message' | 'review' | 'booking' | 'payment' | 'profile';
  title: string;
  description: string;
  timestamp: string;
  avatar?: string;
  status?: 'completed' | 'pending' | 'cancelled';
  metadata?: Record<string, any>;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  userType: 'client' | 'practitioner';
}

export default function ActivityFeed({ activities, userType }: ActivityFeedProps) {
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'session':
        return Calendar;
      case 'message':
        return MessageSquare;
      case 'review':
        return Star;
      case 'booking':
        return UserCheck;
      case 'payment':
        return DollarSign;
      case 'profile':
        return UserCheck;
      default:
        return Clock;
    }
  };

  const getActivityColor = (type: ActivityItem['type'], status?: string) => {
    if (status === 'completed') return 'text-green-600';
    if (status === 'cancelled') return 'text-red-600';
    
    switch (type) {
      case 'session':
        return 'text-blue-600';
      case 'message':
        return 'text-purple-600';
      case 'review':
        return 'text-yellow-600';
      case 'booking':
        return 'text-green-600';
      case 'payment':
        return 'text-emerald-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    const variants = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={`text-xs ${variants[status as keyof typeof variants] || ''}`}>
        {status}
      </Badge>
    );
  };

  return (
    <Card className="border-sage/20">
      <CardHeader>
        <CardTitle className="font-heading text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-forest/60">
            <Clock className="w-12 h-12 mx-auto mb-3 text-sage" />
            <p>No recent activity</p>
            <p className="text-sm">
              {userType === 'client' 
                ? 'Book your first session to get started!' 
                : 'Your client interactions will appear here.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              const iconColor = getActivityColor(activity.type, activity.status);
              
              return (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-cream/50 transition-colors">
                  <div className={`p-2 rounded-full bg-white shadow-sm ${iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-forest">
                        {activity.title}
                      </p>
                      {getStatusBadge(activity.status)}
                    </div>
                    
                    <p className="text-sm text-forest/70 mb-1">
                      {activity.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-forest/50">
                        {activity.timestamp}
                      </span>
                      
                      {activity.metadata?.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-forest/60">
                            {activity.metadata.rating}/5
                          </span>
                        </div>
                      )}
                      
                      {activity.metadata?.amount && (
                        <span className="text-xs font-medium text-green-600">
                          ${activity.metadata.amount}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {activity.avatar && (
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={activity.avatar} />
                      <AvatarFallback className="text-xs">
                        {activity.title.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        {activities.length > 0 && (
          <div className="mt-4 pt-4 border-t border-sage/20">
            <button className="text-sm text-gold hover:text-gold/80 font-medium">
              View all activity →
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}