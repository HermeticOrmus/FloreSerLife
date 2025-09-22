import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Heart,
  MessageSquare,
  Calendar,
  Star,
  FileText,
  Coins,
  Eye,
  Shield,
  Database
} from "lucide-react";

interface AdminOverview {
  totalUsers: number;
  totalPractitioners: number;
  totalClients: number;
  totalSessions: number;
  totalReviews: number;
  totalSurveyResponses: number;
  totalGardenContent: number;
  totalSeedsTransactions: number;
}

export default function AdminDashboard() {
  const [accessCode, setAccessCode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState("");

  useEffect(() => {
    document.title = "Admin Dashboard - FloreSer";
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessCode }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        setAdminToken(accessCode);
        // Store in sessionStorage for this session
        sessionStorage.setItem('adminToken', accessCode);
      } else {
        alert('Invalid access code');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed');
    }
  };

  // Check for existing admin token on component mount
  useEffect(() => {
    const storedToken = sessionStorage.getItem('adminToken');
    if (storedToken) {
      setAdminToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const { data: overview } = useQuery<AdminOverview>({
    queryKey: ["/api/admin/overview"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const response = await fetch('/api/admin/overview', {
        headers: {
          'X-Admin-Access': adminToken,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch overview');
      }
      return response.json();
    },
  });

  const { data: users } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const response = await fetch('/api/admin/users', {
        headers: {
          'X-Admin-Access': adminToken,
        },
      });
      return response.json();
    },
  });

  const { data: practitioners } = useQuery({
    queryKey: ["/api/admin/practitioners"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const response = await fetch('/api/admin/practitioners', {
        headers: {
          'X-Admin-Access': adminToken,
        },
      });
      return response.json();
    },
  });

  const { data: sessions } = useQuery({
    queryKey: ["/api/admin/sessions"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const response = await fetch('/api/admin/sessions', {
        headers: {
          'X-Admin-Access': adminToken,
        },
      });
      return response.json();
    },
  });

  const { data: gardenContent } = useQuery({
    queryKey: ["/api/admin/garden-content"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const response = await fetch('/api/admin/garden-content', {
        headers: {
          'X-Admin-Access': adminToken,
        },
      });
      return response.json();
    },
  });

  const { data: seedsData } = useQuery({
    queryKey: ["/api/admin/seeds-overview"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const response = await fetch('/api/admin/seeds-overview', {
        headers: {
          'X-Admin-Access': adminToken,
        },
      });
      return response.json();
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-gold" />
              <span>Admin Access</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Enter admin access code"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <Button onClick={handleLogin} className="w-full bg-gold text-white hover:bg-gold/90">
              Access Admin Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl lg:text-4xl font-bold text-forest mb-2">
              Admin Dashboard
            </h1>
            <p className="text-forest/70">
              Development oversight for FloreSer platform
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setIsAuthenticated(false);
              sessionStorage.removeItem('adminToken');
            }}
          >
            Logout
          </Button>
        </div>

        {/* Overview Stats */}
        {overview && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="border-sage/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-gold" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-forest">{overview.totalUsers}</div>
              </CardContent>
            </Card>

            <Card className="border-sage/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Practitioners</CardTitle>
                <Heart className="h-4 w-4 text-gold" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-forest">{overview.totalPractitioners}</div>
              </CardContent>
            </Card>

            <Card className="border-sage/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sessions</CardTitle>
                <Calendar className="h-4 w-4 text-gold" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-forest">{overview.totalSessions}</div>
              </CardContent>
            </Card>

            <Card className="border-sage/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Garden Content</CardTitle>
                <FileText className="h-4 w-4 text-gold" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-forest">{overview.totalGardenContent}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Detailed Data Tabs */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="practitioners">Practitioners</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="garden">Garden</TabsTrigger>
            <TabsTrigger value="seeds">Seeds</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users?.slice(0, 10).map((user: any) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border border-sage/20 rounded-lg">
                      <div>
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-forest/60">{user.email}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={user.isEmailVerified ? "default" : "secondary"}>
                          {user.isEmailVerified ? "Verified" : "Unverified"}
                        </Badge>
                        <p className="text-sm text-forest/60 mt-1">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="practitioners" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Practitioners Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {practitioners?.slice(0, 10).map((practitioner: any) => (
                    <div key={practitioner.id} className="flex items-center justify-between p-4 border border-sage/20 rounded-lg">
                      <div>
                        <p className="font-medium">{practitioner.userName}</p>
                        <p className="text-sm text-forest/60">{practitioner.userEmail}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{practitioner.archetype}</Badge>
                          <Badge variant="secondary">{practitioner.experienceLevel}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={practitioner.isVerified ? "default" : "secondary"}>
                          {practitioner.isVerified ? "Verified" : "Pending"}
                        </Badge>
                        <p className="text-sm text-forest/60 mt-1">
                          {practitioner.totalSessions || 0} sessions
                        </p>
                        {practitioner.averageRating && (
                          <p className="text-sm text-forest/60">
                            ⭐ {parseFloat(practitioner.averageRating).toFixed(1)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessions?.slice(0, 10).map((session: any) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border border-sage/20 rounded-lg">
                      <div>
                        <p className="font-medium">
                          {new Date(session.scheduledDatetime).toLocaleDateString()} at{' '}
                          {new Date(session.scheduledDatetime).toLocaleTimeString()}
                        </p>
                        <p className="text-sm text-forest/60">
                          Client: {session.clientEmail}
                        </p>
                        <p className="text-sm text-forest/60">
                          Practitioner: {session.practitionerEmail}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            session.status === 'completed' ? 'default' :
                            session.status === 'scheduled' ? 'secondary' : 'outline'
                          }
                        >
                          {session.status}
                        </Badge>
                        <p className="text-sm text-forest/60 mt-1">
                          ${session.totalAmount} • {session.duration}min
                        </p>
                        <p className="text-sm text-forest/60">
                          {session.isVirtual ? 'Virtual' : 'In-Person'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="garden" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Community Garden Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gardenContent?.slice(0, 10).map((content: any) => (
                    <div key={content.id} className="flex items-center justify-between p-4 border border-sage/20 rounded-lg">
                      <div>
                        <p className="font-medium">{content.title}</p>
                        <p className="text-sm text-forest/60">{content.description}</p>
                        <p className="text-sm text-forest/60">
                          By: {content.authorName} ({content.authorEmail})
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline">{content.contentType}</Badge>
                          <Badge
                            variant={
                              content.status === 'approved' ? 'default' :
                              content.status === 'pending' ? 'secondary' : 'outline'
                            }
                          >
                            {content.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-forest/60">
                          <span className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {content.viewCount}
                          </span>
                          <span className="flex items-center">
                            <Star className="w-3 h-3 mr-1" />
                            {content.likeCount}
                          </span>
                          <span className="flex items-center">
                            <Coins className="w-3 h-3 mr-1" />
                            {content.seedsReward}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seeds" className="space-y-4">
            {seedsData && (
              <>
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <Card className="border-sage/20">
                    <CardHeader>
                      <CardTitle className="text-sm">Total Seeds Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-forest">
                        {seedsData.totals?.totalBalance || 0}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-sage/20">
                    <CardHeader>
                      <CardTitle className="text-sm">Total Earned</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-forest">
                        {seedsData.totals?.totalEarned || 0}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-sage/20">
                    <CardHeader>
                      <CardTitle className="text-sm">Total Spent</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-forest">
                        {seedsData.totals?.totalSpent || 0}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Seeds Earners</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {seedsData.wallets?.slice(0, 10).map((wallet: any) => (
                        <div key={wallet.userId} className="flex items-center justify-between p-4 border border-sage/20 rounded-lg">
                          <div>
                            <p className="font-medium">{wallet.userName}</p>
                            <p className="text-sm text-forest/60">{wallet.userEmail}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline">{wallet.currentTier}</Badge>
                            <div className="mt-1 space-y-1">
                              <p className="text-sm text-forest/60">
                                Balance: {wallet.seedsBalance} seeds
                              </p>
                              <p className="text-sm text-forest/60">
                                Earned: {wallet.totalEarned} seeds
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <EmailTestingPanel adminToken={adminToken} />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}

// Email Testing Component
function EmailTestingPanel({ adminToken }: { adminToken: string }) {
  const [testEmail, setTestEmail] = useState("");
  const [emailType, setEmailType] = useState("welcome");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const sendTestEmail = async () => {
    if (!testEmail) return;

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/send-test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Access': adminToken,
        },
        body: JSON.stringify({
          email: testEmail,
          type: emailType,
          data: {
            name: 'Test User',
            code: 'TEST-CODE-123',
            inviteCode: 'ALPHA-TEST-456',
            date: 'December 25, 2024',
            time: '2:00 PM',
            practitionerName: 'Dr. Sample Practitioner',
            clientName: 'Test Client',
            isVirtual: true,
            meetingLink: 'https://meet.example.com/test-session'
          }
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, message: 'Failed to send test email' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5" />
          <span>Email Testing & Management</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Test Email Address</label>
            <Input
              type="email"
              placeholder="test@example.com"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email Type</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={emailType}
              onChange={(e) => setEmailType(e.target.value)}
            >
              <option value="welcome">Welcome Email</option>
              <option value="survey-thank-you">Survey Thank You</option>
              <option value="alpha-invitation">Alpha Invitation</option>
              <option value="session-confirmation">Session Confirmation</option>
              <option value="session-reminder">Session Reminder</option>
            </select>
          </div>
        </div>

        <Button
          onClick={sendTestEmail}
          disabled={!testEmail || isLoading}
          className="bg-gold text-white hover:bg-gold/90"
        >
          {isLoading ? 'Sending...' : 'Send Test Email'}
        </Button>

        {result && (
          <div className={`p-4 rounded-lg ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center space-x-2">
              {result.success ? (
                <span className="text-green-600">✅</span>
              ) : (
                <span className="text-red-600">❌</span>
              )}
              <span className={result.success ? 'text-green-800' : 'text-red-800'}>
                {result.message}
              </span>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Email Infrastructure Status</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Development Mode</Badge>
              <span>Emails are logged to console (not sent)</span>
            </div>
            <div className="text-gray-600">
              To enable real email sending:
              <ol className="list-decimal list-inside mt-1 space-y-1">
                <li>Configure SMTP settings in environment variables</li>
                <li>Install nodemailer package</li>
                <li>Update emailTransporter.ts to use real nodemailer</li>
              </ol>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}