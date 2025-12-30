import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Sparkles } from "lucide-react";
import { characters } from "@/assets";

export default function MaiaSection() {
  const [, setLocation] = useLocation();

  return (
    <section className="py-20 bg-gradient-to-br from-gold/5 to-sage/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={characters.maia}
              alt="mAIa - Your wellness guide"
              className="w-full h-auto max-w-md mx-auto object-contain"
            />
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-gold/20 text-gold rounded-full text-sm font-medium mb-6">
              <Sparkles className="mr-2 h-4 w-4" />
              AI-Guided Matching
            </div>

            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-forest mb-6">
              Not Sure Where to Begin?
            </h2>

            <p className="text-lg text-forest/80 leading-relaxed mb-8">
              That's perfectly fine. Every soul blooms in its own rhythm.{" "}
              <strong>mAIa</strong> gently helps you find your start. She listens
              to your rhythm, needs, and intentions, then connects you with
              Pollinators most aligned with your growth.
            </p>

            <Button
              size="lg"
              className="bg-gold text-white hover:bg-gold/90 rounded-full px-8"
              onClick={() => setLocation("/garden")}
            >
              Let mAIa Guide You
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
