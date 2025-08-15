import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { logos } from "@/assets";

export default function Header() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log("Search for:", searchQuery);
    }
  };

  const MobileNav = () => (
    <div className="flex flex-col space-y-4 p-4">
      <Link href="/">
        <Button variant="ghost" className="w-full justify-start">
          Home
        </Button>
      </Link>
      <Link href="/practitioners">
        <Button variant="ghost" className="w-full justify-start">
          Find Practitioners
        </Button>
      </Link>
      {!isAuthenticated ? (
        <>
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => window.location.href = '/api/login'}
          >
            Sign In
          </Button>
          <Button 
            className="w-full bg-gold text-white hover:bg-gold/90"
            onClick={() => window.location.href = '/api/login'}
          >
            Join as Practitioner
          </Button>
        </>
      ) : (
        <Button 
          variant="ghost" 
          className="w-full justify-start text-destructive"
          onClick={() => window.location.href = '/api/logout'}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      )}
    </div>
  );

  return (
    <header className="bg-white shadow-sm border-b border-sage/20 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <img 
                  src={logos.main.coloredIcon} 
                  alt="FloreSer Logo" 
                  className="w-10 h-10"
                />
                <span className="font-heading text-xl font-bold text-forest">FloreSer</span>
              </div>
            </Link>
          </div>
          
          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="text"
                placeholder="Search practitioners, services, or archetypes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-sage/30 rounded-full focus:ring-2 focus:ring-gold/50 focus:border-gold"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage h-4 w-4" />
            </form>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Button 
                  variant="ghost" 
                  className="text-forest hover:text-gold"
                  onClick={() => window.location.href = '/api/login'}
                >
                  Sign In
                </Button>
                <Button 
                  className="bg-gold text-white px-6 py-2 rounded-full hover:bg-gold/90"
                  onClick={() => window.location.href = '/api/login'}
                >
                  Join as Practitioner
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
                      {user?.profileImageUrl ? (
                        <img 
                          src={user.profileImageUrl} 
                          alt="Profile" 
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="text-forest">
                      {user?.firstName || 'Account'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/" className="cursor-pointer">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {user?.roles?.includes('practitioner') && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/practitioner" className="cursor-pointer">
                        Practitioner Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {user?.roles?.includes('client') && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/client" className="cursor-pointer">
                        Client Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/practitioners" className="cursor-pointer">
                      Find Practitioners
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive cursor-pointer"
                    onClick={() => window.location.href = '/api/logout'}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5 text-forest" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="mt-6">
                  <MobileNav />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Search practitioners..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-sage/30 rounded-full"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage h-4 w-4" />
          </form>
        </div>
      </nav>
    </header>
  );
}
