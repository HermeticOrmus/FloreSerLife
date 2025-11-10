import { useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Heart,
  Sparkles,
  Shield,
  Users,
  Leaf,
  CheckCircle2
} from "lucide-react";

export default function JoinTheHive() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "Join the Hive — Become a Pollinator | FloreSer.Life";
  }, []);

  const benefits = [
    {
      icon: Heart,
      title: "Visibility & Belonging",
      description: "Be seen by a global community seeking authentic, grounded, holistic guidance. Your work is curated and celebrated."
    },
    {
      icon: Sparkles,
      title: "Ease & Flow",
      description: "Scheduling, payments, and client communication in one intuitive place — so you can focus on your craft."
    },
    {
      icon: Shield,
      title: "Integrity & Trust",
      description: "Every Pollinator is reviewed with care. We prioritize ethical practice, emotional safety, and transparency."
    },
    {
      icon: Users,
      title: "Collective Growth",
      description: "Join a circle that grows together through mentoring, co-creation opportunities, and shared visibility."
    },
    {
      icon: Leaf,
      title: "Creative Equity",
      description: "You remain the owner of your sessions and content. FloreSer.Life is the fertile ground that helps them bloom."
    }
  ];

  const cultureValues = [
    {
      title: "Integrity",
      description: "Holding space with care, honesty, and respect."
    },
    {
      title: "Authenticity",
      description: "Guiding from lived experience, not performance."
    },
    {
      title: "Presence",
      description: "Being fully here — with yourself and those you serve."
    },
    {
      title: "Co-Creation",
      description: "Nurturing a field that flourishes through collaboration, not comparison."
    }
  ];

  const pathSteps = [
    {
      number: "1",
      title: "Apply",
      description: "Share your background, offerings, and archetype resonance."
    },
    {
      number: "2",
      title: "Connect",
      description: "If aligned, meet us for a short conversation or onboarding call."
    },
    {
      number: "3",
      title: "Create Your Hive Profile",
      description: "Craft your story, session offerings, and welcome video."
    },
    {
      number: "4",
      title: "Bloom",
      description: "Once verified, your profile goes live — ready to connect, guide, and grow."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-hive-bg via-hive-card-light to-cream">
      {/* Hero */}
      <section className="relative py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-page-heading font-heading text-hive-text-primary mb-6">
              Join the Hive — Become a Pollinator
            </h1>
            <p className="text-body-lg text-hive-text-secondary mb-8 max-w-3xl mx-auto">
              A home for soul-led facilitators who serve with depth, presence, and joy.
            </p>
            <Button
              size="lg"
              className="bg-hive-accent hover:bg-hive-accent-light text-white rounded-button text-label"
              onClick={() => {
                const applySection = document.getElementById('apply');
                applySection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Apply to Join
            </Button>
          </motion.div>
        </div>
      </section>

      {/* The Invitation */}
      <section className="py-16 bg-white/60">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-section-heading font-heading text-hive-text-primary mb-6">
              The Invitation
            </h2>
            <p className="text-body text-hive-text-secondary mb-4">
              You carry a spark — a wisdom shaped by earth, time, and your own becoming. <strong>FloreSer.Life</strong> is a living ecosystem where that wisdom takes root. A space to share your gifts, pollinate new hearts, and grow within a field of integrity and care.
            </p>
            <p className="text-body text-hive-text-secondary">
              This is not another gig platform. It is a home for soul-led practitioners.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why We Call You Pollinators */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-section-heading font-heading text-hive-text-primary mb-6">
              Why We Call You Pollinators
            </h2>
            <p className="text-body text-hive-text-secondary mb-4">
              In nature, pollinators carry life between blossoms. At FloreSer.Life, our Pollinators — the Bees, Butterflies, Beetles, and Hummingbirds — do the same: guiding growth through wisdom, rhythm, and care.
            </p>
            <p className="text-body text-hive-text-secondary">
              Each archetype represents a way of serving, and together they form a vibrant ecosystem of transformation. When you join the Hive, you don't just list your work — you become part of a movement built on connection, reciprocity, and authenticity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Join the Hive */}
      <section className="py-16 bg-white/60">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-section-heading font-heading text-hive-text-primary mb-12 text-center"
          >
            Why Join the Hive
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-hive-card-light border-0 rounded-card shadow-card h-full hover:shadow-card-hover transition-shadow">
                  <CardHeader>
                    <div className="bg-hive-accent/10 rounded-card-sm p-3 w-fit mb-3">
                      <benefit.icon className="w-6 h-6 text-hive-accent" />
                    </div>
                    <CardTitle className="text-card-heading font-heading text-hive-text-primary">
                      {benefit.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-body-sm text-hive-text-secondary">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Seasons of Practice */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-section-heading font-heading text-hive-text-primary mb-6">
              The Seasons of Practice
            </h2>
            <div className="space-y-4 mb-6">
              <div className="bg-hive-card-light rounded-card p-6 shadow-card-sm">
                <h3 className="text-card-heading font-heading text-hive-text-primary mb-2">
                  Emerging
                </h3>
                <p className="text-body-sm text-hive-text-secondary">
                  New blossoms sharing fresh energy, curiosity, and care. Supported with mentoring and ethical foundations.
                </p>
              </div>
              <div className="bg-hive-card-light rounded-card p-6 shadow-card-sm">
                <h3 className="text-card-heading font-heading text-hive-text-primary mb-2">
                  Evolving
                </h3>
                <p className="text-body-sm text-hive-text-secondary">
                  Experienced guides refining their craft and expanding their reach while staying rooted in essence.
                </p>
              </div>
              <div className="bg-hive-card-light rounded-card p-6 shadow-card-sm">
                <h3 className="text-card-heading font-heading text-hive-text-primary mb-2">
                  Rooted
                </h3>
                <p className="text-body-sm text-hive-text-secondary">
                  Seasoned facilitators holding wisdom, depth, and steady presence.
                </p>
              </div>
            </div>
            <p className="text-body-sm text-hive-text-secondary italic text-center">
              These are not ranks — they are seasons. Each one vital to the balance of our collective ecosystem.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Hive Culture */}
      <section className="py-16 bg-white/60">
        <div className="max-w-5xl mx-auto px-6">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-section-heading font-heading text-hive-text-primary mb-12 text-center"
          >
            The Hive Culture
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-6">
            {cultureValues.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-hive-card-light border-0 rounded-card shadow-card">
                  <CardHeader>
                    <CardTitle className="text-card-heading font-heading text-hive-text-primary">
                      {value.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-body-sm text-hive-text-secondary">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Path to Join */}
      <section id="apply" className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-section-heading font-heading text-hive-text-primary mb-12 text-center"
          >
            The Path to Join
          </motion.h2>
          <div className="space-y-6 mb-12">
            {pathSteps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6 items-start"
              >
                <div className="bg-hive-accent text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 text-stat-md font-heading shadow-card-md">
                  {step.number}
                </div>
                <div className="flex-1">
                  <h3 className="text-card-heading font-heading text-hive-text-primary mb-2">
                    {step.title}
                  </h3>
                  <p className="text-body-sm text-hive-text-secondary">
                    {step.description}
                  </p>
                </div>
                <CheckCircle2 className="w-6 h-6 text-hive-accent flex-shrink-0" />
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <Button
              size="lg"
              className="bg-hive-accent hover:bg-hive-accent-light text-white rounded-button text-label"
              onClick={() => setLocation('/application')} // TODO: Create application form
            >
              Start Your Application
            </Button>
          </div>
        </div>
      </section>

      {/* Together, We Bloom */}
      <section className="py-20 bg-gradient-to-br from-hive-accent/10 to-hive-card-light">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-section-heading font-heading text-hive-text-primary mb-6">
              Together, We Bloom
            </h2>
            <p className="text-body text-hive-text-secondary mb-8">
              You are part of nature's great choreography of flourishing. If you guide from integrity, facilitate with joy, and serve from your center — the Hive is ready to welcome you. Together, we cross-pollinate insight, creativity, and care.
            </p>
            <Button
              size="lg"
              variant="outline"
              className="border-hive-accent text-hive-accent hover:bg-hive-accent hover:text-white rounded-button text-label"
              onClick={() => {
                const applySection = document.getElementById('apply');
                applySection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Join the Hive
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
