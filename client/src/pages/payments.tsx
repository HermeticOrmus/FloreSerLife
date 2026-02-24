import { useLocation } from "wouter";
import { ArrowLeft, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function Payments() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Header />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-sage/20 mb-6">
              <CreditCard className="w-10 h-10 text-forest" />
            </div>
            <h1 className="font-heading text-4xl font-bold text-forest mb-4">
              Payment History
            </h1>
            <p className="text-lg text-forest/60 max-w-2xl mx-auto">
              View your transaction history and manage payment methods
            </p>
          </div>

          {/* Placeholder Content */}
          <div className="bg-white rounded-2xl shadow-lg border border-sage/20 p-12">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sage/20 mb-4">
                <CreditCard className="w-8 h-8 text-forest" />
              </div>
              <h2 className="font-heading text-2xl font-semibold text-forest">
                Coming Soon
              </h2>
              <p className="text-forest/60 max-w-md mx-auto">
                Your payment history will appear here. Track session payments, download invoices,
                and manage your saved payment methods securely.
              </p>
              <div className="pt-8">
                <Button
                  onClick={() => setLocation("/hive")}
                  className="bg-forest hover:bg-forest/90"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Hive
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
