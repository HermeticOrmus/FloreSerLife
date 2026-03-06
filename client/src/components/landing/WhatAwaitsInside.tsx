import { Flower2, Sprout } from "lucide-react";
import { Link } from "wouter";
import { papercut } from "@/assets";

const sections = [
  {
    icon: Flower2,
    title: "The Hive",
    description:
      "A curated directory of guides, mentors, and visionaries across body, soul, and creative expression.",
    href: "/hive",
    texture: papercut.textures.flatGold,
    borderClass: "border-hive-accent/30 hover:border-hive-accent/60",
    iconColor: "text-white",
    iconBg: "bg-hive-accent/40",
  },
  {
    icon: Sprout,
    title: "My Garden",
    description:
      "Your personal sanctuary where sessions, reflections, and growth are lovingly tended.",
    href: "/garden",
    texture: papercut.textures.flatSage,
    borderClass: "border-sage/40 hover:border-sage/70",
    iconColor: "text-white",
    iconBg: "bg-garden-accent/40",
  },
];

export default function WhatAwaitsInside() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-2xl md:text-3xl text-forest mb-6">
            What Awaits Inside
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Link key={section.title} href={section.href}>
                <div
                  className={`border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg overflow-hidden ${section.borderClass} h-full`}
                  style={{
                    backgroundImage: `url(${section.texture})`,
                    backgroundSize: "512px 512px",
                    backgroundRepeat: "repeat",
                  }}
                >
                  <div className="p-8 text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${section.iconBg}`}>
                      <Icon className={`w-8 h-8 ${section.iconColor}`} strokeWidth={1.5} />
                    </div>
                    <h3 className="font-heading text-xl mb-4 text-forest">
                      {section.title}
                    </h3>
                    <p className="leading-relaxed italic text-forest/60">
                      {section.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
