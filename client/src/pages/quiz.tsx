import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { ArchetypeIcons } from "@/components/icons/archetype-icons";
import { archetypeDefinitions } from "@shared/schema";

// Quiz questions that map to archetype traits
const quizQuestions = [
  {
    id: 1,
    question: "When facing a challenge, what approach feels most natural to you?",
    options: [
      { text: "Build a solid foundation and work step by step", archetype: "bee" },
      { text: "Trust my intuition and act quickly", archetype: "hummingbird" },
      { text: "See it as an opportunity for transformation", archetype: "butterfly" },
      { text: "Dig deep to understand the root cause", archetype: "beetle" },
    ],
  },
  {
    id: 2,
    question: "In a group setting, you typically:",
    options: [
      { text: "Create a welcoming space for everyone", archetype: "bee" },
      { text: "Sense the energy and respond to what's needed", archetype: "hummingbird" },
      { text: "Inspire others to embrace change", archetype: "butterfly" },
      { text: "Hold space for deeper conversations", archetype: "beetle" },
    ],
  },
  {
    id: 3,
    question: "What type of healing work resonates most with you?",
    options: [
      { text: "Building community and practical wellness habits", archetype: "bee" },
      { text: "Energy work and intuitive healing", archetype: "hummingbird" },
      { text: "Life transitions and creative expression", archetype: "butterfly" },
      { text: "Shadow work and ancestral healing", archetype: "beetle" },
    ],
  },
  {
    id: 4,
    question: "When supporting someone, you're drawn to:",
    options: [
      { text: "Helping them develop sustainable practices", archetype: "bee" },
      { text: "Providing quick insights and clarity", archetype: "hummingbird" },
      { text: "Guiding them through transformation", archetype: "butterfly" },
      { text: "Exploring their deeper patterns and history", archetype: "beetle" },
    ],
  },
  {
    id: 5,
    question: "Your ideal pace of work is:",
    options: [
      { text: "Steady and consistent, building over time", archetype: "bee" },
      { text: "Quick bursts of focused, intense work", archetype: "hummingbird" },
      { text: "Flowing with natural cycles of change", archetype: "butterfly" },
      { text: "Deep, thorough, taking time for integration", archetype: "beetle" },
    ],
  },
  {
    id: 6,
    question: "What draws you to wellness work?",
    options: [
      { text: "Creating safe spaces and supporting growth", archetype: "bee" },
      { text: "Following my intuition to help others", archetype: "hummingbird" },
      { text: "Witnessing beautiful transformations", archetype: "butterfly" },
      { text: "Understanding and healing deep wounds", archetype: "beetle" },
    ],
  },
];

type ArchetypeKey = "bee" | "hummingbird" | "butterfly" | "beetle";

export default function Quiz() {
  const [, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<ArchetypeKey, number>>({
    bee: 0,
    hummingbird: 0,
    butterfly: 0,
    beetle: 0,
  });
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<ArchetypeKey | null>(null);

  useEffect(() => {
    document.title = "Archetype Quiz - FloreSer";
  }, []);

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
  };

  const handleNext = () => {
    if (selectedOption === null) return;

    const selectedArchetype = quizQuestions[currentQuestion].options[selectedOption].archetype as ArchetypeKey;

    setScores((prev) => ({
      ...prev,
      [selectedArchetype]: prev[selectedArchetype] + 1,
    }));

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      // Calculate result
      const finalScores = {
        ...scores,
        [selectedArchetype]: scores[selectedArchetype] + 1,
      };

      const resultArchetype = (Object.entries(finalScores) as [ArchetypeKey, number][])
        .sort((a, b) => b[1] - a[1])[0][0];

      setResult(resultArchetype);
      setShowResult(true);

      // Store result in localStorage for practitioners page
      localStorage.setItem("floerser_archetype_result", resultArchetype);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setSelectedOption(null);
    }
  };

  const handleViewPractitioners = () => {
    if (result) {
      setLocation(`/practitioners?archetype=${result}`);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestion(0);
    setScores({ bee: 0, hummingbird: 0, butterfly: 0, beetle: 0 });
    setSelectedOption(null);
    setShowResult(false);
    setResult(null);
    localStorage.removeItem("floerser_archetype_result");
  };

  const getArchetypeIcon = (archetype: ArchetypeKey) => {
    switch (archetype) {
      case "bee":
        return <ArchetypeIcons.Bee className="w-16 h-16" />;
      case "hummingbird":
        return <ArchetypeIcons.Hummingbird className="w-16 h-16" />;
      case "butterfly":
        return <ArchetypeIcons.Butterfly className="w-16 h-16" />;
      case "beetle":
        return <ArchetypeIcons.Beetle className="w-16 h-16" />;
    }
  };

  if (showResult && result) {
    const archetypeInfo = archetypeDefinitions[result];

    return (
      <div className="min-h-screen bg-cream flex flex-col">
        <Header />

        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-2xl w-full">
            <Card className="border-sage/20 overflow-hidden">
              <div
                className="p-8 text-center"
                style={{ backgroundColor: `${archetypeInfo.color}15` }}
              >
                <div className="mb-4 flex justify-center">
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${archetypeInfo.color}25` }}
                  >
                    {getArchetypeIcon(result)}
                  </div>
                </div>

                <div className="inline-flex items-center px-4 py-2 bg-white/50 rounded-full text-sm font-medium mb-4">
                  <Sparkles className="w-4 h-4 mr-2 text-gold" />
                  Your Archetype Result
                </div>

                <h1 className="font-heading text-4xl font-bold text-forest mb-2">
                  {archetypeInfo.name}
                </h1>
                <p className="text-sm text-forest/60 italic mb-4">
                  {archetypeInfo.scientificName}
                </p>
              </div>

              <CardContent className="p-8">
                <p className="text-lg text-forest/80 mb-6 text-center">
                  {archetypeInfo.description}
                </p>

                <div className="mb-6">
                  <h3 className="font-semibold text-forest mb-3">Your Key Traits:</h3>
                  <div className="flex flex-wrap gap-2">
                    {archetypeInfo.traits.map((trait: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-sm"
                        style={{
                          backgroundColor: `${archetypeInfo.color}20`,
                          color: archetypeInfo.color
                        }}
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="font-semibold text-forest mb-3">What This Means For You:</h3>
                  <ul className="space-y-2">
                    {archetypeInfo.clientBenefits.map((benefit: string, index: number) => (
                      <li key={index} className="flex items-start text-forest/70">
                        <span className="mr-2 text-gold">-</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleViewPractitioners}
                    className="flex-1 bg-gold text-white hover:bg-gold/90"
                  >
                    Find {archetypeInfo.name} Practitioners
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleRetakeQuiz}
                    className="flex-1 border-forest text-forest hover:bg-forest hover:text-white"
                  >
                    Retake Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const currentQ = quizQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-forest/60">
                Question {currentQuestion + 1} of {quizQuestions.length}
              </span>
              <span className="text-sm font-medium text-forest">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="border-sage/20">
            <CardContent className="p-8">
              <h2 className="font-heading text-2xl font-semibold text-forest mb-6 text-center">
                {currentQ.question}
              </h2>

              <div className="space-y-3 mb-8">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(index)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      selectedOption === index
                        ? "border-gold bg-gold/10 text-forest"
                        : "border-sage/20 hover:border-sage/40 text-forest/80"
                    }`}
                  >
                    {option.text}
                  </button>
                ))}
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentQuestion === 0}
                  className="border-forest text-forest hover:bg-forest hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={selectedOption === null}
                  className="bg-gold text-white hover:bg-gold/90"
                >
                  {currentQuestion === quizQuestions.length - 1 ? "See Result" : "Next"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-forest/50 mt-6">
            Discover which pollinator archetype best matches your wellness journey
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
