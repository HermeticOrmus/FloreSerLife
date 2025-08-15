import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { archetypeDefinitions, experienceLevelDefinitions } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get user roles
      const roles = await storage.getUserRoles(userId);
      
      // Get additional profile data based on roles
      let practitionerProfile = null;
      let clientProfile = null;
      
      for (const role of roles) {
        if (role.role === 'practitioner') {
          practitionerProfile = await storage.getPractitionerByUserId(userId);
        }
        if (role.role === 'client') {
          clientProfile = await storage.getClientByUserId(userId);
        }
      }

      res.json({
        ...user,
        roles: roles.map(r => r.role),
        practitionerProfile,
        clientProfile
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Public API routes
  app.get('/api/practitioners', async (req, res) => {
    try {
      const practitioners = await storage.getFeaturedPractitioners(6);
      res.json(practitioners);
    } catch (error) {
      console.error("Error fetching practitioners:", error);
      res.status(500).json({ message: "Failed to fetch practitioners" });
    }
  });

  app.get('/api/practitioners/all', async (req, res) => {
    try {
      const practitioners = await storage.getAllPractitioners();
      res.json(practitioners);
    } catch (error) {
      console.error("Error fetching all practitioners:", error);
      res.status(500).json({ message: "Failed to fetch practitioners" });
    }
  });

  app.get('/api/archetypes', async (req, res) => {
    res.json(archetypeDefinitions);
  });

  app.get('/api/experience-levels', async (req, res) => {
    res.json(experienceLevelDefinitions);
  });

  // Dashboard routes (protected)
  app.get('/api/dashboard/client/:userId', isAuthenticated, async (req, res) => {
    try {
      const { userId } = req.params;
      const authenticatedUserId = req.user.claims.sub;
      
      // Ensure user can only access their own dashboard
      if (userId !== authenticatedUserId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const dashboardData = await storage.getClientDashboardData(userId);
      if (!dashboardData) {
        return res.status(404).json({ message: "Client dashboard not found" });
      }
      
      res.json(dashboardData);
    } catch (error) {
      console.error("Error fetching client dashboard:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  app.get('/api/dashboard/practitioner/:userId', isAuthenticated, async (req, res) => {
    try {
      const { userId } = req.params;
      const authenticatedUserId = req.user.claims.sub;
      
      // Ensure user can only access their own dashboard
      if (userId !== authenticatedUserId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const dashboardData = await storage.getPractitionerDashboardData(userId);
      if (!dashboardData) {
        return res.status(404).json({ message: "Practitioner dashboard not found" });
      }
      
      res.json(dashboardData);
    } catch (error) {
      console.error("Error fetching practitioner dashboard:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  app.get('/api/sessions/:userId/:role', isAuthenticated, async (req, res) => {
    try {
      const { userId, role } = req.params;
      const authenticatedUserId = req.user.claims.sub;
      
      // Ensure user can only access their own sessions
      if (userId !== authenticatedUserId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      if (role !== 'client' && role !== 'practitioner') {
        return res.status(400).json({ message: "Invalid role specified" });
      }
      
      const sessions = await storage.getUserSessions(userId, role as "client" | "practitioner");
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching user sessions:", error);
      res.status(500).json({ message: "Failed to fetch sessions" });
    }
  });

  // Protected routes
  app.post('/api/practitioners', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Check if user already has a practitioner profile
      const existingPractitioner = await storage.getPractitionerByUserId(userId);
      if (existingPractitioner) {
        return res.status(400).json({ message: "Practitioner profile already exists" });
      }

      const practitionerData = {
        userId,
        ...req.body
      };

      const practitioner = await storage.createPractitioner(practitionerData);
      
      // Create practitioner role if it doesn't exist
      const roles = await storage.getUserRoles(userId);
      const hasPractitionerRole = roles.some(role => role.role === 'practitioner');
      if (!hasPractitionerRole) {
        await storage.createUserRole(userId, 'practitioner');
      }

      res.status(201).json(practitioner);
    } catch (error) {
      console.error("Error creating practitioner:", error);
      res.status(500).json({ message: "Failed to create practitioner profile" });
    }
  });

  app.post('/api/clients', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Check if user already has a client profile
      const existingClient = await storage.getClientByUserId(userId);
      if (existingClient) {
        return res.status(400).json({ message: "Client profile already exists" });
      }

      const clientData = {
        userId,
        ...req.body
      };

      const client = await storage.createClient(clientData);
      
      // Create client role if it doesn't exist
      const roles = await storage.getUserRoles(userId);
      const hasClientRole = roles.some(role => role.role === 'client');
      if (!hasClientRole) {
        await storage.createUserRole(userId, 'client');
      }

      res.status(201).json(client);
    } catch (error) {
      console.error("Error creating client:", error);
      res.status(500).json({ message: "Failed to create client profile" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
