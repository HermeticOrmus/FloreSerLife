import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AIGuardianProvider } from "@/components/ai-guardian";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Alpha from "@/pages/alpha";
import Home from "@/pages/home";
import Practitioners from "@/pages/practitioners";
import PractitionerProfile from "@/pages/practitioner-profile";
import ClientDashboard from "@/pages/client-dashboard";
import PractitionerDashboard from "@/pages/practitioner-dashboard";
import AdminSurveyPage from "@/pages/admin-survey";
import AdminDashboard from "@/pages/admin-dashboard";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Survey from "@/pages/survey";
import Hive from "@/pages/hive";
import Garden from "@/pages/garden";
import BookSession from "@/pages/book-session";
import SimpleAdminLogin from "@/pages/simple-admin-login";
import SimpleAdminPanel from "@/pages/simple-admin-panel";
import Quiz from "@/pages/quiz";
import Resources from "@/pages/resources";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";

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

      {/* Survey, Hive, Garden and Alpha routes - always accessible */}
      <Route path="/survey" component={Survey} />
      <Route path="/hive" component={Hive} />
      <Route path="/garden" component={Garden} />
      <Route path="/alpha" component={Alpha} />

      {/* Coming Soon pages - always accessible */}
      <Route path="/quiz" component={Quiz} />
      <Route path="/resources" component={Resources} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />

      {/* Admin routes - always accessible */}
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/simple-admin/login" component={SimpleAdminLogin} />
      <Route path="/simple-admin/panel" component={SimpleAdminPanel} />
      
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/practitioners" component={Practitioners} />
          <Route path="/practitioners/:id" component={PractitionerProfile} />
          <Route path="/book/:id" component={BookSession} />
        </>
      ) : (
        <>
          <Route path="/" component={getUserDashboard()} />
          <Route path="/dashboard/client" component={ClientDashboard} />
          <Route path="/dashboard/practitioner" component={PractitionerDashboard} />
          <Route path="/book/:id" component={BookSession} />

          {/* Admin routes - only accessible to admin users */}
          {user?.roles?.includes('admin') && (
            <Route path="/admin/survey" component={AdminSurveyPage} />
          )}

          <Route path="/practitioners" component={Practitioners} />
          <Route path="/practitioners/:id" component={PractitionerProfile} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AIGuardianProvider>
          <Toaster />
          <Router />
        </AIGuardianProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
