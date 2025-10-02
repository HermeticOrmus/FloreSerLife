import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Calendar,
  MessageSquare,
  Settings,
  HelpCircle,
  Star,
  Users,
  BarChart3,
  PlusCircle
} from "lucide-react";

interface SidebarNavItem {
  title: string;
  icon: React.ComponentType<any>;
  href?: string;
  action?: () => void;
  badge?: string;
  isActive?: boolean;
}

interface DashboardSidebarProps {
  userType: 'client' | 'practitioner';
  activeSection?: string;
  onNavigate?: (section: string) => void;
}

export default function DashboardSidebar({ userType, activeSection, onNavigate }: DashboardSidebarProps) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const clientNavItems: SidebarNavItem[] = [
    { title: "Dashboard", icon: BarChart3, href: "dashboard" },
    { title: "Find Practitioners", icon: Users, href: "practitioners" },
    { title: "My Sessions", icon: Calendar, href: "sessions", badge: "2" },
    { title: "Messages", icon: MessageSquare, href: "messages", badge: "3" },
    { title: "Favorites", icon: Star, href: "favorites" },
    { title: "Profile", icon: User, href: "profile" },
    { title: "Settings", icon: Settings, href: "settings" },
  ];

  const practitionerNavItems: SidebarNavItem[] = [
    { title: "Dashboard", icon: BarChart3, href: "dashboard" },
    { title: "Schedule", icon: Calendar, href: "schedule", badge: "5" },
    { title: "Clients", icon: Users, href: "clients" },
    { title: "Messages", icon: MessageSquare, href: "messages", badge: "2" },
    { title: "Reviews", icon: Star, href: "reviews" },
    { title: "Profile", icon: User, href: "profile" },
    { title: "Settings", icon: Settings, href: "settings" },
  ];

  const navItems = userType === 'client' ? clientNavItems : practitionerNavItems;

  const handleNavClick = (item: SidebarNavItem) => {
    if (item.action) {
      item.action();
    } else if (item.href && onNavigate) {
      onNavigate(item.href);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <div className="text-center">
        <Avatar className="w-16 h-16 mx-auto mb-3">
          <AvatarImage src={user?.profileImageUrl || undefined} alt={user?.firstName || 'User'} />
          <AvatarFallback className="bg-gold text-white text-lg font-semibold">
            {user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || ''}
          </AvatarFallback>
        </Avatar>
        <h3 className="font-heading font-semibold text-forest">
          {user?.firstName || ''} {user?.lastName || ''}
        </h3>
        <p className="text-sm text-forest/60 capitalize">
          {userType}
        </p>
        {userType === 'practitioner' && (
          <Badge variant="secondary" className="mt-2 bg-gold/20 text-gold">
            Verified
          </Badge>
        )}
      </div>

      <Separator className="bg-sage/20" />

      {/* Navigation */}
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = activeSection === item.href;
          const Icon = item.icon;
          
          return (
            <Button
              key={item.title}
              variant={isActive ? "secondary" : "ghost"}
              className={`w-full justify-start h-10 px-3 ${
                isActive 
                  ? "bg-gold/10 text-gold hover:bg-gold/20" 
                  : "text-forest/70 hover:text-forest hover:bg-sage/10"
              }`}
              onClick={() => handleNavClick(item)}
            >
              <Icon className="w-4 h-4 mr-3" />
              <span className="flex-1 text-left">{item.title}</span>
              {item.badge && (
                <Badge 
                  variant="secondary" 
                  className="ml-auto bg-gold text-white text-xs min-w-[20px] h-5"
                >
                  {item.badge}
                </Badge>
              )}
            </Button>
          );
        })}
      </nav>

      <Separator className="bg-sage/20" />

      {/* Quick Actions */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-forest/60 px-3">Quick Actions</h4>
        
        {userType === 'client' ? (
          <Button
            variant="outline"
            size="sm"
            className="w-full border-gold text-gold hover:bg-gold hover:text-white"
            onClick={() => setLocation('/hive')}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Book Session
          </Button>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-gold text-gold hover:bg-gold hover:text-white"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Availability
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full text-forest/60 hover:text-forest"
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          Help & Support
        </Button>
      </div>
    </div>
  );
}