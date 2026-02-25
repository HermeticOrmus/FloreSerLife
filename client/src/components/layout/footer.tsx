import { Link } from "wouter";
import { logos } from "@/assets";

export default function Footer() {
  return (
    <footer className="bg-forest text-white/80 py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img
                src={logos.main.coloredIcon}
                alt="FloreSer Logo"
                className="w-7 h-7"
                loading="lazy"
                width={28}
                height={28}
              />
              <span className="font-heading text-lg text-white">FloreSer</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              A nature-inspired wellness community where seekers find healing support and new facilitators discover their calling.
            </p>
          </div>

          <div>
            <h4 className="text-white text-sm tracking-wide mb-4">For Clients</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/practitioners" className="text-white/50 hover:text-white transition-colors">
                  Find Practitioners
                </Link>
              </li>
              <li>
                <Link href="/hive" className="text-white/50 hover:text-white transition-colors">Book Sessions</Link>
              </li>
              <li>
                <Link href="/quiz" className="text-white/50 hover:text-white transition-colors">Archetype Quiz</Link>
              </li>
              <li>
                <Link href="/alpha" className="text-white/50 hover:text-white transition-colors">How It Works</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm tracking-wide mb-4">For Facilitators</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/join-the-hive" className="text-white/50 hover:text-white transition-colors">Join the Hive</Link>
              </li>
              <li>
                <Link href="/auth/signup" className="text-white/50 hover:text-white transition-colors">Start with Bee Archetype</Link>
              </li>
              <li>
                <Link href="/resources" className="text-white/50 hover:text-white transition-colors">Facilitator Resources</Link>
              </li>
              <li>
                <Link href="/garden" className="text-white/50 hover:text-white transition-colors">Community & Mentorship</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm tracking-wide mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-white/50 hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/50 hover:text-white transition-colors">Contact</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white/50 hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="text-white/50 hover:text-white transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} FloreSer.Life
          </p>
        </div>
      </div>
    </footer>
  );
}
