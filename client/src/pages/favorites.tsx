import { useLocation } from "wouter";
import { ArrowLeft, Heart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Favorites() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/garden")}
            className="text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Garden
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-100 mb-6">
              <Heart className="w-10 h-10 text-rose-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Favorite Practitioners
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your saved practitioners for quick access and booking
            </p>
          </div>

          {/* Placeholder Content */}
          <div className="bg-white rounded-2xl shadow-lg border border-rose-100 p-12">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-50 mb-4">
                <Heart className="w-8 h-8 text-rose-500" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Coming Soon
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Your favorite practitioners will appear here. Save practitioners you connect with
                for easy booking and quick access to their profiles.
              </p>
              <div className="pt-8">
                <Button
                  onClick={() => setLocation("/practitioners")}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Browse All Practitioners
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
