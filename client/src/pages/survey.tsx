import { useState, useEffect } from "react";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, ArrowRight, CheckCircle, ChevronLeft, ChevronRight, Crown, Star, Trophy, Sparkles } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

// Survey form validation schema
const surveySchema = z.object({
  // Demographics (required)
  identityType: z.enum(["facilitator", "client", "both", "neither", "exploring"]),
  ageRange: z.string().optional(),
  countryOfResidence: z.string().optional(),
  currency: z.string().optional(),
  
  // Facilitator questions (conditional)
  facilitatorSessionPrice: z.string().optional(),
  openToFreeSession: z.string().optional(),
  contributionInterests: z.array(z.string()).optional(),
  reciprocityPreferences: z.array(z.string()).optional(),
  reciprocityOther: z.string().optional(),
  
  // Client questions (conditional)
  clientComfortablePrice: z.string().optional(),
  clientMaxPrice: z.string().optional(),
  clientTrialPrice: z.string().optional(),
  sessionFrequency: z.enum(["weekly", "2-3_monthly", "monthly", "occasionally", "rarely"]).optional(),
  bookingEncouragements: z.array(z.string()).optional(),
  trustFactors: z.array(z.string()).optional(),
  trustFactorsOther: z.string().optional(),
  
  // Community Garden
  gardenInterestLevel: z.enum(["very_interested", "maybe", "not_for_me"]).optional(),
  gardenContentIdeas: z.string().optional(),
  gardenMonthlyPrice: z.string().optional(),
  
  // Final thoughts
  finalThoughts: z.string().optional(),
});

type SurveyFormData = z.infer<typeof surveySchema>;

const STORAGE_KEY = 'floreser_alpha_consultation_draft';

const SURVEY_STEPS = [
  { id: 'demographics', title: 'Your Foundation', description: 'Building your founding member profile', icon: Crown },
  { id: 'role-specific', title: 'Your Expertise', description: 'Leveraging your industry insights', icon: Star },
  { id: 'community', title: 'Co-Creating Community', description: 'Designing revolutionary features together', icon: Sparkles },
  { id: 'final', title: 'Your Vision', description: 'Shaping the future of wellness technology', icon: Trophy },
];

const ALPHA_MEMBER_NUMBER = Math.floor(Math.random() * 150) + 1; // Simulated alpha member number

const AGE_RANGES = [
  "18-24", "25-34", "35-44", "45-54", "55-64", "65+"
];

const FACILITATOR_PRICE_RANGES = [
  "$25-50", "$51-75", "$76-100", "$101-150", "$151-200", "$200+"
];

const CLIENT_PRICE_RANGES = [
  "$25-50", "$51-75", "$76-100", "$101-150", "$151+"
];

const CONTRIBUTION_INTERESTS = [
  "Creating content",
  "Mentoring other practitioners", 
  "Hosting group sessions",
  "Leading workshops",
  "Community moderation",
  "Beta testing new features"
];

const RECIPROCITY_PREFERENCES = [
  "Increased visibility on platform",
  "Reduced platform fees",
  "Payment in platform credits",
  "Cross-promotion opportunities", 
  "Priority support",
  "Early access to new features"
];

const BOOKING_ENCOURAGEMENTS = [
  "Discounted session packs",
  "Monthly subscription plans",
  "Free consultation calls",
  "Money-back guarantee",
  "Flexible cancellation",
  "Practitioner matching service"
];

const TRUST_FACTORS = [
  "Clear practitioner profiles",
  "Transparent pricing",
  "Client reviews and ratings",
  "Verified credentials",
  "Video introductions",
  "Trial sessions available",
  "Secure payment processing",
  "Professional vetting process"
];

export default function Survey() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<SurveyFormData>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      contributionInterests: [],
      reciprocityPreferences: [],
      bookingEncouragements: [],
      trustFactors: [],
    },
  });

  const identityType = form.watch("identityType");

  // Load saved draft on mount
  useEffect(() => {
    document.title = "Alpha Founding Member Consultation - FloreSer";
    const savedDraft = localStorage.getItem(STORAGE_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        form.reset(parsed);
        if (parsed.identityType) {
          setCurrentStep(1); // Skip to next step if identity is already selected
        }
      } catch (error) {
        console.error("Failed to parse saved draft:", error);
      }
    }
  }, [form]);

  // Save draft when form values change
  useEffect(() => {
    const subscription = form.watch((values) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const submitMutation = useMutation({
    mutationFn: async (data: SurveyFormData) => {
      const response = await apiRequest("POST", "/api/survey", data);
      return response.json();
    },
    onSuccess: () => {
      localStorage.removeItem(STORAGE_KEY);
      setIsSubmitted(true);
      toast({
        title: "Survey submitted!",
        description: "Thank you for your valuable feedback.",
      });
    },
    onError: (error) => {
      toast({
        title: "Submission failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SurveyFormData) => {
    submitMutation.mutate(data);
  };

  const nextStep = () => {
    if (currentStep < SURVEY_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getProgress = () => {
    return ((currentStep + 1) / SURVEY_STEPS.length) * 100;
  };

  const canProceed = () => {
    if (currentStep === 0) {
      return !!identityType;
    }
    return true;
  };

  const showFacilitatorQuestions = identityType === "facilitator" || identityType === "both";
  const showClientQuestions = identityType === "client" || identityType === "both";

  // Show introduction screen before starting survey
  const [showIntro, setShowIntro] = useState(true);

  const renderIntroduction = () => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card className="border-gold/30 shadow-2xl bg-gradient-to-br from-white to-cream">
        <CardContent className="p-12">
          <div className="text-center">
            <div className="relative mb-6">
              <Crown className="w-16 h-16 text-gold mx-auto mb-4" />
              <div className="absolute -top-2 -right-8 bg-gold text-white text-xs font-bold px-2 py-1 rounded-full">
                EXCLUSIVE
              </div>
            </div>
            
            <div className="bg-gold/10 rounded-full px-6 py-2 mb-6 inline-block">
              <span className="text-gold font-bold text-sm tracking-wide">ALPHA FOUNDING MEMBER CONSULTATION</span>
            </div>
            
            <h1 className="font-heading text-4xl font-bold text-forest mb-6">
              Help Build Your Ideal Wellness Platform
            </h1>
            
            <p className="text-xl text-forest/80 mb-8 leading-relaxed">
              You're among the first <strong className="text-gold">150 visionaries</strong> invited to co-create the future of wellness technology. Your insights will directly shape every feature, design decision, and user experience we build.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-sage/10 to-sage/5 rounded-lg p-6 text-center">
              <Star className="w-8 h-8 text-sage mx-auto mb-3" />
              <h3 className="font-semibold text-forest mb-2">Industry Expert Input</h3>
              <p className="text-sm text-forest/70">Your professional experience guides our platform development</p>
            </div>
            <div className="bg-gradient-to-br from-gold/10 to-gold/5 rounded-lg p-6 text-center">
              <Sparkles className="w-8 h-8 text-gold mx-auto mb-3" />
              <h3 className="font-semibold text-forest mb-2">Revolutionary Features</h3>
              <p className="text-sm text-forest/70">Co-design breakthrough wellness technology solutions</p>
            </div>
            <div className="bg-gradient-to-br from-forest/10 to-forest/5 rounded-lg p-6 text-center">
              <Trophy className="w-8 h-8 text-forest mx-auto mb-3" />
              <h3 className="font-semibold text-forest mb-2">Founding Recognition</h3>
              <p className="text-sm text-forest/70">Lifetime status as a platform co-creator and founding member</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-sage/20 to-gold/20 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="bg-gold text-white rounded-full p-2 flex-shrink-0">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-forest mb-2">Your Consultation Value: $500+</h3>
                <p className="text-forest/80 text-sm">
                  Professional product consultation typically costs $100-200/hour. This 15-20 minute consultation provides us with insights equivalent to multiple paid consulting sessions.
                </p>
              </div>
            </div>
          </div>
          
          <Alert className="border-gold/30 bg-gold/5 mb-8">
            <Sparkles className="h-4 w-4 text-gold" />
            <AlertDescription className="text-forest">
              <strong>Confidential Preview:</strong> You'll be among the first to see and test revolutionary features before public launch. Your feedback shapes the wellness technology landscape.
            </AlertDescription>
          </Alert>
          
          <div className="text-center">
            <Button 
              onClick={() => setShowIntro(false)} 
              className="bg-gold text-white hover:bg-gold/90 px-8 py-3 text-lg font-semibold"
              data-testid="button-start-consultation"
            >
              Begin My Founding Member Consultation
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <p className="text-xs text-forest/60 mt-4">
              Estimated time: 15-20 minutes • Your input shapes the future • Completely confidential
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="text-center border-gold/30 shadow-2xl bg-gradient-to-br from-white to-cream">
            <CardContent className="p-12">
              <div className="relative">
                <div className="absolute -top-4 -right-4 bg-gold text-white rounded-full p-2">
                  <Crown className="w-6 h-6" />
                </div>
                <Trophy className="w-20 h-20 text-gold mx-auto mb-6" />
                <div className="bg-gold/10 rounded-full px-4 py-2 mb-4 inline-block">
                  <span className="text-gold font-semibold text-sm">FOUNDING MEMBER #{ALPHA_MEMBER_NUMBER.toString().padStart(3, '0')}</span>
                </div>
                <h1 className="font-heading text-3xl font-bold text-forest mb-4">
                  Welcome to the Founding Circle!
                </h1>
                <div className="bg-gradient-to-r from-sage/20 to-gold/20 rounded-lg p-6 mb-6">
                  <p className="text-forest text-lg font-medium mb-3">
                    🌟 Your consultation has been recorded and will directly influence our platform development.
                  </p>
                  <p className="text-forest/80 mb-4">
                    As an Alpha Founding Member, your insights are now part of FloreSer's DNA. You've contributed an estimated <strong className="text-gold">$500+ value</strong> in development consultation.
                  </p>
                </div>
                
                <div className="bg-white/50 rounded-lg p-6 mb-6 text-left">
                  <h3 className="font-heading text-lg font-semibold text-forest mb-3 flex items-center">
                    <Sparkles className="w-5 h-5 text-gold mr-2" />
                    Your Founding Member Benefits
                  </h3>
                  <ul className="space-y-2 text-forest/80">
                    <li className="flex items-center"><Star className="w-4 h-4 text-gold mr-2 flex-shrink-0" />Priority access to platform beta launch</li>
                    <li className="flex items-center"><Star className="w-4 h-4 text-gold mr-2 flex-shrink-0" />Permanent founder recognition & special badge</li>
                    <li className="flex items-center"><Star className="w-4 h-4 text-gold mr-2 flex-shrink-0" />Exclusive founder community access</li>
                    <li className="flex items-center"><Star className="w-4 h-4 text-gold mr-2 flex-shrink-0" />Lifetime reduced platform fees</li>
                    <li className="flex items-center"><Star className="w-4 h-4 text-gold mr-2 flex-shrink-0" />Direct line to our development team</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <Link href="/">
                    <Button className="bg-gold text-white hover:bg-gold/90 w-full font-semibold" data-testid="button-return-home">
                      🏡 Return to Your FloreSer Platform
                    </Button>
                  </Link>
                  <Link href="/practitioners">
                    <Button variant="outline" className="w-full border-sage text-sage hover:bg-sage hover:text-white" data-testid="button-browse-practitioners">
                      🌱 Start Exploring Practitioners
                    </Button>
                  </Link>
                </div>
                
                <p className="text-xs text-forest/60 mt-6">
                  Watch for exclusive updates as we bring your vision to life. The future of wellness technology starts with visionaries like you.
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const renderDemographicsStep = () => (
    <div className="space-y-6" data-testid="step-demographics">
      <div className="bg-gradient-to-r from-sage/10 to-gold/10 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-forest mb-2 flex items-center">
          <Crown className="w-5 h-5 text-gold mr-2" />
          Building Your Founding Member Profile
        </h3>
        <p className="text-sm text-forest/70">
          Help us understand your unique perspective in the wellness industry. This foundational information guides how we design features specifically for professionals like you.
        </p>
      </div>
      
      <FormField
        control={form.control}
        name="identityType"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-forest font-medium flex items-center">
              I identify as * 
              <span className="ml-2 text-xs bg-gold/20 text-gold px-2 py-1 rounded-full">Platform Design Focus</span>
            </FormLabel>
            <p className="text-xs text-forest/60 mb-3">This determines which specialized features and pricing models we prioritize in development.</p>
            <FormControl>
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="grid grid-cols-1 gap-3"
                data-testid="input-identity-type"
              >
                {[
                  { value: "facilitator", label: "Facilitator/Practitioner" },
                  { value: "client", label: "Client/Seeker" },
                  { value: "both", label: "Both" },
                  { value: "neither", label: "Neither" },
                  { value: "exploring", label: "Just exploring" },
                ].map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <label htmlFor={option.value} className="text-forest cursor-pointer">
                      {option.label}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="ageRange"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-forest font-medium flex items-center">
              Age range
              <span className="ml-2 text-xs bg-sage/20 text-sage px-2 py-1 rounded-full">UX Optimization</span>
            </FormLabel>
            <p className="text-xs text-forest/60 mb-3">Helps us design age-appropriate interfaces and marketing approaches for different wellness communities.</p>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger data-testid="select-age-range">
                  <SelectValue placeholder="Select your age range" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {AGE_RANGES.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="countryOfResidence"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-forest font-medium flex items-center">
              Country of residence
              <span className="ml-2 text-xs bg-forest/20 text-forest px-2 py-1 rounded-full">Global Strategy</span>
            </FormLabel>
            <p className="text-xs text-forest/60 mb-3">Influences our international expansion priorities and localization features for different wellness markets.</p>
            <FormControl>
              <Input
                placeholder="e.g., United States, Canada, etc."
                {...field}
                data-testid="input-country"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="currency"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-forest font-medium flex items-center">
              Preferred currency
              <span className="ml-2 text-xs bg-gold/20 text-gold px-2 py-1 rounded-full">Payment Systems</span>
            </FormLabel>
            <p className="text-xs text-forest/60 mb-3">Guides our payment processor selection and currency conversion features for seamless transactions.</p>
            <FormControl>
              <Input
                placeholder="e.g., USD, EUR, CAD, etc."
                {...field}
                data-testid="input-currency"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  const renderRoleSpecificStep = () => (
    <div className="space-y-8" data-testid="step-role-specific">
      {showFacilitatorQuestions && (
        <div className="bg-gradient-to-br from-sage/10 to-light-green/10 rounded-lg p-6 border border-sage/20">
          <h3 className="font-heading text-lg font-semibold text-forest mb-4">
            For Facilitators/Practitioners
          </h3>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="facilitatorSessionPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-forest font-medium">What do you charge per session?</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger data-testid="select-facilitator-price">
                        <SelectValue placeholder="Select price range" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {FACILITATOR_PRICE_RANGES.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="openToFreeSession"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-forest font-medium">
                    Would you be open to offering a free session in exchange for feedback?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex gap-6"
                      data-testid="radio-free-session"
                    >
                      {[
                        { value: "yes", label: "Yes" },
                        { value: "no", label: "No" },
                        { value: "maybe", label: "Maybe" },
                      ].map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.value} id={`free-${option.value}`} />
                          <label htmlFor={`free-${option.value}`} className="text-forest cursor-pointer">
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contributionInterests"
              render={() => (
                <FormItem>
                  <FormLabel className="text-forest font-medium">
                    What types of contributions to the platform interest you? (Select all that apply)
                  </FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3" data-testid="checkbox-group-contributions">
                    {CONTRIBUTION_INTERESTS.map((interest) => (
                      <FormField
                        key={interest}
                        control={form.control}
                        name="contributionInterests"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(interest)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), interest])
                                    : field.onChange(field.value?.filter((value) => value !== interest));
                                }}
                                data-testid={`checkbox-contribution-${interest.toLowerCase().replace(/\s+/g, '-')}`}
                              />
                            </FormControl>
                            <FormLabel className="text-sm text-forest font-normal cursor-pointer">
                              {interest}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reciprocityPreferences"
              render={() => (
                <FormItem>
                  <FormLabel className="text-forest font-medium">
                    If you contribute, what would you like in return? (Select all that apply)
                  </FormLabel>
                  <div className="grid grid-cols-1 gap-3" data-testid="checkbox-group-reciprocity">
                    {RECIPROCITY_PREFERENCES.map((preference) => (
                      <FormField
                        key={preference}
                        control={form.control}
                        name="reciprocityPreferences"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(preference)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), preference])
                                    : field.onChange(field.value?.filter((value) => value !== preference));
                                }}
                                data-testid={`checkbox-reciprocity-${preference.toLowerCase().replace(/\s+/g, '-')}`}
                              />
                            </FormControl>
                            <FormLabel className="text-sm text-forest font-normal cursor-pointer">
                              {preference}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reciprocityOther"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-forest font-medium">Other reciprocity ideas</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any other ideas for what you'd like in return for contributing?"
                      className="min-h-[80px]"
                      {...field}
                      data-testid="textarea-reciprocity-other"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}

      {showClientQuestions && (
        <div className="bg-gradient-to-br from-gold/10 to-cream rounded-lg p-6 border border-sage/20">
          <h3 className="font-heading text-lg font-semibold text-forest mb-4">
            For Clients/Seekers
          </h3>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="clientComfortablePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-forest font-medium">
                    What's a comfortable price range for a session?
                  </FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger data-testid="select-client-comfortable-price">
                        <SelectValue placeholder="Select comfortable price range" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CLIENT_PRICE_RANGES.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clientMaxPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-forest font-medium">
                    What's the maximum you'd be willing to pay for a high-quality session?
                  </FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger data-testid="select-client-max-price">
                        <SelectValue placeholder="Select maximum price" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CLIENT_PRICE_RANGES.concat(["$151-200", "$200+"]).map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clientTrialPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-forest font-medium">
                    What would you pay for a trial session with a new practitioner?
                  </FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger data-testid="select-client-trial-price">
                        <SelectValue placeholder="Select trial session price" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      {["$10-25", "$26-40", "$41-60", "$61-80"].map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sessionFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-forest font-medium">
                    How often would you book sessions?
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="grid grid-cols-1 gap-2"
                      data-testid="radio-session-frequency"
                    >
                      {[
                        { value: "weekly", label: "Weekly" },
                        { value: "2-3_monthly", label: "2-3 times per month" },
                        { value: "monthly", label: "Monthly" },
                        { value: "occasionally", label: "Occasionally" },
                        { value: "rarely", label: "Rarely" },
                      ].map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.value} id={`freq-${option.value}`} />
                          <label htmlFor={`freq-${option.value}`} className="text-forest cursor-pointer">
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bookingEncouragements"
              render={() => (
                <FormItem>
                  <FormLabel className="text-forest font-medium">
                    What would encourage you to book more sessions? (Select all that apply)
                  </FormLabel>
                  <div className="grid grid-cols-1 gap-3" data-testid="checkbox-group-booking-encouragements">
                    {BOOKING_ENCOURAGEMENTS.map((encouragement) => (
                      <FormField
                        key={encouragement}
                        control={form.control}
                        name="bookingEncouragements"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(encouragement)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), encouragement])
                                    : field.onChange(field.value?.filter((value) => value !== encouragement));
                                }}
                                data-testid={`checkbox-encouragement-${encouragement.toLowerCase().replace(/\s+/g, '-')}`}
                              />
                            </FormControl>
                            <FormLabel className="text-sm text-forest font-normal cursor-pointer">
                              {encouragement}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="trustFactors"
              render={() => (
                <FormItem>
                  <FormLabel className="text-forest font-medium">
                    What builds trust for you when choosing a practitioner? (Select all that apply)
                  </FormLabel>
                  <div className="grid grid-cols-1 gap-3" data-testid="checkbox-group-trust-factors">
                    {TRUST_FACTORS.map((factor) => (
                      <FormField
                        key={factor}
                        control={form.control}
                        name="trustFactors"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(factor)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), factor])
                                    : field.onChange(field.value?.filter((value) => value !== factor));
                                }}
                                data-testid={`checkbox-trust-${factor.toLowerCase().replace(/\s+/g, '-')}`}
                              />
                            </FormControl>
                            <FormLabel className="text-sm text-forest font-normal cursor-pointer">
                              {factor}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="trustFactorsOther"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-forest font-medium">Other trust factors</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any other factors that build trust for you?"
                      className="min-h-[80px]"
                      {...field}
                      data-testid="textarea-trust-other"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderCommunityStep = () => (
    <div className="space-y-6" data-testid="step-community">
      <div className="bg-gradient-to-br from-light-green/10 to-sage/10 rounded-lg p-6 border border-sage/20">
        <h3 className="font-heading text-lg font-semibold text-forest mb-2">
          Community Garden
        </h3>
        <p className="text-forest/70 mb-4">
          We're considering a community space for shared resources, discussions, and collaboration.
        </p>
        
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="gardenInterestLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-forest font-medium">
                  How interested are you in a community space?
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="grid grid-cols-1 gap-3"
                    data-testid="radio-garden-interest"
                  >
                    {[
                      { value: "very_interested", label: "Very interested! Tell me more." },
                      { value: "maybe", label: "Maybe, depends on what it offers." },
                      { value: "not_for_me", label: "Not for me." },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`garden-${option.value}`} />
                        <label htmlFor={`garden-${option.value}`} className="text-forest cursor-pointer">
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gardenContentIdeas"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-forest font-medium">
                  What kind of content or features would you like to see in a community space?
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., peer support groups, resource sharing, practitioner Q&As, meditation spaces..."
                    className="min-h-[100px]"
                    {...field}
                    data-testid="textarea-garden-content"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gardenMonthlyPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-forest font-medium">
                  What would you pay monthly for access to this community space?
                </FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger data-testid="select-garden-price">
                      <SelectValue placeholder="Select monthly price" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="free">Free only</SelectItem>
                    <SelectItem value="$5-10">$5-10</SelectItem>
                    <SelectItem value="$11-20">$11-20</SelectItem>
                    <SelectItem value="$21-30">$21-30</SelectItem>
                    <SelectItem value="$31-50">$31-50</SelectItem>
                    <SelectItem value="$50+">$50+</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );

  const renderFinalStep = () => (
    <div className="space-y-6" data-testid="step-final">
      <FormField
        control={form.control}
        name="finalThoughts"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-forest font-medium text-lg">
              Any final thoughts or suggestions?
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Share any additional feedback, suggestions, or thoughts about the FloreSer platform..."
                className="min-h-[120px]"
                {...field}
                data-testid="textarea-final-thoughts"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="bg-gradient-to-br from-gold/10 to-cream rounded-lg p-6 border border-sage/20">
        <h3 className="font-heading text-lg font-semibold text-forest mb-2">
          Thank you for your time!
        </h3>
        <p className="text-forest/70">
          Your feedback is invaluable in helping us create a platform that truly serves the wellness community. 
          We appreciate you taking the time to share your thoughts with us.
        </p>
      </div>
    </div>
  );

  const getCurrentStepContent = () => {
    switch (currentStep) {
      case 0: return renderDemographicsStep();
      case 1: return renderRoleSpecificStep();
      case 2: return renderCommunityStep();
      case 3: return renderFinalStep();
      default: return renderDemographicsStep();
    }
  };

  // If showing intro, render that instead
  if (showIntro) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <main>
          {renderIntroduction()}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Crown className="w-8 h-8 text-gold mr-3" />
            <div>
              <div className="bg-gold/10 rounded-full px-4 py-1 mb-2">
                <span className="text-gold font-bold text-sm tracking-wide">FOUNDING MEMBER CONSULTATION</span>
              </div>
              <h1 className="font-heading text-3xl lg:text-4xl font-bold text-forest">
                Co-Creating Your Ideal Platform
              </h1>
            </div>
          </div>
          <p className="text-lg text-forest/70 mb-6">
            Your industry expertise directly shapes revolutionary wellness technology
          </p>
          
          {/* Enhanced Progress indicator */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center text-sm mb-2">
              <div className="flex items-center text-forest/60">
                {React.createElement(SURVEY_STEPS[currentStep].icon, { className: "w-4 h-4 text-gold mr-1" })}
                <span>Milestone {currentStep + 1} of {SURVEY_STEPS.length}</span>
              </div>
              <div className="text-right">
                <span className="text-forest/60">{Math.round(getProgress())}% complete</span>
                <div className="text-xs text-gold font-medium">~${Math.round((getProgress() / 100) * 500)}+ value</div>
              </div>
            </div>
            <div className="relative">
              <Progress value={getProgress()} className="h-3 bg-sage/20" data-testid="progress-bar" />
              <div className="absolute inset-0 bg-gradient-to-r from-sage/40 to-gold/40 rounded-full" style={{ width: `${getProgress()}%` }}></div>
            </div>
            <div className="mt-3 text-sm text-forest/70">
              {SURVEY_STEPS[currentStep].description}
            </div>
          </div>
        </div>

        {/* Enhanced Survey Form */}
        <Card className="border-gold/30 shadow-2xl bg-gradient-to-br from-white to-cream">
          <CardHeader className="bg-gradient-to-r from-sage/10 to-gold/10 rounded-t-lg">
            <div className="flex items-center">
              {React.createElement(SURVEY_STEPS[currentStep].icon, { className: "w-6 h-6 text-gold mr-3" })}
              <div>
                <CardTitle className="font-heading text-xl text-forest">
                  {SURVEY_STEPS[currentStep].title}
                </CardTitle>
                <p className="text-sm text-forest/70 mt-1">Contributing to platform development milestone {currentStep + 1}</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {getCurrentStepContent()}
                
                {/* Enhanced Navigation */}
                <div className="space-y-4 pt-6 border-t border-gold/20">
                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      className="border-sage text-sage hover:bg-sage hover:text-white"
                      data-testid="button-prev"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous Milestone
                    </Button>
                    
                    {currentStep === SURVEY_STEPS.length - 1 ? (
                      <Button
                        type="submit"
                        disabled={submitMutation.isPending}
                        className="bg-gold text-white hover:bg-gold/90 px-6 font-semibold"
                        data-testid="button-submit"
                      >
                        {submitMutation.isPending ? (
                          <>
                            <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"></div>
                            Processing Your Vision...
                          </>
                        ) : (
                          <>
                            Complete My Consultation
                            <Trophy className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={nextStep}
                        disabled={!canProceed()}
                        className="bg-gold text-white hover:bg-gold/90 px-6"
                        data-testid="button-next"
                      >
                        Next: {SURVEY_STEPS[currentStep + 1].title}
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                  
                  {/* Progress footer */}
                  <div className="p-4 bg-gradient-to-r from-sage/5 to-gold/5 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-forest/70">
                        <Crown className="w-4 h-4 text-gold mr-2" />
                        Founding Member #{ALPHA_MEMBER_NUMBER.toString().padStart(3, '0')}
                      </div>
                      <div className="text-forest/70">
                        Your insights directly influence our development roadmap
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Enhanced Additional info */}
        <div className="mt-6 text-center">
          <div className="bg-white/50 rounded-lg p-4 mb-4">
            <p className="text-sm text-forest font-medium mb-2">
              🌟 Confidential Alpha Consultation
            </p>
            <p className="text-xs text-forest/60">
              Your professional insights are {user ? "securely linked to your founding member profile" : "confidentially recorded"} and will directly guide our platform architecture and feature prioritization.
            </p>
          </div>
          <Link href="/">
            <Button variant="ghost" className="mt-2 text-sage hover:text-forest" data-testid="link-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to FloreSer Platform
            </Button>
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}