import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  MessageSquare, 
  Search, 
  Star, 
  User, 
  Settings,
  PlusCircle,
  Clock,
  Users,
  BarChart3,
  FileText
} from "lucide-react";

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  action: () => void;
  variant?: 'default' | 'secondary' | 'outline';
  color?: string;
  disabled?: boolean;
}

interface QuickActionsProps {
  userType: 'client' | 'practitioner';
  onAction?: (actionType: string) => void;
}

export default function QuickActions({ userType, onAction }: QuickActionsProps) {
  const handleAction = (actionType: string) => {
    onAction?.(actionType);
  };

  const clientActions: QuickAction[] = [
    {
      title: "Book New Session",
      description: "Find and book with a practitioner",
      icon: Calendar,
      action: () => handleAction('book-session'),
      variant: 'default',
      color: 'bg-gold text-white hover:bg-gold/90'
    },
    {
      title: "Browse Practitioners",
      description: "Explore available practitioners",
      icon: Search,
      action: () => handleAction('browse-practitioners'),
      variant: 'outline'
    },
    {
      title: "View Messages",
      description: "Check your conversations",
      icon: MessageSquare,
      action: () => handleAction('view-messages'),
      variant: 'outline'
    },
    {
      title: "Update Profile",
      description: "Manage your preferences",
      icon: User,
      action: () => handleAction('update-profile'),
      variant: 'outline'
    }
  ];

  const practitionerActions: QuickAction[] = [
    {
      title: "Add Availability",
      description: "Set your schedule",
      icon: Clock,
      action: () => handleAction('add-availability'),
      variant: 'default',
      color: 'bg-gold text-white hover:bg-gold/90'
    },
    {
      title: "View Schedule",
      description: "Check upcoming sessions",
      icon: Calendar,
      action: () => handleAction('view-schedule'),
      variant: 'outline'
    },
    {
      title: "Client Messages",
      description: "Respond to clients",
      icon: MessageSquare,
      action: () => handleAction('client-messages'),
      variant: 'outline'
    },
    {
      title: "Analytics",
      description: "View your performance",
      icon: BarChart3,
      action: () => handleAction('view-analytics'),
      variant: 'outline'
    },
    {
      title: "Update Profile",
      description: "Manage your listing",
      icon: User,
      action: () => handleAction('update-profile'),
      variant: 'outline'
    },
    {
      title: "Session Notes",
      description: "Add client notes",
      icon: FileText,
      action: () => handleAction('session-notes'),
      variant: 'outline'
    }
  ];

  const actions = userType === 'client' ? clientActions : practitionerActions;

  return (
    <Card className="border-sage/20">
      <CardHeader>
        <CardTitle className="font-heading text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            
            return (
              <Button
                key={index}
                variant={action.variant as any}
                className={`h-auto p-4 flex flex-col items-start space-y-2 text-left ${
                  action.color || 'border-sage/30 hover:border-sage/50'
                }`}
                onClick={action.action}
                disabled={action.disabled}
              >
                <div className="flex items-center space-x-2 w-full">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium text-sm">{action.title}</span>
                </div>
                <span className="text-xs opacity-70 text-left">
                  {action.description}
                </span>
              </Button>
            );
          })}
        </div>
        
        {userType === 'practitioner' && (
          <div className="mt-4 pt-4 border-t border-sage/20">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-forest/60 hover:text-forest"
              onClick={() => handleAction('view-all-tools')}
            >
              <Settings className="w-4 h-4 mr-2" />
              View All Tools
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}