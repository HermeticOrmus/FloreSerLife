import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Crown,
  Star,
  Zap,
  Lock,
  Eye,
  MessageCircle,
  Calendar,
  Sparkles,
  Upgrade,
  CheckCircle,
  X
} from "lucide-react";

// Access control types
export interface AccessInfo {
  accessLevel: "preview" | "basic" | "premium" | "unlimited";
  subscriptionStatus: "free" | "trial" | "premium" | "cancelled" | "expired";
  permissions: any;
}

export interface UsageInfo {
  allowed: boolean;
  limit?: number;
  used?: number;
  message?: string;
}

// Access level definitions
const ACCESS_LEVELS = {
  preview: {
    name: "Preview",
    color: "bg-gray-100 text-gray-600",
    icon: Eye,
    description: "Explore platform features"
  },
  basic: {
    name: "Basic",
    color: "bg-blue-100 text-blue-600",
    icon: Star,
    description: "Essential features"
  },
  premium: {
    name: "Premium",
    color: "bg-gold/20 text-gold",
    icon: Crown,
    description: "Full platform experience"
  },
  unlimited: {
    name: "Unlimited",
    color: "bg-purple-100 text-purple-600",
    icon: Sparkles,
    description: "All features + exclusive benefits"
  }
};

// Access level badge component
export function AccessLevelBadge({ accessLevel }: { accessLevel: string }) {
  const level = ACCESS_LEVELS[accessLevel as keyof typeof ACCESS_LEVELS] || ACCESS_LEVELS.preview;
  const IconComponent = level.icon;

  return (
    <Badge className={level.color}>
      <IconComponent className="w-3 h-3 mr-1" />
      {level.name}
    </Badge>
  );
}

// Usage limit progress bar
export function UsageProgress({ used = 0, limit = 0, label }: { used?: number; limit?: number; label: string }) {
  if (limit === 0) return null;

  const percentage = Math.min((used / limit) * 100, 100);
  const isNearLimit = percentage > 80;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-forest/70">{label}</span>
        <span className={`font-medium ${isNearLimit ? 'text-red-600' : 'text-forest'}`}>
          {used} / {limit}
        </span>
      </div>
      <Progress
        value={percentage}
        className={`h-2 ${isNearLimit ? 'bg-red-100' : 'bg-sage/20'}`}
      />
      {isNearLimit && (
        <p className="text-xs text-red-600">
          You're close to your limit. Consider upgrading for unlimited access.
        </p>
      )}
    </div>
  );
}

// Access denied component
export function AccessDenied({
  message,
  currentLevel,
  requiredLevel,
  onUpgrade
}: {
  message: string;
  currentLevel: string;
  requiredLevel: string;
  onUpgrade?: () => void;
}) {
  return (
    <Alert className="border-red-200 bg-red-50">
      <Lock className="h-4 w-4 text-red-600" />
      <AlertDescription className="text-red-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium mb-1">{message}</p>
            <p className="text-sm">
              Your current access: <AccessLevelBadge accessLevel={currentLevel} />
              {" • "}Required: <AccessLevelBadge accessLevel={requiredLevel.toLowerCase()} />
            </p>
          </div>
          {onUpgrade && (
            <Button
              size="sm"
              className="bg-gold text-white hover:bg-gold/90"
              onClick={onUpgrade}
            >
              <Upgrade className="w-3 h-3 mr-1" />
              Upgrade
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}

// Upgrade modal component
export function UpgradeModal({
  isOpen,
  onClose,
  currentLevel = "preview",
  feature
}: {
  isOpen: boolean;
  onClose: () => void;
  currentLevel?: string;
  feature?: string;
}) {
  const [selectedPlan, setSelectedPlan] = useState("basic");

  const plans = {
    basic: {
      name: "Basic Access",
      price: "$9.99/month",
      features: [
        "View up to 10 practitioners",
        "Book 1 session per month",
        "Message practitioners",
        "Read-only garden access",
        "Full profile viewing"
      ],
      popular: false
    },
    premium: {
      name: "Premium Access",
      price: "$19.99/month",
      features: [
        "Unlimited practitioner viewing",
        "Unlimited session booking",
        "Full garden access",
        "Create content",
        "Priority support",
        "Advanced matching"
      ],
      popular: true
    },
    unlimited: {
      name: "Unlimited Access",
      price: "$39.99/month",
      features: [
        "All Premium features",
        "Early access to new features",
        "1-on-1 support",
        "Custom practitioner recommendations",
        "Exclusive community access",
        "Lifetime founder benefits"
      ],
      popular: false
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Crown className="w-5 h-5 text-gold" />
            <span>Upgrade Your Access</span>
          </DialogTitle>
        </DialogHeader>

        {feature && (
          <Alert className="border-gold/30 bg-gold/5">
            <Sparkles className="h-4 w-4 text-gold" />
            <AlertDescription className="text-forest">
              <strong>Unlock {feature}</strong> and discover the full potential of FloreSer's wellness platform.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-3 gap-6 my-6">
          {Object.entries(plans).map(([key, plan]) => (
            <Card
              key={key}
              className={`cursor-pointer transition-all ${
                selectedPlan === key
                  ? 'ring-2 ring-gold border-gold'
                  : 'border-sage/20 hover:border-sage/40'
              } ${plan.popular ? 'relative' : ''}`}
              onClick={() => setSelectedPlan(key)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gold text-white">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <div className="text-2xl font-bold text-gold">{plan.price}</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Maybe Later
          </Button>

          <div className="space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                // Start free trial logic
                console.log("Starting free trial...");
                onClose();
              }}
            >
              Start 7-Day Free Trial
            </Button>
            <Button
              className="bg-gold text-white hover:bg-gold/90"
              onClick={() => {
                // Upgrade logic
                console.log("Upgrading to:", selectedPlan);
                onClose();
              }}
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Feature preview overlay
export function FeaturePreview({
  children,
  isAllowed,
  message,
  currentLevel,
  requiredLevel,
  feature
}: {
  children: React.ReactNode;
  isAllowed: boolean;
  message?: string;
  currentLevel?: string;
  requiredLevel?: string;
  feature?: string;
}) {
  const [showUpgrade, setShowUpgrade] = useState(false);

  if (isAllowed) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>

      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
        <Card className="max-w-sm text-center border-gold/30 shadow-lg">
          <CardContent className="p-6">
            <Lock className="w-12 h-12 text-gold mx-auto mb-3" />
            <h3 className="font-heading text-lg font-semibold text-forest mb-2">
              Premium Feature
            </h3>
            <p className="text-sm text-forest/70 mb-4">
              {message || `This feature requires ${requiredLevel} access`}
            </p>
            <Button
              className="bg-gold text-white hover:bg-gold/90"
              onClick={() => setShowUpgrade(true)}
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade Access
            </Button>
          </CardContent>
        </Card>
      </div>

      <UpgradeModal
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        currentLevel={currentLevel}
        feature={feature}
      />
    </div>
  );
}

// Access control context hook (simplified version)
export function useAccessControl() {
  // This would normally connect to your authentication system
  // For now, returning mock data for development
  const [accessInfo] = useState<AccessInfo>({
    accessLevel: "preview",
    subscriptionStatus: "free",
    permissions: {
      viewPractitioners: 3,
      viewSessions: false,
      bookSessions: false,
      messagePractitioners: false,
      accessGarden: false,
      createContent: false,
      viewFullProfiles: false,
      accessSeeds: false,
    }
  });

  const checkPermission = (permission: string): UsageInfo => {
    const permissionValue = accessInfo.permissions[permission];

    if (permissionValue === true || permissionValue === "unlimited") {
      return { allowed: true };
    }

    if (permissionValue === false) {
      return {
        allowed: false,
        message: `This feature requires upgraded access`
      };
    }

    if (typeof permissionValue === "number") {
      // For demo purposes, simulate some usage
      const used = Math.floor(permissionValue * 0.7);
      return {
        allowed: used < permissionValue,
        limit: permissionValue,
        used,
        message: used >= permissionValue ? "You've reached your limit" : undefined
      };
    }

    return { allowed: false, message: "Access denied" };
  };

  return {
    accessInfo,
    checkPermission,
  };
}