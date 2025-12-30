import { useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Construction, ArrowLeft } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description: string;
}

export default function ComingSoon({ title, description }: ComingSoonProps) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = `${title} - FloreSer`;
  }, [title]);

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center">
              <Construction className="w-12 h-12 text-gold" />
            </div>
          </div>

          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-forest mb-4">
            {title}
          </h1>

          <p className="text-xl text-forest/70 mb-8 max-w-xl mx-auto">
            {description}
          </p>

          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-8 border border-sage/20 mb-8">
            <h2 className="font-heading text-2xl font-semibold text-forest mb-4">
              We're Working on Something Special 🌸
            </h2>
            <p className="text-forest/70 mb-6">
              This feature is currently in development. We're crafting a meaningful experience
              that aligns with FloreSer's vision of connecting wellness seekers with practitioners
              through our nature-inspired archetype system.
            </p>
            <div className="space-y-2 text-sm text-forest/60">
              <p>Want to be notified when this feature launches?</p>
              <p className="font-medium text-gold">Stay tuned to your FloreSer dashboard for updates!</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setLocation('/')}
              className="bg-gold text-white hover:bg-gold/90"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => setLocation('/hive')}
              className="border-forest text-forest hover:bg-forest hover:text-white"
            >
              Explore Practitioners
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
