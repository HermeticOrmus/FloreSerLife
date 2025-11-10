import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, Calendar, Lock, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  sessionId?: string;
  tags?: string[];
}

interface ReflectionsJournalProps {
  entries?: JournalEntry[];
  onAddEntry?: (entry: Omit<JournalEntry, 'id'>) => void;
  onUpdateEntry?: (id: string, entry: Partial<JournalEntry>) => void;
}

export default function ReflectionsJournal({
  entries = [],
  onAddEntry,
  onUpdateEntry
}: ReflectionsJournalProps) {
  const [isWriting, setIsWriting] = useState(false);
  const [newEntry, setNewEntry] = useState({
    title: "",
    content: "",
    tags: ""
  });
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  const handleSaveEntry = () => {
    if (!newEntry.title || !newEntry.content) return;

    const entry = {
      date: new Date().toISOString(),
      title: newEntry.title,
      content: newEntry.content,
      tags: newEntry.tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    if (onAddEntry) {
      onAddEntry(entry);
    }

    // Reset form
    setNewEntry({ title: "", content: "", tags: "" });
    setIsWriting(false);
  };

  const sortedEntries = [...entries].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card className="bg-hive-card-light border-0 rounded-card shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-hive-accent" />
            <CardTitle className="text-card-heading font-heading text-hive-text-primary">
              Reflections Journal
            </CardTitle>
          </div>
          <Badge variant="outline" className="text-xs border-hive-accent/30">
            <Lock className="w-3 h-3 mr-1" />
            Private
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-body-sm text-hive-text-secondary">
            A private space to reflect on your sessions, insights, and growth as a facilitator.
          </p>
          {!isWriting && (
            <Button
              size="sm"
              className="bg-hive-accent text-white hover:bg-hive-accent-light rounded-button"
              onClick={() => setIsWriting(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              New Entry
            </Button>
          )}
        </div>

        {/* Writing form */}
        {isWriting && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 p-6 bg-hive-bg rounded-card border-2 border-hive-accent/20"
          >
            <div>
              <Input
                placeholder="Entry title (e.g., 'Session with Sarah - Breakthrough moment')"
                value={newEntry.title}
                onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                className="bg-white border-hive-accent/20"
              />
            </div>

            <div>
              <Textarea
                placeholder="What insights emerged? What did you notice about your facilitation? What would you like to remember?"
                value={newEntry.content}
                onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                rows={8}
                className="bg-white border-hive-accent/20 resize-none"
              />
            </div>

            <div>
              <Input
                placeholder="Tags (e.g., breakthrough, challenging, gratitude)"
                value={newEntry.tags}
                onChange={(e) => setNewEntry(prev => ({ ...prev, tags: e.target.value }))}
                className="bg-white border-hive-accent/20"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsWriting(false);
                  setNewEntry({ title: "", content: "", tags: "" });
                }}
                className="rounded-button"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveEntry}
                disabled={!newEntry.title || !newEntry.content}
                className="bg-hive-accent text-white hover:bg-hive-accent-light rounded-button"
              >
                <Sparkles className="w-4 h-4 mr-1" />
                Save Reflection
              </Button>
            </div>
          </motion.div>
        )}

        {/* Entries list */}
        {sortedEntries.length > 0 ? (
          <ScrollArea className="h-96">
            <div className="space-y-3 pr-4">
              {sortedEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <button
                    onClick={() => setSelectedEntry(entry)}
                    className={`
                      w-full text-left p-4 rounded-card transition-all
                      ${selectedEntry?.id === entry.id
                        ? 'bg-hive-accent/10 border-2 border-hive-accent shadow-card-md'
                        : 'bg-hive-bg border-2 border-transparent hover:border-hive-accent/20 hover:shadow-card-sm'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-body font-semibold text-hive-text-primary line-clamp-1">
                        {entry.title}
                      </h4>
                      <div className="flex items-center gap-1 text-caption text-hive-text-secondary flex-shrink-0 ml-2">
                        <Calendar className="w-3 h-3" />
                        {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>

                    <p className="text-body-sm text-hive-text-secondary line-clamp-2 mb-2">
                      {entry.content}
                    </p>

                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {entry.tags.slice(0, 3).map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs border-hive-accent/20">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </button>

                  {/* Expanded view */}
                  {selectedEntry?.id === entry.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-3 p-4 bg-white rounded-card border border-hive-accent/10"
                    >
                      <p className="text-body text-hive-text-primary whitespace-pre-wrap">
                        {entry.content}
                      </p>
                      <div className="mt-4 pt-4 border-t border-hive-accent/10">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedEntry(null)}
                          className="text-xs"
                        >
                          Collapse
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-12 bg-hive-bg rounded-card">
            <BookOpen className="w-12 h-12 text-hive-accent/30 mx-auto mb-4" />
            <p className="text-body text-hive-text-secondary mb-2">
              No reflections yet
            </p>
            <p className="text-body-sm text-hive-text-secondary mb-4">
              Start documenting your journey as a facilitator
            </p>
            <Button
              size="sm"
              onClick={() => setIsWriting(true)}
              className="bg-hive-accent text-white hover:bg-hive-accent-light rounded-button"
            >
              <Plus className="w-4 h-4 mr-1" />
              Write First Entry
            </Button>
          </div>
        )}

        {/* Wisdom note */}
        <div className="pt-4 border-t border-hive-accent/10">
          <p className="text-caption text-hive-text-secondary italic text-center">
            "The act of reflection deepens our practice and honors the sacred work we do." — FloreSer
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
