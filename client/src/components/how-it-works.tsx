import { Badge } from "@/components/ui/badge";
import { FlaskConical, Brain, Zap, Users, Target, TrendingUp } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Contribute to Research",
      subtitle: "Shape Innovative Matching Science",
      description: "Complete our comprehensive alpha survey to help shape our innovative pollinator-inspired practitioner matching approach. Your insights directly contribute to the development of this new wellness connection system.",
      icon: FlaskConical,
      details: "Multi-dimensional wellness preference mapping • Healing pattern exploration • User experience optimization"
    },
    {
      number: 2,
      title: "Experience Innovative Technology",
      subtitle: "Test the Future of Wellness Matching",
      description: "Get exclusive access to our innovative pollinator archetype system—a nature-inspired approach to wellness matching. Experience our developing pairing system that considers healing modalities, energetic compatibility, and personal preferences in this alpha testing phase.",
      icon: Brain,
      details: "Advanced archetype assessment • Compatibility evaluation • User preference optimization"
    },
    {
      number: 3,
      title: "Refine the Algorithm",
      subtitle: "Co-Create Industry Transformation",
      description: "Your ongoing feedback becomes integral to refining our innovative wellness matching methodology. Help us develop a system that aims to improve how people connect with healing practitioners and contribute to new approaches for practitioner-client compatibility.",
      icon: Target,
      details: "System refinement • User feedback integration • Alpha feature development"
    }
  ];

  return (
    <section className="py-20 bg-cream/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-forest/10 text-forest rounded-full text-sm font-medium mb-4">
            <span className="mr-2">🚀</span>
            Innovative Alpha Testing Program
          </div>
          <h2 className="font-heading text-3xl lg:text-5xl font-bold text-forest mb-6">
            Your Journey to Transform Wellness Matching
          </h2>
          <p className="text-xl text-forest/70 max-w-4xl mx-auto mb-8">
            As a founding alpha member, you're not just testing a platform—you're co-creating 
            an innovative approach to wellness connections. Every interaction helps us develop 
            and refine a system that aims to meaningfully improve how people find healing practitioners.
          </p>
          
          {/* Alpha Program Highlights */}
          <div className="grid md:grid-cols-3 gap-6 mb-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-forest">Innovative</div>
              <div className="text-sm text-forest/60">Approach</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-forest">Nature</div>
              <div className="text-sm text-forest/60">Inspired</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-forest">Alpha</div>
              <div className="text-sm text-forest/60">Testing</div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="inline-flex items-center px-6 py-3 bg-sage/10 text-sage rounded-full text-sm font-medium">
              <span className="mr-2">👥</span>
              Limited to 100 Alpha Members • You're In!
            </div>
          </div>
        </div>
        
        {/* Enhanced Step Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div key={step.number} className="bg-white rounded-2xl p-8 shadow-lg border border-sage/20 hover:shadow-xl transition-all duration-300 group">
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-br from-gold/20 to-gold/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                    <IconComponent className="w-8 h-8 text-gold" />
                  </div>
                  <div className="bg-forest/5 rounded-full px-3 py-1 inline-block mb-2">
                    <span className="text-xs font-semibold text-forest/60">PHASE {step.number}</span>
                  </div>
                </div>
                
                <h3 className="font-heading text-xl font-semibold text-forest mb-2 text-center">
                  {step.title}
                </h3>
                <p className="text-sm font-medium text-gold/80 text-center mb-4">
                  {step.subtitle}
                </p>
                
                <p className="text-forest/70 leading-relaxed text-sm mb-6">
                  {step.description}
                </p>

                <div className="pt-4 border-t border-sage/10">
                  <h4 className="text-xs font-semibold text-forest/60 uppercase tracking-wide mb-2 text-center">
                    Key Activities
                  </h4>
                  <div className="space-y-1">
                    {step.details.split(' • ').map((detail, index) => (
                      <div key={index} className="flex items-center text-xs text-forest/60">
                        <div className="w-1 h-1 bg-gold rounded-full mr-2 flex-shrink-0"></div>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Innovation Impact Section */}
        <div className="mt-20 text-center">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-sage/5 to-cream/30 rounded-2xl p-12 border border-sage/20">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <TrendingUp className="w-6 h-6 text-forest" />
              <h3 className="font-heading text-2xl font-bold text-forest">
                The Future of Wellness Matching Starts Here
              </h3>
            </div>
            
            <p className="text-lg text-forest/70 leading-relaxed mb-8">
              Your participation in this alpha program directly contributes to developing an innovative 
              approach to practitioner-client compatibility. The insights and feedback we gather will 
              help us create a system that could transform how people find their ideal healing practitioners.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="text-left">
                <h4 className="font-semibold text-forest mb-3 flex items-center">
                  <FlaskConical className="w-5 h-5 mr-2 text-gold" />
                  Research Innovation
                </h4>
                <ul className="space-y-2 text-sm text-forest/70">
                  <li className="flex items-start">
                    <div className="w-1 h-1 bg-gold rounded-full mt-2 mr-2 flex-shrink-0"></div>
                    <span>Innovative pollinator-inspired healing classification system</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1 h-1 bg-gold rounded-full mt-2 mr-2 flex-shrink-0"></div>
                    <span>Community-driven development and validation</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1 h-1 bg-gold rounded-full mt-2 mr-2 flex-shrink-0"></div>
                    <span>Compatibility assessment for optimal pairing</span>
                  </li>
                </ul>
              </div>
              
              <div className="text-left">
                <h4 className="font-semibold text-forest mb-3 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-sage" />
                  Industry Impact
                </h4>
                <ul className="space-y-2 text-sm text-forest/70">
                  <li className="flex items-start">
                    <div className="w-1 h-1 bg-sage rounded-full mt-2 mr-2 flex-shrink-0"></div>
                    <span>Promising alpha results in practitioner-client compatibility</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1 h-1 bg-sage rounded-full mt-2 mr-2 flex-shrink-0"></div>
                    <span>Innovative approach to wellness marketplace matching</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1 h-1 bg-sage rounded-full mt-2 mr-2 flex-shrink-0"></div>
                    <span>Future standard for holistic practitioner assessment</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <Badge className="bg-gold/20 text-gold px-4 py-2">
                Alpha Testing • Shaping the Future • Innovative Research
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
