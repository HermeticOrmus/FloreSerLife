import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-cream to-light-green/30">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        {/* Exclusive Alpha CTA */}
        <div className="bg-white/50 rounded-2xl p-8 mb-8 border border-gold/20 shadow-lg">
          <div className="inline-flex items-center px-4 py-2 bg-gold text-white rounded-full text-sm font-medium mb-4">
            <span className="mr-2">✨</span>
            Exclusive Alpha Access
          </div>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-forest mb-6">
            Your Vision Will Shape FloreSer's Future
          </h2>
          <p className="text-lg text-forest/70 mb-8 max-w-2xl mx-auto">
            This is more than early access - you're helping us build something innovative. 
            Your feedback today becomes the foundation of tomorrow's wellness connections.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button 
              size="lg"
              className="bg-gold text-white px-8 py-4 rounded-full font-medium hover:bg-gold/90 shadow-lg"
              onClick={() => window.location.href = '/survey'}
              data-testid="button-join-alpha-program"
            >
              Join the Alpha Program
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-2 border-forest text-forest px-8 py-4 rounded-full font-medium hover:bg-forest hover:text-white"
              onClick={() => window.location.href = '/survey'}
              data-testid="button-share-vision"
            >
              Share Your Vision
            </Button>
          </div>
          
          {/* Alpha Value Statement */}
          <div className="bg-sage/10 rounded-lg p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gold/20 rounded-full p-2 mr-3">
                <span className="text-gold font-bold text-lg">🌱</span>
              </div>
              <h3 className="font-heading text-lg font-semibold text-forest">
                Growing Together
              </h3>
            </div>
            <p className="text-forest/70 text-sm leading-relaxed">
              Like nature's pollinators, you're essential to our ecosystem. Every insight you share 
              helps us create deeper, more meaningful connections in the wellness community.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
