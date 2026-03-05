import { papercut } from "@/assets";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useLocation } from "wouter";

/**
 * Hero section — Origami.
 * Paper texture canvas. The illustration speaks. Clean folds divide.
 */
export function HeroSection() {
  const [, setLocation] = useLocation();

  return (
    <section className="relative w-full origami-paper origami-overlay-graphite">
      <div className="relative z-10 flex flex-col items-center min-h-[75vh] md:min-h-[80vh] px-4 pt-24 md:pt-32 pb-16">
        {/* Central sprout — the only visual */}
        <div className="flex-1 flex items-center justify-center">
          <img
            src={papercut.heroTransparent.sproutLeaves}
            alt="A seed sprouting toward the light"
            className="w-40 h-40 md:w-56 md:h-56 lg:w-72 lg:h-72"
            fetchPriority="high"
          />
        </div>

        {/* Text — minimal, precise */}
        <div className="text-center max-w-xl">
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-forest mb-4 leading-tight tracking-tight">
            Tend Your Inner Garden
          </h1>
          <p className="text-base md:text-lg text-forest/60 mb-10 leading-relaxed">
            A living ecosystem connecting seekers with trusted holistic guides.
          </p>
          <Button
            size="lg"
            onClick={() => setLocation("/quiz")}
            className="text-white bg-forest hover:bg-forest/90 px-10 py-6 text-base font-medium tracking-wide transition-colors"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Begin with mAIa
          </Button>
        </div>
      </div>

      {/* Origami crease — fold between sections */}
      <div className="origami-crease" />
    </section>
  );
}

export default HeroSection;
