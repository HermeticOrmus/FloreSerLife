import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { logos, papercut } from "@/assets";

export default function Footer() {
  return (
    <footer
      className="text-white py-16 relative"
      style={{
        backgroundImage: `url(${papercut.textures.paperForest})`,
        backgroundSize: "256px 256px",
        backgroundRepeat: "repeat",
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-forest/80 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img
                src={logos.main.coloredIcon}
                alt="FloreSer Logo"
                className="w-8 h-8"
                loading="lazy"
                width={32}
                height={32}
              />
              <span className="font-heading text-lg font-bold">FloreSer</span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              A nature-inspired wellness community where seekers find healing support and new facilitators discover their calling. Start your journey with the Bee archetype - perfect for beginners.
            </p>
          </div>

          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">For Clients</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/practitioners" className="text-white/85 hover:text-gold transition-colors">
                  Find Practitioners
                </Link>
              </li>
              <li>
                <Link href="/hive" className="text-white/85 hover:text-gold transition-colors">Book Sessions</Link>
              </li>
              <li>
                <Link href="/quiz" className="text-white/85 hover:text-gold transition-colors">Archetype Quiz</Link>
              </li>
              <li>
                <Link href="/alpha" className="text-white/85 hover:text-gold transition-colors">How It Works</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">For Facilitators</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/join-the-hive" className="text-white/85 hover:text-gold transition-colors">Join the Hive</Link>
              </li>
              <li>
                <Link href="/auth/signup" className="text-white/85 hover:text-gold transition-colors"><span aria-hidden="true">🐝 </span>Start with Bee Archetype</Link>
              </li>
              <li>
                <Link href="/resources" className="text-white/85 hover:text-gold transition-colors">Facilitator Resources</Link>
              </li>
              <li>
                <Link href="/garden" className="text-white/85 hover:text-gold transition-colors">Community & Mentorship</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-white/85 hover:text-gold transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/85 hover:text-gold transition-colors">Contact</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white/85 hover:text-gold transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="text-white/85 hover:text-gold transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/25 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/70 text-sm">
            © {new Date().getFullYear()} FloreSer.Life — Where growth is sacred and flourishing is your birthright.
          </p>
          {/* Social links - add URLs when accounts are created
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="https://facebook.com/floreser.life" className="text-white/70 hover:text-gold transition-colors" aria-label="Facebook">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="https://instagram.com/floreser.life" className="text-white/70 hover:text-gold transition-colors" aria-label="Instagram">
              <Instagram className="w-5 h-5" />
            </a>
          </div>
          */}
        </div>
      </div>
    </footer>
  );
}
