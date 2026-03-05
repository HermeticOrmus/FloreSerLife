import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, ArrowRight, Check } from "lucide-react";
import { MaiaSprite } from "@/components/maia-sprite";
import { archetypeDefinitions } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { papercut } from "@/assets";

// ============================================
// TYPES
// ============================================

type ArchetypeKey = "bee" | "butterfly" | "hummingbird" | "beetle";

interface Scores {
  bee: number;
  butterfly: number;
  hummingbird: number;
  beetle: number;
}

type QuestionType = "select" | "multi" | "open";

interface QuizOption {
  text: string;
  weights: Partial<Scores>;
  layer2Trigger?: boolean; // marks options that trigger Layer 2
}

interface QuizStep {
  id: string;
  label: string;
  prompt: string;
  type: QuestionType;
  maxSelect?: number;
  options?: QuizOption[];
  reflection: string;
}

interface ChatMessage {
  id: string;
  sender: "maia" | "user";
  content: string;
}

// ============================================
// QUESTION DATA — LAYER 1
// ============================================

const layer1Steps: QuizStep[] = [
  {
    id: "petal1",
    label: "Petal 1",
    prompt: "When you pause and feel inside, what's most present these days?",
    type: "multi",
    maxSelect: 2,
    options: [
      { text: "I feel a little lost or disconnected", weights: { bee: 2 } },
      { text: "I want to find my center again", weights: {} },
      { text: "I'm curious — something inside me wants to explore or awaken", weights: {} },
      { text: "I'm integrating something big — change, ceremony, ending, or new beginning", weights: { beetle: 2 }, layer2Trigger: true },
      { text: "I've been doing inner work and want to refine or deepen it", weights: { hummingbird: 1, beetle: 1 }, layer2Trigger: true },
      { text: "I feel emotionally full — I need grounding and balance", weights: { bee: 1, beetle: 1 } },
      { text: "I'm ready to express, create, or share my gifts more fully", weights: { butterfly: 1, hummingbird: 1 }, layer2Trigger: true },
      { text: "I don't know what I need — I just want something that feels gentle and real", weights: {} },
    ],
    reflection: "Beautiful. Every state is part of the cycle. Even uncertainty is fertile soil — it means something new is preparing to grow.",
  },
  {
    id: "petal2",
    label: "Petal 2",
    prompt: "How would you love someone to support you right now?",
    type: "multi",
    options: [
      { text: "Through the body — movement, touch, or breath", weights: { bee: 2 } },
      { text: "Through words — listening, reflection, and conversation", weights: { bee: 1, hummingbird: 1 } },
      { text: "Through creativity — art, music, writing, or ritual", weights: { butterfly: 2 } },
      { text: "Through silence — meditation, energy work, or subtle presence", weights: { hummingbird: 2 } },
      { text: "Through community — circles, sharing, and belonging", weights: { bee: 1, butterfly: 1 } },
      { text: "Through nature — grounding, elements, connection to Earth", weights: { bee: 2 } },
      { text: "I'm not sure yet — I'd like mAIa to suggest what fits", weights: {} },
    ],
    reflection: "Every way of tending is sacred. The right form often feels like exhale — no striving, just recognition.",
  },
  {
    id: "petal3",
    label: "Petal 3",
    prompt: "What kind of setting helps you open most easily?",
    type: "multi",
    options: [
      { text: "One-on-one guidance where I feel safe and seen", weights: { bee: 2 } },
      { text: "Small group circles where I can share or simply listen", weights: { bee: 1, butterfly: 1 } },
      { text: "Ongoing mentorship or a series of sessions", weights: { hummingbird: 2, beetle: 1 } },
      { text: "Self-paced or recorded tools I can explore privately", weights: { butterfly: 1, hummingbird: 1 } },
      { text: "Ceremonial or ritual-based experiences", weights: { butterfly: 1, hummingbird: 1, beetle: 1 } },
      { text: "I prefer to start by exploring before committing", weights: {} },
      { text: "I'm open to whatever feels aligned — I trust the process", weights: {} },
    ],
    reflection: "There's no single way to bloom. Each season calls for a different rhythm — what matters is that it feels true to you.",
  },
  {
    id: "petal4",
    label: "Petal 4",
    prompt: "What feels ready to be tended or explored?",
    type: "multi",
    maxSelect: 3,
    options: [
      { text: "Grounding, safety, belonging", weights: { bee: 2 } },
      { text: "Emotional release or nervous system repair", weights: { bee: 1, beetle: 1 } },
      { text: "Self-expression, creativity, or voice", weights: { butterfly: 2 } },
      { text: "Intuition or connection to the unseen", weights: { hummingbird: 2 }, layer2Trigger: true },
      { text: "Relationships, boundaries, or intimacy", weights: { bee: 1 } },
      { text: "Purpose, meaning, direction", weights: { hummingbird: 1, beetle: 1 }, layer2Trigger: true },
      { text: "Integration after transformation", weights: { beetle: 2 }, layer2Trigger: true },
      { text: "Shadow work or ancestral threads", weights: { beetle: 3 }, layer2Trigger: true },
      { text: "Joy, play, and lightness", weights: { butterfly: 2 } },
    ],
    reflection: "Every theme is a doorway. Sometimes we walk through one and find the others waiting there too.",
  },
  {
    id: "petal5",
    label: "Petal 5",
    prompt: "If your inner world were a garden, what would it look like right now?",
    type: "select",
    options: [
      { text: "Seed — I'm just beginning, feeling into what's possible", weights: { bee: 1 } },
      { text: "Root — I'm stabilizing, finding rhythm", weights: { bee: 1 } },
      { text: "Stem — I'm gathering energy and courage", weights: { butterfly: 1 } },
      { text: "Leaf — I'm expanding and learning", weights: { butterfly: 1 } },
      { text: "Petal — I'm expressing and creating", weights: { butterfly: 1, hummingbird: 1 } },
      { text: "Fruit — I'm integrating and giving back", weights: { beetle: 1 } },
    ],
    reflection: "Every season has its wisdom. The key is to honor where you are, not rush where you're going.",
  },
  {
    id: "open1",
    label: "The Breath Between Petals",
    prompt: "If you could name one thing your heart is quietly asking for right now, what would it be?",
    type: "open",
    reflection: "Thank you for sharing that. I can feel how alive that wish is — let's hold it as we find the right support for it.",
  },
];

// ============================================
// QUESTION DATA — LAYER 2
// ============================================

const layer2Steps: QuizStep[] = [
  {
    id: "root1",
    label: "Root 1",
    prompt: "If your energy today were an element of nature, which would it be?",
    type: "select",
    options: [
      { text: "Earth — steady, quiet, needing grounding", weights: { bee: 1 } },
      { text: "Water — emotional, flowing, seeking clarity", weights: { beetle: 1 } },
      { text: "Fire — alive, passionate, needing direction", weights: { butterfly: 1 } },
      { text: "Air — light, creative, needing focus", weights: { hummingbird: 1 } },
      { text: "Ether — subtle, expansive, seeking integration", weights: { hummingbird: 1, beetle: 1 } },
    ],
    reflection: "Your element speaks to what the season is asking of you. Let it guide, not confine.",
  },
  {
    id: "root2",
    label: "Root 2",
    prompt: "When something in your life transforms, how do you usually move through it?",
    type: "select",
    options: [
      { text: "I anchor first — I need safety before movement", weights: { bee: 1 } },
      { text: "I act quickly — movement helps me release", weights: { butterfly: 1 } },
      { text: "I observe and reflect before I act", weights: { hummingbird: 1, beetle: 1 } },
      { text: "I surrender — trusting what unfolds", weights: { hummingbird: 1 } },
    ],
    reflection: "How we meet change reveals much about our inner wisdom. Each response carries its own intelligence.",
  },
  {
    id: "root3",
    label: "Root 3",
    prompt: "What guides you when you're uncertain?",
    type: "select",
    options: [
      { text: "Intuition or inner knowing", weights: { hummingbird: 1 } },
      { text: "Logic and analysis", weights: {} },
      { text: "Feedback from others", weights: { bee: 1 } },
      { text: "Signs, synchronicities, or dreams", weights: { hummingbird: 1 } },
      { text: "I don't know — I'm learning to listen", weights: { bee: 1 } },
    ],
    reflection: "The compass you trust is the one your soul has been refining for years. Trust it a little more.",
  },
  {
    id: "root4",
    label: "Root 4",
    prompt: "What truth or challenge are you currently learning to embody?",
    type: "open",
    reflection: "Thank you for naming that. Every truth revealed changes the soil of your becoming.",
  },
  {
    id: "root5",
    label: "Root 5",
    prompt: "After a deep experience or realization, what helps you integrate?",
    type: "multi",
    options: [
      { text: "Silence and solitude", weights: { beetle: 1 } },
      { text: "Movement or nature", weights: { bee: 1 } },
      { text: "Creative expression", weights: { butterfly: 1 } },
      { text: "Conversation or sharing", weights: { bee: 1 } },
      { text: "Ritual or ceremony", weights: { butterfly: 1, hummingbird: 1 } },
      { text: "Teaching or serving others", weights: { hummingbird: 1 } },
    ],
    reflection: "Integration is the quiet art of letting insight settle into the body. You know the rhythm that works.",
  },
  {
    id: "root6",
    label: "Root 6",
    prompt: "If one part of your life could bloom more fully this season, what would it be?",
    type: "select",
    options: [
      { text: "Relationships", weights: { bee: 1 } },
      { text: "Purpose / Vocation", weights: { hummingbird: 1, beetle: 1 } },
      { text: "Health / Vitality", weights: { bee: 1 } },
      { text: "Creativity / Expression", weights: { butterfly: 1 } },
      { text: "Spiritual connection", weights: { hummingbird: 1, beetle: 1 } },
      { text: "Belonging / Community", weights: { bee: 1 } },
    ],
    reflection: "Whatever you chose wants your attention. The act of naming it is the first bloom.",
  },
  {
    id: "open2",
    label: "The Living Thread",
    prompt: "What thread of meaning keeps reappearing in your life — the one that asks to be woven more consciously?",
    type: "open",
    reflection: "Meaning doesn't shout; it repeats itself softly until we listen. That thread may be the pattern your next season wants to take.",
  },
];

// ============================================
// SCORING HELPERS
// ============================================

function addWeights(scores: Scores, weights: Partial<Scores>): Scores {
  return {
    bee: scores.bee + (weights.bee || 0),
    butterfly: scores.butterfly + (weights.butterfly || 0),
    hummingbird: scores.hummingbird + (weights.hummingbird || 0),
    beetle: scores.beetle + (weights.beetle || 0),
  };
}

function computeResult(scores: Scores): { primary: ArchetypeKey; secondary: ArchetypeKey | null; isBlended: boolean; isBalanced: boolean } {
  const sorted = (Object.entries(scores) as [ArchetypeKey, number][]).sort((a, b) => b[1] - a[1]);
  const [first, second] = sorted;

  if (first[1] - sorted[sorted.length - 1][1] <= 1) {
    return { primary: first[0], secondary: second[0], isBlended: false, isBalanced: true };
  }
  if (first[1] - second[1] <= 2) {
    return { primary: first[0], secondary: second[0], isBlended: true, isBalanced: false };
  }
  return { primary: first[0], secondary: null, isBlended: false, isBalanced: false };
}

function shouldTriggerLayer2(answers: Record<string, string[]>): boolean {
  let triggerCount = 0;

  // Count layer2Trigger selections across all layer 1 steps
  for (const step of layer1Steps) {
    if (!step.options) continue;
    const selected = answers[step.id] || [];
    for (const sel of selected) {
      const opt = step.options.find((o) => o.text === sel);
      if (opt?.layer2Trigger) triggerCount++;
    }
  }

  return triggerCount >= 2;
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function Quiz() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();

  // State
  const [phase, setPhase] = useState<"intro" | "layer1" | "layer1-closing" | "layer2-offer" | "layer2-intro" | "layer2" | "layer2-closing" | "results">("intro");
  const [stepIndex, setStepIndex] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [openText, setOpenText] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [scores, setScores] = useState<Scores>({ bee: 0, butterfly: 0, hummingbird: 0, beetle: 0 });
  const [showReflection, setShowReflection] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [quizResponseId, setQuizResponseId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "mAIa — FloreSer";
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showOptions, showReflection, isTyping]);

  // ============================================
  // HELPERS
  // ============================================

  const addMessage = (sender: "maia" | "user", content: string) => {
    setMessages((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, sender, content }]);
  };

  const typeMessage = (content: string, then?: () => void) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMessage("maia", content);
      then?.();
    }, 800 + Math.random() * 600);
  };

  const currentSteps = phase === "layer2" ? layer2Steps : layer1Steps;
  const currentStep = currentSteps[stepIndex];

  // ============================================
  // PHASE TRANSITIONS
  // ============================================

  const startQuiz = () => {
    setPhase("layer1");
    setStepIndex(0);
    const intro = "Welcome, dear one. I'm mAIa — a thread of light and listening within FloreSer. You don't need to know where you're going yet. Let's simply notice what's alive in your garden today, and see what kind of nourishment might help it bloom.";
    addMessage("maia", intro);
    setTimeout(() => {
      typeMessage(layer1Steps[0].prompt, () => setShowOptions(true));
    }, 1200);
  };

  const advanceStep = () => {
    setShowOptions(false);
    setShowReflection(false);
    setSelected([]);
    setOpenText("");

    const nextIndex = stepIndex + 1;

    if (nextIndex < currentSteps.length) {
      setStepIndex(nextIndex);
      const nextStep = currentSteps[nextIndex];
      typeMessage(nextStep.prompt, () => setShowOptions(true));
    } else if (phase === "layer1") {
      // Layer 1 complete — check for Layer 2
      const triggers = shouldTriggerLayer2(answers);
      if (triggers) {
        setPhase("layer2-offer");
        typeMessage("It seems your roots already run deep. Would you like to explore a few deeper reflections together?");
      } else {
        finishLayer1Only();
      }
    } else if (phase === "layer2") {
      finishLayer2();
    }
  };

  const finishLayer1Only = () => {
    setPhase("layer1-closing");
    typeMessage("Thank you for walking this path with me. Your garden is alive — even if you can't see all its blossoms yet.");
    setTimeout(() => {
      typeMessage("I've gathered a few Pollinators and pathways that may feel aligned with your current season.", () => {
        const result = computeResult(scores);
        saveQuizResponse(result, false);
        setPhase("results");
      });
    }, 1500);
  };

  const startLayer2 = () => {
    setPhase("layer2-intro");
    typeMessage("I sense you've already walked a few seasons in your inner garden. Shall we look a little deeper together? These reflections aren't about answers — they're about resonance.");
    setTimeout(() => {
      setPhase("layer2");
      setStepIndex(0);
      typeMessage(layer2Steps[0].prompt, () => setShowOptions(true));
    }, 2000);
  };

  const finishLayer2 = () => {
    setPhase("layer2-closing");
    typeMessage("You carry both depth and clarity. Based on your reflections, I'll suggest Pollinators and paths attuned to your frequency of growth.");
    setTimeout(() => {
      typeMessage("Remember: insight is only the beginning; integration is where the roots drink light.", () => {
        const result = computeResult(scores);
        saveQuizResponse(result, true);
        setPhase("results");
      });
    }, 1500);
  };

  // ============================================
  // ANSWER HANDLING
  // ============================================

  const handleSelect = (optionText: string) => {
    if (!currentStep) return;

    if (currentStep.type === "select") {
      setSelected([optionText]);
    } else {
      // multi-select
      const max = currentStep.maxSelect;
      setSelected((prev) => {
        if (prev.includes(optionText)) {
          return prev.filter((s) => s !== optionText);
        }
        if (max && prev.length >= max) return prev;
        return [...prev, optionText];
      });
    }
  };

  const submitAnswer = () => {
    if (!currentStep) return;

    if (currentStep.type === "open") {
      if (!openText.trim()) return;
      addMessage("user", openText.trim());
      setAnswers((prev) => ({ ...prev, [currentStep.id]: [openText.trim()] }));
      setShowOptions(false);
      // Open text has no weights
      typeMessage(currentStep.reflection, () => {
        setShowReflection(true);
      });
    } else {
      if (selected.length === 0) return;
      addMessage("user", selected.join(" | "));
      setAnswers((prev) => ({ ...prev, [currentStep.id]: selected }));
      setShowOptions(false);

      // Apply weights
      let newScores = { ...scores };
      for (const sel of selected) {
        const opt = currentStep.options?.find((o) => o.text === sel);
        if (opt) {
          newScores = addWeights(newScores, opt.weights);
        }
      }
      setScores(newScores);

      typeMessage(currentStep.reflection, () => {
        setShowReflection(true);
      });
    }
  };

  // ============================================
  // API — SAVE QUIZ
  // ============================================

  const saveQuizResponse = async (result: ReturnType<typeof computeResult>, layer2Done: boolean) => {
    try {
      const body: Record<string, unknown> = {
        whatsAlive: answers.petal1 || [],
        supportType: answers.petal2 || [],
        connectionStyle: answers.petal3 || [],
        themes: answers.petal4 || [],
        growthSeason: answers.petal5?.[0] || null,
        openReflection1: answers.open1?.[0] || null,
        layer2Completed: layer2Done,
        primaryArchetype: result.primary,
        secondaryArchetype: result.secondary,
        archetypeScores: scores,
      };

      if (layer2Done) {
        body.energySignature = answers.root1?.[0] || null;
        body.relationshipToChange = answers.root2?.[0] || null;
        body.innerCompass = answers.root3?.[0] || null;
        body.edgeOfGrowth = answers.root4?.[0] || null;
        body.integrationRhythm = answers.root5 || [];
        body.seedOfVision = answers.root6?.[0] || null;
        body.openReflection2 = answers.open2?.[0] || null;
      }

      const res = await fetch("/api/quiz/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        setQuizResponseId(data.id);
      }
    } catch (e) {
      console.error("Failed to save quiz response:", e);
    }
  };

  const saveReflections = async () => {
    if (!quizResponseId) return;
    try {
      const res = await fetch(`/api/quiz/responses/${quizResponseId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        addMessage("maia", "Your reflections have been saved to your Garden as a private entry.");
      }
    } catch (e) {
      console.error("Failed to save reflections:", e);
    }
  };

  // ============================================
  // RESULT DISPLAY
  // ============================================

  const result = computeResult(scores);
  const primaryInfo = archetypeDefinitions[result.primary];

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-cream flex flex-col origami-paper">
      <Header />

      <main className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 py-8">
        {/* Progress indicator */}
        {(phase === "layer1" || phase === "layer2") && (
          <div className="mb-6 text-center">
            <p className="text-xs tracking-[0.2em] uppercase text-forest/40">
              {phase === "layer1" ? `Opening Petals — ${currentStep?.label || ""}` : `Deep Roots — ${currentStep?.label || ""}`}
            </p>
            <div className="mt-2 h-1 bg-forest/10 rounded-full overflow-hidden max-w-xs mx-auto">
              <div
                className="h-full bg-gold transition-all duration-500 rounded-full"
                style={{ width: `${((stepIndex + 1) / currentSteps.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Chat messages area */}
        <div ref={containerRef} className="flex-1 overflow-y-auto space-y-4 pb-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-5 py-3 ${
                  msg.sender === "user"
                    ? "bg-forest text-white"
                    : "bg-white border border-gold/20 text-forest"
                }`}
              >
                {msg.sender === "maia" && (
                  <div className="flex items-center gap-2 mb-1">
                    <MaiaSprite state="idle" size={18} />
                    <span className="text-xs font-medium text-gold">mAIa</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gold/20 rounded-2xl px-5 py-3">
                <div className="flex items-center gap-2">
                  <MaiaSprite state="thinking" size={24} />
                  <span className="text-xs text-forest/50">mAIa is reflecting...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ============================================ */}
        {/* INTERACTION AREA */}
        {/* ============================================ */}

        {/* Intro screen */}
        {phase === "intro" && (
          <div className="text-center py-16 space-y-8">
            <div className="flex justify-center">
              <img
                src={papercut.pollinatorsTransparent.bee}
                alt="mAIa"
                className="w-32 h-32 object-contain"
              />
            </div>
            <div>
              <h1 className="font-heading text-3xl md:text-4xl text-forest mb-3 tracking-tight">
                A Conversation with mAIa
              </h1>
              <p className="text-base text-forest/60 max-w-md mx-auto leading-relaxed">
                A few soulful questions to help you find the practices, guides, and pathways that can nurture your next unfolding.
              </p>
            </div>
            <Button
              size="lg"
              onClick={startQuiz}
              className="bg-gold text-white hover:bg-gold/90 px-10 py-6 text-base font-medium tracking-wide"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Begin
            </Button>
          </div>
        )}

        {/* Option selection (select / multi) */}
        {showOptions && currentStep && currentStep.type !== "open" && (
          <div className="border-t border-forest/10 pt-4 space-y-3">
            {currentStep.maxSelect && currentStep.type === "multi" && (
              <p className="text-xs text-forest/40 text-center">
                Select up to {currentStep.maxSelect}
              </p>
            )}
            {!currentStep.maxSelect && currentStep.type === "multi" && (
              <p className="text-xs text-forest/40 text-center">
                Select all that resonate
              </p>
            )}
            <div className="space-y-2">
              {currentStep.options?.map((opt) => (
                <button
                  key={opt.text}
                  onClick={() => handleSelect(opt.text)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-all ${
                    selected.includes(opt.text)
                      ? "border-gold bg-gold/10 text-forest"
                      : "border-forest/10 hover:border-forest/25 text-forest/70"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt.text}</span>
                    {selected.includes(opt.text) && (
                      <Check className="w-4 h-4 text-gold flex-shrink-0 ml-2" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-end pt-2">
              <Button
                onClick={submitAnswer}
                disabled={selected.length === 0}
                className="bg-gold text-white hover:bg-gold/90"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Open text input */}
        {showOptions && currentStep && currentStep.type === "open" && (
          <div className="border-t border-forest/10 pt-4 space-y-3">
            <Textarea
              value={openText}
              onChange={(e) => setOpenText(e.target.value)}
              placeholder="Share what comes to heart..."
              className="min-h-[100px] border-forest/15 focus:border-gold resize-none text-sm"
            />
            <div className="flex justify-end">
              <Button
                onClick={submitAnswer}
                disabled={!openText.trim()}
                className="bg-gold text-white hover:bg-gold/90"
              >
                Share
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* After reflection — continue button */}
        {showReflection && !showOptions && phase !== "results" && (
          <div className="border-t border-forest/10 pt-4 flex justify-center">
            <Button
              onClick={advanceStep}
              className="bg-gold text-white hover:bg-gold/90"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Layer 2 offer */}
        {phase === "layer2-offer" && !isTyping && (
          <div className="border-t border-forest/10 pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={startLayer2}
              className="bg-gold text-white hover:bg-gold/90"
            >
              Yes, continue deeper
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              onClick={finishLayer1Only}
              className="border-forest/20 text-forest hover:bg-forest/5"
            >
              Not now, I'm complete for today
            </Button>
          </div>
        )}

        {/* Results screen */}
        {phase === "results" && (
          <div className="border-t border-forest/10 pt-8 space-y-8">
            <div className="text-center space-y-4">
              <div
                className="w-20 h-20 rounded-full mx-auto flex items-center justify-center"
                style={{ backgroundColor: `${primaryInfo.color}25` }}
              >
                <Sparkles className="w-8 h-8" style={{ color: primaryInfo.color }} />
              </div>

              {result.isBalanced ? (
                <>
                  <h2 className="font-heading text-2xl text-forest">A Pollinator in Your Own Way</h2>
                  <p className="text-forest/60 text-sm max-w-md mx-auto leading-relaxed">
                    You seem to move between many energies. Let's begin with what feels most alive today.
                  </p>
                </>
              ) : result.isBlended ? (
                <>
                  <p className="text-xs tracking-[0.2em] uppercase text-forest/40">Your Archetype Blend</p>
                  <h2 className="font-heading text-2xl text-forest">
                    {archetypeDefinitions[result.primary].name}-{archetypeDefinitions[result.secondary!].name}
                  </h2>
                  <p className="text-forest/60 text-sm max-w-md mx-auto leading-relaxed">
                    {primaryInfo.description}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xs tracking-[0.2em] uppercase text-forest/40">Your Primary Archetype</p>
                  <h2 className="font-heading text-2xl text-forest">{primaryInfo.name}</h2>
                  <p className="text-xs text-forest/40 italic">{primaryInfo.scientificName}</p>
                  <p className="text-forest/60 text-sm max-w-md mx-auto leading-relaxed">
                    {primaryInfo.description}
                  </p>
                </>
              )}

              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {primaryInfo.traits.map((trait: string) => (
                  <span
                    key={trait}
                    className="px-3 py-1 rounded-full text-xs"
                    style={{ backgroundColor: `${primaryInfo.color}20`, color: primaryInfo.color }}
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 max-w-sm mx-auto">
              <Button
                onClick={() => setLocation(`/practitioners?archetype=${result.primary}`)}
                className="bg-gold text-white hover:bg-gold/90 py-5"
              >
                View Your Suggested Pollinators
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              {isAuthenticated && quizResponseId && (
                <Button
                  variant="outline"
                  onClick={saveReflections}
                  className="border-gold/30 text-forest hover:bg-gold/5 py-5"
                >
                  Save My Reflections
                </Button>
              )}

              {!isAuthenticated && (
                <Button
                  variant="outline"
                  onClick={() => setLocation("/auth/signup")}
                  className="border-forest/20 text-forest hover:bg-forest/5 py-5"
                >
                  Create Account to Save Results
                </Button>
              )}

              <Button
                variant="ghost"
                onClick={() => {
                  setPhase("intro");
                  setStepIndex(0);
                  setMessages([]);
                  setAnswers({});
                  setScores({ bee: 0, butterfly: 0, hummingbird: 0, beetle: 0 });
                  setSelected([]);
                  setOpenText("");
                  setShowReflection(false);
                  setShowOptions(false);
                  setQuizResponseId(null);
                }}
                className="text-forest/50 hover:text-forest"
              >
                Start Over
              </Button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
