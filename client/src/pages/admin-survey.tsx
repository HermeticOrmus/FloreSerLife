import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { format } from "date-fns";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Download, 
  Filter, 
  ChevronDown, 
  ChevronRight, 
  Users, 
  FileText, 
  Calendar,
  BarChart3,
  Search,
  RefreshCw
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { SurveyResponse } from "@shared/schema";

const ITEMS_PER_PAGE = 20;

const IDENTITY_TYPE_LABELS = {
  facilitator: "Facilitator/Practitioner",
  client: "Client/Seeker", 
  both: "Both",
  neither: "Neither",
  exploring: "Just Exploring"
};

const IDENTITY_TYPE_COLORS = {
  facilitator: "bg-sage/20 text-sage",
  client: "bg-gold/20 text-gold",
  both: "bg-forest/20 text-forest", 
  neither: "bg-gray-100 text-gray-800",
  exploring: "bg-cream text-forest"
};

interface AdminSurveyPageProps {}

export default function AdminSurveyPage({}: AdminSurveyPageProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterIdentityType, setFilterIdentityType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    document.title = "Survey Results - Admin Panel - FloreSer";
  }, []);

  // Fetch survey responses
  const { 
    data: surveysData, 
    isLoading, 
    error,
    refetch 
  } = useQuery<{ data: SurveyResponse[], total: number }>({
    queryKey: ["/api/survey/responses"],
    retry: 1,
  });

  // Filter and paginate data
  const filteredSurveys = useMemo(() => {
    if (!surveysData?.data) return [];
    
    let filtered = surveysData.data;
    
    // Filter by identity type
    if (filterIdentityType !== "all") {
      filtered = filtered.filter(survey => survey.identityType === filterIdentityType);
    }
    
    // Filter by search term (country, currency, age range)
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(survey => 
        survey.countryOfResidence?.toLowerCase().includes(search) ||
        survey.currency?.toLowerCase().includes(search) ||
        survey.ageRange?.toLowerCase().includes(search) ||
        survey.finalThoughts?.toLowerCase().includes(search)
      );
    }
    
    return filtered;
  }, [surveysData?.data, filterIdentityType, searchTerm]);

  const paginatedSurveys = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSurveys.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredSurveys, currentPage]);

  const totalPages = Math.ceil(filteredSurveys.length / ITEMS_PER_PAGE);

  // Generate statistics
  const stats = useMemo(() => {
    if (!surveysData?.data) return null;
    
    const total = surveysData.data.length;
    const authenticated = surveysData.data.filter(s => s.userId).length;
    const anonymous = total - authenticated;
    
    const byType = surveysData.data.reduce((acc, survey) => {
      acc[survey.identityType] = (acc[survey.identityType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total,
      authenticated,
      anonymous,
      byType
    };
  }, [surveysData?.data]);

  // Export to CSV functionality
  const exportToCSV = () => {
    if (!filteredSurveys.length) {
      toast({
        title: "No data to export",
        description: "No survey responses match your current filters.",
        variant: "destructive"
      });
      return;
    }

    const csvHeaders = [
      "Submission Date",
      "Identity Type", 
      "Age Range",
      "Country",
      "Currency",
      "Facilitator Price",
      "Open to Free Session",
      "Client Comfortable Price",
      "Client Max Price",
      "Session Frequency",
      "Garden Interest",
      "Is Authenticated"
    ];

    const csvData = filteredSurveys.map(survey => [
      survey.createdAt ? format(new Date(survey.createdAt), "yyyy-MM-dd HH:mm") : "",
      IDENTITY_TYPE_LABELS[survey.identityType],
      survey.ageRange || "",
      survey.countryOfResidence || "",
      survey.currency || "",
      survey.facilitatorSessionPrice || "",
      survey.openToFreeSession || "",
      survey.clientComfortablePrice || "",
      survey.clientMaxPrice || "",
      survey.sessionFrequency || "",
      survey.gardenInterestLevel || "",
      survey.userId ? "Yes" : "No"
    ]);

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `floreser-survey-results-${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export successful",
      description: `Downloaded ${filteredSurveys.length} survey responses as CSV.`
    });
  };

  const toggleRowExpansion = (surveyId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(surveyId)) {
      newExpanded.delete(surveyId);
    } else {
      newExpanded.add(surveyId);
    }
    setExpandedRows(newExpanded);
  };

  const renderDetailedView = (survey: SurveyResponse) => (
    <div className="grid md:grid-cols-2 gap-6 p-4 bg-cream/50 rounded" data-testid={`detailed-content-${survey.id}`}>
      {/* Demographics */}
      <div data-testid={`section-demographics-${survey.id}`}>
        <h4 className="font-semibold text-forest mb-3">Demographics</h4>
        <div className="space-y-2 text-sm">
          <div data-testid={`text-age-range-${survey.id}`}><span className="font-medium">Age Range:</span> {survey.ageRange || "Not specified"}</div>
          <div data-testid={`text-country-residence-${survey.id}`}><span className="font-medium">Country:</span> {survey.countryOfResidence || "Not specified"}</div>
          <div data-testid={`text-currency-${survey.id}`}><span className="font-medium">Currency:</span> {survey.currency || "Not specified"}</div>
        </div>
      </div>

      {/* Role-specific data */}
      <div data-testid={`section-role-specific-${survey.id}`}>
        <h4 className="font-semibold text-forest mb-3">Role-Specific Responses</h4>
        <div className="space-y-2 text-sm">
          {survey.facilitatorSessionPrice && (
            <div><span className="font-medium">Facilitator Session Price:</span> {survey.facilitatorSessionPrice}</div>
          )}
          {survey.openToFreeSession && (
            <div><span className="font-medium">Open to Free Session:</span> {survey.openToFreeSession}</div>
          )}
          {survey.clientComfortablePrice && (
            <div><span className="font-medium">Client Comfortable Price:</span> {survey.clientComfortablePrice}</div>
          )}
          {survey.sessionFrequency && (
            <div><span className="font-medium">Session Frequency:</span> {survey.sessionFrequency}</div>
          )}
        </div>
      </div>

      {/* Arrays */}
      {(survey.contributionInterests?.length || survey.bookingEncouragements?.length) && (
        <div className="md:col-span-2">
          <h4 className="font-semibold text-forest mb-3">Interests & Preferences</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            {survey.contributionInterests?.length && (
              <div>
                <span className="font-medium">Contribution Interests:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {survey.contributionInterests.map((interest, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">{interest}</Badge>
                  ))}
                </div>
              </div>
            )}
            {survey.bookingEncouragements?.length && (
              <div>
                <span className="font-medium">Booking Encouragements:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {survey.bookingEncouragements.map((encouragement, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">{encouragement}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Community Garden */}
      {survey.gardenInterestLevel && (
        <div>
          <h4 className="font-semibold text-forest mb-3">Community Garden</h4>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">Interest Level:</span> {survey.gardenInterestLevel}</div>
            {survey.gardenMonthlyPrice && (
              <div><span className="font-medium">Monthly Price:</span> {survey.gardenMonthlyPrice}</div>
            )}
          </div>
        </div>
      )}

      {/* Final thoughts */}
      {survey.finalThoughts && (
        <div className="md:col-span-2">
          <h4 className="font-semibold text-forest mb-3">Final Thoughts</h4>
          <p className="text-sm text-forest/80 italic">{survey.finalThoughts}</p>
        </div>
      )}
    </div>
  );

  // Admin sidebar navigation (simplified version)
  const adminSidebar = (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-forest rounded-full flex items-center justify-center mx-auto mb-3">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h3 className="font-heading font-semibold text-forest">Admin Panel</h3>
        <p className="text-sm text-forest/60">System Administration</p>
      </div>
      
      <nav className="space-y-1">
        <Button
          variant="secondary"
          className="w-full justify-start h-10 px-3 bg-gold/10 text-gold hover:bg-gold/20"
          data-testid="button-survey-results"
        >
          <FileText className="w-4 h-4 mr-3" />
          Survey Results
        </Button>
      </nav>
    </div>
  );

  const actions = (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button 
        onClick={exportToCSV} 
        disabled={!filteredSurveys.length}
        className="bg-forest text-white hover:bg-forest/90"
        data-testid="button-export-csv"
      >
        <Download className="w-4 h-4 mr-2" />
        Export CSV
      </Button>
      <Button 
        onClick={() => refetch()} 
        variant="outline"
        data-testid="button-refresh"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Refresh
      </Button>
    </div>
  );

  if (error) {
    return (
      <DashboardLayout
        title="Survey Results"
        subtitle="Admin Panel"
        sidebar={adminSidebar}
        actions={actions}
      >
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            Failed to load survey responses. You may not have admin privileges or there was a server error.
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Survey Results"
      subtitle="Analyze platform survey responses and gather insights"
      sidebar={adminSidebar}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="section-statistics">
            <Card className="border-sage/20" data-testid="card-total-responses">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-forest/70">Total Responses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-forest" data-testid="stat-total-responses">
                  {stats.total}
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-sage/20" data-testid="card-authenticated">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-forest/70">Authenticated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-forest" data-testid="stat-authenticated">
                  {stats.authenticated}
                </div>
                <p className="text-xs text-forest/60">
                  {stats.total > 0 ? Math.round((stats.authenticated / stats.total) * 100) : 0}% of total
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-sage/20" data-testid="card-anonymous">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-forest/70">Anonymous</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-forest" data-testid="stat-anonymous">
                  {stats.anonymous}
                </div>
                <p className="text-xs text-forest/60">
                  {stats.total > 0 ? Math.round((stats.anonymous / stats.total) * 100) : 0}% of total
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-sage/20" data-testid="card-most-common">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-forest/70">Most Common Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-bold text-forest" data-testid="stat-most-common">
                  {Object.entries(stats.byType).sort(([,a], [,b]) => b - a)[0]?.[0] || "None"}
                </div>
                <p className="text-xs text-forest/60">
                  {Object.entries(stats.byType).sort(([,a], [,b]) => b - a)[0]?.[1] || 0} responses
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="border-sage/20" data-testid="card-filters">
          <CardHeader>
            <CardTitle className="flex items-center text-forest">
              <Filter className="w-4 h-4 mr-2" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-forest mb-2 block">Identity Type</label>
                <Select value={filterIdentityType} onValueChange={setFilterIdentityType}>
                  <SelectTrigger data-testid="filter-identity-type">
                    <SelectValue placeholder="All identity types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Identity Types</SelectItem>
                    {Object.entries(IDENTITY_TYPE_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-forest mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-forest/40 w-4 h-4" />
                  <Input
                    placeholder="Search country, currency, age..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                    data-testid="input-search"
                  />
                </div>
              </div>
              
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setFilterIdentityType("all");
                    setSearchTerm("");
                    setCurrentPage(1);
                  }}
                  data-testid="button-clear-filters"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="border-sage/20" data-testid="card-results">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-forest">
              <div className="flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Survey Responses
              </div>
              <div className="text-sm font-normal text-forest/60">
                Showing {paginatedSurveys.length} of {filteredSurveys.length} results
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : filteredSurveys.length === 0 ? (
              <div className="text-center py-8 text-forest/60" data-testid="message-no-results">
                <FileText className="w-12 h-12 mx-auto mb-4 text-forest/30" />
                <p>No survey responses found matching your filters.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <Table data-testid="table-survey-responses">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10"></TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Identity Type</TableHead>
                      <TableHead>Demographics</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedSurveys.map((survey) => (
                      <Collapsible key={survey.id} asChild>
                        <>
                          <TableRow 
                            className="cursor-pointer hover:bg-sage/5"
                            data-testid={`row-survey-${survey.id}`}
                          >
                            <TableCell>
                              <CollapsibleTrigger 
                                onClick={() => toggleRowExpansion(survey.id)}
                                data-testid={`button-expand-${survey.id}`}
                              >
                                {expandedRows.has(survey.id) ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                              </CollapsibleTrigger>
                            </TableCell>
                            <TableCell data-testid={`cell-date-${survey.id}`}>
                              <div className="text-sm">
                                {survey.createdAt ? format(new Date(survey.createdAt), "MMM dd, yyyy") : "Unknown"}
                              </div>
                              <div className="text-xs text-forest/60">
                                {survey.createdAt ? format(new Date(survey.createdAt), "HH:mm") : ""}
                              </div>
                            </TableCell>
                            <TableCell data-testid={`cell-identity-${survey.id}`}>
                              <Badge 
                                className={`${IDENTITY_TYPE_COLORS[survey.identityType]} text-xs`}
                                data-testid={`badge-identity-${survey.identityType}`}
                              >
                                {IDENTITY_TYPE_LABELS[survey.identityType]}
                              </Badge>
                            </TableCell>
                            <TableCell data-testid={`cell-demographics-${survey.id}`}>
                              <div className="text-sm">
                                {survey.ageRange && (
                                  <div data-testid={`text-age-${survey.id}`}>Age: {survey.ageRange}</div>
                                )}
                                {survey.countryOfResidence && (
                                  <div className="text-xs text-forest/60" data-testid={`text-country-${survey.id}`}>{survey.countryOfResidence}</div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell data-testid={`cell-status-${survey.id}`}>
                              <Badge 
                                variant={survey.userId ? "default" : "secondary"}
                                className="text-xs"
                                data-testid={`badge-status-${survey.userId ? 'authenticated' : 'anonymous'}`}
                              >
                                {survey.userId ? "Authenticated" : "Anonymous"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                          <CollapsibleContent asChild>
                            <TableRow>
                              <TableCell colSpan={5} className="p-0" data-testid={`detail-view-${survey.id}`}>
                                {renderDetailedView(survey)}
                              </TableCell>
                            </TableRow>
                          </CollapsibleContent>
                        </>
                      </Collapsible>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-6" data-testid="pagination-controls">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                      disabled={currentPage === 1}
                      data-testid="button-prev-page"
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-forest/60" data-testid="text-pagination">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                      disabled={currentPage === totalPages}
                      data-testid="button-next-page"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}