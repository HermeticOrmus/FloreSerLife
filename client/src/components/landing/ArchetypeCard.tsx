import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
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
  delay = 0,
}: ArchetypeCardProps) {
  const [, setLocation] = useLocation();

  const handleExplore = () => {
    setLocation(`/practitioners?archetype=${archetype}`);
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <Card className="bg-gradient-to-br from-cream to-white rounded-card shadow-card border-sage/20 hover:shadow-card-hover transition-all duration-300 h-full group">
        <CardContent className="p-8">
          {/* Badge at top */}
          <Badge className="bg-gold/20 text-gold hover:bg-gold/30 mb-4 text-sm font-medium border-0">
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
          <p className="text-body-sm text-forest/70 leading-relaxed mb-6">
            {description}
          </p>

          {/* Explore Link */}
          <button
            onClick={handleExplore}
            className="inline-flex items-center text-gold hover:text-gold/80 font-medium text-sm transition-colors group-hover:translate-x-1 transition-transform duration-200"
          >
            {link}
            <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
