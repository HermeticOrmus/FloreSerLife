import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Search, Loader2, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { apiRequest } from "@/lib/queryClient";

interface Practitioner {
  id: string;
  userId: string;
  displayName?: string;
  archetype?: string;
  avatar?: string;
}

interface NewConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId: string;
  onConversationCreated: (conversationId: string, participantName: string) => void;
}

export default function NewConversationDialog({
  open,
  onOpenChange,
  currentUserId,
  onConversationCreated
}: NewConversationDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch practitioners to message
  const { data: practitioners = [], isLoading } = useQuery<Practitioner[]>({
    queryKey: ["/api/practitioners/all"],
    enabled: open,
  });

  // Create conversation mutation
  const createConversation = useMutation({
    mutationFn: async (participantId: string) => {
      const res = await apiRequest("POST", "/api/messages/conversations", {
        participantId
      });
      return res.json();
    },
    onSuccess: (data: any, participantId) => {
      const practitioner = practitioners.find(p => p.userId === participantId);
      const name = practitioner?.displayName || "User";
      onConversationCreated(data.id, name);
      onOpenChange(false);
      setSearchQuery("");
    }
  });

  // Filter out current user and search
  const filteredPractitioners = (Array.isArray(practitioners) ? practitioners : [])
    .filter((p) => p.userId !== currentUserId)
    .filter((p) =>
      p.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleSelect = async (practitioner: Practitioner) => {
    await createConversation.mutateAsync(practitioner.userId);
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-forest">New Message</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest/40" />
          <Input
            placeholder="Search practitioners..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 border-sage/30 focus:border-gold focus:ring-gold"
            autoFocus
          />
        </div>

        <div className="max-h-64 overflow-y-auto -mx-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gold" />
            </div>
          ) : filteredPractitioners.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <User className="w-8 h-8 text-sage mb-2" />
              <p className="text-forest/60">
                {searchQuery ? "No practitioners found" : "No practitioners available"}
              </p>
            </div>
          ) : (
            <div className="space-y-1 px-2">
              {filteredPractitioners.map((practitioner) => (
                <button
                  key={practitioner.id}
                  onClick={() => handleSelect(practitioner)}
                  disabled={createConversation.isPending}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-sage/10 transition-colors text-left disabled:opacity-50"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={practitioner.avatar} />
                    <AvatarFallback className="bg-sage/20 text-forest">
                      {getInitials(practitioner.displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-forest truncate">
                      {practitioner.displayName || "Practitioner"}
                    </p>
                    {practitioner.archetype && (
                      <p className="text-xs text-forest/50 capitalize">
                        {practitioner.archetype}
                      </p>
                    )}
                  </div>
                  {createConversation.isPending && (
                    <Loader2 className="w-4 h-4 animate-spin text-gold" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
