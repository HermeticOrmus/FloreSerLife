import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  MapPin,
  User,
  CreditCard,
  Check,
  ArrowLeft,
  Info
} from "lucide-react";
import { format, addDays, setHours, setMinutes, isSameDay, parse } from "date-fns";

interface TimeSlot {
  time: string;
  available: boolean;
}

export default function BookSession() {
  const { id: practitionerId } = useParams();
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [sessionType, setSessionType] = useState<"virtual" | "in_person">("virtual");
  const [duration, setDuration] = useState<"30" | "60" | "90">("60");
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to book a session",
        variant: "destructive"
      });
      setLocation("/auth/signin");
    }
  }, [isAuthenticated]);

  // Fetch practitioner details
  const { data: practitioner, isLoading: practitionerLoading } = useQuery<any>({
    queryKey: [`/api/practitioners/${practitionerId}`],
    enabled: !!practitionerId,
    queryFn: async () => {
      const res = await fetch(`/api/practitioners/${practitionerId}`, {
        credentials: 'include'
      });
      if (!res.ok) throw new Error("Practitioner not found");
      return res.json();
    }
  });

  // Fetch availability for selected date
  const { data: availability, isLoading: availabilityLoading } = useQuery<TimeSlot[]>({
    queryKey: [`/api/bookings/${practitionerId}/availability`, selectedDate],
    enabled: !!practitionerId && !!selectedDate,
    queryFn: async () => {
      const dateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
      const res = await fetch(
        `/api/bookings/${practitionerId}/availability?date=${dateStr}&duration=${duration}`,
        { credentials: 'include' }
      );
      if (!res.ok) throw new Error("Failed to fetch availability");
      return res.json();
    }
  });

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(bookingData)
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create booking');
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
      toast({
        title: "Session booked!",
        description: "Check your email for confirmation details"
      });
      setLocation('/dashboard/client');
    },
    onError: (error: Error) => {
      toast({
        title: "Booking failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const calculatePrice = () => {
    if (!practitioner?.hourlyRate) return 0;
    const rate = parseFloat(practitioner.hourlyRate);
    const durationNum = parseInt(duration);
    return (rate * (durationNum / 60)).toFixed(2);
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Incomplete selection",
        description: "Please select a date and time",
        variant: "destructive"
      });
      return;
    }

    const [hours, minutes] = selectedTime.split(':').map(Number);
    const scheduledDatetime = setMinutes(setHours(selectedDate, hours), minutes);

    createBookingMutation.mutate({
      practitionerId,
      scheduledDatetime,
      duration: parseInt(duration),
      isVirtual: sessionType === "virtual",
      totalAmount: calculatePrice(),
      notes: notes.trim() || null
    });
  };

  const nextStep = () => {
    if (step === 1 && (!selectedDate || !selectedTime)) {
      toast({
        title: "Please select a time slot",
        variant: "destructive"
      });
      return;
    }
    if (step < 3) setStep((step + 1) as 1 | 2 | 3);
  };

  const prevStep = () => {
    if (step > 1) setStep((step - 1) as 1 | 2 | 3);
  };

  if (practitionerLoading) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-sage/20 rounded w-1/3"></div>
            <div className="h-64 bg-sage/20 rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!practitioner) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>Practitioner not found</AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => setLocation(`/practitioners/${practitionerId}`)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Profile
        </Button>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    step >= s
                      ? 'bg-gold border-gold text-white'
                      : 'bg-white border-sage/30 text-sage'
                  }`}
                >
                  {step > s ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-20 h-1 ${step > s ? 'bg-gold' : 'bg-sage/20'}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center space-x-24 mt-2">
            <span className={`text-sm ${step >= 1 ? 'text-forest font-medium' : 'text-forest/60'}`}>
              Date & Time
            </span>
            <span className={`text-sm ${step >= 2 ? 'text-forest font-medium' : 'text-forest/60'}`}>
              Details
            </span>
            <span className={`text-sm ${step >= 3 ? 'text-forest font-medium' : 'text-forest/60'}`}>
              Confirm
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main booking area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Date & Time Selection */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-forest">Select Date & Time</CardTitle>
                  <CardDescription>
                    Choose your preferred session date and available time slot
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Calendar */}
                  <div className="flex justify-center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) =>
                        date < new Date() || date > addDays(new Date(), 90)
                      }
                      className="rounded-md border"
                    />
                  </div>

                  {selectedDate && (
                    <>
                      <Separator />

                      {/* Duration selector */}
                      <div>
                        <label className="text-sm font-medium text-forest mb-2 block">
                          Session Duration
                        </label>
                        <Select value={duration} onValueChange={(v) => setDuration(v as any)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">60 minutes</SelectItem>
                            <SelectItem value="90">90 minutes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Available time slots */}
                      <div>
                        <label className="text-sm font-medium text-forest mb-2 block">
                          Available Times for {format(selectedDate, 'MMMM d, yyyy')}
                        </label>
                        {availabilityLoading ? (
                          <div className="grid grid-cols-4 gap-2">
                            {[...Array(8)].map((_, i) => (
                              <div key={i} className="h-10 bg-sage/20 rounded animate-pulse" />
                            ))}
                          </div>
                        ) : availability && availability.length > 0 ? (
                          <div className="grid grid-cols-4 gap-2">
                            {availability.map((slot) => (
                              <Button
                                key={slot.time}
                                variant={selectedTime === slot.time ? "default" : "outline"}
                                disabled={!slot.available}
                                onClick={() => setSelectedTime(slot.time)}
                                className={`${
                                  selectedTime === slot.time
                                    ? 'bg-gold text-white'
                                    : slot.available
                                    ? 'hover:bg-gold/10'
                                    : 'opacity-50 cursor-not-allowed'
                                }`}
                              >
                                {slot.time}
                              </Button>
                            ))}
                          </div>
                        ) : (
                          <Alert>
                            <Info className="w-4 h-4" />
                            <AlertDescription>
                              No available time slots for this date. Please select another date.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 2: Session Details */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-forest">Session Details</CardTitle>
                  <CardDescription>
                    Provide additional information for your session
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Session type */}
                  <div>
                    <label className="text-sm font-medium text-forest mb-2 block">
                      Session Type
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {practitioner.isVirtual && (
                        <Card
                          className={`cursor-pointer border-2 ${
                            sessionType === "virtual"
                              ? 'border-gold bg-gold/5'
                              : 'border-sage/20 hover:border-sage/40'
                          }`}
                          onClick={() => setSessionType("virtual")}
                        >
                          <CardContent className="p-4 flex items-center space-x-3">
                            <Video className={`w-5 h-5 ${sessionType === "virtual" ? 'text-gold' : 'text-forest/60'}`} />
                            <div>
                              <div className="font-medium text-forest">Virtual Session</div>
                              <div className="text-xs text-forest/60">Online via video call</div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                      {practitioner.isInPerson && (
                        <Card
                          className={`cursor-pointer border-2 ${
                            sessionType === "in_person"
                              ? 'border-gold bg-gold/5'
                              : 'border-sage/20 hover:border-sage/40'
                          }`}
                          onClick={() => setSessionType("in_person")}
                        >
                          <CardContent className="p-4 flex items-center space-x-3">
                            <MapPin className={`w-5 h-5 ${sessionType === "in_person" ? 'text-gold' : 'text-forest/60'}`} />
                            <div>
                              <div className="font-medium text-forest">In-Person Session</div>
                              <div className="text-xs text-forest/60">{practitioner.location || "Practitioner's location"}</div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>

                  {/* Session notes */}
                  <div>
                    <label className="text-sm font-medium text-forest mb-2 block">
                      Session Notes (Optional)
                    </label>
                    <Textarea
                      placeholder="Share what you'd like to focus on in this session..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={5}
                      className="resize-none"
                    />
                    <p className="text-xs text-forest/60 mt-2">
                      This helps your facilitator prepare for your session
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-forest">Confirm Your Booking</CardTitle>
                  <CardDescription>
                    Review your session details before booking
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b">
                      <span className="text-forest/70">Date & Time</span>
                      <span className="font-medium text-forest">
                        {selectedDate && format(selectedDate, 'MMMM d, yyyy')} at {selectedTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b">
                      <span className="text-forest/70">Duration</span>
                      <span className="font-medium text-forest">{duration} minutes</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b">
                      <span className="text-forest/70">Session Type</span>
                      <span className="font-medium text-forest flex items-center">
                        {sessionType === "virtual" ? (
                          <><Video className="w-4 h-4 mr-2" /> Virtual</>
                        ) : (
                          <><MapPin className="w-4 h-4 mr-2" /> In-Person</>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b">
                      <span className="text-forest/70">Session Fee</span>
                      <span className="font-medium text-forest text-lg">${calculatePrice()}</span>
                    </div>
                    {notes && (
                      <div className="py-3">
                        <span className="text-forest/70 text-sm block mb-2">Your Notes:</span>
                        <p className="text-forest text-sm bg-cream p-3 rounded">{notes}</p>
                      </div>
                    )}
                  </div>

                  <Alert>
                    <Info className="w-4 h-4" />
                    <AlertDescription>
                      You'll receive a confirmation email with session details and payment instructions.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={step === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              {step < 3 ? (
                <Button
                  onClick={nextStep}
                  className="bg-gold text-white hover:bg-gold/90"
                >
                  Continue
                  <Clock className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleBooking}
                  disabled={createBookingMutation.isPending}
                  className="bg-gold text-white hover:bg-gold/90"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {createBookingMutation.isPending ? 'Booking...' : 'Confirm & Book'}
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar - Practitioner info */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-forest text-sm">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <div className="font-medium text-forest">Facilitator #{practitioner.id.slice(-6)}</div>
                    <div className="text-sm text-forest/60">{practitioner.archetype} • {practitioner.experienceLevel}</div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-forest/70">Date</span>
                    <span className="font-medium text-forest">
                      {selectedDate ? format(selectedDate, 'MMM d') : '-'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-forest/70">Time</span>
                    <span className="font-medium text-forest">{selectedTime || '-'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-forest/70">Duration</span>
                    <span className="font-medium text-forest">{duration} min</span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-lg font-semibold">
                  <span className="text-forest">Total</span>
                  <span className="text-gold">${calculatePrice()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
