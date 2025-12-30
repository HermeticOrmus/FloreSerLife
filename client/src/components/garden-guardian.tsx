import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Leaf,
  BookOpen,
  Lightbulb,
  Sparkles,
  Bot,
  MessageCircle,
  Send,
  X,
  Minimize2,
  Maximize2,
  TreePine,
  Star
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface GardenContent {
  id: string;
  title: string;
  content: string;
  contentType: string;
  authorArchetype: string;
  tags: string[];
  seedsReward: number;
}

interface GuardianMessage {
  id: string;
  content: string;
  sender: 'user' | 'guardian';
  timestamp: Date;
  relatedContent?: GardenContent[];
  contentRecommendations?: string[];
}

export function GardenGuardian() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<GuardianMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Fetch garden content for AI context
  const { data: gardenData } = useQuery<any>({
    queryKey: ["/api/garden/content"],
  });

  const gardenContent = Array.isArray((gardenData as any)?.content) ? (gardenData as any).content :
    Array.isArray(gardenData) ? gardenData : [];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addGuardianMessage(
          "🌱 Hello! I'm the Garden Guardian, your AI guide to our Community Garden wisdom. I've studied all the content shared by our facilitators and can help you find exactly what you need for your healing journey. What brings you to the Garden today?",
          [],
          ["Browse healing insights", "Find transformation stories", "Discover grounding techniques"]
        );
      }, 500);
    }
  }, [isOpen]);

  const addGuardianMessage = (
    content: string,
    relatedContent: GardenContent[] = [],
    recommendations: string[] = []
  ) => {
    const newMessage: GuardianMessage = {
      id: Date.now().toString(),
      content,
      sender: 'guardian',
      timestamp: new Date(),
      relatedContent,
      contentRecommendations: recommendations
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (content: string) => {
    const newMessage: GuardianMessage = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const findRelevantContent = (userMessage: string): GardenContent[] => {
    const lowerMessage = userMessage.toLowerCase();
    const keywords = lowerMessage.split(' ').filter(word => word.length > 3);

    return gardenContent.filter((content: GardenContent) => {
      const contentText = (content.title + ' ' + content.content + ' ' + content.tags.join(' ')).toLowerCase();
      return keywords.some(keyword => contentText.includes(keyword));
    }).slice(0, 3); // Limit to top 3 matches
  };

  const generateGardenResponse = (userMessage: string): {
    response: string;
    relatedContent: GardenContent[];
    recommendations: string[]
  } => {
    const lowerMessage = userMessage.toLowerCase();
    const relevantContent = findRelevantContent(userMessage);

    // Anxiety/stress related
    if (lowerMessage.includes('anxiety') || lowerMessage.includes('stress') || lowerMessage.includes('calm')) {
      const beeContent = gardenContent.filter((c: GardenContent) => c.authorArchetype === 'bee');
      return {
        response: "🐝 I sense you're seeking peace and grounding. The Bee archetype facilitators in our Garden have shared wonderful wisdom about creating calm and stability. Bee energy is all about steady, nurturing support - perfect for anxiety relief.\n\nLet me share some content that might resonate with your need for tranquility:",
        relatedContent: beeContent.slice(0, 2).concat(relevantContent.slice(0, 1)),
        recommendations: ["Explore grounding techniques", "Find community support", "Learn breathing exercises"]
      };
    }

    // Transformation/change related
    if (lowerMessage.includes('transform') || lowerMessage.includes('change') || lowerMessage.includes('transition')) {
      const butterflyContent = gardenContent.filter((c: GardenContent) => c.authorArchetype === 'butterfly');
      return {
        response: "🦋 Beautiful! You're in a season of transformation. Our Butterfly archetype facilitators specialize in guiding people through life transitions and metamorphosis. Their wisdom in the Garden can illuminate your path forward.\n\nHere's some transformational content I've curated for you:",
        relatedContent: butterflyContent.slice(0, 2).concat(relevantContent.slice(0, 1)),
        recommendations: ["Read transformation stories", "Explore life transition guides", "Find your metamorphosis path"]
      };
    }

    // Spiritual/intuitive seeking
    if (lowerMessage.includes('spiritual') || lowerMessage.includes('intuition') || lowerMessage.includes('guidance')) {
      const hummingbirdContent = gardenContent.filter((c: GardenContent) => c.authorArchetype === 'hummingbird');
      return {
        response: "🦜 I feel your call for deeper spiritual connection. The Hummingbird archetype facilitators are masters of precision and spiritual insight. They've shared profound wisdom about accessing intuition and divine guidance.\n\nLet me guide you to their most illuminating content:",
        relatedContent: hummingbirdContent.slice(0, 2).concat(relevantContent.slice(0, 1)),
        recommendations: ["Discover intuitive practices", "Explore spiritual insights", "Connect with divine guidance"]
      };
    }

    // Deep work/healing
    if (lowerMessage.includes('heal') || lowerMessage.includes('deep') || lowerMessage.includes('shadow')) {
      const beetleContent = gardenContent.filter((c: GardenContent) => c.authorArchetype === 'beetle');
      return {
        response: "🪲 You're ready for deep, transformative work. The Beetle archetype facilitators excel at shadow work and profound integration. They've shared powerful content about diving deep into healing work.\n\nHere's some profound content for your deep healing journey:",
        relatedContent: beetleContent.slice(0, 2).concat(relevantContent.slice(0, 1)),
        recommendations: ["Explore shadow work techniques", "Find deep healing practices", "Discover integration methods"]
      };
    }

    // General content search
    if (relevantContent.length > 0) {
      return {
        response: `🌱 I found some beautiful content in our Garden that matches what you're seeking! Our facilitators have shared wisdom that directly speaks to your interests.\n\nHere's what I discovered for you:`,
        relatedContent: relevantContent,
        recommendations: ["Explore similar content", "Connect with the author", "Save for later reading"]
      };
    }

    // Default response with random valuable content
    const randomContent = gardenContent.slice(0, 3);
    return {
      response: "🌿 While I search for content specific to your needs, let me share some of the most beloved wisdom from our Garden. Our facilitators have created beautiful content that speaks to many healing journeys.\n\nHere are some highlights:",
      relatedContent: randomContent,
      recommendations: ["Browse by archetype", "Explore content types", "Find facilitator wisdom"]
    };
  };

  const handleSendMessage = async () => {
    const text = inputValue.trim();
    if (!text) return;

    addUserMessage(text);
    setInputValue("");
    setIsTyping(true);

    // Simulate processing delay
    setTimeout(() => {
      const { response, relatedContent, recommendations } = generateGardenResponse(text);
      addGuardianMessage(response, relatedContent, recommendations);
      setIsTyping(false);
    }, 1000 + Math.random() * 1500);
  };

  const getArchetypeIcon = (archetype: string) => {
    const icons = {
      bee: "🐝",
      hummingbird: "🦜",
      butterfly: "🦋",
      beetle: "🪲"
    };
    return icons[archetype as keyof typeof icons] || "🌟";
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-20 right-6 z-40">
        <Button
          size="lg"
          className="rounded-full bg-gradient-to-r from-green-600 to-forest text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all p-4"
          onClick={() => setIsOpen(true)}
        >
          <TreePine className="w-6 h-6 mr-2" />
          Garden Guardian
          <Leaf className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 right-6 z-40">
      <Card className={`w-96 shadow-2xl border-green-200 transition-all duration-300 ${
        isMinimized ? 'h-16' : 'h-[500px]'
      }`}>
        <CardHeader className="flex flex-row items-center justify-between p-4 bg-gradient-to-r from-green-600 to-forest text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <TreePine className="w-6 h-6" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <CardTitle className="text-lg">Garden Guardian</CardTitle>
              <p className="text-xs text-white/80">AI Wisdom Curator</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:bg-white/20 p-1"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 h-full flex flex-col">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="space-y-3">
                  <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-green-600 text-white'
                        : 'bg-green-50 border border-green-200'
                    }`}>
                      {message.sender === 'guardian' && (
                        <div className="flex items-center space-x-2 mb-2">
                          <TreePine className="w-4 h-4 text-green-600" />
                          <span className="text-xs font-medium text-green-700">Garden Guardian</span>
                          <Badge className="text-xs bg-green-100 text-green-700">
                            <Leaf className="w-3 h-3 mr-1" />
                            Curator
                          </Badge>
                        </div>
                      )}
                      <div className="text-sm whitespace-pre-line">
                        {message.content}
                      </div>
                    </div>
                  </div>

                  {/* Related Content Cards */}
                  {message.relatedContent && message.relatedContent.length > 0 && (
                    <div className="ml-4 space-y-2">
                      <p className="text-xs text-green-600 font-medium">📚 Curated Content:</p>
                      {message.relatedContent.map((content) => (
                        <Card key={content.id} className="border-green-200 bg-green-50/50">
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between mb-2">
                              <Badge variant="outline" className="text-xs border-green-300">
                                {getArchetypeIcon(content.authorArchetype)} {content.contentType}
                              </Badge>
                              <div className="flex items-center text-xs text-green-600">
                                <Sparkles className="w-3 h-3 mr-1" />
                                {content.seedsReward} Seeds
                              </div>
                            </div>
                            <h4 className="font-semibold text-sm text-forest mb-1 line-clamp-1">
                              {content.title}
                            </h4>
                            <p className="text-xs text-forest/70 line-clamp-2 mb-2">
                              {content.content}
                            </p>
                            <div className="flex justify-between items-center">
                              <div className="flex gap-1">
                                {content.tags.slice(0, 2).map((tag, idx) => (
                                  <span key={idx} className="text-xs text-green-600">#{tag}</span>
                                ))}
                              </div>
                              <Button size="sm" variant="outline" className="h-6 text-xs border-green-300 hover:bg-green-100">
                                <BookOpen className="w-3 h-3 mr-1" />
                                Read
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Content Recommendations */}
                  {message.contentRecommendations && message.contentRecommendations.length > 0 && (
                    <div className="ml-4">
                      <p className="text-xs text-green-600 font-medium mb-2">💡 Try these:</p>
                      <div className="flex flex-wrap gap-2">
                        {message.contentRecommendations.map((rec, idx) => (
                          <Button
                            key={idx}
                            size="sm"
                            variant="outline"
                            className="h-6 text-xs border-green-300 hover:bg-green-100"
                            onClick={() => {
                              setInputValue(rec);
                              handleSendMessage();
                            }}
                          >
                            {rec}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <TreePine className="w-4 h-4 text-green-600" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-green-600/60 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-green-600/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-green-600/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-green-200">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about Garden content..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 border-green-200 focus:border-green-400"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}