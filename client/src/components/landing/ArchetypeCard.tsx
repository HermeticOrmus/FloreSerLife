import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

export interface ArchetypeCardProps {
  archetype: "bee" | "hummingbird" | "butterfly" | "beetle";
  badge: string;
  name: string;
  latinName: string;
  description: string;
  link: string;
  delay?: number;
}

export default function ArchetypeCard({
  archetype,
  badge,
  name,
  latinName,
  description,
  link,
}: ArchetypeCardProps) {
  const [, setLocation] = useLocation();

  const handleExplore = () => {
    setLocation(`/practitioners?archetype=${archetype}`);
  };

  return (
    <div className="bg-white border border-forest/8 origami-paper origami-corner origami-fold-shadow rounded-lg h-full">
      <div className="p-8">
        {/* Badge at top */}
        <Badge className="bg-forest/5 text-forest/50 hover:bg-forest/10 mb-4 text-sm font-medium border border-forest/10">
          {badge}
        </Badge>

        {/* Archetype Name with Latin */}
        <h3 className="text-card-heading font-heading text-forest mb-3">
          The {name}{" "}
          <span className="text-forest/60 italic text-body-sm">
            ({latinName})
          </span>
        </h3>

        {/* Poetic Description */}
        <p className="text-body-sm text-forest/60 leading-relaxed mb-6">
          {description}
        </p>

        {/* Explore Link */}
        <button
          onClick={handleExplore}
          className="inline-flex items-center text-forest/70 hover:text-forest font-medium text-sm transition-colors"
        >
          {link}
          <ArrowRight className="ml-1 h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
