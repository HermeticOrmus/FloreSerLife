import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ConversationItemProps {
  id: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  isActive: boolean;
  onClick: () => void;
}

export default function ConversationItem({
  participantName,
  participantAvatar,
  lastMessage,
  lastMessageAt,
  unreadCount,
  isActive,
  onClick
}: ConversationItemProps) {
  const initials = participantName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const timeAgo = lastMessageAt
    ? formatDistanceToNow(new Date(lastMessageAt), { addSuffix: true })
    : "";

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left",
        isActive
          ? "bg-gold/10 border border-gold/30"
          : "hover:bg-sage/10 border border-transparent"
      )}
    >
      <Avatar className="h-12 w-12 flex-shrink-0">
        <AvatarImage src={participantAvatar} alt={participantName} />
        <AvatarFallback className="bg-sage/20 text-forest font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={cn(
            "font-medium truncate",
            unreadCount > 0 ? "text-forest" : "text-forest/80"
          )}>
            {participantName}
          </span>
          {lastMessageAt && (
            <span className="text-xs text-forest/50 flex-shrink-0">
              {timeAgo}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className={cn(
            "text-sm truncate",
            unreadCount > 0 ? "text-forest font-medium" : "text-forest/60"
          )}>
            {lastMessage || "No messages yet"}
          </p>
          {unreadCount > 0 && (
            <span className="bg-gold text-white text-xs font-medium rounded-full px-2 py-0.5 min-w-[20px] text-center flex-shrink-0">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
