import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, requireAuth, requireAdmin } from "./auth";
import { archetypeDefinitions, experienceLevelDefinitions, insertSurveyResponseSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // This route is now handled in auth.ts

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

  // Survey endpoints
  app.post('/api/survey', async (req: any, res) => {
    try {
      // Extract userId if user is authenticated, otherwise allow anonymous submission
      const userId = req.user?.id || null;
      
      // Validate the survey response data
      const validationResult = insertSurveyResponseSchema.safeParse({
        ...req.body,
        userId
      });

      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid survey data", 
          errors: validationResult.error.issues 
        });
      }

      const surveyResponse = await storage.createSurveyResponse(validationResult.data);
      
      res.status(201).json({
        message: "Survey response submitted successfully",
        data: surveyResponse
      });
    } catch (error) {
      console.error("Error submitting survey response:", error);
      res.status(500).json({ message: "Failed to submit survey response" });
    }
  });

  // Simple admin authentication endpoint
  app.post('/api/simple-admin/login', async (req, res) => {
    try {
      const { password } = req.body;
      
      // Simple password check (in production, use environment variable)
      const adminPassword = process.env.SIMPLE_ADMIN_PASSWORD || "admin123";
      
      if (password === adminPassword) {
        res.json({ 
          success: true, 
          message: "Authentication successful" 
        });
      } else {
        res.status(401).json({ 
          success: false, 
          message: "Invalid password" 
        });
      }
    } catch (error) {
      console.error("Simple admin login error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Server error" 
      });
    }
  });

  app.get('/api/survey/responses', requireAdmin, async (req: any, res) => {
    try {
      // This endpoint is restricted to admin users only
      const allResponses = await storage.getAllSurveyResponses();
      
      res.json({
        message: "Survey responses retrieved successfully",
        data: allResponses,
        total: allResponses.length
      });
    } catch (error) {
      console.error("Error fetching survey responses:", error);
      res.status(500).json({ message: "Failed to fetch survey responses" });
    }
  });

  // Dashboard routes (protected)
  app.get('/api/dashboard/client/:userId', requireAuth, async (req: any, res) => {
    try {
      const { userId } = req.params;
      const authenticatedUserId = req.user.id;
      
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

  app.get('/api/dashboard/practitioner/:userId', requireAuth, async (req: any, res) => {
    try {
      const { userId } = req.params;
      const authenticatedUserId = req.user.id;
      
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

  app.get('/api/sessions/:userId/:role', requireAuth, async (req: any, res) => {
    try {
      const { userId, role } = req.params;
      const authenticatedUserId = req.user.id;
      
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
  app.post('/api/practitioners', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
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

  app.post('/api/clients', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
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
