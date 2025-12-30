import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Bot,
  MessageCircle,
  Send,
  Sparkles,
  Heart,
  User,
  Minimize2,
  Maximize2,
  X,
  Leaf,
  Star,
  Shield,
  Lightbulb,
  Navigation,
  Zap
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { papercut } from "@/assets";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'maia';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'guidance' | 'archetype_insight';
}

interface Suggestion {
  id: string;
  text: string;
  action?: () => void;
  icon?: React.ReactNode;
}

export function AIGuardian() {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize mAIa with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addMaiaMessage(
          "Hello! I'm mAIa, your AI Guardian. I'm here to help you navigate FloreSer and find the wellness support that's perfect for you. How can I assist you today?",
          'guidance'
        );
        generateContextualSuggestions();
      }, 500);
    }
  }, [isOpen]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMaiaMessage = (content: string, type: Message['type'] = 'text') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'maia',
      timestamp: new Date(),
      type
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const generateContextualSuggestions = () => {
    const baseSuggestions: Suggestion[] = [
      {
        id: '1',
        text: "Help me find the right practitioner",
        icon: <Navigation className="w-4 h-4" />,
        action: () => handleSuggestionClick("I need help finding the right practitioner for my needs")
      },
      {
        id: '2',
        text: "Explain the archetype system",
        icon: <Star className="w-4 h-4" />,
        action: () => handleSuggestionClick("Can you explain how the pollinator archetype system works?")
      },
      {
        id: '3',
        text: "Show me wellness resources",
        icon: <Leaf className="w-4 h-4" />,
        action: () => handleSuggestionClick("What wellness resources are available in the Community Garden?")
      }
    ];

    if (isAuthenticated) {
      baseSuggestions.push({
        id: '4',
        text: "Track my wellness journey",
        icon: <Heart className="w-4 h-4" />,
        action: () => handleSuggestionClick("Help me understand my progress and next steps")
      });
    }

    setSuggestions(baseSuggestions);
  };

  const handleSuggestionClick = (text: string) => {
    setInputValue(text);
    handleSendMessage(text);
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text) return;

    addUserMessage(text);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const response = generateMaiaResponse(text);
      addMaiaMessage(response.content, response.type);
      setIsTyping(false);

      // Update suggestions based on conversation
      generateDynamicSuggestions(text);
    }, 1000 + Math.random() * 1500);
  };

  const generateMaiaResponse = (userMessage: string): { content: string; type: Message['type'] } => {
    const lowerMessage = userMessage.toLowerCase();

    // Archetype-related responses
    if (lowerMessage.includes('archetype') || lowerMessage.includes('pollinator')) {
      return {
        content: "Our pollinator archetype system is inspired by nature's wisdom! We have four types:\n\n🐝 **Bee (Grounding)**: Community-focused, steady healing approach\n🦜 **Hummingbird (Precision)**: Quick insights, spiritual guidance\n🦋 **Butterfly (Transformation)**: Life transitions, metamorphosis\n🪲 **Beetle (Integration)**: Deep work, shadow integration\n\nEach practitioner embodies one archetype, helping you find someone whose energy truly resonates with your healing journey.",
        type: 'archetype_insight'
      };
    }

    // Practitioner finding help
    if (lowerMessage.includes('find') && lowerMessage.includes('practitioner')) {
      return {
        content: "I'd love to help you find your perfect practitioner match! Let me guide you:\n\n1. **Consider your goals**: Are you seeking emotional healing, spiritual growth, or practical life changes?\n\n2. **Think about your energy**: Do you prefer gentle, steady support (Bee) or dynamic, transformative work (Butterfly)?\n\n3. **Browse by archetype**: Visit our Practitioners page and filter by the archetype that resonates with you.\n\n4. **Read their wisdom**: Check out their content in The Hive to see their approach.\n\nWould you like me to ask you a few questions to narrow down the best archetype match for you?",
        type: 'guidance'
      };
    }

    // Community Garden questions
    if (lowerMessage.includes('garden') || lowerMessage.includes('resource')) {
      return {
        content: "The Community Garden is our wisdom-sharing space! Here you'll find:\n\n🌱 **Insights**: Deep wisdom from our facilitators\n📚 **Resources**: Tools, books, and materials\n🌟 **Success Stories**: Transformation journeys\n🛠️ **Practical Tools**: Techniques you can use\n🧘 **Meditations**: Guided practices\n\nYou earn Seeds for engaging with content and can unlock premium wisdom as you grow. Facilitators get special benefits too!\n\nWhat type of content interests you most?",
        type: 'guidance'
      };
    }

    // Progress and journey tracking
    if (lowerMessage.includes('progress') || lowerMessage.includes('journey') || lowerMessage.includes('track')) {
      return {
        content: "Your wellness journey is unique and beautiful! Here's how I can help you track your growth:\n\n🌱 **Seeds Progress**: You're building your pollinator tier through platform engagement\n📈 **Session History**: Track your practitioner sessions and insights\n💎 **Wisdom Collection**: Save valuable content from the Garden\n🎯 **Goal Setting**: Define and work toward your wellness objectives\n\nRemember, healing isn't linear - every step forward, no matter how small, is meaningful progress. What aspect of your journey would you like to explore?",
        type: 'guidance'
      };
    }

    // Getting started help
    if (lowerMessage.includes('start') || lowerMessage.includes('begin') || lowerMessage.includes('new')) {
      return {
        content: "Welcome to FloreSer! I'm so glad you're here. Let's start your wellness journey:\n\n✨ **Take our survey**: Help us understand your needs\n🔍 **Explore archetypes**: Discover which resonates with you\n👥 **Visit The Hive**: See our facilitator community\n🌱 **Check the Garden**: Browse wisdom and resources\n📅 **Book a session**: When you're ready to connect\n\nEverything here is designed around nature's wisdom to help you find authentic, meaningful support. What feels like the right first step for you?",
        type: 'guidance'
      };
    }

    // Default response with helpful suggestions
    return {
      content: "I'm here to help guide your wellness journey! I can assist with finding practitioners, understanding our archetype system, exploring the Community Garden, or answering any questions about FloreSer.\n\nWhat would be most helpful for you right now?",
      type: 'text'
    };
  };

  const generateDynamicSuggestions = (lastUserMessage: string) => {
    const lowerMessage = lastUserMessage.toLowerCase();
    let newSuggestions: Suggestion[] = [];

    if (lowerMessage.includes('archetype')) {
      newSuggestions = [
        {
          id: 'arch1',
          text: "Take archetype quiz",
          icon: <Zap className="w-4 h-4" />,
          action: () => handleSuggestionClick("Can you help me discover my archetype?")
        },
        {
          id: 'arch2',
          text: "See Bee practitioners",
          icon: <Heart className="w-4 h-4" />,
          action: () => window.open('/practitioners?archetype=bee', '_blank')
        }
      ];
    } else if (lowerMessage.includes('practitioner')) {
      newSuggestions = [
        {
          id: 'prac1',
          text: "Browse all practitioners",
          icon: <Navigation className="w-4 h-4" />,
          action: () => window.open('/practitioners', '_blank')
        },
        {
          id: 'prac2',
          text: "Visit The Hive",
          icon: <Star className="w-4 h-4" />,
          action: () => window.open('/hive', '_blank')
        }
      ];
    } else if (lowerMessage.includes('garden')) {
      newSuggestions = [
        {
          id: 'gard1',
          text: "Explore Community Garden",
          icon: <Leaf className="w-4 h-4" />,
          action: () => window.open('/garden', '_blank')
        },
        {
          id: 'gard2',
          text: "Learn about Seeds",
          icon: <Sparkles className="w-4 h-4" />,
          action: () => handleSuggestionClick("How does the Seeds currency system work?")
        }
      ];
    }

    // Always include a "Something else" option
    newSuggestions.push({
      id: 'other',
      text: "Ask something else",
      icon: <MessageCircle className="w-4 h-4" />,
      action: () => setSuggestions([])
    });

    setSuggestions(newSuggestions);
  };

  const formatMessage = (content: string) => {
    // Basic markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br />');
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="rounded-full text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all px-6 py-4"
          onClick={() => setIsOpen(true)}
          style={{
            backgroundImage: `url(${papercut.textures.paperSage})`,
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat',
          }}
        >
          <Bot className="w-5 h-5 mr-2" />
          <span className="font-medium">Chat with mAIa</span>
          <Sparkles className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-96 shadow-2xl border-forest/20 transition-all duration-300 ${
        isMinimized ? 'h-16' : 'h-[500px]'
      }`}>
        <CardHeader className="flex flex-row items-center justify-between p-4 bg-gradient-to-r from-forest to-green-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Bot className="w-6 h-6" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <CardTitle className="text-lg">mAIa</CardTitle>
              <p className="text-xs text-white/80">Your AI Guardian</p>
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
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-forest text-white'
                        : message.type === 'archetype_insight'
                        ? 'bg-gradient-to-r from-gold/10 to-forest/10 border border-gold/20'
                        : message.type === 'guidance'
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-gray-100'
                    }`}
                  >
                    {message.sender === 'maia' && (
                      <div className="flex items-center space-x-2 mb-2">
                        <Bot className="w-4 h-4 text-forest" />
                        <span className="text-xs font-medium text-forest">mAIa</span>
                        {message.type === 'archetype_insight' && (
                          <Badge className="text-xs bg-gold/20 text-gold">
                            <Star className="w-3 h-3 mr-1" />
                            Archetype Wisdom
                          </Badge>
                        )}
                        {message.type === 'guidance' && (
                          <Badge className="text-xs bg-green-100 text-green-700">
                            <Lightbulb className="w-3 h-3 mr-1" />
                            Guidance
                          </Badge>
                        )}
                      </div>
                    )}
                    <div
                      className="text-sm"
                      dangerouslySetInnerHTML={{
                        __html: formatMessage(message.content)
                      }}
                    />
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4 text-forest" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-forest/60 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-forest/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-forest/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="px-4 py-2">
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion) => (
                    <Button
                      key={suggestion.id}
                      variant="outline"
                      size="sm"
                      onClick={suggestion.action}
                      className="text-xs h-8 border-forest/20 hover:bg-forest/5"
                    >
                      {suggestion.icon}
                      <span className="ml-1">{suggestion.text}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask mAIa anything..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 border-forest/20 focus:border-forest"
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-forest text-white hover:bg-forest/90"
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

// AI Guardian context and provider for global state
export function AIGuardianProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <AIGuardian />
    </>
  );
}