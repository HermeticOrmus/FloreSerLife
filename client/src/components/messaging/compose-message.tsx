import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";

interface ComposeMessageProps {
  onSend: (content: string) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
}

export default function ComposeMessage({
  onSend,
  disabled,
  placeholder = "Type a message..."
}: ComposeMessageProps) {
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSending || disabled) return;

    setIsSending(true);
    try {
      await onSend(content.trim());
      setContent("");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 p-4 border-t border-sage/20 bg-white">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled || isSending}
        className="min-h-[44px] max-h-32 resize-none border-sage/30 focus:border-gold focus:ring-gold"
        rows={1}
      />
      <Button
        type="submit"
        disabled={!content.trim() || isSending || disabled}
        className="bg-gold hover:bg-gold/90 text-white h-11 w-11 p-0 flex-shrink-0"
      >
        {isSending ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}
      </Button>
    </form>
  );
}
