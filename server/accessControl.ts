import type { RequestHandler } from "express";
import { storage } from "./storage";

// Access levels and their permissions
export const ACCESS_PERMISSIONS = {
  preview: {
    name: "Preview Access",
    description: "Limited access to explore platform features",
    permissions: {
      viewPractitioners: 3, // Can view max 3 practitioners
      viewSessions: false,
      bookSessions: false,
      messagePractitioners: false,
      accessGarden: false,
      createContent: false,
      viewFullProfiles: false,
      accessSeeds: false,
    },
  },
  basic: {
    name: "Basic Access",
    description: "Essential platform features",
    permissions: {
      viewPractitioners: 10, // Can view max 10 practitioners
      viewSessions: true,
      bookSessions: 1, // Can book 1 session per month
      messagePractitioners: true,
      accessGarden: true, // Read-only access
      createContent: false,
      viewFullProfiles: true,
      accessSeeds: true,
    },
  },
  premium: {
    name: "Premium Access",
    description: "Full platform experience",
    permissions: {
      viewPractitioners: "unlimited",
      viewSessions: true,
      bookSessions: "unlimited",
      messagePractitioners: true,
      accessGarden: true,
      createContent: true,
      viewFullProfiles: true,
      accessSeeds: true,
    },
  },
  unlimited: {
    name: "Unlimited Access",
    description: "All features plus exclusive benefits",
    permissions: {
      viewPractitioners: "unlimited",
      viewSessions: true,
      bookSessions: "unlimited",
      messagePractitioners: true,
      accessGarden: true,
      createContent: true,
      viewFullProfiles: true,
      accessSeeds: true,
      earlyAccess: true,
      prioritySupport: true,
    },
  },
};

// Access control service
export class AccessControlService {
  // Check if user has permission for a specific action
  static async hasPermission(
    userId: string,
    permission: string,
    context?: any
  ): Promise<{ allowed: boolean; limit?: number; used?: number; message?: string }> {
    try {
      const user = await storage.getUserById(userId);
      if (!user) {
        return { allowed: false, message: "User not found" };
      }

      const accessLevel = user.accessLevel || "preview";
      const permissions = ACCESS_PERMISSIONS[accessLevel as keyof typeof ACCESS_PERMISSIONS];

      if (!permissions) {
        return { allowed: false, message: "Invalid access level" };
      }

      const permissionValue = (permissions.permissions as any)[permission];

      // Handle unlimited permissions
      if (permissionValue === "unlimited" || permissionValue === true) {
        return { allowed: true };
      }

      // Handle false permissions
      if (permissionValue === false) {
        return {
          allowed: false,
          message: `${permission} requires ${AccessControlService.getUpgradeLevel(accessLevel)} access`
        };
      }

      // Handle numeric limits (like viewing practitioners)
      if (typeof permissionValue === "number") {
        const used = await AccessControlService.getUsageCount(userId, permission, context);
        return {
          allowed: used < permissionValue,
          limit: permissionValue,
          used,
          message: used >= permissionValue
            ? `You've reached your limit of ${permissionValue}. Upgrade for more access.`
            : undefined
        };
      }

      return { allowed: false, message: "Permission not defined" };
    } catch (error) {
      console.error("Error checking permission:", error);
      return { allowed: false, message: "Error checking permissions" };
    }
  }

  // Get current usage count for limited permissions
  static async getUsageCount(userId: string, permission: string, context?: any): Promise<number> {
    try {
      switch (permission) {
        case "viewPractitioners":
          // Track unique practitioners viewed in current session or time period
          // For now, return a mock count - implement session tracking later
          return 0;

        case "bookSessions":
          // Count sessions booked this month
          const sessionsThisMonth = await storage.getUserSessionsThisMonth(userId);
          return sessionsThisMonth;

        default:
          return 0;
      }
    } catch (error) {
      console.error("Error getting usage count:", error);
      return 0;
    }
  }

  // Get the next upgrade level
  static getUpgradeLevel(currentLevel: string): string {
    switch (currentLevel) {
      case "preview":
        return "Basic";
      case "basic":
        return "Premium";
      case "premium":
        return "Unlimited";
      default:
        return "Premium";
    }
  }

  // Check subscription status and update access level
  static async updateUserAccessLevel(userId: string): Promise<void> {
    try {
      const user = await storage.getUserById(userId);
      if (!user) return;

      const now = new Date();
      let newAccessLevel = "preview";
      let newSubscriptionStatus = user.subscriptionStatus || "free";

      // Check trial status
      if (user.trialEndDate && now < user.trialEndDate) {
        newAccessLevel = "basic";
        newSubscriptionStatus = "trial";
      }
      // Check subscription status
      else if (user.subscriptionEndDate && now < user.subscriptionEndDate) {
        switch (user.subscriptionStatus) {
          case "premium":
            // Premium subscribers can have premium or unlimited access level
            // Keep existing access level if it's unlimited, otherwise set to premium
            newAccessLevel = user.accessLevel === "unlimited" ? "unlimited" : "premium";
            break;
          default:
            newAccessLevel = "basic";
        }
      }
      // Expired or no subscription
      else {
        newAccessLevel = "preview";
        if (user.subscriptionStatus === "premium" || user.subscriptionStatus === "trial") {
          newSubscriptionStatus = "expired";
        } else {
          newSubscriptionStatus = "free";
        }
      }

      // Update user if needed
      if (user.accessLevel !== newAccessLevel || user.subscriptionStatus !== newSubscriptionStatus) {
        await storage.updateUserAccess(userId, newAccessLevel, newSubscriptionStatus);
      }
    } catch (error) {
      console.error("Error updating user access level:", error);
    }
  }

  // Start free trial for user
  static async startFreeTrial(userId: string, durationDays: number = 7): Promise<boolean> {
    try {
      const user = await storage.getUserById(userId);
      if (!user) return false;

      // Check if user has already used their trial
      if (user.trialEndDate) {
        return false; // Already used trial
      }

      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + durationDays);

      await storage.updateUserAccess(userId, "basic", "trial", {
        trialEndDate
      });

      return true;
    } catch (error) {
      console.error("Error starting free trial:", error);
      return false;
    }
  }

  // Get complete user access information including facilitator benefits
  static async getUserAccessInfo(userId: string): Promise<any> {
    try {
      const user = await storage.getUserById(userId);
      if (!user) return null;

      await AccessControlService.updateUserAccessLevel(userId);

      const accessLevel = user.accessLevel || "preview";
      const subscriptionStatus = user.subscriptionStatus || "free";
      const currentAccess = ACCESS_PERMISSIONS[accessLevel as keyof typeof ACCESS_PERMISSIONS];

      if (!currentAccess) {
        return null;
      }

      // Check if user is a facilitator (practitioner) for bonus benefits
      const userRoles = await storage.getUserRoles(userId);
      const isFacilitator = userRoles.some(role => role.role === 'practitioner');

      return {
        accessLevel,
        subscriptionStatus,
        permissions: currentAccess.permissions,
        isFacilitator,
        facilitatorBenefits: isFacilitator ? {
          seedsMultiplier: 2.0,
          featuredContent: true,
          premiumContentCreation: accessLevel !== 'preview',
          monthlyBonus: 50,
          prioritySupport: true
        } : null,
        usage: {
          viewPractitioners: {
            used: 0, // This would come from actual usage tracking
            limit: currentAccess.permissions.viewPractitioners === "unlimited" ? null :
                   typeof currentAccess.permissions.viewPractitioners === 'number' ? currentAccess.permissions.viewPractitioners : null
          }
        }
      };
    } catch (error) {
      console.error("Error getting user access info:", error);
      return null;
    }
  }
}

// Middleware to check access permissions
export const requirePermission = (permission: string, options?: { context?: any }) => {
  const middleware: RequestHandler = async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const userId = (req.user as any).id;

    // Update user access level first
    await AccessControlService.updateUserAccessLevel(userId);

    // Check permission
    const result = await AccessControlService.hasPermission(userId, permission, options?.context);

    if (!result.allowed) {
      return res.status(403).json({
        message: result.message || "Access denied",
        accessLevel: await storage.getUserAccessLevel(userId),
        upgradeRequired: true,
        upgradeLevel: AccessControlService.getUpgradeLevel(
          await storage.getUserAccessLevel(userId) || "preview"
        ),
      });
    }

    // Add permission info to request for the route handler
    (req as any).permissionInfo = result;
    next();
  };

  return middleware;
};

// Middleware to add user access info to all authenticated requests
export const addAccessInfo: RequestHandler = async (req, res, next) => {
  if (req.user) {
    const userId = (req.user as any).id;
    await AccessControlService.updateUserAccessLevel(userId);

    const user = await storage.getUserById(userId);
    (req as any).userAccess = {
      accessLevel: user?.accessLevel || "preview",
      subscriptionStatus: user?.subscriptionStatus || "free",
      permissions: ACCESS_PERMISSIONS[user?.accessLevel as keyof typeof ACCESS_PERMISSIONS] || ACCESS_PERMISSIONS.preview,
    };
  }
  next();
};