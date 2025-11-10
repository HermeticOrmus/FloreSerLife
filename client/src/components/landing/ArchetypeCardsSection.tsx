import ArchetypeCard from "./ArchetypeCard";

export default function ArchetypeCardsSection() {
  const archetypes = [
    {
      archetype: "bee" as const,
      badge: "You look to feel safe and supported",
      name: "Bee",
      latinName: "Apis mellifera",
      description:
        "For when you crave steadiness, warmth, and gentle care. The Bee guides you back to your body, your rhythm, and belonging — gentle, grounding, restorative.",
      link: "Explore the Bees →",
    },
    {
      archetype: "hummingbird" as const,
      badge: "You look for clarity and insight",
      name: "Hummingbird",
      latinName: "Colibri coruscans",
      description:
        "When you're seeking clarity, alignment, and truth. The Hummingbird helps you listen deeply to what's whispering within — light, precise, luminous.",
      link: "Explore the Hummingbirds →",
    },
    {
      archetype: "butterfly" as const,
      badge: "You are in the middle of change",
      name: "Butterfly",
      latinName: "Papilio machaon",
      description:
        "When life is transforming. The Butterfly reminds you that endings are gateways to new life — graceful, tender, liberating.",
      link: "Explore the Butterflies →",
    },
    {
      archetype: "beetle" as const,
      badge: "You want to go deeper",
      name: "Beetle",
      latinName: "Scarabaeus sacer",
      description:
        "For moments that call for depth and introspection. The Beetle walks with you through the dark, turning old stories into fertile soil — steady, alchemical, profound.",
      link: "Explore the Beetles →",
    },
  ];

  return (
    <section id="find" aria-labelledby="match-title" className="py-16 bg-sage/5">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-8">
          <p className="text-gold text-sm font-medium tracking-wide uppercase mb-4">
            Nature-Inspired Pollinator Matching
          </p>
          <h2 id="match-title" className="text-section-heading font-heading text-forest mb-6">
            Discover Your Perfect Pollinator Match
          </h2>
          <p className="text-body text-forest/70 max-w-3xl mx-auto leading-relaxed mb-6">
            Every journey is unique—shaped by your season, your rhythm, your becoming. Our <strong>Pollinator Archetype System</strong> connects you with facilitators whose natural style aligns with your current phase of life. Experience meaningful, trustworthy connections that foster genuine transformation.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-forest/70">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gold rounded-full"></div>
              <span>Personalized Matching</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gold rounded-full"></div>
              <span>Verified Expertise</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gold rounded-full"></div>
              <span>Meaningful, Heart-Led Connections</span>
            </div>
          </div>
        </div>

        {/* Meet the Pollinators intro */}
        <div className="text-center mb-12 mt-16">
          <h3 className="text-card-heading font-heading text-forest mb-4">
            Meet the Pollinators
          </h3>
          <p className="text-body-sm text-forest/70 max-w-2xl mx-auto italic">
            You don't need to know which modality you're seeking—only where you are now. Each archetype embodies a way of guiding from nature's wisdom. Find the archetype that mirrors your moment.
          </p>
        </div>

        {/* Archetype Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {archetypes.map((archetype, index) => (
            <ArchetypeCard
              key={archetype.archetype}
              {...archetype}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
