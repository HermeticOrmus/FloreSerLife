import { useLocation } from "wouter";
import { ArrowLeft, Heart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function Favorites() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Header />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-subtle-rose/20 mb-6">
              <Heart className="w-10 h-10 text-subtle-rose" />
            </div>
            <h1 className="font-heading text-4xl font-bold text-forest mb-4">
              Favorite Practitioners
            </h1>
            <p className="text-lg text-forest/60 max-w-2xl mx-auto">
              Your saved practitioners for quick access and booking
            </p>
          </div>

          {/* Placeholder Content */}
          <div className="bg-white rounded-2xl shadow-lg border border-subtle-rose/20 p-12">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-subtle-rose/10 mb-4">
                <Heart className="w-8 h-8 text-subtle-rose" />
              </div>
              <h2 className="font-heading text-2xl font-semibold text-forest">
                Coming Soon
              </h2>
              <p className="text-forest/60 max-w-md mx-auto">
                Your favorite practitioners will appear here. Save practitioners you connect with
                for easy booking and quick access to their profiles.
              </p>
              <div className="pt-8">
                <Button
                  onClick={() => setLocation("/practitioners")}
                  className="bg-forest hover:bg-forest/90"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Browse All Practitioners
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
