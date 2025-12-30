import { papercut } from "@/assets";

/**
 * Minimal paper-cut style hero section
 * Responsive: Desktop shows composition centered, Mobile shows full image
 */
export function HeroSection() {
  return (
    <section className="relative w-full">
      {/* Full composition - natural aspect ratio on all screen sizes */}
      <img
        src={papercut.heroBackground}
        alt="FloreSer - Paper-cut landscape with sprout"
        className="w-full h-auto"
      />
    </section>
  );
}

export default HeroSection;
