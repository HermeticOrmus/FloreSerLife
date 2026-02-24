import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Leaf, Upload, Coins, Link2 } from "lucide-react";
import { GardenContentType, contentTypeOptions } from "./types";

interface UploadFormData {
  title: string;
  description: string;
  content: string;
  contentType: GardenContentType;
  tags: string;
  fileUrl: string;
}

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (data: UploadFormData) => void;
  isPending: boolean;
}

const INITIAL_FORM: UploadFormData = {
  title: "",
  description: "",
  content: "",
  contentType: "article",
  tags: "",
  fileUrl: "",
};

const URL_CONTENT_TYPES = new Set(["video", "audio"]);

export default function UploadModal({
  open,
  onOpenChange,
  onUpload,
  isPending,
}: UploadModalProps) {
  const [form, setForm] = useState<UploadFormData>(INITIAL_FORM);

  const update = (field: keyof UploadFormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const showUrlField = URL_CONTENT_TYPES.has(form.contentType);

  const handleSubmit = () => {
    onUpload(form);
    setForm(INITIAL_FORM);
  };

  const canSubmit = form.title && (form.content || form.fileUrl) && !isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-garden-text-primary">
            <Leaf className="w-5 h-5 text-garden-accent mr-2" />
            Share Your Gift with the Community
          </DialogTitle>
          <p className="text-body-sm text-garden-text-secondary mt-2">
            Offer your wisdom freely. What you share here helps others flourish
            on their journey.
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-garden-text-primary mb-2 block">
              Content Type
            </label>
            <Select
              value={form.contentType}
              onValueChange={(value) =>
                update("contentType", value as GardenContentType)
              }
            >
              <SelectTrigger className="bg-garden-card border-garden-accent/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {contentTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div>{option.label}</div>
                      <div className="text-xs text-garden-text-secondary">
                        {option.description}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-garden-text-primary mb-2 block">
              Title
            </label>
            <Input
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Give your content a compelling title..."
              className="bg-garden-card border-garden-accent/20"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-garden-text-primary mb-2 block">
              Description
            </label>
            <Input
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Brief summary of your content..."
              className="bg-garden-card border-garden-accent/20"
            />
          </div>

          {showUrlField && (
            <div>
              <label className="text-sm font-medium text-garden-text-primary mb-2 block">
                <Link2 className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                Content URL
              </label>
              <Input
                value={form.fileUrl}
                onChange={(e) => update("fileUrl", e.target.value)}
                placeholder="https://youtube.com/watch?v=... or https://soundcloud.com/..."
                className="bg-garden-card border-garden-accent/20"
                type="url"
              />
              <p className="text-xs text-garden-text-secondary mt-1">
                Paste a YouTube, Vimeo, or SoundCloud link
              </p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-garden-text-primary mb-2 block">
              Content
            </label>
            <Textarea
              value={form.content}
              onChange={(e) => update("content", e.target.value)}
              placeholder="Share your wisdom, insights, or resources..."
              rows={6}
              className="bg-garden-card border-garden-accent/20"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-garden-text-primary mb-2 block">
              Tags
            </label>
            <Input
              value={form.tags}
              onChange={(e) => update("tags", e.target.value)}
              placeholder="healing, transformation, wisdom (comma separated)"
              className="bg-garden-card border-garden-accent/20"
            />
          </div>

          <div className="bg-garden-accent-light rounded-card p-4">
            <div className="flex items-center mb-2">
              <Coins className="w-4 h-4 text-garden-accent mr-2" />
              <span className="text-sm font-medium text-garden-text-primary">
                Seeds Reward
              </span>
            </div>
            <p className="text-xs text-garden-text-secondary">
              You'll earn 25 Seeds for this contribution, plus bonus Seeds based
              on community engagement!
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-button"
            >
              Cancel
            </Button>
            <Button
              className="bg-garden-accent text-white hover:bg-garden-accent/90 rounded-button"
              onClick={handleSubmit}
              disabled={!canSubmit}
            >
              <Upload className="w-4 h-4 mr-2" />
              Share Your Gift
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
