import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, MessageSquarePlus, Loader2, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ConversationItem from "./conversation-item";

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

interface InboxProps {
  currentUserId: string;
  activeConversationId: string | null;
  onSelectConversation: (conversation: Conversation) => void;
  onNewMessage: () => void;
}

export default function Inbox({
  currentUserId,
  activeConversationId,
  onSelectConversation,
  onNewMessage
}: InboxProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: conversations = [], isLoading } = useQuery<Conversation[]>({
    queryKey: ["/api/messages/conversations"],
    refetchInterval: 30000, // Poll every 30 seconds
  });

  const filteredConversations = conversations.filter((conv) =>
    conv.participantName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-sage/20">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading text-xl font-semibold text-forest">
            Messages
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={onNewMessage}
            className="border-gold text-gold hover:bg-gold hover:text-white"
          >
            <MessageSquarePlus className="w-4 h-4 mr-1" />
            New
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest/40" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 border-sage/30 focus:border-gold focus:ring-gold"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 animate-spin text-gold" />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="bg-sage/10 rounded-full p-4 mb-3">
              <MessageCircle className="w-8 h-8 text-sage" />
            </div>
            <p className="text-forest/60 font-medium">No conversations yet</p>
            <p className="text-sm text-forest/40 mt-1">
              {searchQuery
                ? "No results found"
                : "Start a conversation with a practitioner"}
            </p>
            {!searchQuery && (
              <Button
                variant="outline"
                className="mt-4 border-gold text-gold hover:bg-gold hover:text-white"
                onClick={onNewMessage}
              >
                Start a conversation
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                id={conversation.id}
                participantName={conversation.participantName}
                participantAvatar={conversation.participantAvatar}
                lastMessage={conversation.lastMessagePreview}
                lastMessageAt={conversation.lastMessageAt}
                unreadCount={conversation.unreadCount}
                isActive={conversation.id === activeConversationId}
                onClick={() => onSelectConversation(conversation)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
