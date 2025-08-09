export default function StatsSection() {
  const stats = [
    { value: "2,500+", label: "Verified Practitioners" },
    { value: "15,000+", label: "Healing Sessions" },
    { value: "4.9", label: "Average Rating" },
    { value: "98%", label: "Client Satisfaction" }
  ];

  return (
    <section className="py-20 bg-forest text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-white/80 text-lg">
            Join our growing community of healing and transformation
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
