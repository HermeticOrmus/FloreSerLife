export default function StatsSection() {
  const values = [
    {
      icon: "🐝",
      title: "Foundation & Growth",
      description: "Perfect starting point for new facilitators. Safe spaces for learning and community support.",
      level: "All Experience Levels Welcome"
    },
    {
      icon: "🦜",
      title: "Precision & Insight",
      description: "Swift, focused guidance for spiritual and emotional clarity.",
      level: "Experienced Practitioners"
    },
    {
      icon: "🦋",
      title: "Transformation & Growth",
      description: "Gentle support through life's most profound changes.",
      level: "Experienced Practitioners"
    },
    {
      icon: "🪲",
      title: "Integration & Depth",
      description: "Deep, methodical work for lasting healing and wholeness.",
      level: "Experienced Practitioners"
    }
  ];

  return (
    <section className="py-20 bg-forest text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-4">
            Four Paths to Wellness
          </h2>
          <p className="text-white/80 text-lg max-w-3xl mx-auto mb-6">
            Whether you're seeking healing support or ready to begin facilitating,
            our pollinator archetypes offer different approaches to wellness. The Bee
            archetype welcomes all experience levels, while others are designed for experienced practitioners.
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-gold/20 text-gold rounded-full text-sm font-medium">
            <span className="mr-2">🌱</span>
            New facilitators: Start with the Bee community
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8 text-center">
          {values.map((value, index) => (
            <div key={index} className={`space-y-4 p-6 rounded-lg border ${
              index === 0
                ? 'bg-gold/10 border-gold/30'
                : 'bg-white/5 border-white/20'
            }`}>
              <div className="text-5xl mb-4">{value.icon}</div>
              <div className="text-white font-medium text-lg">{value.title}</div>
              <div className="text-white/70 text-sm leading-relaxed mb-3">{value.description}</div>
              <div className={`text-xs px-3 py-1 rounded-full ${
                index === 0
                  ? 'bg-gold/20 text-gold'
                  : 'bg-white/10 text-white/60'
              }`}>
                {value.level}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
