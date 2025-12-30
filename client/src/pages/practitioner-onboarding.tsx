import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  MapPin,
  Video,
  DollarSign,
  User
} from "lucide-react";
import { ArchetypeIcons } from "@/components/icons/archetype-icons";
import {
  archetypeDefinitions,
  experienceLevelDefinitions,
  professionalCategoryDefinitions,
  categoryGroups
} from "@shared/schema";

type Archetype = "bee" | "hummingbird" | "butterfly" | "beetle";
type ExperienceLevel = "rising" | "evolving" | "wise";

interface OnboardingData {
  archetype: Archetype | null;
  experienceLevel: ExperienceLevel | null;
  bio: string;
  specializations: string[];
  professionalCategories: string[];
  hourlyRate: string;
  location: string;
  isVirtual: boolean;
  isInPerson: boolean;
  yearsActive: string;
}

const STEPS = [
  { id: 1, title: "Archetype", description: "Choose your healing approach" },
  { id: 2, title: "Experience", description: "Your journey level" },
  { id: 3, title: "Profile", description: "Tell your story" },
  { id: 4, title: "Services", description: "Set your offerings" },
  { id: 5, title: "Review", description: "Confirm & launch" },
];

export default function PractitionerOnboarding() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    archetype: null,
    experienceLevel: null,
    bio: "",
    specializations: [],
    professionalCategories: [],
    hourlyRate: "",
    location: "",
    isVirtual: true,
    isInPerson: false,
    yearsActive: "",
  });
  const [specializationInput, setSpecializationInput] = useState("");

  useEffect(() => {
    document.title = "Become a Facilitator - FloreSer";
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to become a facilitator",
        variant: "destructive",
      });
      setLocation("/auth/signin");
    }
  }, [authLoading, isAuthenticated, setLocation, toast]);

  const createPractitionerMutation = useMutation({
    mutationFn: async (practitionerData: any) => {
      const response = await fetch("/api/practitioners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(practitionerData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create practitioner profile");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Welcome to FloreSer!",
        description: "Your facilitator profile has been created successfully.",
      });
      setLocation("/dashboard/practitioner");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (!data.archetype || !data.experienceLevel) {
      toast({
        title: "Missing information",
        description: "Please complete all required fields",
        variant: "destructive",
      });
      return;
    }

    createPractitionerMutation.mutate({
      userId: user?.id,
      archetype: data.archetype,
      experienceLevel: data.experienceLevel,
      bio: data.bio || null,
      specializations: data.specializations.length > 0 ? data.specializations : null,
      professionalCategories: data.professionalCategories.length > 0 ? data.professionalCategories : null,
      hourlyRate: data.hourlyRate ? parseFloat(data.hourlyRate) : null,
      location: data.location || null,
      isVirtual: data.isVirtual,
      isInPerson: data.isInPerson,
      yearsActive: data.yearsActive ? parseInt(data.yearsActive) : null,
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.archetype !== null;
      case 2:
        return data.experienceLevel !== null;
      case 3:
        return true; // Optional fields
      case 4:
        return data.isVirtual || data.isInPerson; // At least one session type
      case 5:
        return true;
      default:
        return false;
    }
  };

  const addSpecialization = () => {
    if (specializationInput.trim() && !data.specializations.includes(specializationInput.trim())) {
      setData({
        ...data,
        specializations: [...data.specializations, specializationInput.trim()],
      });
      setSpecializationInput("");
    }
  };

  const removeSpecialization = (spec: string) => {
    setData({
      ...data,
      specializations: data.specializations.filter((s) => s !== spec),
    });
  };

  const toggleCategory = (category: string) => {
    if (data.professionalCategories.includes(category)) {
      setData({
        ...data,
        professionalCategories: data.professionalCategories.filter((c) => c !== category),
      });
    } else {
      setData({
        ...data,
        professionalCategories: [...data.professionalCategories, category],
      });
    }
  };

  const getArchetypeIcon = (archetype: string, size = "w-12 h-12") => {
    switch (archetype) {
      case "bee":
        return <ArchetypeIcons.Bee className={size} />;
      case "hummingbird":
        return <ArchetypeIcons.Hummingbird className={size} />;
      case "butterfly":
        return <ArchetypeIcons.Butterfly className={size} />;
      case "beetle":
        return <ArchetypeIcons.Beetle className={size} />;
      default:
        return <User className={size} />;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-pulse text-forest">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-heading text-2xl lg:text-3xl font-bold text-forest">
                Become a Facilitator
              </h1>
              <p className="text-forest/70">
                Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].description}
              </p>
            </div>
            <Badge variant="outline" className="text-gold border-gold">
              <Sparkles className="w-3 h-3 mr-1" />
              {Math.round((currentStep / STEPS.length) * 100)}% Complete
            </Badge>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center space-x-2 mb-4">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    currentStep > step.id
                      ? "bg-gold text-white"
                      : currentStep === step.id
                      ? "bg-forest text-white"
                      : "bg-sage/20 text-forest/50"
                  }`}
                >
                  {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`w-12 h-1 mx-1 rounded ${
                      currentStep > step.id ? "bg-gold" : "bg-sage/20"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <Progress value={(currentStep / STEPS.length) * 100} className="h-2" />
        </div>

        {/* Step Content */}
        <Card className="border-sage/20 mb-8">
          <CardContent className="p-6">
            {/* Step 1: Archetype Selection */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="font-heading text-xl font-semibold text-forest mb-2">
                    Choose Your Pollinator Archetype
                  </h2>
                  <p className="text-forest/70">
                    Each archetype represents a unique approach to wellness facilitation.
                    <br />
                    <span className="text-gold font-medium">
                      New to facilitating? Bee is the perfect starting point!
                    </span>
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {(Object.entries(archetypeDefinitions) as [Archetype, typeof archetypeDefinitions.bee][]).map(
                    ([key, archetype]) => (
                      <Card
                        key={key}
                        className={`cursor-pointer transition-all hover:shadow-lg ${
                          data.archetype === key
                            ? "ring-2 ring-gold border-gold"
                            : "border-sage/20 hover:border-gold/50"
                        }`}
                        onClick={() => setData({ ...data, archetype: key })}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div
                              className="p-3 rounded-full"
                              style={{ backgroundColor: `${archetype.color}20` }}
                            >
                              {getArchetypeIcon(key)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-heading font-semibold text-forest">
                                  {archetype.name}
                                </h3>
                                {key === "bee" && (
                                  <Badge className="bg-gold/20 text-gold text-xs">
                                    Recommended for New Facilitators
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-forest/50 italic mb-2">
                                {archetype.scientificName}
                              </p>
                              <p className="text-sm text-forest/70 mb-3">
                                {archetype.description}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {archetype.traits.slice(0, 3).map((trait) => (
                                  <Badge
                                    key={trait}
                                    variant="outline"
                                    className="text-xs"
                                    style={{ borderColor: archetype.color, color: archetype.color }}
                                  >
                                    {trait}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          {data.archetype === key && (
                            <div className="mt-4 pt-4 border-t border-sage/20">
                              <p className="text-sm text-forest/80">{archetype.approach}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Experience Level */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="font-heading text-xl font-semibold text-forest mb-2">
                    What's Your Experience Level?
                  </h2>
                  <p className="text-forest/70">
                    This helps clients understand your journey and find the right match.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {(Object.entries(experienceLevelDefinitions) as [ExperienceLevel, typeof experienceLevelDefinitions.rising][]).map(
                    ([key, level]) => (
                      <Card
                        key={key}
                        className={`cursor-pointer transition-all hover:shadow-lg ${
                          data.experienceLevel === key
                            ? "ring-2 ring-gold border-gold"
                            : "border-sage/20 hover:border-gold/50"
                        }`}
                        onClick={() => setData({ ...data, experienceLevel: key })}
                      >
                        <CardContent className="p-6 text-center">
                          <div
                            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
                            style={{ backgroundColor: `${level.color}30` }}
                          >
                            <span className="text-2xl">
                              {key === "rising" ? "🌱" : key === "evolving" ? "🌿" : "🌳"}
                            </span>
                          </div>
                          <h3 className="font-heading font-semibold text-forest mb-1">
                            {level.name}
                          </h3>
                          <p className="text-sm text-forest/70 mb-3">{level.description}</p>
                          <p className="text-xs text-forest/50">{level.growthFocus}</p>
                          {data.archetype === "bee" && level.beeContext && (
                            <p className="text-xs text-gold mt-2 italic">{level.beeContext}</p>
                          )}
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Profile Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="font-heading text-xl font-semibold text-forest mb-2">
                    Tell Your Story
                  </h2>
                  <p className="text-forest/70">
                    Help clients understand who you are and how you can support them.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-forest font-medium">
                      Your Bio
                    </Label>
                    <Textarea
                      id="bio"
                      placeholder="Share your journey, approach, and what inspires your wellness practice..."
                      value={data.bio}
                      onChange={(e) => setData({ ...data, bio: e.target.value })}
                      className="min-h-[120px]"
                    />
                    <p className="text-xs text-forest/50">
                      {data.bio.length}/500 characters
                    </p>
                  </div>

                  {/* Specializations */}
                  <div className="space-y-2">
                    <Label className="text-forest font-medium">Specializations</Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add a specialization (e.g., Anxiety, Relationships)"
                        value={specializationInput}
                        onChange={(e) => setSpecializationInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSpecialization())}
                      />
                      <Button type="button" onClick={addSpecialization} variant="outline">
                        Add
                      </Button>
                    </div>
                    {data.specializations.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {data.specializations.map((spec) => (
                          <Badge
                            key={spec}
                            variant="secondary"
                            className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => removeSpecialization(spec)}
                          >
                            {spec} ×
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Professional Categories */}
                  <div className="space-y-2">
                    <Label className="text-forest font-medium">Professional Categories</Label>
                    <p className="text-sm text-forest/60 mb-2">
                      Select all modalities that apply to your practice
                    </p>
                    <div className="space-y-4">
                      {Object.entries(categoryGroups).map(([groupKey, group]) => (
                        <div key={groupKey}>
                          <h4 className="text-sm font-medium text-forest mb-2">{group.name}</h4>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(professionalCategoryDefinitions)
                              .filter(([, cat]) => cat.group === groupKey)
                              .map(([catKey, cat]) => (
                                <Badge
                                  key={catKey}
                                  variant={data.professionalCategories.includes(catKey) ? "default" : "outline"}
                                  className={`cursor-pointer transition-colors ${
                                    data.professionalCategories.includes(catKey)
                                      ? "bg-gold text-white"
                                      : "hover:bg-gold/10"
                                  }`}
                                  onClick={() => toggleCategory(catKey)}
                                >
                                  {cat.icon} {cat.name}
                                </Badge>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Years Active */}
                  <div className="space-y-2">
                    <Label htmlFor="yearsActive" className="text-forest font-medium">
                      Years in Practice
                    </Label>
                    <Input
                      id="yearsActive"
                      type="number"
                      min="0"
                      placeholder="How many years have you been practicing?"
                      value={data.yearsActive}
                      onChange={(e) => setData({ ...data, yearsActive: e.target.value })}
                      className="max-w-[200px]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Service Settings */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="font-heading text-xl font-semibold text-forest mb-2">
                    Set Up Your Services
                  </h2>
                  <p className="text-forest/70">
                    Define how clients can connect with you.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Session Types */}
                  <div className="space-y-4">
                    <Label className="text-forest font-medium">Session Types</Label>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card
                        className={`cursor-pointer transition-all ${
                          data.isVirtual ? "ring-2 ring-gold border-gold" : "border-sage/20"
                        }`}
                        onClick={() => setData({ ...data, isVirtual: !data.isVirtual })}
                      >
                        <CardContent className="p-4 flex items-center space-x-4">
                          <div className={`p-3 rounded-full ${data.isVirtual ? "bg-gold/20" : "bg-sage/10"}`}>
                            <Video className={`w-6 h-6 ${data.isVirtual ? "text-gold" : "text-forest/50"}`} />
                          </div>
                          <div>
                            <h4 className="font-medium text-forest">Virtual Sessions</h4>
                            <p className="text-sm text-forest/60">Online video calls</p>
                          </div>
                          <Switch checked={data.isVirtual} className="ml-auto" />
                        </CardContent>
                      </Card>

                      <Card
                        className={`cursor-pointer transition-all ${
                          data.isInPerson ? "ring-2 ring-gold border-gold" : "border-sage/20"
                        }`}
                        onClick={() => setData({ ...data, isInPerson: !data.isInPerson })}
                      >
                        <CardContent className="p-4 flex items-center space-x-4">
                          <div className={`p-3 rounded-full ${data.isInPerson ? "bg-gold/20" : "bg-sage/10"}`}>
                            <MapPin className={`w-6 h-6 ${data.isInPerson ? "text-gold" : "text-forest/50"}`} />
                          </div>
                          <div>
                            <h4 className="font-medium text-forest">In-Person Sessions</h4>
                            <p className="text-sm text-forest/60">Face-to-face meetings</p>
                          </div>
                          <Switch checked={data.isInPerson} className="ml-auto" />
                        </CardContent>
                      </Card>
                    </div>
                    {!data.isVirtual && !data.isInPerson && (
                      <p className="text-sm text-destructive">
                        Please select at least one session type
                      </p>
                    )}
                  </div>

                  {/* Location (if in-person) */}
                  {data.isInPerson && (
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-forest font-medium">
                        Location
                      </Label>
                      <Input
                        id="location"
                        placeholder="City, State/Country"
                        value={data.location}
                        onChange={(e) => setData({ ...data, location: e.target.value })}
                      />
                    </div>
                  )}

                  {/* Hourly Rate */}
                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate" className="text-forest font-medium">
                      Session Rate (USD)
                    </Label>
                    <div className="relative max-w-[200px]">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest/50" />
                      <Input
                        id="hourlyRate"
                        type="number"
                        min="0"
                        step="5"
                        placeholder="0"
                        value={data.hourlyRate}
                        onChange={(e) => setData({ ...data, hourlyRate: e.target.value })}
                        className="pl-8"
                      />
                    </div>
                    <p className="text-xs text-forest/50">
                      Leave blank to discuss pricing with clients individually
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review & Submit */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="font-heading text-xl font-semibold text-forest mb-2">
                    Review Your Profile
                  </h2>
                  <p className="text-forest/70">
                    Make sure everything looks good before launching your facilitator profile.
                  </p>
                </div>

                <Card className="border-gold/30 bg-gold/5">
                  <CardContent className="p-6">
                    {/* Archetype & Experience */}
                    <div className="flex items-center space-x-4 mb-6">
                      <div
                        className="p-4 rounded-full"
                        style={{
                          backgroundColor: data.archetype
                            ? `${archetypeDefinitions[data.archetype].color}20`
                            : "#f0f0f0",
                        }}
                      >
                        {data.archetype && getArchetypeIcon(data.archetype, "w-16 h-16")}
                      </div>
                      <div>
                        <h3 className="font-heading text-xl font-semibold text-forest">
                          {data.archetype && archetypeDefinitions[data.archetype].name} Facilitator
                        </h3>
                        <p className="text-forest/60">
                          {data.experienceLevel && experienceLevelDefinitions[data.experienceLevel].name}
                          {data.yearsActive && ` · ${data.yearsActive} years in practice`}
                        </p>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Bio */}
                    {data.bio && (
                      <div className="mb-4">
                        <h4 className="font-medium text-forest mb-2">About</h4>
                        <p className="text-forest/80">{data.bio}</p>
                      </div>
                    )}

                    {/* Specializations */}
                    {data.specializations.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-forest mb-2">Specializations</h4>
                        <div className="flex flex-wrap gap-2">
                          {data.specializations.map((spec) => (
                            <Badge key={spec} variant="secondary">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Professional Categories */}
                    {data.professionalCategories.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-forest mb-2">Modalities</h4>
                        <div className="flex flex-wrap gap-2">
                          {data.professionalCategories.map((cat) => (
                            <Badge key={cat} variant="outline" className="text-gold border-gold">
                              {professionalCategoryDefinitions[cat as keyof typeof professionalCategoryDefinitions]?.icon}{" "}
                              {professionalCategoryDefinitions[cat as keyof typeof professionalCategoryDefinitions]?.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <Separator className="my-4" />

                    {/* Service Details */}
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-forest/60">Session Types</span>
                        <p className="font-medium text-forest">
                          {[data.isVirtual && "Virtual", data.isInPerson && "In-Person"]
                            .filter(Boolean)
                            .join(" & ")}
                        </p>
                      </div>
                      {data.location && (
                        <div>
                          <span className="text-forest/60">Location</span>
                          <p className="font-medium text-forest">{data.location}</p>
                        </div>
                      )}
                      {data.hourlyRate && (
                        <div>
                          <span className="text-forest/60">Rate</span>
                          <p className="font-medium text-forest">${data.hourlyRate}/session</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-sage/10 rounded-lg p-4 text-sm text-forest/80">
                  <p className="font-medium text-forest mb-1">What happens next?</p>
                  <ul className="space-y-1">
                    <li>✓ Your profile will be visible to clients</li>
                    <li>✓ You can update your profile anytime from your dashboard</li>
                    <li>✓ Start receiving booking requests from clients</li>
                    <li>✓ Earn Seeds and build your reputation</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="border-forest/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {currentStep < 5 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-gold hover:bg-gold/90 text-white"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={createPractitionerMutation.isPending}
              className="bg-gold hover:bg-gold/90 text-white"
            >
              {createPractitionerMutation.isPending ? (
                "Creating Profile..."
              ) : (
                <>
                  Launch My Profile
                  <Sparkles className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
