import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, User, Globe, DollarSign, MessageCircle, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { SurveyResponse } from "@shared/schema";

export default function SimpleAdminPanel() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("simpleAdminAuth");
    if (!isAuthenticated) {
      setLocation("/simple-admin/login");
    }
  }, [setLocation]);

  const { data: responses, isLoading, error } = useQuery<{
    data: SurveyResponse[];
    total: number;
  }>({
    queryKey: ["/api/survey/responses"],
    enabled: !!localStorage.getItem("simpleAdminAuth"),
  });

  const handleLogout = () => {
    localStorage.removeItem("simpleAdminAuth");
    toast({
      title: "Logged out",
      description: "You have been logged out of the admin panel",
    });
    setLocation("/simple-admin/login");
  };

  const exportCSV = () => {
    if (!responses?.data) return;

    const headers = [
      "Date",
      "Identity Type",
      "Age Range",
      "Country",
      "Currency",
      "Facilitator Price",
      "Client Comfortable Price",
      "Session Frequency",
      "Garden Interest",
      "Final Thoughts"
    ];

    const csvData = responses.data.map(response => [
      response.createdAt ? new Date(response.createdAt).toLocaleDateString() : "N/A",
      response.identityType,
      response.ageRange || "",
      response.countryOfResidence || "",
      response.currency || "",
      response.facilitatorSessionPrice || "",
      response.clientComfortablePrice || "",
      response.sessionFrequency || "",
      response.gardenInterestLevel || "",
      response.finalThoughts || ""
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `survey-responses-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-forest">Loading survey responses...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Failed to load survey responses. Please try again.</p>
            <Button onClick={handleLogout} className="mt-4">
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalResponses = responses?.total || 0;
  const surveyData = responses?.data || [];

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-forest">Survey Admin Panel</h1>
            <div className="flex items-center gap-4">
              <Button
                onClick={exportCSV}
                variant="outline"
                disabled={totalResponses === 0}
                data-testid="button-export-csv"
              >
                Export CSV
              </Button>
              <Button
                onClick={handleLogout}
                variant="ghost"
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6" data-testid="card-statistics">
          <CardHeader>
            <CardTitle>Survey Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center" data-testid="stat-total-responses">
                <div className="text-3xl font-bold text-forest">{totalResponses}</div>
                <div className="text-sm text-gray-600">Total Responses</div>
              </div>
              <div className="text-center" data-testid="stat-facilitators">
                <div className="text-3xl font-bold text-gold">
                  {surveyData.filter(r => r.identityType === 'facilitator' || r.identityType === 'both').length}
                </div>
                <div className="text-sm text-gray-600">Facilitators</div>
              </div>
              <div className="text-center" data-testid="stat-clients">
                <div className="text-3xl font-bold text-sage">
                  {surveyData.filter(r => r.identityType === 'client' || r.identityType === 'both').length}
                </div>
                <div className="text-sm text-gray-600">Clients</div>
              </div>
              <div className="text-center" data-testid="stat-exploring">
                <div className="text-3xl font-bold text-gray-600">
                  {surveyData.filter(r => r.identityType === 'exploring' || r.identityType === 'neither').length}
                </div>
                <div className="text-sm text-gray-600">Exploring</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-responses">
          <CardHeader>
            <CardTitle>Survey Responses ({totalResponses})</CardTitle>
          </CardHeader>
          <CardContent>
            {surveyData.length === 0 ? (
              <div className="text-center py-8 text-gray-500" data-testid="message-no-responses">
                No survey responses yet.
              </div>
            ) : (
              <div className="space-y-4">
                {surveyData.map((response) => (
                  <Card key={response.id} className="border-l-4 border-l-forest" data-testid={`response-card-${response.id}`}>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2" data-testid={`response-date-${response.id}`}>
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">
                            {response.createdAt ? new Date(response.createdAt).toLocaleDateString() : "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2" data-testid={`response-identity-${response.id}`}>
                          <User className="w-4 h-4 text-gray-500" />
                          <Badge variant="outline" data-testid={`badge-identity-${response.identityType}`}>
                            {response.identityType}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2" data-testid={`response-location-${response.id}`}>
                          <Globe className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">
                            {response.countryOfResidence || "Not specified"}
                          </span>
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {response.ageRange && (
                          <div data-testid={`response-age-${response.id}`}>
                            <strong>Age Range:</strong> {response.ageRange}
                          </div>
                        )}
                        {response.currency && (
                          <div data-testid={`response-currency-${response.id}`}>
                            <strong>Currency:</strong> {response.currency}
                          </div>
                        )}
                        {response.facilitatorSessionPrice && (
                          <div data-testid={`response-facilitator-price-${response.id}`}>
                            <strong>Facilitator Session Price:</strong> {response.facilitatorSessionPrice}
                          </div>
                        )}
                        {response.clientComfortablePrice && (
                          <div data-testid={`response-client-price-${response.id}`}>
                            <strong>Client Comfortable Price:</strong> {response.clientComfortablePrice}
                          </div>
                        )}
                        {response.sessionFrequency && (
                          <div data-testid={`response-frequency-${response.id}`}>
                            <strong>Session Frequency:</strong> {response.sessionFrequency}
                          </div>
                        )}
                        {response.gardenInterestLevel && (
                          <div data-testid={`response-garden-interest-${response.id}`}>
                            <strong>Garden Interest:</strong> {response.gardenInterestLevel}
                          </div>
                        )}
                      </div>
                      
                      {response.finalThoughts && (
                        <>
                          <Separator className="my-4" />
                          <div data-testid={`response-final-thoughts-${response.id}`}>
                            <strong className="flex items-center gap-2 mb-2">
                              <MessageCircle className="w-4 h-4" />
                              Final Thoughts:
                            </strong>
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                              {response.finalThoughts}
                            </p>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}