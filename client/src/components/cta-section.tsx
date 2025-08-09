import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-cream to-light-green/30">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl lg:text-4xl font-bold text-forest mb-6">
          Ready to Begin Your Healing Journey?
        </h2>
        <p className="text-lg text-forest/70 mb-8 max-w-2xl mx-auto">
          Whether you're seeking transformation or ready to share your gifts as a healer, 
          FloreSer is your gateway to meaningful wellness connections.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg"
            className="bg-gold text-white px-8 py-4 rounded-full font-medium hover:bg-gold/90 shadow-lg"
          >
            Find Your Practitioner
          </Button>
          <Button 
            variant="outline"
            size="lg"
            className="border-2 border-forest text-forest px-8 py-4 rounded-full font-medium hover:bg-forest hover:text-white"
            onClick={() => window.location.href = '/api/login'}
          >
            Join as Practitioner
          </Button>
        </div>
      </div>
    </section>
  );
}
