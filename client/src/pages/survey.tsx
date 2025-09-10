import { useState, useEffect } from "react";
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
import { ArrowLeft, ArrowRight, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
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

const STORAGE_KEY = 'floreser_survey_draft';

const SURVEY_STEPS = [
  { id: 'demographics', title: 'About You', description: 'Tell us about yourself' },
  { id: 'role-specific', title: 'Your Role', description: 'Questions specific to your role' },
  { id: 'community', title: 'Community Garden', description: 'Interest in our community features' },
  { id: 'final', title: 'Final Thoughts', description: 'Any additional feedback' },
];

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
    document.title = "Platform Survey - FloreSer";
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

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="text-center border-sage/20 shadow-lg">
            <CardContent className="p-8">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h1 className="font-heading text-2xl font-bold text-forest mb-4">
                Thank You!
              </h1>
              <p className="text-forest/70 mb-6">
                Your feedback has been submitted successfully. We truly value your input and will use it to improve the FloreSer platform for everyone.
              </p>
              <div className="space-y-3">
                <Link href="/">
                  <Button className="bg-gold text-white hover:bg-gold/90 w-full">
                    Return to FloreSer
                  </Button>
                </Link>
                <Link href="/practitioners">
                  <Button variant="outline" className="w-full border-sage text-sage hover:bg-sage hover:text-white">
                    Browse Practitioners
                  </Button>
                </Link>
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
      <FormField
        control={form.control}
        name="identityType"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-forest font-medium">I identify as *</FormLabel>
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
            <FormLabel className="text-forest font-medium">Age range</FormLabel>
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
            <FormLabel className="text-forest font-medium">Country of residence</FormLabel>
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
            <FormLabel className="text-forest font-medium">Preferred currency</FormLabel>
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

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-forest mb-4">
            Platform Survey
          </h1>
          <p className="text-lg text-forest/70 mb-6">
            Help us improve FloreSer by sharing your thoughts on pricing and features
          </p>
          
          {/* Progress indicator */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-forest/60 mb-2">
              <span>Step {currentStep + 1} of {SURVEY_STEPS.length}</span>
              <span>{Math.round(getProgress())}% complete</span>
            </div>
            <Progress value={getProgress()} className="h-2" data-testid="progress-bar" />
            <div className="mt-2 text-sm text-forest/60">
              {SURVEY_STEPS[currentStep].title}: {SURVEY_STEPS[currentStep].description}
            </div>
          </div>
        </div>

        {/* Survey Form */}
        <Card className="border-sage/20 shadow-lg">
          <CardHeader>
            <CardTitle className="font-heading text-xl text-forest">
              {SURVEY_STEPS[currentStep].title}
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {getCurrentStepContent()}
                
                {/* Navigation */}
                <div className="flex justify-between pt-6 border-t border-sage/20">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="border-sage text-sage hover:bg-sage hover:text-white"
                    data-testid="button-prev"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  
                  {currentStep === SURVEY_STEPS.length - 1 ? (
                    <Button
                      type="submit"
                      disabled={submitMutation.isPending}
                      className="bg-gold text-white hover:bg-gold/90"
                      data-testid="button-submit"
                    >
                      {submitMutation.isPending ? "Submitting..." : "Submit Survey"}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!canProceed()}
                      className="bg-gold text-white hover:bg-gold/90"
                      data-testid="button-next"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Additional info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-forest/60">
            Your responses are {user ? "linked to your account" : "anonymous"} and will help us improve the platform for everyone.
          </p>
          <Link href="/">
            <Button variant="ghost" className="mt-2 text-sage hover:text-forest" data-testid="link-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to FloreSer
            </Button>
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}