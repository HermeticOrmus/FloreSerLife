import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Practitioners from "@/pages/practitioners";
import ClientDashboard from "@/pages/client-dashboard";
import PractitionerDashboard from "@/pages/practitioner-dashboard";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Survey from "@/pages/survey";

function Router() {
  const { user, isAuthenticated, isLoading } = useAuth();

  const getUserDashboard = () => {
    if (!user || !user.roles) return Home;
    
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
      
      {/* Survey route - always accessible */}
      <Route path="/survey" component={Survey} />
      
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/practitioners" component={Practitioners} />
        </>
      ) : (
        <>
          <Route path="/" component={getUserDashboard()} />
          <Route path="/dashboard/client" component={ClientDashboard} />
          <Route path="/dashboard/practitioner" component={PractitionerDashboard} />
          <Route path="/practitioners" component={Practitioners} />
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
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
