import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation, useRoute } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  ArrowLeft,
  Search,
  Filter,
  Eye,
  Shield,
  AlertTriangle,
  BarChart3,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  UserCheck,
  FileText,
  ChevronRight,
} from "lucide-react";

// ── Types ───────────────────────────────────────────────────────────────────

type ApplicationStatus =
  | "SUBMITTED"
  | "REVIEW_IN_PROGRESS"
  | "INTERVIEW_SCHEDULED"
  | "DECISION_PENDING"
  | "ACCEPTED"
  | "PAUSED"
  | "DECLINED";

type MaiaLabel = "GREEN" | "YELLOW" | "RED";
type RiskLevel = "NONE" | "LOW" | "MEDIUM" | "HIGH";
type EthicsSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

interface MockApplication {
  id: string;
  name: string;
  email: string;
  submittedAt: string;
  status: ApplicationStatus;
  maiaLabel: MaiaLabel;
  riskLevel: RiskLevel;
  reviewer: string | null;
  lastActivity: string;
  archetype: string;
  location: string;
  score: number | null;
}

// ── Mock data ───────────────────────────────────────────────────────────────
const mockApplications: MockApplication[] = [
  {
    id: "app-001",
    name: "Maya Gonzalez",
    email: "maya@example.com",
    submittedAt: "2026-02-15",
    status: "REVIEW_IN_PROGRESS",
    maiaLabel: "GREEN",
    riskLevel: "NONE",
    reviewer: "Cynthia",
    lastActivity: "2 hours ago",
    archetype: "butterfly",
    location: "Costa Rica",
    score: 87,
  },
  {
    id: "app-002",
    name: "James Blackwood",
    email: "james@example.com",
    submittedAt: "2026-02-14",
    status: "INTERVIEW_SCHEDULED",
    maiaLabel: "YELLOW",
    riskLevel: "MEDIUM",
    reviewer: "Cynthia",
    lastActivity: "1 day ago",
    archetype: "beetle",
    location: "London, UK",
    score: 64,
  },
  {
    id: "app-003",
    name: "Ananda Patel",
    email: "ananda@example.com",
    submittedAt: "2026-02-13",
    status: "SUBMITTED",
    maiaLabel: "GREEN",
    riskLevel: "LOW",
    reviewer: null,
    lastActivity: "3 days ago",
    archetype: "hummingbird",
    location: "Mumbai, India",
    score: null,
  },
  {
    id: "app-004",
    name: "Sarah Winters",
    email: "sarah@example.com",
    submittedAt: "2026-02-10",
    status: "DECISION_PENDING",
    maiaLabel: "RED",
    riskLevel: "HIGH",
    reviewer: "Cynthia",
    lastActivity: "5 days ago",
    archetype: "bee",
    location: "Austin, TX",
    score: 42,
  },
];

// ── Helper components ───────────────────────────────────────────────────────

function MaiaLabelBadge({ label }: { label: MaiaLabel }) {
  const styles: Record<MaiaLabel, string> = {
    GREEN: "bg-green-100 text-green-800 border-green-200",
    YELLOW: "bg-yellow-100 text-yellow-800 border-yellow-200",
    RED: "bg-red-100 text-red-800 border-red-200",
  };
  return (
    <Badge className={`text-[10px] border ${styles[label]}`}>{label}</Badge>
  );
}

function RiskBadge({ level }: { level: RiskLevel }) {
  const styles: Record<RiskLevel, string> = {
    NONE: "bg-gray-50 text-gray-500 border-gray-200",
    LOW: "bg-blue-50 text-blue-700 border-blue-200",
    MEDIUM: "bg-orange-50 text-orange-700 border-orange-200",
    HIGH: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <Badge className={`text-[10px] border ${styles[level]}`}>{level}</Badge>
  );
}

function StatusBadge({ status }: { status: ApplicationStatus }) {
  const labels: Record<ApplicationStatus, string> = {
    SUBMITTED: "Submitted",
    REVIEW_IN_PROGRESS: "In Review",
    INTERVIEW_SCHEDULED: "Interview",
    DECISION_PENDING: "Decision",
    ACCEPTED: "Accepted",
    PAUSED: "Paused",
    DECLINED: "Declined",
  };
  const colors: Record<ApplicationStatus, string> = {
    SUBMITTED: "bg-blue-50 text-blue-700 border-blue-200",
    REVIEW_IN_PROGRESS: "bg-purple-50 text-purple-700 border-purple-200",
    INTERVIEW_SCHEDULED: "bg-amber-50 text-amber-700 border-amber-200",
    DECISION_PENDING: "bg-orange-50 text-orange-700 border-orange-200",
    ACCEPTED: "bg-green-50 text-green-700 border-green-200",
    PAUSED: "bg-gray-50 text-gray-600 border-gray-200",
    DECLINED: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <Badge className={`text-[10px] border ${colors[status]}`}>
      {labels[status]}
    </Badge>
  );
}

// ── Scoring rubric dimensions ───────────────────────────────────────────────
const SCORE_DIMENSIONS = [
  { id: "clarity", label: "Clarity", description: "Can a client understand what they offer?" },
  { id: "scope", label: "Scope & Boundaries", description: "Clear limits, consent, no overreach" },
  { id: "integrity", label: "Integrity of Claims", description: "No guarantees or prohibited claims" },
  { id: "structure", label: "Offer Structure", description: "Offerings coherent, pricing clear" },
  { id: "tone", label: "Tone & Care", description: "Non-coercive, respectful language" },
  { id: "fit", label: "FloreSer Fit", description: "Alignment with ecosystem values" },
];

// ── Ethics flag types ───────────────────────────────────────────────────────
const ETHICS_FLAG_TYPES = [
  "CONSENT_LANGUAGE_MISSING",
  "SCOPE_OF_PRACTICE_UNCLEAR",
  "COERCIVE_OR_PRESSURE_LANGUAGE",
  "CONFIDENTIALITY_MISREPRESENTED",
  "BOUNDARY_RISK",
  "PROHIBITED_CLAIMS",
  "MINOR_SAFETY_CONCERN",
  "MAJOR_SAFETY_CONCERN",
];

// ── Interview questions ─────────────────────────────────────────────────────
const INTERVIEW_QUESTIONS = [
  { section: "A", label: "Presence & Approach", questions: [
    "In 2-3 minutes, how would you describe the space you hold for clients?",
    "What kinds of intentions or situations are a good fit for your work?",
    "What is not a good fit -- where do you refer out or decline?",
  ]},
  { section: "B", label: "Consent & Boundaries", questions: [
    "How do you explain consent and choice during a session?",
    "How do you handle a client who asks you for guarantees or specific outcomes?",
    "What boundaries do you hold around messaging between sessions?",
  ]},
  { section: "C", label: "Safety & Scope", questions: [
    "How do you respond if a client shares something intense that is outside your scope?",
    "What is your approach to collaborating with professional support when relevant?",
  ]},
  { section: "D", label: "Practical Operations", questions: [
    "What is your cancellation / rescheduling approach?",
    "How do you prepare clients before sessions?",
  ]},
  { section: "E", label: "FloreSer Alignment", questions: [
    "What does integrity in facilitation mean to you?",
    "How would you like to contribute to the ecosystem beyond 1:1 sessions?",
  ]},
];

// ── Applications List View ──────────────────────────────────────────────────

function ApplicationsList() {
  const [, setLocation] = useLocation();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = mockApplications.filter((app) => {
    if (statusFilter !== "all" && app.status !== statusFilter) return false;
    if (searchQuery && !app.name.toLowerCase().includes(searchQuery.toLowerCase()))
      return false;
    return true;
  });

  return (
    <div>
      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 bg-white">
            <Filter className="w-4 h-4 mr-2 text-gray-400" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="SUBMITTED">Submitted</SelectItem>
            <SelectItem value="REVIEW_IN_PROGRESS">In Review</SelectItem>
            <SelectItem value="INTERVIEW_SCHEDULED">Interview</SelectItem>
            <SelectItem value="DECISION_PENDING">Decision</SelectItem>
            <SelectItem value="ACCEPTED">Accepted</SelectItem>
            <SelectItem value="PAUSED">Paused</SelectItem>
            <SelectItem value="DECLINED">Declined</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50/80">
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Applicant
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Submitted
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  mAIa
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Risk
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Score
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Reviewer
                </th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <tr
                  key={app.id}
                  className="border-b last:border-b-0 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{app.name}</p>
                      <p className="text-xs text-gray-500">{app.location}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {app.submittedAt}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-4 py-3">
                    <MaiaLabelBadge label={app.maiaLabel} />
                  </td>
                  <td className="px-4 py-3">
                    <RiskBadge level={app.riskLevel} />
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {app.score !== null ? `${app.score}/100` : "--"}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {app.reviewer || (
                      <span className="text-gray-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setLocation(`/admin/applications/${app.id}`)
                      }
                      className="text-xs"
                    >
                      Review
                      <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-gray-400"
                  >
                    No applications match your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Application Detail View ─────────────────────────────────────────────────

function ApplicationDetail({ id }: { id: string }) {
  const [, setLocation] = useLocation();
  const app = mockApplications.find((a) => a.id === id);
  const [activePanel, setActivePanel] = useState("snapshot");

  if (!app) {
    return (
      <div className="text-center py-12 text-gray-500">
        Application not found
      </div>
    );
  }

  const panels = [
    { id: "snapshot", label: "Snapshot", icon: Eye },
    { id: "application", label: "Application", icon: FileText },
    { id: "prescreen", label: "mAIa Pre-screen", icon: Sparkles },
    { id: "score", label: "Internal Score", icon: BarChart3 },
    { id: "ethics", label: "Ethics Flags", icon: Shield },
    { id: "risk", label: "Risk Markers", icon: AlertTriangle },
    { id: "interview", label: "Interview", icon: MessageSquare },
    { id: "decision", label: "Decision", icon: CheckCircle2 },
  ];

  return (
    <div>
      {/* Back button + header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/admin/applications")}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900">{app.name}</h2>
            <StatusBadge status={app.status} />
            <MaiaLabelBadge label={app.maiaLabel} />
            <RiskBadge level={app.riskLevel} />
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            {app.email} -- {app.location} -- Submitted {app.submittedAt}
          </p>
        </div>
      </div>

      {/* Panel tabs */}
      <div className="flex items-center gap-1 mb-5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {panels.map((panel) => {
          const isActive = activePanel === panel.id;
          const Icon = panel.icon;
          return (
            <button
              key={panel.id}
              onClick={() => setActivePanel(panel.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-forest text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {panel.label}
            </button>
          );
        })}
      </div>

      {/* Panel content */}
      <Card className="border-gray-200">
        <CardContent className="p-6">
          {activePanel === "snapshot" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Applicant Snapshot</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm"><span className="text-gray-500">Name:</span> {app.name}</p>
                  <p className="text-sm"><span className="text-gray-500">Email:</span> {app.email}</p>
                  <p className="text-sm"><span className="text-gray-500">Location:</span> {app.location}</p>
                  <p className="text-sm"><span className="text-gray-500">Archetype:</span> {app.archetype}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm"><span className="text-gray-500">Reviewer:</span> {app.reviewer || "Unassigned"}</p>
                  <p className="text-sm"><span className="text-gray-500">Last Activity:</span> {app.lastActivity}</p>
                  <p className="text-sm"><span className="text-gray-500">Score:</span> {app.score !== null ? `${app.score}/100` : "Not scored"}</p>
                </div>
              </div>
            </div>
          )}

          {activePanel === "application" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Submitted Application</h3>
              <p className="text-sm text-gray-500">Read-only view of submitted answers.</p>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 space-y-3">
                <div className="border-b border-gray-200 pb-2">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Bio / Story</p>
                  <p className="text-sm text-gray-700 mt-1 italic">Application data will appear here once the backend is connected.</p>
                </div>
                <div className="border-b border-gray-200 pb-2">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Certifications</p>
                  <p className="text-sm text-gray-500 italic">--</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Offerings</p>
                  <p className="text-sm text-gray-500 italic">--</p>
                </div>
              </div>
            </div>
          )}

          {activePanel === "prescreen" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">mAIa Pre-screen</h3>
                <MaiaLabelBadge label={app.maiaLabel} />
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 space-y-3">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Recommended Next Step</p>
                  <Badge className="bg-purple-50 text-purple-700 border border-purple-200 text-xs">
                    STANDARD_REVIEW
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Summary</p>
                  <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                    <li>All required fields complete</li>
                    <li>Scope of practice clearly defined</li>
                    <li>No prohibited claims detected</li>
                    <li>Consent language present in offerings</li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Missing Fields</p>
                  <p className="text-sm text-gray-500 italic">None</p>
                </div>
              </div>
            </div>
          )}

          {activePanel === "score" && (
            <div className="space-y-5">
              <h3 className="font-semibold text-gray-900">Internal Scoring</h3>
              <p className="text-xs text-gray-500">Rate each dimension 0-5. Total converts to 0-100 scale.</p>
              <div className="space-y-4">
                {SCORE_DIMENSIONS.map((dim) => (
                  <div key={dim.id} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-gray-700">
                        {dim.label}
                      </Label>
                      <span className="text-xs text-gray-400">0-5</span>
                    </div>
                    <p className="text-[11px] text-gray-400">{dim.description}</p>
                    <Slider defaultValue={[3]} max={5} step={1} className="py-1" />
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Total Score
                </span>
                <span className="text-lg font-bold text-forest">
                  {app.score !== null ? `${app.score}/100` : "--"}
                </span>
              </div>
            </div>
          )}

          {activePanel === "ethics" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Ethics Flags</h3>
                <Button variant="outline" size="sm" className="text-xs">
                  <Shield className="w-3.5 h-3.5 mr-1" />
                  Add Flag
                </Button>
              </div>
              {app.riskLevel === "NONE" || app.riskLevel === "LOW" ? (
                <div className="text-center py-8 text-gray-400">
                  <Shield className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No ethics flags raised</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center justify-between mb-1">
                      <Badge className="text-[10px] bg-yellow-100 text-yellow-800 border border-yellow-300">
                        SCOPE_OF_PRACTICE_UNCLEAR
                      </Badge>
                      <Badge className="text-[10px] bg-orange-100 text-orange-700 border border-orange-200">
                        MEDIUM
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">
                      Scope description is broad and could imply medical practice.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Status: OPEN
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activePanel === "risk" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Risk Markers</h3>
                <Button variant="outline" size="sm" className="text-xs">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                  Add Marker
                </Button>
              </div>
              {app.riskLevel === "NONE" ? (
                <div className="text-center py-8 text-gray-400">
                  <AlertTriangle className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No risk markers</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center justify-between mb-1">
                      <Badge className="text-[10px] bg-orange-100 text-orange-800 border border-orange-300">
                        SCOPE_DRIFT_RISK
                      </Badge>
                      <RiskBadge level={app.riskLevel} />
                    </div>
                    <p className="text-sm text-gray-700 mt-1">
                      Broad scope could lead to scope drift over time.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Confidence: 0.7 -- Status: OPEN
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activePanel === "interview" && (
            <div className="space-y-5">
              <h3 className="font-semibold text-gray-900">Interview Workspace</h3>
              <p className="text-xs text-gray-500">
                12 structured questions across 5 sections. Record responses during the live conversation.
              </p>
              <div className="space-y-6">
                {INTERVIEW_QUESTIONS.map((section) => (
                  <div key={section.section}>
                    <h4 className="text-sm font-medium text-gray-800 mb-3">
                      Section {section.section}: {section.label}
                    </h4>
                    <div className="space-y-3">
                      {section.questions.map((q, i) => (
                        <div key={i} className="space-y-1.5">
                          <p className="text-sm text-gray-700">
                            {i + 1}. {q}
                          </p>
                          <Textarea
                            placeholder="Record response..."
                            rows={2}
                            className="text-sm resize-none bg-gray-50 border-gray-200"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t border-gray-200">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Recommendation
                  </Label>
                  <Select>
                    <SelectTrigger className="w-64 bg-white">
                      <SelectValue placeholder="Select recommendation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACCEPT_TRIAL">Accept (Trial)</SelectItem>
                      <SelectItem value="ACCEPT_ACTIVE">Accept (Active)</SelectItem>
                      <SelectItem value="PAUSE">Pause</SelectItem>
                      <SelectItem value="DECLINE">Decline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {activePanel === "decision" && (
            <div className="space-y-5">
              <h3 className="font-semibold text-gray-900">Decision</h3>
              <p className="text-xs text-gray-500">
                Required: mAIa pre-screen, SUMMARY note, internal score, all ethics flags resolved.
              </p>

              {/* Checklist */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-gray-700">mAIa pre-screen completed</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">SUMMARY note pending</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {app.score !== null ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <Clock className="w-4 h-4 text-gray-400" />
                  )}
                  <span className={app.score !== null ? "text-gray-700" : "text-gray-500"}>
                    Internal score {app.score !== null ? "set" : "pending"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-gray-700">Ethics flags resolved</span>
                </div>
              </div>

              {/* Decision buttons */}
              <div className="flex flex-wrap gap-3 pt-4">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <UserCheck className="w-4 h-4 mr-1.5" />
                  Accept (Trial)
                </Button>
                <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
                  <UserCheck className="w-4 h-4 mr-1.5" />
                  Accept (Active)
                </Button>
                <Button variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50">
                  <Clock className="w-4 h-4 mr-1.5" />
                  Pause
                </Button>
                <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                  <XCircle className="w-4 h-4 mr-1.5" />
                  Decline
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ── Main Component (routes between list and detail) ─────────────────────────
export default function AdminApplications() {
  const [matchDetail, params] = useRoute("/admin/applications/:id");

  useEffect(() => {
    document.title = "Vetting Console - FloreSer Admin";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!matchDetail && (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Vetting Console
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Review and manage facilitator applications
              </p>
            </div>
            <ApplicationsList />
          </>
        )}

        {matchDetail && params?.id && (
          <ApplicationDetail id={params.id} />
        )}
      </main>

      <Footer />
    </div>
  );
}
