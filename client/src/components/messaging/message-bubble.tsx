import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Check, CheckCheck } from "lucide-react";

interface MessageBubbleProps {
  content: string;
  timestamp: string;
  isOwn: boolean;
  isRead?: boolean;
  senderName?: string;
}

export default function MessageBubble({
  content,
  timestamp,
  isOwn,
  isRead,
  senderName
}: MessageBubbleProps) {
  const formattedTime = format(new Date(timestamp), "h:mm a");

  return (
    <div className={cn(
      "flex w-full mb-3",
      isOwn ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[75%] rounded-2xl px-4 py-2",
        isOwn
          ? "bg-gold text-white rounded-br-md"
          : "bg-sage/10 text-forest rounded-bl-md"
      )}>
        {!isOwn && senderName && (
          <p className="text-xs font-medium mb-1 opacity-70">{senderName}</p>
        )}
        <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
        <div className={cn(
          "flex items-center justify-end gap-1 mt-1",
          isOwn ? "text-white/70" : "text-forest/50"
        )}>
          <span className="text-xs">{formattedTime}</span>
          {isOwn && (
            isRead
              ? <CheckCheck className="w-3.5 h-3.5" />
              : <Check className="w-3.5 h-3.5" />
          )}
        </div>
      </div>
    </div>
  );
}
