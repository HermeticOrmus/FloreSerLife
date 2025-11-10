import { useLocation } from "wouter";
import { ArrowLeft, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Application() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/join-the-hive")}
            className="text-amber-700 hover:text-amber-900 hover:bg-amber-50"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Learn More
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 mb-6">
              <Sparkles className="w-10 h-10 text-amber-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Join The Hive
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Apply to become a practitioner and share your gifts with our community
            </p>
          </div>

          {/* Placeholder Content */}
          <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-12">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 mb-4">
                <FileText className="w-8 h-8 text-amber-500" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Application Form Coming Soon
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                The practitioner application process is being prepared. You'll be able to submit your
                credentials, describe your practice, and join our community of healers and guides.
              </p>
              <div className="pt-8">
                <Button
                  onClick={() => setLocation("/join-the-hive")}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Learn More About The Hive
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
