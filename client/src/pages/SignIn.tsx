import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Sparkles } from "lucide-react";
import { logos } from "@/assets";

export default function SignIn() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to sign in");
      }

      // Redirect to dashboard or home
      setLocation("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Organic gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cream via-light-green/10 to-hive-accent/5" />

      {/* Floating organic shapes */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-garden-accent/15 to-transparent rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-tl from-hive-accent/15 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-gradient-to-r from-gold/10 to-light-green/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }} />

      {/* Decorative vine pattern - left */}
      <div className="absolute left-0 top-0 w-32 h-full opacity-15 pointer-events-none">
        <svg viewBox="0 0 100 800" className="h-full w-full" preserveAspectRatio="none">
          <path
            d="M50,0 Q30,100 50,200 T50,400 T50,600 T50,800"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-forest"
          />
          <circle cx="50" cy="150" r="8" className="text-gold fill-current animate-bloom" style={{ animationDelay: '0.5s' }} />
          <circle cx="50" cy="350" r="6" className="text-garden-accent fill-current animate-bloom" style={{ animationDelay: '1s' }} />
          <circle cx="50" cy="550" r="10" className="text-hive-accent fill-current animate-bloom" style={{ animationDelay: '1.5s' }} />
        </svg>
      </div>

      {/* Decorative vine pattern - right */}
      <div className="absolute right-0 top-0 w-32 h-full opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 800" className="h-full w-full" preserveAspectRatio="none">
          <path
            d="M50,0 Q70,100 50,200 T50,400 T50,600 T50,800"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-forest"
          />
          <circle cx="50" cy="250" r="7" className="text-garden-accent fill-current animate-bloom" style={{ animationDelay: '0.8s' }} />
          <circle cx="50" cy="450" r="5" className="text-gold fill-current animate-bloom" style={{ animationDelay: '1.3s' }} />
        </svg>
      </div>

      <div className="w-full max-w-md relative z-10 animate-petal-fade">
        {/* Back to home */}
        <Link href="/">
          <Button variant="ghost" className="mb-4 text-forest hover:text-gold group">
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to FloreSer
          </Button>
        </Link>

        <Card variant="glass" className="shadow-card-xl border-white/40">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gold/30 to-garden-accent/30 rounded-full blur-lg animate-float" />
                <img
                  src={logos.main.coloredIcon}
                  alt="FloreSer"
                  className="w-14 h-14 relative z-10 drop-shadow-lg"
                />
              </div>
            </div>
            <CardTitle className="font-heading text-card-heading text-forest">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-body-sm text-forest/60">
              Sign in to continue your wellness journey
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive" className="animate-shake">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Google Sign In */}
            <Button
              type="button"
              variant="outline"
              className="w-full bg-white/60 hover:bg-white/80 border-sage/30"
              onClick={handleGoogleSignIn}
            >
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google"
                className="w-4 h-4 mr-2"
              />
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-sage/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full text-forest/50">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-forest/80">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-earth-400 z-10" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    variant="default"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-forest/80">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-earth-400 z-10" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    variant="default"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-earth-400 hover:text-forest transition-colors z-10"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <Link href="/auth/forgot-password">
                  <span className="text-body-sm text-gold hover:text-gold/80 cursor-pointer transition-colors">
                    Forgot password?
                  </span>
                </Link>
              </div>

              <Button
                type="submit"
                variant="hummingbird"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Signing In..."
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <div className="text-center text-body-sm text-forest/60">
              Don't have an account?{" "}
              <Link href="/auth/signup">
                <span className="text-gold hover:text-gold/80 cursor-pointer font-medium transition-colors">
                  Join FloreSer
                </span>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Bottom decorative text */}
        <p className="text-center text-caption text-forest/40 mt-6">
          Your sanctuary for holistic wellness
        </p>
      </div>
    </div>
  );
}