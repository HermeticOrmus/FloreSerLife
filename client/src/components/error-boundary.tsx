import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the whole app.
 *
 * Uses React's class component pattern because error boundaries must use
 * componentDidCatch and getDerivedStateFromError lifecycle methods.
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error details for debugging
    console.error("ErrorBoundary caught an error:", error);
    console.error("Component stack:", errorInfo.componentStack);
  }

  handleReload = (): void => {
    // Clear state and reload the page
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Allow custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI with papercraft styling
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[hsl(60,56%,91%)] p-4">
          <Card className="w-full max-w-md border-2 border-[hsl(82,15%,62%)]/30 shadow-lg">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-[hsl(82,15%,62%)]/20 flex items-center justify-center">
                  <Leaf className="h-8 w-8 text-[hsl(82,15%,62%)]" />
                </div>
              </div>
              <CardTitle className="text-xl font-heading text-[hsl(180,25%,31%)]">
                Something went a little sideways
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-[hsl(180,25%,31%)]/80 font-body">
                Like a seed that needs replanting, sometimes things need a fresh start.
                Let's try again together.
              </p>

              <Button
                onClick={this.handleReload}
                className="bg-[hsl(45,70%,52%)] hover:bg-[hsl(45,70%,45%)] text-white font-medium px-6"
              >
                Try Again
              </Button>

              {/* Show error details in development for debugging */}
              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-sm text-[hsl(0,0%,66%)] hover:text-[hsl(180,25%,31%)]">
                    Technical details
                  </summary>
                  <pre className="mt-2 p-3 bg-[hsl(60,56%,95%)] rounded-md text-xs text-[hsl(180,25%,31%)]/70 overflow-auto max-h-40">
                    {this.state.error.message}
                    {this.state.error.stack && (
                      <>
                        {"\n\n"}
                        {this.state.error.stack}
                      </>
                    )}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
