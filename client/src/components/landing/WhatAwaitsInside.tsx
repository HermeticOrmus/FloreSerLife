import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Flower2, Sprout, TreeDeciduous } from "lucide-react";

export default function WhatAwaitsInside() {
  const sections = [
    {
      icon: Flower2,
      title: "The Hive",
      description:
        "A curated directory of guides, mentors, and visionaries across body, soul, and creative expression.",
    },
    {
      icon: Sprout,
      title: "My Garden",
      description:
        "Your personal sanctuary where sessions, reflections, and growth are lovingly tended.",
    },
    {
      icon: TreeDeciduous,
      title: "The Community Garden",
      description:
        "Seasonal rituals, shared insights, and global gatherings for collective flourishing.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-sage/5 to-cream/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl lg:text-5xl font-bold text-forest mb-6">
            What Awaits Inside
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-white rounded-card shadow-card border-sage/20 hover:shadow-card-hover transition-all h-full">
                  <CardContent className="p-8 text-center">
                    <div className="bg-gold/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Icon className="w-8 h-8 text-gold" />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-forest mb-4">
                      {section.title}
                    </h3>
                    <p className="text-forest/70 leading-relaxed italic">
                      {section.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
