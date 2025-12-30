import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Sparkles } from "lucide-react";
import { logos } from "@/assets";

export default function SignUp() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create account");
      }

      // Redirect to email verification or dashboard
      setLocation("/auth/verify-email");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 py-8">
      {/* Organic gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cream via-garden-accent/5 to-hive-accent/10" />

      {/* Floating organic shapes */}
      <div className="absolute top-20 left-5 w-80 h-80 bg-gradient-to-br from-garden-accent/20 to-transparent rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 right-5 w-72 h-72 bg-gradient-to-tl from-hive-accent/20 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/4 right-1/3 w-56 h-56 bg-gradient-to-r from-gold/15 to-light-green/15 rounded-full blur-2xl animate-float" style={{ animationDelay: '3s' }} />
      <div className="absolute bottom-1/3 left-1/4 w-40 h-40 bg-gradient-to-br from-garden-accent/10 to-gold/10 rounded-full blur-xl animate-float" style={{ animationDelay: '5s' }} />

      {/* Decorative vine pattern - left */}
      <div className="absolute left-0 top-0 w-28 h-full opacity-15 pointer-events-none">
        <svg viewBox="0 0 100 1000" className="h-full w-full" preserveAspectRatio="none">
          <path
            d="M50,0 Q30,100 50,200 T50,400 T50,600 T50,800 T50,1000"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-forest"
          />
          <circle cx="50" cy="150" r="7" className="text-gold fill-current animate-bloom" style={{ animationDelay: '0.3s' }} />
          <circle cx="50" cy="350" r="5" className="text-garden-accent fill-current animate-bloom" style={{ animationDelay: '0.8s' }} />
          <circle cx="50" cy="550" r="9" className="text-hive-accent fill-current animate-bloom" style={{ animationDelay: '1.2s' }} />
          <circle cx="50" cy="750" r="6" className="text-gold fill-current animate-bloom" style={{ animationDelay: '1.6s' }} />
        </svg>
      </div>

      {/* Decorative vine pattern - right */}
      <div className="absolute right-0 top-0 w-28 h-full opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 1000" className="h-full w-full" preserveAspectRatio="none">
          <path
            d="M50,0 Q70,100 50,200 T50,400 T50,600 T50,800 T50,1000"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-forest"
          />
          <circle cx="50" cy="200" r="6" className="text-garden-accent fill-current animate-bloom" style={{ animationDelay: '0.5s' }} />
          <circle cx="50" cy="450" r="8" className="text-hive-accent fill-current animate-bloom" style={{ animationDelay: '1s' }} />
          <circle cx="50" cy="700" r="5" className="text-gold fill-current animate-bloom" style={{ animationDelay: '1.4s' }} />
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
                <div className="absolute inset-0 bg-gradient-to-br from-garden-accent/30 to-gold/30 rounded-full blur-lg animate-float" />
                <img
                  src={logos.main.coloredIcon}
                  alt="FloreSer"
                  className="w-14 h-14 relative z-10 drop-shadow-lg"
                />
              </div>
            </div>
            <CardTitle className="font-heading text-card-heading text-forest">
              Begin Your Journey
            </CardTitle>
            <CardDescription className="text-body-sm text-forest/60">
              Join our community of seekers and facilitators
            </CardDescription>

            {/* Facilitator Pathway Highlight - Nature styled */}
            <div className="mt-4 relative overflow-hidden bg-gradient-to-r from-hive-accent/15 via-gold/10 to-transparent rounded-card p-4 border border-hive-accent/20">
              <div className="absolute top-0 right-0 w-16 h-16 bg-hive-accent/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative flex items-start space-x-3">
                <Badge variant="bee" size="sm" className="mt-0.5 shrink-0">
                  Bee
                </Badge>
                <p className="text-body-sm text-forest/80 text-left">
                  <span className="font-semibold text-forest">New to facilitating?</span> The Bee archetype is your perfect starting point — a supportive community for developing foundational wellness skills.
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            {error && (
              <Alert variant="destructive" className="animate-shake">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Google Sign Up */}
            <Button
              type="button"
              variant="outline"
              className="w-full bg-white/60 hover:bg-white/80 border-sage/30"
              onClick={handleGoogleSignUp}
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

            {/* Email Sign Up Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-forest/80">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-earth-400 z-10" />
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      variant="default"
                      placeholder="First"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-forest/80">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    variant="default"
                    placeholder="Last"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

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
                    placeholder="Create a password"
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-forest/80">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-earth-400 z-10" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    variant="default"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-earth-400 hover:text-forest transition-colors z-10"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="bee"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Creating Account..."
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Begin Your Journey
                  </>
                )}
              </Button>
            </form>

            <div className="text-center text-body-sm text-forest/60">
              Already have an account?{" "}
              <Link href="/auth/signin">
                <span className="text-gold hover:text-gold/80 cursor-pointer font-medium transition-colors">
                  Sign in
                </span>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Bottom decorative text */}
        <p className="text-center text-caption text-forest/40 mt-6">
          Where healing becomes flourishing
        </p>
      </div>
    </div>
  );
}