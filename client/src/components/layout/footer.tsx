import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { logos } from "@/assets";

export default function Footer() {
  return (
    <footer className="bg-forest text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src={logos.main.coloredIcon} 
                alt="FloreSer Logo" 
                className="w-8 h-8"
              />
              <span className="font-heading text-lg font-bold">FloreSer</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Connecting souls through nature-inspired wellness. Find your perfect practitioner match through our unique pollinator archetype system.
            </p>
          </div>
          
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">For Clients</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="/practitioners">
                  <a className="hover:text-gold transition-colors">Find Practitioners</a>
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-gold transition-colors">Book Sessions</a>
              </li>
              <li>
                <a href="#" className="hover:text-gold transition-colors">Archetype Quiz</a>
              </li>
              <li>
                <a href="#" className="hover:text-gold transition-colors">How It Works</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">For Practitioners</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <a href="/api/login" className="hover:text-gold transition-colors">Join FloreSer</a>
              </li>
              <li>
                <a href="#" className="hover:text-gold transition-colors">Practitioner Resources</a>
              </li>
              <li>
                <a href="#" className="hover:text-gold transition-colors">Success Stories</a>
              </li>
              <li>
                <a href="#" className="hover:text-gold transition-colors">Support</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <a href="#" className="hover:text-gold transition-colors">About Us</a>
              </li>
              <li>
                <a href="#" className="hover:text-gold transition-colors">Contact</a>
              </li>
              <li>
                <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">
            © 2024 FloreSer. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-white/60 hover:text-gold transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-white/60 hover:text-gold transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-white/60 hover:text-gold transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-white/60 hover:text-gold transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
