import { useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MessageBubble from "./message-bubble";
import ComposeMessage from "./compose-message";
import { apiRequest } from "@/lib/queryClient";

interface ConversationViewProps {
  conversationId: string;
  participantName: string;
  participantAvatar?: string;
  currentUserId: string;
  onBack: () => void;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

interface ConversationData {
  conversation: {
    id: string;
    participant1Id: string;
    participant2Id: string;
    lastMessageAt: string;
    lastMessagePreview: string;
  };
  messages: Message[];
}

export default function ConversationView({
  conversationId,
  participantName,
  participantAvatar,
  currentUserId,
  onBack
}: ConversationViewProps) {
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initials = participantName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Fetch messages
  const { data, isLoading, error } = useQuery<ConversationData>({
    queryKey: [`/api/messages/conversations/${conversationId}`],
    refetchInterval: 30000, // Poll every 30 seconds
  });

  // Send message mutation
  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", "/api/messages", {
        conversationId,
        content
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/messages/conversations/${conversationId}`]
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/messages/conversations"]
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/messages/unread-count"]
      });
    }
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data?.messages]);

  const handleSend = async (content: string) => {
    await sendMessage.mutateAsync(content);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-500">
        Failed to load conversation
      </div>
    );
  }

  const messages = data?.messages || [];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-sage/20 bg-white">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="md:hidden"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <Avatar className="h-10 w-10">
          <AvatarImage src={participantAvatar} alt={participantName} />
          <AvatarFallback className="bg-sage/20 text-forest">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div>
          <h3 className="font-medium text-forest">{participantName}</h3>
          <p className="text-xs text-forest/50">Tap to view profile</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-cream/30">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-sage/10 rounded-full p-4 mb-3">
              <User className="w-8 h-8 text-sage" />
            </div>
            <p className="text-forest/60">No messages yet</p>
            <p className="text-sm text-forest/40">
              Send a message to start the conversation
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                content={message.content}
                timestamp={message.createdAt}
                isOwn={message.senderId === currentUserId}
                isRead={message.isRead}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Compose */}
      <ComposeMessage
        onSend={handleSend}
        disabled={sendMessage.isPending}
      />
    </div>
  );
}
