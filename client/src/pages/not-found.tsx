import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-earth-50 paper-grain-light">
      <Card className="w-full max-w-lg mx-4 shadow-card-lg border-sage/20 overflow-hidden">
        <div className="h-2 bg-gold" />
        <CardContent className="pt-8 pb-8 text-center">

          <h1 className="font-heading text-3xl font-bold text-forest mb-2">
            Path Not Found
          </h1>

          <p className="text-earth-600 mb-6 max-w-sm mx-auto">
            Like a seedling seeking sunlight, sometimes we wander to find our way.
            This page doesn't exist, but your journey continues.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button className="text-white bg-forest hover:bg-forest/90">
                <Home className="w-4 h-4 mr-2" />
                Return Home
              </Button>
            </Link>
            <Link href="/practitioners">
              <Button
                variant="outline"
                className="border-sage hover:bg-sage/10"
              >
                <Search className="w-4 h-4 mr-2" />
                Find Practitioners
              </Button>
            </Link>
          </div>

          <Button
            variant="ghost"
            className="mt-4 text-earth-500 hover:text-forest"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
