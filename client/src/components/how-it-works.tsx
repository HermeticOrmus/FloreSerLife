export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Discover Your Match",
      description: "Browse practitioners by archetype, specialization, or location. Use our smart filters to find someone who aligns with your healing needs and preferences."
    },
    {
      number: 2,
      title: "Book Your Session",
      description: "Schedule your appointment with real-time calendar availability. Choose between in-person or virtual sessions that fit your schedule and comfort level."
    },
    {
      number: 3,
      title: "Begin Your Journey",
      description: "Attend your session and start your healing journey. Track your progress and book follow-up sessions as needed through your personal dashboard."
    }
  ];

  return (
    <section className="py-20 bg-cream/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-forest mb-4">
            How FloreSer Works
          </h2>
          <p className="text-lg text-forest/70 max-w-2xl mx-auto">
            Your journey to wellness is just three steps away. Our platform makes it easy to find, connect, and heal with the right practitioner.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="bg-gold/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-gold">{step.number}</span>
              </div>
              <h3 className="font-heading text-xl font-semibold text-forest mb-4">
                {step.title}
              </h3>
              <p className="text-forest/70 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
