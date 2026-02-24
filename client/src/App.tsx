import { lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AIGuardianProvider } from "@/components/ai-guardian";
import { ErrorBoundary } from "@/components/error-boundary";
import { useAuth } from "@/hooks/useAuth";
import { papercut } from "@/assets";

const NotFound = lazy(() => import("@/pages/not-found"));
const Landing = lazy(() => import("@/pages/landing"));
const Alpha = lazy(() => import("@/pages/alpha"));
const Home = lazy(() => import("@/pages/home"));
const Practitioners = lazy(() => import("@/pages/practitioners"));
const PractitionerProfile = lazy(() => import("@/pages/practitioner-profile"));
const ClientDashboard = lazy(() => import("@/pages/client-dashboard"));
const PractitionerDashboard = lazy(() => import("@/pages/practitioner-dashboard"));
const AdminSurveyPage = lazy(() => import("@/pages/admin-survey"));
const AdminDashboard = lazy(() => import("@/pages/admin-dashboard"));
const SignIn = lazy(() => import("@/pages/SignIn"));
const SignUp = lazy(() => import("@/pages/SignUp"));
const Survey = lazy(() => import("@/pages/survey"));
const Hive = lazy(() => import("@/pages/Hive"));
const Garden = lazy(() => import("@/pages/Garden"));
const JoinTheHive = lazy(() => import("@/pages/JoinTheHive"));
const BookSession = lazy(() => import("@/pages/book-session"));
const SimpleAdminLogin = lazy(() => import("@/pages/simple-admin-login"));
const SimpleAdminPanel = lazy(() => import("@/pages/simple-admin-panel"));
const Quiz = lazy(() => import("@/pages/quiz"));
const Resources = lazy(() => import("@/pages/resources"));
const About = lazy(() => import("@/pages/about"));
const Contact = lazy(() => import("@/pages/contact"));
const Privacy = lazy(() => import("@/pages/privacy"));
const Terms = lazy(() => import("@/pages/terms"));
const DesignSystemTest = lazy(() => import("@/pages/design-system-test"));
const Journal = lazy(() => import("@/pages/journal"));
const Sessions = lazy(() => import("@/pages/sessions"));
const Payments = lazy(() => import("@/pages/payments"));
const Analytics = lazy(() => import("@/pages/analytics"));
const Application = lazy(() => import("@/pages/application"));
const Favorites = lazy(() => import("@/pages/favorites"));
const PractitionerOnboarding = lazy(() => import("@/pages/practitioner-onboarding"));
const ProfileSettings = lazy(() => import("@/pages/profile-settings"));
const AdminApplications = lazy(() => import("@/pages/admin-applications"));

function Router() {
  const { user, isAuthenticated, isLoading } = useAuth();

  const getUserDashboard = () => {
    if (!user || !user.roles) return Home;
    
    // Check if user has admin role first
    if (user.roles.includes('admin')) {
      return AdminSurveyPage;
    }
    
    // Check if user has practitioner role
    if (user.roles.includes('practitioner')) {
      return PractitionerDashboard;
    }
    
    // Check if user has client role
    if (user.roles.includes('client')) {
      return ClientDashboard;
    }
    
    // Default to regular home page
    return Home;
  };

  return (
    <Switch>
      {/* Auth routes - always accessible */}
      <Route path="/auth/signin" component={SignIn} />
      <Route path="/auth/signup" component={SignUp} />

      {/* Survey, Hive, Garden, Join the Hive and Alpha routes - always accessible */}
      <Route path="/survey" component={Survey} />
      <Route path="/hive" component={Hive} />
      <Route path="/garden" component={Garden} />
      <Route path="/join-the-hive" component={JoinTheHive} />
      <Route path="/alpha" component={Alpha} />

      {/* Design System Test - Development only */}
      {import.meta.env.DEV && <Route path="/design-system-test" component={DesignSystemTest} />}

      {/* Coming Soon pages - always accessible */}
      <Route path="/quiz" component={Quiz} />
      <Route path="/resources" component={Resources} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />

      {/* Placeholder pages - always accessible */}
      <Route path="/journal" component={Journal} />
      <Route path="/sessions" component={Sessions} />
      <Route path="/payments" component={Payments} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/application" component={Application} />
      <Route path="/favorites" component={Favorites} />
      <Route path="/profile" component={ProfileSettings} />

      {/* Practitioner Onboarding */}
      <Route path="/become-facilitator" component={PractitionerOnboarding} />

      {/* Admin routes - always accessible */}
      <Route path="/admin/applications/:id" component={AdminApplications} />
      <Route path="/admin/applications" component={AdminApplications} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/simple-admin/login" component={SimpleAdminLogin} />
      <Route path="/simple-admin/panel" component={SimpleAdminPanel} />
      
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/practitioners" component={Practitioners} />
          <Route path="/the-hive" component={Practitioners} />
          <Route path="/practitioners/:id" component={PractitionerProfile} />
          <Route path="/book/:id" component={BookSession} />
        </>
      ) : (
        <>
          <Route path="/" component={getUserDashboard()} />
          <Route path="/dashboard/client" component={ClientDashboard} />
          <Route path="/my-garden" component={ClientDashboard} />
          <Route path="/dashboard/practitioner" component={PractitionerDashboard} />
          <Route path="/my-hive" component={PractitionerDashboard} />
          <Route path="/book/:id" component={BookSession} />

          {/* Admin routes - only accessible to admin users */}
          {user?.roles?.includes('admin') && (
            <Route path="/admin/survey" component={AdminSurveyPage} />
          )}

          <Route path="/practitioners" component={Practitioners} />
          <Route path="/the-hive" component={Practitioners} />
          <Route path="/practitioners/:id" component={PractitionerProfile} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AIGuardianProvider>
            <div className="min-h-screen relative bg-background">
              <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-green-800 focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500">Skip to main content</a>
              {/* Global paper texture overlay - subtle for legibility */}
              <div
                className="fixed inset-0 pointer-events-none z-0 opacity-20"
                style={{
                  backgroundImage: `url(${papercut.textures.paperUI})`,
                  backgroundSize: '256px 256px',
                  backgroundRepeat: 'repeat',
                }}
              />
              <div id="main-content" className="relative z-10">
                <Toaster />
                <Suspense fallback={<div className="min-h-screen flex items-center justify-center" role="status" aria-live="polite"><div className="animate-pulse text-gold text-lg">Loading...</div></div>}>
                  <Router />
                </Suspense>
              </div>
            </div>
          </AIGuardianProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
