import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, User, LogOut, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { logos, papercut } from "@/assets";
import { cn } from "@/lib/utils";

export default function Header() {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Search for:", searchQuery);
    }
  };

  const handleSignIn = () => setLocation('/auth/signin');
  const handleJoinFloreSer = () => setLocation('/auth/signup');
  const handleSignOut = () => {
    fetch('/api/auth/logout', { method: 'POST' }).then(() => setLocation('/'));
  };

  const NavLink = ({ href, children, testId }: { href: string; children: React.ReactNode; testId?: string }) => (
    <Link href={href}>
      <Button
        variant="ghost"
        className={cn(
          "hover:bg-sage/10 transition-all duration-300",
          "relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2",
          "after:w-0 after:h-0.5 after:bg-gold after:transition-all after:duration-300",
          "hover:after:w-full"
        )}
        data-testid={testId}
      >
        <span className="text-typewriter-medium text-shadow-emboss-sm">
          {children}
        </span>
      </Button>
    </Link>
  );

  const MobileNav = () => (
    <div className="flex flex-col space-y-2 p-4">
      <div className="pb-4 mb-4 border-b border-sage/20">
        <div className="flex items-center space-x-2">
          <img src={logos.main.coloredIcon} alt="FloreSer" className="w-8 h-8" />
          <span className="font-heading text-lg font-bold text-forest">FloreSer</span>
        </div>
      </div>

      {[
        { href: "/", label: "Home", testId: "button-mobile-home" },
        { href: "/practitioners", label: "Find Practitioners", testId: "button-mobile-practitioners" },
        { href: "/hive", label: "The Hive", testId: "button-mobile-hive" },
        { href: "/garden", label: "Community Garden", testId: "button-mobile-garden" },
        { href: "/join-the-hive", label: "Join the Hive", testId: "button-mobile-join-hive" },
        { href: "/survey", label: "Platform Survey", testId: "button-mobile-survey" },
      ].map((item) => (
        <Link key={item.href} href={item.href}>
          <Button
            variant="ghost"
            className="w-full justify-start text-forest hover:text-gold hover:bg-sage/10"
            data-testid={item.testId}
          >
            {item.label}
          </Button>
        </Link>
      ))}

      <div className="pt-4 mt-4 border-t border-sage/20 space-y-2">
        {!isAuthenticated ? (
          <>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleSignIn}
              data-testid="button-mobile-sign-in"
            >
              Sign In
            </Button>
            <Button
              variant="hummingbird"
              className="w-full text-white hover:opacity-90"
              onClick={handleJoinFloreSer}
              data-testid="button-mobile-join-floreser"
              style={{
                backgroundImage: `url(${papercut.textures.paperGold})`,
                backgroundSize: '200px 200px',
                backgroundRepeat: 'repeat',
              }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Start Your Journey
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start text-subtle-rose hover:bg-subtle-rose/10"
            onClick={handleSignOut}
            data-testid="button-mobile-sign-out"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-500 relative",
        isScrolled
          ? "bg-white/80 backdrop-blur-lg shadow-card border-b border-sage/10"
          : "bg-white shadow-card-sm border-b border-sage/20"
      )}
    >
      {/* Paper texture background - all screen sizes */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          backgroundImage: `url(${papercut.textures.paperUI})`,
          backgroundSize: '256px 256px',
          backgroundRepeat: 'repeat',
        }}
      />
      <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer group">
              <img
                src={logos.main.coloredIcon}
                alt="FloreSer Logo"
                className="w-10 h-10 transition-transform duration-300 group-hover:scale-110"
                style={{
                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
                }}
              />
              <span className="font-heading text-xl font-bold transition-all duration-300 text-typewriter-dark text-shadow-emboss tracking-wide">
                FloreSer
              </span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative w-full group">
              <Input
                variant="search"
                type="text"
                placeholder=""
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
                data-testid="input-search-desktop"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-earth-400 h-4 w-4 transition-colors group-focus-within:text-gold" />
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <NavLink href="/hive" testId="button-hive-desktop">The Hive</NavLink>
            <NavLink href="/garden" testId="button-garden-desktop">Garden</NavLink>
            <NavLink href="/join-the-hive" testId="button-join-hive-desktop">Join the Hive</NavLink>
            <NavLink href="/survey" testId="button-survey-desktop">Survey</NavLink>

            {!isAuthenticated ? (
              <div className="flex items-center space-x-2 ml-2">
                <Button
                  variant="ghost"
                  className="hover:bg-sage/10"
                  onClick={handleSignIn}
                  data-testid="button-sign-in-desktop"
                >
                  <span className="text-typewriter-medium text-shadow-emboss-sm">
                    Sign In
                  </span>
                </Button>
                <Button
                  variant="hummingbird"
                  onClick={handleJoinFloreSer}
                  data-testid="button-join-floreser-desktop"
                  className="text-white hover:opacity-90"
                  style={{
                    backgroundImage: `url(${papercut.textures.paperGold})`,
                    backgroundSize: '200px 200px',
                    backgroundRepeat: 'repeat',
                  }}
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  Start Your Journey
                </Button>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 hover:bg-sage/10"
                    data-testid="button-user-menu"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-gold to-hive-accent rounded-full flex items-center justify-center shadow-card-sm">
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
                    <span className="text-forest font-medium">
                      {user?.firstName || 'Account'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-md border-sage/20 shadow-card-lg">
                  <DropdownMenuItem asChild>
                    <Link href="/" className="cursor-pointer" data-testid="link-dashboard">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {user?.roles?.includes('practitioner') && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/practitioner" className="cursor-pointer" data-testid="link-practitioner-dashboard">
                        Practitioner Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {user?.roles?.includes('client') && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/client" className="cursor-pointer" data-testid="link-client-dashboard">
                        Client Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {user?.roles?.includes('admin') && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/survey" className="cursor-pointer" data-testid="link-admin-panel">
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/practitioners" className="cursor-pointer" data-testid="link-find-practitioners">
                      Find Practitioners
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-sage/20" />
                  <DropdownMenuItem
                    className="text-subtle-rose cursor-pointer hover:bg-subtle-rose/10 focus:bg-subtle-rose/10"
                    onClick={handleSignOut}
                    data-testid="button-sign-out"
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
                <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                  <Menu className="h-5 w-5 text-forest" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white/95 backdrop-blur-md">
                <MobileNav />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <Input
              variant="search"
              type="text"
              placeholder=""
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              data-testid="input-search-mobile"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-earth-400 h-4 w-4" />
          </form>
        </div>
      </nav>
    </header>
  );
}
