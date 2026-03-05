import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Search, Menu, User, LogOut, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { logos, characters } from "@/assets";
import { cn } from "@/lib/utils";

export default function Header() {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignIn = () => setLocation('/auth/signin');
  const handleJoinFloreSer = () => setLocation('/auth/signup');
  const handleSignOut = () => {
    fetch('/api/auth/logout', { method: 'POST' }).then(() => setLocation('/'));
  };

  const NavLink = ({ href, children, testId }: { href: string; children: React.ReactNode; testId?: string }) => (
    <Link href={href}>
      <Button
        variant="ghost"
        className="text-forest/70 hover:text-forest hover:bg-transparent transition-colors"
        data-testid={testId}
      >
        {children}
      </Button>
    </Link>
  );

  const MobileNav = () => (
    <div className="flex flex-col space-y-1 p-6">
      <div className="pb-6 mb-6 border-b border-forest/10">
        <div className="flex items-center space-x-2">
          <img src={characters.maiaIcon} alt="FloreSer" width={28} height={28} className="w-7 h-7 object-contain" />
          <span className="font-heading text-lg text-forest">FloreSer</span>
        </div>
      </div>

      {[
        { href: "/", label: "Home", testId: "button-mobile-home" },
        { href: "/practitioners", label: "Find Practitioners", testId: "button-mobile-practitioners" },
        { href: "/hive", label: "The Hive", testId: "button-mobile-hive" },
        { href: "/garden", label: "Garden", testId: "button-mobile-garden" },
        { href: "/join-the-hive", label: "Join the Hive", testId: "button-mobile-join-hive" },
      ].map((item) => (
        <Link key={item.href} href={item.href}>
          <Button
            variant="ghost"
            className="w-full justify-start text-forest/70 hover:text-forest hover:bg-transparent"
            data-testid={item.testId}
          >
            {item.label}
          </Button>
        </Link>
      ))}

      <div className="pt-6 mt-6 border-t border-forest/10 space-y-2">
        {!isAuthenticated ? (
          <>
            <Button
              variant="ghost"
              className="w-full justify-start text-forest/70"
              onClick={handleSignIn}
              data-testid="button-mobile-sign-in"
            >
              Sign In
            </Button>
            <Button
              className="w-full bg-forest text-white hover:bg-forest/90"
              onClick={handleJoinFloreSer}
              data-testid="button-mobile-join-floreser"
            >
              Start Your Journey
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start text-subtle-rose"
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
        "sticky top-0 z-50 transition-all duration-300 bg-white origami-paper",
        isScrolled
          ? "origami-fold-shadow border-b border-forest/5"
          : "border-b border-forest/10"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <img
                src={characters.maiaIcon}
                alt="FloreSer Logo"
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
              <span className="font-heading text-xl text-forest tracking-wide">
                FloreSer
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink href="/hive" testId="button-hive-desktop">The Hive</NavLink>
            <NavLink href="/garden" testId="button-garden-desktop">Garden</NavLink>
            <NavLink href="/join-the-hive" testId="button-join-hive-desktop">Join the Hive</NavLink>

            {!isAuthenticated ? (
              <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-forest/10">
                <Button
                  variant="ghost"
                  className="text-forest/70 hover:text-forest hover:bg-transparent"
                  onClick={handleSignIn}
                  data-testid="button-sign-in-desktop"
                >
                  Sign In
                </Button>
                <Button
                  onClick={handleJoinFloreSer}
                  data-testid="button-join-floreser-desktop"
                  className="bg-forest text-white hover:bg-forest/90"
                >
                  Start Your Journey
                </Button>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 hover:bg-transparent ml-4"
                    data-testid="button-user-menu"
                  >
                    <div className="w-8 h-8 bg-forest rounded-full flex items-center justify-center">
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
                <DropdownMenuContent align="end" className="w-56 bg-white border-forest/10">
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
                  <DropdownMenuSeparator className="bg-forest/10" />
                  <DropdownMenuItem
                    className="text-subtle-rose cursor-pointer"
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
              <SheetContent side="right" className="w-72 bg-white border-l border-forest/10">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <MobileNav />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
