import { useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { PaperCutBanner } from "@/components/landing/PaperCutBanner";
import { PaperCutHexCard } from "@/components/nature/PaperCutHexCard";
import { papercut } from "@/assets";
import {
  Heart,
  Shield,
  Sprout,
  Users,
  Sparkles,
  Leaf,
} from "lucide-react";

// Tudor Rose SVG - laid on its side (rotated), paper-cut style
function TudorRoseSide({ size = 200 }: { size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.40;
  const innerR = size * 0.26;
  const centerR = size * 0.12;

  const petal = (r: number, width: number) => {
    const tipY = -r;
    const cpX = width * 0.6;
    const cpY = -r * 0.5;
    return `M 0,0 C ${cpX},${cpY} ${cpX * 0.8},${tipY * 0.85} 0,${tipY} C ${-cpX * 0.8},${tipY * 0.85} ${-cpX},${cpY} 0,0 Z`;
  };

  const outerPetalPath = petal(outerR, outerR * 0.55);
  const innerPetalPath = petal(innerR, innerR * 0.5);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="drop-shadow-lg"
      style={{ transform: "rotate(-25deg)" }}
    >
      <defs>
        <filter id="aboutPetalShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000025" />
        </filter>
      </defs>

      {/* Outer petals - deep Tudor red */}
      <g transform={`translate(${cx}, ${cy})`} filter="url(#aboutPetalShadow)">
        {[0, 72, 144, 216, 288].map((angle) => (
          <path
            key={`outer-${angle}`}
            d={outerPetalPath}
            transform={`rotate(${angle})`}
            fill="#7B2D26"
            opacity="0.95"
          />
        ))}
      </g>

      {/* Inner petals - creamy white */}
      <g transform={`translate(${cx}, ${cy})`} filter="url(#aboutPetalShadow)">
        {[36, 108, 180, 252, 324].map((angle) => (
          <path
            key={`inner-${angle}`}
            d={innerPetalPath}
            transform={`rotate(${angle})`}
            fill="#FFF5E1"
            opacity="0.95"
          />
        ))}
      </g>

      {/* Golden center */}
      <circle cx={cx} cy={cy} r={centerR} fill="#D4A843" filter="url(#aboutPetalShadow)" />
      <circle cx={cx} cy={cy} r={centerR * 0.5} fill="#E8C06A" opacity="0.6" />
    </svg>
  );
}

// Scattered petal SVG element
function ScatteredPetal({
  x,
  y,
  rotation,
  size,
  color,
  delay,
}: {
  x: number;
  y: number;
  rotation: number;
  size: number;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 0.6, scale: 1 }}
      transition={{ delay, duration: 0.6 }}
      className="absolute pointer-events-none"
      style={{ left: x, top: y, transform: `rotate(${rotation}deg)` }}
    >
      <svg width={size} height={size * 1.5} viewBox="0 0 20 30">
        <path
          d="M 10,0 C 16,5 18,15 10,30 C 2,15 4,5 10,0 Z"
          fill={color}
          opacity="0.7"
        />
      </svg>
    </motion.div>
  );
}

// Value banner item
const values = [
  {
    title: "Nature-Inspired",
    description:
      "Every element of FloreSer grows from the rhythms and wisdom of the natural world. From our pollinator archetypes to our garden metaphors, nature is our guiding teacher.",
    texture: "paperClay" as const,
    hasPattern: false,
  },
  {
    title: "Ethical by Design",
    description:
      "No dark patterns. No addiction mechanics. No data extraction. We build technology that empowers you, respects your time, and honours your autonomy.",
    texture: "cream" as const,
    hasPattern: true,
  },
  {
    title: "Community of Care",
    description:
      "FloreSer is a living ecosystem, not a listing. Every facilitator is part of the Hive, contributing their wisdom to a shared field of growth and presence.",
    texture: "paperClay" as const,
    hasPattern: false,
  },
  {
    title: "Sacred Growth",
    description:
      "Your journey is honoured at every stage. Whether you are a seed just beginning or a garden in full bloom, you are welcomed, supported, and seen.",
    texture: "cream" as const,
    hasPattern: true,
  },
];

// Hexagon card items at the bottom
const hexItems = [
  {
    id: "archetype",
    icon: Sparkles,
    title: "Pollinator Archetypes",
    description: "Four nature-inspired guides to match you with the right facilitator",
    color: "tudor-red" as const,
  },
  {
    id: "community",
    icon: Users,
    title: "The Hive",
    description: "A curated community of vetted, soulful facilitators",
    color: "claystone" as const,
  },
  {
    id: "garden",
    icon: Leaf,
    title: "Community Garden",
    description: "Share and discover wellness content in a sacred digital space",
    color: "deep-sage" as const,
  },
  {
    id: "seeds",
    icon: Sprout,
    title: "Seeds Currency",
    description: "Earn rewards for genuine engagement, never extraction",
    color: "dew-gold" as const,
  },
  {
    id: "safety",
    icon: Shield,
    title: "Safe Space",
    description: "Privacy, trust, and ethical standards at every layer",
    color: "olive-resin" as const,
  },
  {
    id: "heart",
    icon: Heart,
    title: "Genuine Care",
    description: "Every feature serves your flourishing, never our metrics",
    color: "forest-earth" as const,
  },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function About() {
  useEffect(() => {
    document.title = "About - FloreSer.Life";
  }, []);

  return (
    <div
      className="min-h-screen text-papercut-neutral-dark"
      style={{
        backgroundImage: `url(${papercut.textures.paperUI})`,
        backgroundSize: "256px 256px",
        backgroundRepeat: "repeat",
        backgroundColor: "#f5f3ef",
      }}
    >
      <Header />

      {/* Hero Panel - Layered paper hills with Tudor rose */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        {/* Layered paper hill shapes */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Back hill - clay */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[60%]"
            style={{
              backgroundImage: `url(${papercut.textures.paperClay})`,
              backgroundSize: "200px 200px",
              backgroundRepeat: "repeat",
              clipPath: "ellipse(80% 100% at 50% 100%)",
              opacity: 0.3,
            }}
          />
          {/* Mid hill - cream/blush */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[45%]"
            style={{
              backgroundImage: `url(${papercut.textures.cream})`,
              backgroundSize: "200px 200px",
              backgroundRepeat: "repeat",
              clipPath: "ellipse(70% 100% at 40% 100%)",
              opacity: 0.25,
            }}
          />
          {/* Front hill - soft gold */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[30%]"
            style={{
              backgroundImage: `url(${papercut.textures.paperGold})`,
              backgroundSize: "200px 200px",
              backgroundRepeat: "repeat",
              clipPath: "ellipse(60% 100% at 60% 100%)",
              opacity: 0.15,
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Text content - left side */}
            <motion.div
              className="flex-1 text-center lg:text-left"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-heading text-4xl lg:text-5xl font-bold text-forest mb-6">
                About{" "}
                <span className="bg-gradient-to-r from-gold via-hive-accent to-garden-accent bg-clip-text text-transparent">
                  FloreSer
                </span>
              </h1>
              <p className="text-xl text-forest/70 leading-relaxed max-w-xl mb-4">
                A living ecosystem where seekers and guides meet, grow,
                and flourish together &mdash; rooted in nature, powered by intention.
              </p>
              <p className="text-lg text-forest/60 leading-relaxed max-w-xl">
                FloreSer was born from a single question:{" "}
                <em>
                  What would a wellness platform look like if it treated every
                  person as a living garden?
                </em>
              </p>
            </motion.div>

            {/* Tudor Rose - right side, laid on its side */}
            <motion.div
              className="relative flex-shrink-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <TudorRoseSide size={220} />

              {/* Scattered petals around the rose */}
              <ScatteredPetal x={-30} y={40} rotation={-15} size={18} color="#7B2D26" delay={0.6} />
              <ScatteredPetal x={180} y={20} rotation={45} size={14} color="#FFF5E1" delay={0.7} />
              <ScatteredPetal x={160} y={180} rotation={-30} size={16} color="#7B2D26" delay={0.8} />
              <ScatteredPetal x={-10} y={170} rotation={60} size={12} color="#FFF5E1" delay={0.9} />
              <ScatteredPetal x={80} y={-15} rotation={20} size={13} color="#D4A843" delay={1.0} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <PaperCutBanner variant="plain-sage">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-forest mb-8">
              Our Story
            </h2>
            <div className="text-lg text-forest/80 leading-relaxed space-y-5">
              <p>
                We believe that healing is not a transaction. It is a relationship
                &mdash; between seeker and guide, between intention and practice,
                between the self that is and the self that is becoming.
              </p>
              <p>
                FloreSer.Life was created to be more than a marketplace. It is an
                ecosystem &mdash; a garden &mdash; where facilitators are honoured as
                <strong> Pollinators</strong>, seekers are welcomed as
                <strong> seeds</strong>, and every interaction nurtures genuine
                growth.
              </p>
              <p>
                Our name comes from the Spanish <em>floreser</em>: to flourish,
                to bloom. And that is what we hold as our north star &mdash; your
                flourishing.
              </p>
            </div>
          </motion.div>
        </div>
      </PaperCutBanner>

      {/* Four Value Banners - Mid Section */}
      <section className="py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="font-heading text-3xl lg:text-4xl font-bold text-forest text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            What We Stand For
          </motion.h2>

          <motion.div
            className="grid sm:grid-cols-2 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {values.map((value, index) => {
              const texture =
                papercut.textures[value.texture as keyof typeof papercut.textures];

              return (
                <motion.div
                  key={value.title}
                  variants={fadeUp}
                  className="relative rounded-2xl overflow-hidden p-8 shadow-md"
                  style={{
                    backgroundImage: `url(${texture})`,
                    backgroundSize: "200px 200px",
                    backgroundRepeat: "repeat",
                  }}
                >
                  {/* Subtle relief overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(145deg, rgba(255,255,255,0.12) 0%, transparent 50%, rgba(0,0,0,0.04) 100%)",
                    }}
                  />

                  {/* Decorative motif on patterned cards */}
                  {value.hasPattern && (
                    <div
                      className="absolute top-4 right-4 w-16 h-16 opacity-10 pointer-events-none"
                    >
                      <svg viewBox="0 0 60 60">
                        {[0, 72, 144, 216, 288].map((angle) => (
                          <ellipse
                            key={angle}
                            cx="30"
                            cy="30"
                            rx="8"
                            ry="20"
                            fill="#7B2D26"
                            transform={`rotate(${angle} 30 30)`}
                          />
                        ))}
                        <circle cx="30" cy="30" r="6" fill="#D4A843" />
                      </svg>
                    </div>
                  )}

                  <div className="relative z-10">
                    <h3 className="font-heading text-xl font-bold text-forest mb-3">
                      {value.title}
                    </h3>
                    <p className="text-forest/75 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Six Hexagon Cards - Bottom */}
      <PaperCutBanner variant="patterned-leaf">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="font-heading text-3xl lg:text-4xl font-bold text-forest text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            The Living Ecosystem
          </motion.h2>
          <motion.p
            className="text-lg text-forest/70 text-center max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Six pillars that make FloreSer a garden, not a marketplace
          </motion.p>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {hexItems.map((item) => (
              <motion.div
                key={item.id}
                variants={fadeUp}
                className="flex justify-center"
              >
                <PaperCutHexCard
                  color={item.color}
                  hoverable={false}
                  className="w-48 h-52 md:w-56 md:h-60"
                >
                  <item.icon className="w-10 h-10 mb-3 drop-shadow-sm text-inherit" />
                  <h3 className="font-heading text-card-heading mb-2 drop-shadow-sm text-inherit">
                    {item.title}
                  </h3>
                  <p className="text-body-sm drop-shadow-sm leading-relaxed text-inherit">
                    {item.description}
                  </p>
                </PaperCutHexCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </PaperCutBanner>

      <Footer />
    </div>
  );
}
