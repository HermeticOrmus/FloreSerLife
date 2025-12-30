import { ReactNode } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  sidebar?: ReactNode;
  actions?: ReactNode;
}

export default function DashboardLayout({
  children,
  title,
  subtitle,
  sidebar,
  actions
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl lg:text-4xl font-bold text-forest mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-forest/70 text-lg">
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="mt-4 sm:mt-0">
              {actions}
            </div>
          )}
        </div>

        {/* Dashboard Content */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          {sidebar && (
            <div className="lg:col-span-3">
              <Card className="border-sage/20 p-6 sticky top-24">
                {sidebar}
              </Card>
            </div>
          )}
          
          {/* Main Content */}
          <div className={sidebar ? "lg:col-span-9" : "lg:col-span-12"}>
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}