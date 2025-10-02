import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLocation } from "wouter";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Phone,
  MessageSquare,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Session {
  id: string;
  clientName?: string;
  practitionerName?: string;
  date: string;
  time: string;
  duration: number;
  type: 'virtual' | 'in-person';
  status: 'scheduled' | 'confirmed' | 'pending' | 'cancelled';
  avatar?: string;
  meetingLink?: string;
  location?: string;
  notes?: string;
}

interface UpcomingSessionsProps {
  sessions: Session[];
  userType: 'client' | 'practitioner';
  onSessionAction?: (sessionId: string, action: string) => void;
}

export default function UpcomingSessions({
  sessions,
  userType,
  onSessionAction
}: UpcomingSessionsProps) {
  const [, setLocation] = useLocation();
  const getStatusColor = (status: Session['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAction = (sessionId: string, action: string) => {
    onSessionAction?.(sessionId, action);
  };

  const formatDateTime = (date: string, time: string) => {
    const sessionDate = new Date(`${date}T${time}`);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const isToday = sessionDate.toDateString() === today.toDateString();
    const isTomorrow = sessionDate.toDateString() === tomorrow.toDateString();
    
    let dateLabel = '';
    if (isToday) dateLabel = 'Today';
    else if (isTomorrow) dateLabel = 'Tomorrow';
    else dateLabel = sessionDate.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
    
    const timeLabel = sessionDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    return { dateLabel, timeLabel };
  };

  return (
    <Card className="border-sage/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-heading text-lg">Upcoming Sessions</CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleAction('', 'view-all')}
        >
          View All
        </Button>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-forest/60">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-sage" />
            <p className="font-medium">No upcoming sessions</p>
            <p className="text-sm">
              {userType === 'client' 
                ? 'Book your first session to get started!' 
                : 'Your upcoming client sessions will appear here.'}
            </p>
            <Button
              className="mt-4 bg-gold text-white hover:bg-gold/90"
              onClick={() => {
                if (userType === 'client') {
                  setLocation('/hive');
                } else {
                  handleAction('', 'add-availability');
                }
              }}
            >
              {userType === 'client' ? 'Book Session' : 'Add Availability'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.slice(0, 3).map((session) => {
              const { dateLabel, timeLabel } = formatDateTime(session.date, session.time);
              const displayName = userType === 'client' 
                ? session.practitionerName 
                : session.clientName;
              
              return (
                <div 
                  key={session.id} 
                  className="p-4 border border-sage/20 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={session.avatar} />
                        <AvatarFallback className="bg-sage/20 text-forest">
                          {displayName?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-forest">{displayName}</p>
                        <div className="flex items-center space-x-2 text-sm text-forest/60">
                          <Calendar className="w-3 h-3" />
                          <span>{dateLabel}</span>
                          <Clock className="w-3 h-3 ml-2" />
                          <span>{timeLabel}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge className={`text-xs ${getStatusColor(session.status)}`}>
                        {session.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {session.type === 'virtual' && session.meetingLink && (
                            <DropdownMenuItem onClick={() => handleAction(session.id, 'join-meeting')}>
                              <Video className="w-4 h-4 mr-2" />
                              Join Meeting
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleAction(session.id, 'send-message')}>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction(session.id, 'view-details')}>
                            View Details
                          </DropdownMenuItem>
                          {session.status === 'scheduled' && (
                            <DropdownMenuItem 
                              onClick={() => handleAction(session.id, 'cancel')}
                              className="text-red-600"
                            >
                              Cancel Session
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-forest/60">
                      <div className="flex items-center space-x-1">
                        {session.type === 'virtual' ? (
                          <Video className="w-4 h-4" />
                        ) : (
                          <MapPin className="w-4 h-4" />
                        )}
                        <span>{session.type === 'virtual' ? 'Virtual' : 'In-Person'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{session.duration} min</span>
                      </div>
                    </div>
                    
                    {session.status === 'confirmed' && (
                      <div className="flex space-x-2">
                        {session.type === 'virtual' && session.meetingLink && (
                          <Button 
                            size="sm" 
                            className="bg-gold text-white hover:bg-gold/90"
                            onClick={() => handleAction(session.id, 'join-meeting')}
                          >
                            <Video className="w-4 h-4 mr-1" />
                            Join
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAction(session.id, 'send-message')}
                        >
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Message
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {session.notes && (
                    <div className="mt-3 p-2 bg-cream/50 rounded text-sm text-forest/70">
                      <strong>Note:</strong> {session.notes}
                    </div>
                  )}
                </div>
              );
            })}
            
            {sessions.length > 3 && (
              <div className="text-center pt-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleAction('', 'view-all-sessions')}
                  className="text-gold hover:text-gold/80"
                >
                  View {sessions.length - 3} more sessions →
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}