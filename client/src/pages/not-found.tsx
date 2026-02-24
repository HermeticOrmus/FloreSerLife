import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { papercut } from "@/assets";

export default function NotFound() {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative"
      style={{
        backgroundImage: `url(${papercut.textures.cream})`,
        backgroundSize: '512px 512px',
        backgroundRepeat: 'repeat',
      }}
    >
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 opacity-20">
        <img src={papercut.accents.leaf} alt="" className="w-24 h-24" loading="lazy" width={96} height={96} />
      </div>
      <div className="absolute bottom-20 right-10 opacity-20 rotate-45">
        <img src={papercut.accents.flowerbud} alt="" className="w-20 h-20" loading="lazy" width={80} height={80} />
      </div>

      <Card className="w-full max-w-lg mx-4 shadow-card-lg border-sage/20 overflow-hidden">
        <div
          className="h-2"
          style={{
            backgroundImage: `url(${papercut.textures.paperGold})`,
            backgroundSize: '200px 200px',
          }}
        />
        <CardContent className="pt-8 pb-8 text-center">
          {/* Decorative sun glow */}
          <div className="flex justify-center mb-6">
            <img
              src={papercut.sunGlow}
              alt=""
              className="w-32 h-32 opacity-80"
              loading="lazy"
              width={128}
              height={128}
            />
          </div>

          <h1 className="font-heading text-3xl font-bold text-forest mb-2">
            Path Not Found
          </h1>

          <p className="text-earth-600 mb-6 max-w-sm mx-auto">
            Like a seedling seeking sunlight, sometimes we wander to find our way.
            This page doesn't exist, but your journey continues.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button
                className="text-white"
                style={{
                  backgroundImage: `url(${papercut.textures.paperForest})`,
                  backgroundSize: '200px 200px',
                }}
              >
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
