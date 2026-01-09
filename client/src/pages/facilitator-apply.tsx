import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { apiRequest } from "@/lib/queryClient";
import {
  Send,
  Loader2,
  Sparkles,
  CheckCircle,
  ArrowLeft
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function FacilitatorApplyPage() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Apply as Facilitator - FloreSer";
  }, []);

  // Check mAIa availability
  const { data: maiaStatus } = useQuery<{ available: boolean }>({
    queryKey: ["/api/maia/status"],
  });

  // Check existing application
  const { data: existingApp } = useQuery({
    queryKey: ["/api/facilitator-application"],
    enabled: isAuthenticated,
  });

  // Load existing conversation if user has one
  useEffect(() => {
    if (existingApp) {
      const app = existingApp as any;
      setApplicationId(app.id);
      setApplicationStatus(app.status);
      if (app.conversationHistory && Array.isArray(app.conversationHistory)) {
        setMessages(app.conversationHistory);
      }
    }
  }, [existingApp]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Chat mutation
  const chat = useMutation({
    mutationFn: async (userMessage: string) => {
      const res = await apiRequest("POST", "/api/facilitator-application/chat", {
        message: userMessage,
        applicationId,
        email: email || user?.email,
      });
      return res.json();
    },
    onSuccess: (data) => {
      setApplicationId(data.applicationId);
      if (data.isNew) {
        setMessages([{ role: "assistant", content: data.response }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "user", content: message },
          { role: "assistant", content: data.response },
        ]);
      }
      setMessage("");
    },
  });

  // Submit application mutation
  const submitApp = useMutation({
    mutationFn: async () => {
      const res = await apiRequest(
        "POST",
        `/api/facilitator-application/${applicationId}/submit`
      );
      return res.json();
    },
    onSuccess: () => {
      setApplicationStatus("submitted");
    },
  });

  const handleStartConversation = async () => {
    if (!email && !user?.email) return;
    chat.mutate("Hello, I'd like to apply to become a facilitator.");
  };

  const handleSend = async () => {
    if (!message.trim() || chat.isPending) return;
    const userMsg = message;
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    chat.mutate(userMsg);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // If application already submitted
  if (applicationStatus && applicationStatus !== "in_progress") {
    return (
      <div className="min-h-screen bg-cream flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-xl shadow-sm border border-sage/20 p-8">
              <div className="bg-gold/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-gold" />
              </div>
              <h2 className="font-heading text-2xl font-semibold text-forest mb-2">
                Application {applicationStatus === "submitted" ? "Submitted" : applicationStatus}
              </h2>
              <p className="text-forest/60 mb-6">
                {applicationStatus === "submitted" &&
                  "Thank you for applying! Our team will review your application and get back to you soon."}
                {applicationStatus === "approved" &&
                  "Congratulations! Your application has been approved. Welcome to the FloreSer community!"}
                {applicationStatus === "rejected" &&
                  "We appreciate your interest. Unfortunately, we're unable to approve your application at this time."}
              </p>
              <Button
                variant="outline"
                onClick={() => setLocation("/")}
                className="border-gold text-gold hover:bg-gold hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return Home
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Initial state - before conversation started
  if (messages.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="bg-gold/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-10 h-10 text-gold" />
              </div>
              <h1 className="font-heading text-3xl font-bold text-forest mb-2">
                Become a Pollinator
              </h1>
              <p className="text-forest/60 max-w-md mx-auto">
                Join our community of wellness facilitators. mAIa will guide you
                through the application process.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-sage/20 p-8">
              {!maiaStatus?.available && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <p className="text-amber-800 text-sm">
                    mAIa is currently unavailable. Please try again later or
                    contact us at hello@floreser.life
                  </p>
                </div>
              )}

              {!isAuthenticated && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-forest mb-2">
                    Your Email
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="border-sage/30 focus:border-gold focus:ring-gold"
                  />
                  <p className="text-xs text-forest/50 mt-1">
                    We'll save your progress so you can continue later
                  </p>
                </div>
              )}

              <Button
                onClick={handleStartConversation}
                disabled={
                  chat.isPending ||
                  !maiaStatus?.available ||
                  (!isAuthenticated && !email)
                }
                className="w-full bg-gold hover:bg-gold/90 text-white"
              >
                {chat.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Start Application with mAIa
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-forest/50 mt-4">
                Already have an account?{" "}
                <a
                  href="/auth/signin"
                  className="text-gold hover:underline"
                >
                  Sign in
                </a>{" "}
                to continue your application.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Conversation in progress
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-sage/20 overflow-hidden h-[calc(100vh-200px)] min-h-[500px] flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-sage/20 bg-gradient-to-r from-gold/10 to-cream">
              <Avatar className="h-10 w-10 border-2 border-gold/30">
                <AvatarImage src="/maia-avatar.png" />
                <AvatarFallback className="bg-gold/20 text-gold font-semibold">
                  M
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-forest">mAIa</h3>
                <p className="text-xs text-forest/50">
                  Facilitator Application Guide
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-gold text-white rounded-br-md"
                        : "bg-sage/10 text-forest rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {chat.isPending && (
                <div className="flex justify-start">
                  <div className="bg-sage/10 rounded-2xl px-4 py-3 rounded-bl-md">
                    <Loader2 className="w-5 h-5 animate-spin text-forest/50" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-sage/20 bg-white">
              <div className="flex gap-2">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  disabled={chat.isPending}
                  className="min-h-[44px] max-h-32 resize-none border-sage/30 focus:border-gold focus:ring-gold"
                  rows={1}
                />
                <Button
                  onClick={handleSend}
                  disabled={!message.trim() || chat.isPending}
                  className="bg-gold hover:bg-gold/90 text-white h-11 w-11 p-0"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>

              {/* Submit button - show after a few exchanges */}
              {messages.length >= 6 && applicationId && (
                <div className="mt-4 pt-4 border-t border-sage/10">
                  <Button
                    variant="outline"
                    onClick={() => submitApp.mutate()}
                    disabled={submitApp.isPending}
                    className="w-full border-forest text-forest hover:bg-forest hover:text-white"
                  >
                    {submitApp.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Submit Application for Review
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-center text-forest/50 mt-2">
                    You can continue chatting or submit when ready
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
