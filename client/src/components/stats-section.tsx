export default function StatsSection() {
  const stats = [
    { value: "100", label: "Alpha Members" },
    { value: "Valued", label: "Your Contribution" },
    { value: "Innovative", label: "Archetype System" },
    { value: "Alpha", label: "Testing Phase" }
  ];

  return (
    <section className="py-20 bg-forest text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-4">
            Why Alpha Participation Matters
          </h2>
          <p className="text-white/80 text-lg max-w-3xl mx-auto">
            You're not just using our platform - you're creating it. Every insight you share 
            helps us build something truly innovative for the wellness community.
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-4xl font-bold text-gold mb-2">{stat.value}</div>
              <div className="text-white/80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
