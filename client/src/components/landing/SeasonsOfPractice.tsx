import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Sprout, Leaf, TreePine } from "lucide-react";

export default function SeasonsOfPractice() {
  const seasons = [
    {
      name: "Emerging",
      icon: Sprout,
      color: "bg-sage/10 text-sage",
    },
    {
      name: "Evolving",
      icon: Leaf,
      color: "bg-gold/10 text-gold",
    },
    {
      name: "Rooted",
      icon: TreePine,
      color: "bg-forest/10 text-forest",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="font-heading text-3xl lg:text-5xl font-bold text-forest mb-8">
            The Seasons of Practice
          </h2>

          <p className="text-lg text-forest/80 leading-relaxed mb-6 max-w-4xl mx-auto">
            Each Pollinator grows through seasons of practice—some are{" "}
            <strong>Emerging</strong>, just beginning to share their light;
            others are <strong>Evolving</strong>, refining and expanding their
            craft; and some are <strong>Rooted</strong>, seasoned in their path,
            grounded in years of presence and wisdom.
          </p>

          <p className="text-forest/60 italic mb-12">
            Wherever they are in their journey, all are guided by integrity,
            care, and the wish to see you bloom.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {seasons.map((season, index) => {
              const Icon = season.icon;
              return (
                <motion.div
                  key={season.name}
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Badge
                    className={`${season.color} px-6 py-3 text-base font-medium border-0 rounded-full`}
                  >
                    <Icon className="w-4 h-4 mr-2 inline" />
                    {season.name}
                  </Badge>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
