import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Inbox from "@/components/messaging/inbox";
import ConversationView from "@/components/messaging/conversation-view";
import NewConversationDialog from "@/components/messaging/new-conversation-dialog";
import { MessageCircle } from "lucide-react";

interface Conversation {
  id: string;
  participant1Id: string;
  participant2Id: string;
  lastMessageAt: string;
  lastMessagePreview: string;
  participantName: string;
  participantAvatar?: string;
  unreadCount: number;
}

export default function MessagesPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
  const [mobileShowConversation, setMobileShowConversation] = useState(false);

  useEffect(() => {
    document.title = "Messages - FloreSer";
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/auth/signin");
    }
  }, [authLoading, isAuthenticated, setLocation]);

  // Fetch unread count for header badge
  const { data: unreadData } = useQuery<{ count: number }>({
    queryKey: ["/api/messages/unread-count"],
    enabled: !!user,
    refetchInterval: 30000,
  });

  const handleSelectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation);
    setMobileShowConversation(true);
  };

  const handleBackToInbox = () => {
    setMobileShowConversation(false);
  };

  const handleNewConversationCreated = (conversationId: string, participantName: string) => {
    setActiveConversation({
      id: conversationId,
      participant1Id: user?.id || "",
      participant2Id: "",
      lastMessageAt: new Date().toISOString(),
      lastMessagePreview: "",
      participantName,
      unreadCount: 0
    });
    setMobileShowConversation(true);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-sage/20 overflow-hidden h-[calc(100vh-200px)] min-h-[500px]">
          {/* Desktop Layout */}
          <div className="hidden md:flex h-full">
            {/* Sidebar - Inbox */}
            <div className="w-80 border-r border-sage/20 flex-shrink-0">
              <Inbox
                currentUserId={user.id}
                activeConversationId={activeConversation?.id || null}
                onSelectConversation={handleSelectConversation}
                onNewMessage={() => setShowNewMessageDialog(true)}
              />
            </div>

            {/* Main - Conversation */}
            <div className="flex-1 flex flex-col">
              {activeConversation ? (
                <ConversationView
                  conversationId={activeConversation.id}
                  participantName={activeConversation.participantName}
                  participantAvatar={activeConversation.participantAvatar}
                  currentUserId={user.id}
                  onBack={handleBackToInbox}
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <div className="bg-sage/10 rounded-full p-6 mb-4">
                    <MessageCircle className="w-12 h-12 text-sage" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-forest mb-2">
                    Your Messages
                  </h3>
                  <p className="text-forest/60 max-w-sm">
                    Select a conversation from the sidebar or start a new message with a practitioner.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden h-full">
            {mobileShowConversation && activeConversation ? (
              <ConversationView
                conversationId={activeConversation.id}
                participantName={activeConversation.participantName}
                participantAvatar={activeConversation.participantAvatar}
                currentUserId={user.id}
                onBack={handleBackToInbox}
              />
            ) : (
              <Inbox
                currentUserId={user.id}
                activeConversationId={activeConversation?.id || null}
                onSelectConversation={handleSelectConversation}
                onNewMessage={() => setShowNewMessageDialog(true)}
              />
            )}
          </div>
        </div>
      </main>

      <Footer />

      <NewConversationDialog
        open={showNewMessageDialog}
        onOpenChange={setShowNewMessageDialog}
        currentUserId={user.id}
        onConversationCreated={handleNewConversationCreated}
      />
    </div>
  );
}
