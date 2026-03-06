import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import { papercut } from "@/assets";

const pollinatorIcons = {
  bee: papercut.pollinators.bee,
  hummingbird: papercut.pollinators.hummingbird,
  butterfly: papercut.pollinators.butterfly,
  beetle: papercut.pollinators.beetle,
} as const;

export interface ArchetypeCardProps {
  archetype: "bee" | "hummingbird" | "butterfly" | "beetle";
  badge: string;
  badgeColor: string;
  name: string;
  latinName: string;
  description: string;
  link: string;
  delay?: number;
}

export default function ArchetypeCard({
  archetype,
  badge,
  badgeColor,
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
      <div className="p-8 flex gap-6">
        {/* Papercraft pollinator icon */}
        <div className="flex-shrink-0">
          <img
            src={pollinatorIcons[archetype]}
            alt={`${name} pollinator`}
            className="w-20 h-20 md:w-24 md:h-24 object-contain"
            loading="lazy"
          />
        </div>

        <div className="flex-1">
          {/* Badge at top */}
          <Badge
            className="mb-4 text-sm font-medium border"
            style={{ color: badgeColor, borderColor: `${badgeColor}30`, backgroundColor: `${badgeColor}10` }}
          >
            {badge}
          </Badge>

          {/* Archetype Name with Latin */}
          <h3 className="text-card-heading font-heading mb-3" style={{ color: badgeColor }}>
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
            className="inline-flex items-center font-medium text-sm transition-colors"
            style={{ color: badgeColor }}
          >
            {link}
            <ChevronRight className="ml-1 h-5 w-5" style={{ color: `${badgeColor}70` }} />
          </button>
        </div>
      </div>
    </div>
  );
}
