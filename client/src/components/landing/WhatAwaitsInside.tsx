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
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-2xl md:text-3xl text-forest mb-6">
            What Awaits Inside
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.title}
                className="border border-forest/8 rounded-lg origami-paper origami-overlay-graphite origami-corner origami-fold-shadow h-full"
              >
                <div className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-forest/30" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-xl text-forest mb-4">
                    {section.title}
                  </h3>
                  <p className="text-forest/60 leading-relaxed italic">
                    {section.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
