export default function StatsSection() {
  const stats = [
    { value: "150+", label: "Verified Practitioners", description: "Rigorous background checks" },
    { value: "89%", label: "Satisfaction Rate", description: "Based on completed sessions" },
    { value: "2.4k+", label: "Successful Matches", description: "Life-changing connections" },
    { value: "4", label: "Archetype Categories", description: "Science-backed matching" }
  ];

  return (
    <section className="py-20 bg-forest text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-4">
            Proven Results Through Nature-Inspired Matching
          </h2>
          <p className="text-white/80 text-lg max-w-3xl mx-auto">
            Traditional therapy matching has a 40% satisfaction rate. Our pollinator archetype
            system achieves 89% satisfaction by connecting you with practitioners who truly
            understand your unique healing journey.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-2">
              <div className="text-4xl font-bold text-gold mb-2">{stat.value}</div>
              <div className="text-white font-medium">{stat.label}</div>
              <div className="text-white/60 text-sm">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
