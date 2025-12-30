import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, requireAuth, requireAdmin, requireDevAdmin } from "./auth";
import { requirePermission, addAccessInfo } from "./accessControl";
import { emailService } from "./email";
import { format } from "date-fns";
import {
  archetypeDefinitions,
  experienceLevelDefinitions,
  pollinatorTierDefinitions,
  insertSurveyResponseSchema
} from "@shared/schema";

// AI Guardian response generation
async function generateAIResponse(userMessage: string, context: any) {
  const lowerMessage = userMessage.toLowerCase();

  // Archetype-related responses
  if (lowerMessage.includes('archetype') || lowerMessage.includes('pollinator')) {
    return {
      content: "Our pollinator archetype system is inspired by nature's wisdom! We have four types:\n\n🐝 **Bee (Foundation)**: Perfect starting point for new facilitators! Creates safe, supportive spaces for healing and growth. Welcomes all experience levels.\n🦜 **Hummingbird (Precision)**: Quick insights, spiritual guidance - for experienced practitioners\n🦋 **Butterfly (Transformation)**: Life transitions, metamorphosis - for experienced practitioners\n🪲 **Beetle (Integration)**: Deep work, shadow integration - for experienced practitioners\n\n**New to facilitating?** The Bee archetype is designed as your natural entry point, where you can build foundational skills while being part of a supportive community.",
      type: 'archetype_insight',
      suggestions: [
        { text: "Start with Bee archetype", action: "bee_info" },
        { text: "See all archetypes", action: "browse_archetypes" },
        { text: "Facilitator pathway", action: "facilitator_journey" }
      ]
    };
  }

  // Practitioner finding help
  if (lowerMessage.includes('find') && lowerMessage.includes('practitioner')) {
    return {
      content: "I'd love to help you find your perfect practitioner match! Let me guide you:\n\n1. **Consider your goals**: Are you seeking emotional healing, spiritual growth, or practical life changes?\n\n2. **Think about your energy**: Do you prefer gentle, steady support (Bee) or dynamic, transformative work (Butterfly)?\n\n3. **Browse by archetype**: Visit our Practitioners page and filter by the archetype that resonates with you.\n\n4. **Read their wisdom**: Check out their content in The Hive to see their approach.\n\n**New to wellness or want to start gently?** I especially recommend Bee practitioners - they create safe, welcoming spaces perfect for beginners and anyone seeking foundational support.",
      type: 'guidance',
      suggestions: [
        { text: "Find Bee practitioners", action: "browse_bee_practitioners" },
        { text: "Browse all practitioners", action: "browse_practitioners" },
        { text: "Archetype quiz", action: "quiz" }
      ]
    };
  }

  // Community Garden questions
  if (lowerMessage.includes('garden') || lowerMessage.includes('resource')) {
    return {
      content: "The Community Garden is our wisdom-sharing space! Here you'll find:\n\n🌱 **Insights**: Deep wisdom from our facilitators\n📚 **Resources**: Tools, books, and materials\n🌟 **Success Stories**: Transformation journeys\n🛠️ **Practical Tools**: Techniques you can use\n🧘 **Meditations**: Guided practices\n\nYou earn Seeds for engaging with content and can unlock premium wisdom as you grow. Facilitators get special benefits too!\n\nWhat type of content interests you most?",
      type: 'guidance',
      suggestions: [
        { text: "Visit Garden", action: "garden" },
        { text: "Learn about Seeds", action: "seeds_info" }
      ]
    };
  }

  // Seeds system questions
  if (lowerMessage.includes('seeds') || lowerMessage.includes('currency')) {
    return {
      content: "Seeds are our wellness currency system! Here's how it works:\n\n🌱 **Earn Seeds** by engaging with the platform:\n- Sharing content in the Garden: 25+ Seeds\n- Receiving likes on your content: 1 seed each\n- Completing sessions: 15+ Seeds\n- Platform activities: Various amounts\n\n🌳 **Pollinator Tiers**:\n- Seedling (0-100 Seeds): Basic access\n- Sprout (100-500 Seeds): Enhanced features\n- Blooming (500-2000 Seeds): Premium benefits\n- Wise Garden (2000+ Seeds): Full access + moderation\n\n💎 **Facilitators get 2x Seeds multiplier** for all activities!\n\nYour Seeds unlock features and show your contribution to our wellness community.",
      type: 'guidance',
      suggestions: [
        { text: "Check my Seeds", action: "seeds_wallet" },
        { text: "Earn more Seeds", action: "earn_seeds" }
      ]
    };
  }

  // New facilitator guidance
  if (lowerMessage.includes('new') && (lowerMessage.includes('facilitator') || lowerMessage.includes('practitioner') || lowerMessage.includes('start'))) {
    return {
      content: "Welcome to your facilitator journey! 🌱\n\nThe **Bee archetype** is designed specifically as your starting point. Here's why it's perfect for new facilitators:\n\n🐝 **Safe to Learn**: Creates supportive environments where you can develop your skills\n🤝 **Community Support**: Built-in mentorship and peer learning\n🎯 **Practical Focus**: Hands-on approach to building foundational wellness skills\n📈 **Growth Path**: Develops core competencies that support all wellness work\n\n**Remember**: Even seasoned practitioners with 15+ years often choose the Bee path because it's a sophisticated, grounding approach - not just a beginner's practice!",
      type: 'guidance',
      suggestions: [
        { text: "Learn about Bee archetype", action: "bee_info" },
        { text: "Find Bee mentors", action: "bee_practitioners" },
        { text: "Facilitator resources", action: "facilitator_resources" }
      ]
    };
  }

  // Default response with helpful suggestions
  return {
    content: "I'm here to help guide your wellness journey! I can assist with finding practitioners, understanding our archetype system, exploring the Community Garden, or answering any questions about FloreSer.\n\n**New to facilitating?** Ask me about starting your journey with the Bee archetype!\n\nWhat would be most helpful for you right now?",
    type: 'text',
    suggestions: [
      { text: "Find practitioners", action: "practitioners" },
      { text: "New facilitator guide", action: "new_facilitator" },
      { text: "Learn archetypes", action: "archetypes" },
      { text: "Explore Garden", action: "garden" }
    ]
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Add access control info to all authenticated requests
  app.use(addAccessInfo);

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

      // Apply access control for authenticated users
      if (req.user) {
        const userAccess = (req as any).userAccess;
        const permissions = userAccess?.permissions?.permissions;

        if (permissions?.viewPractitioners && typeof permissions.viewPractitioners === 'number') {
          // Limit the number of practitioners for preview/basic users
          const limitedPractitioners = practitioners.slice(0, permissions.viewPractitioners);
          return res.json({
            practitioners: limitedPractitioners,
            accessInfo: {
              total: practitioners.length,
              shown: limitedPractitioners.length,
              limit: permissions.viewPractitioners,
              accessLevel: userAccess.accessLevel,
              upgradeRequired: limitedPractitioners.length < practitioners.length
            }
          });
        }
      }

      // Full access for non-authenticated users (public preview) or unlimited users
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

      // Send thank you email if email is provided
      if (validationResult.data.userId) {
        try {
          const user = await storage.getUserById(validationResult.data.userId);
          if (user?.email) {
            // Generate a unique survey code for early access benefits
            const surveyCode = `FLORESER-${Date.now().toString(36).toUpperCase()}`;
            await emailService.sendSurveyThankYou(user.email, surveyCode);
          }
        } catch (emailError) {
          console.error("Failed to send survey thank you email:", emailError);
          // Don't fail the survey submission if email fails
        }
      }

      res.status(201).json({
        message: "Survey response submitted successfully",
        data: surveyResponse
      });
    } catch (error) {
      console.error("Error submitting survey response:", error);
      res.status(500).json({ message: "Failed to submit survey response" });
    }
  });

  // Favorites endpoints
  app.get('/api/favorites/:userId', requireAuth, async (req: any, res) => {
    try {
      const { userId } = req.params;

      if (req.user.id !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const favorites = await storage.getFavoritePractitioners(userId);
      res.json(favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  app.post('/api/favorites', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { practitionerId } = req.body;

      // Check if already favorited
      const existing = await storage.getFavoritePractitioners(userId);
      const alreadyFavorited = existing.some((f: any) => f.practitionerId === practitionerId);

      if (alreadyFavorited) {
        // Remove favorite
        await storage.removeFavoritePractitioner(userId, practitionerId);
        res.json({ message: "Removed from favorites", favorited: false });
      } else {
        // Add favorite
        await storage.addFavoritePractitioner(userId, practitionerId);
        res.json({ message: "Added to favorites", favorited: true });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      res.status(500).json({ message: "Failed to update favorites" });
    }
  });

  // Booking endpoints
  // Get practitioner availability for a specific date
  app.get('/api/bookings/:practitionerId/availability', async (req, res) => {
    try {
      const { practitionerId } = req.params;
      const { date, duration = '60' } = req.query;

      if (!date) {
        return res.status(400).json({ message: "Date parameter required" });
      }

      const requestedDate = new Date(date as string);
      const durationMinutes = parseInt(duration as string);

      // Generate time slots (9 AM to 5 PM in 30-minute intervals)
      const slots = [];
      for (let hour = 9; hour < 17; hour++) {
        for (let minute of [0, 30]) {
          const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          slots.push({ time, available: true }); // TODO: Check against existing bookings
        }
      }

      // TODO: Filter out booked slots based on actual bookings from database
      const bookedSlots = await storage.getPractitionerBookingsByDate(practitionerId, requestedDate);

      res.json(slots);
    } catch (error) {
      console.error("Error fetching availability:", error);
      res.status(500).json({ message: "Failed to fetch availability" });
    }
  });

  // Create a new booking
  app.post('/api/bookings', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const {
        practitionerId,
        scheduledDatetime,
        duration,
        isVirtual,
        totalAmount,
        notes
      } = req.body;

      // Get client profile
      const client = await storage.getClientByUserId(userId);
      if (!client) {
        return res.status(400).json({ message: "Client profile required to book sessions" });
      }

      // Check for conflicts
      const conflicts = await storage.checkBookingConflicts(
        practitionerId,
        new Date(scheduledDatetime),
        duration
      );

      if (conflicts.length > 0) {
        return res.status(409).json({
          message: "This time slot is no longer available",
          conflicts
        });
      }

      // Create booking
      const booking = await storage.createBooking({
        clientId: client.id,
        practitionerId,
        scheduledDatetime: new Date(scheduledDatetime),
        duration,
        status: 'scheduled',
        totalAmount,
        isVirtual,
        notes
      });

      // Send confirmation emails to both client and practitioner
      try {
        const { emailService } = await import('./email');
        const practitioner = await storage.getPractitioner(practitionerId);
        if (!practitioner) {
          throw new Error("Practitioner not found");
        }

        const practitionerUser = await storage.getUserById(practitioner.userId);
        const clientUser = await storage.getUserById(userId);

        if (!practitionerUser || !clientUser) {
          throw new Error("User information not found");
        }

        const practitionerName = practitionerUser.firstName && practitionerUser.lastName
          ? `${practitionerUser.firstName} ${practitionerUser.lastName}`
          : 'Your practitioner';

        const clientName = clientUser.firstName && clientUser.lastName
          ? `${clientUser.firstName} ${clientUser.lastName}`
          : 'Your client';

        const sessionDetails = {
          date: format(new Date(scheduledDatetime), 'MMMM d, yyyy'),
          time: format(new Date(scheduledDatetime), 'h:mm a'),
          practitionerName,
          clientName,
          isVirtual,
          meetingLink: isVirtual ? 'https://floreser.life/sessions' : undefined
        };

        // Send to client
        await emailService.sendSessionConfirmation(
          clientUser.email,
          sessionDetails
        );

        // Send to practitioner
        await emailService.sendSessionConfirmation(
          practitionerUser.email,
          sessionDetails
        );
      } catch (emailError) {
        console.error("Failed to send confirmation emails:", emailError);
        // Don't fail the booking if email fails
      }

      res.json({
        message: "Booking created successfully",
        booking
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  // Get user's bookings
  app.get('/api/bookings', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const bookings = await storage.getUserBookings(userId);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Update booking status
  app.put('/api/bookings/:id/status', requireAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user.id;

      // Verify user owns this booking or is the practitioner
      const booking = await storage.getBookingById(id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      // TODO: Add authorization check

      await storage.updateBookingStatus(id, status);
      res.json({ message: "Booking status updated" });
    } catch (error) {
      console.error("Error updating booking:", error);
      res.status(500).json({ message: "Failed to update booking" });
    }
  });

  // Enhanced admin authentication endpoint
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { accessCode } = req.body;

      // Use environment variable for admin access code
      const adminAccessCode = process.env.ADMIN_ACCESS_CODE;

      if (!adminAccessCode) {
        return res.status(500).json({
          success: false,
          message: "Admin access not configured"
        });
      }

      if (accessCode === adminAccessCode) {
        // Set admin session
        (req.session as any).isAdmin = true;

        res.json({
          success: true,
          message: "Admin access granted",
          adminLevel: "full"
        });
      } else {
        res.status(401).json({
          success: false,
          message: "Invalid access code"
        });
      }
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  });

  // Legacy simple admin endpoint (for backwards compatibility)
  app.post('/api/simple-admin/login', async (req, res) => {
    try {
      const { password } = req.body;

      // Use environment variable with secure fallback
      const adminPassword = process.env.SIMPLE_ADMIN_PASSWORD;

      if (!adminPassword) {
        return res.status(500).json({
          success: false,
          message: "Admin authentication not configured"
        });
      }

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

  // Reviews endpoints
  app.post('/api/reviews', requireAuth, async (req: any, res) => {
    try {
      const { sessionId, practitionerId, rating, comment } = req.body;
      const userId = req.user.id;

      // Validate rating
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
      }

      // Get client profile
      const client = await storage.getClientByUserId(userId);
      if (!client) {
        return res.status(400).json({ message: "Client profile not found" });
      }

      // Check if review already exists for this session
      const existingReview = await storage.getReviewBySessionId(sessionId);
      if (existingReview) {
        return res.status(400).json({ message: "Review already exists for this session" });
      }

      const review = await storage.createReview({
        sessionId,
        clientId: client.id,
        practitionerId,
        rating: parseInt(rating),
        comment: comment || null
      });

      res.status(201).json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  app.get('/api/reviews/practitioner/:practitionerId', async (req: any, res) => {
    try {
      const { practitionerId } = req.params;
      const reviews = await storage.getPractitionerReviewsWithClient(practitionerId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching practitioner reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.get('/api/reviews/client/:clientId', requireAuth, async (req: any, res) => {
    try {
      const { clientId } = req.params;
      const authenticatedUserId = req.user.id;

      // Verify user owns this client profile
      const client = await storage.getClient(clientId);
      if (!client || client.userId !== authenticatedUserId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const reviews = await storage.getReviewsByClientId(clientId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching client reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Seeds Currency API endpoints
  app.get('/api/seeds/wallet/:userId', requireAuth, async (req: any, res) => {
    try {
      const { userId } = req.params;
      const authenticatedUserId = req.user.id;

      // Ensure user can only access their own wallet
      if (userId !== authenticatedUserId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const wallet = await storage.getSeedsWallet(userId);
      if (!wallet) {
        // Create wallet if it doesn't exist
        const newWallet = await storage.createSeedsWallet(userId);
        return res.json(newWallet);
      }

      res.json(wallet);
    } catch (error) {
      console.error("Error fetching seeds wallet:", error);
      res.status(500).json({ message: "Failed to fetch wallet" });
    }
  });

  app.get('/api/seeds/stats/:userId', requireAuth, async (req: any, res) => {
    try {
      const { userId } = req.params;
      const authenticatedUserId = req.user.id;

      if (userId !== authenticatedUserId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const stats = await storage.getUserSeedsStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching seeds stats:", error);
      res.status(500).json({ message: "Failed to fetch seeds stats" });
    }
  });

  // Community Garden API endpoints
  app.get('/api/garden/content', async (req, res) => {
    try {
      const { page = 1, limit = 20, contentType, tags, authorId, isPremium } = req.query;

      // Get access control info for the user
      const userId = (req.session as any)?.userId;
      let accessInfo = null;

      if (userId) {
        const { AccessControlService } = await import('./accessControl');
        accessInfo = await AccessControlService.getUserAccessInfo(userId);
      }

      const content = await storage.getGardenContent({
        limit: parseInt(limit as string),
        offset: (parseInt(page as string) - 1) * parseInt(limit as string),
        contentType: contentType as string,
        authorId: authorId as string
      });

      // Apply access control filtering
      let filteredContent = content;
      if (!accessInfo || !accessInfo.permissions.accessGarden) {
        // Return limited preview content for non-subscribers
        filteredContent = content
          .filter(item => true) // Remove isPremium filter for now
          .slice(0, 3)
          .map(item => ({
            ...item,
            content: item.content ? item.content.substring(0, 150) + '...' : '',
            isPreview: true
          }));
      }

      res.json({
        content: filteredContent,
        accessInfo: {
          hasAccess: accessInfo?.permissions?.accessGarden || false,
          accessLevel: accessInfo?.accessLevel || 'preview',
          upgradeRequired: !accessInfo?.permissions?.accessGarden
        }
      });
    } catch (error) {
      console.error("Error fetching garden content:", error);
      res.status(500).json({ message: "Failed to fetch garden content" });
    }
  });

  app.post('/api/garden/content', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { AccessControlService } = await import('./accessControl');

      // Check if user has permission to create content
      const accessInfo = await AccessControlService.getUserAccessInfo(userId);
      if (!accessInfo.permissions.createContent) {
        return res.status(403).json({
          message: "Content creation requires upgraded access",
          requiredLevel: "basic"
        });
      }

      const { title, content, contentType, tags, isPremium = false } = req.body;

      if (!title || !content || !contentType) {
        return res.status(400).json({ message: "Title, content, and contentType are required" });
      }

      const newContent = await storage.createGardenContent({
        title,
        content,
        contentType,
        authorId: userId,
        tags: tags || []
      });

      // Award seeds for content creation (with facilitator bonus)
      const baseSeeds = 25;
      const finalAmount = accessInfo.facilitatorBenefits?.seedsMultiplier
        ? Math.floor(baseSeeds * accessInfo.facilitatorBenefits.seedsMultiplier)
        : baseSeeds;

      await storage.addSeedsTransaction({
        userId,
        amount: finalAmount,
        type: 'garden_upload',
        description: accessInfo.facilitatorBenefits
          ? 'Content shared to Garden (Facilitator bonus applied)'
          : 'Content shared to Community Garden',
        referenceId: newContent.id,
        referenceType: 'garden_content'
      });

      res.status(201).json(newContent);
    } catch (error) {
      console.error("Error creating garden content:", error);
      res.status(500).json({ message: "Failed to create content" });
    }
  });

  app.post('/api/garden/content/:contentId/like', requireAuth, async (req: any, res) => {
    try {
      const { contentId } = req.params;
      const userId = req.user.id;

      const interaction = await storage.createGardenInteraction({
        userId,
        contentId,
        interactionType: 'like'
      });

      // Award 1 seed to content author for like
      const content = await storage.getGardenContentById(contentId);
      if (content && content.authorId !== userId) {
        await storage.addSeedsTransaction({
          userId: content.authorId,
          amount: 1,
          type: 'content_engagement',
          description: 'Received like on garden content',
          referenceId: contentId,
          referenceType: 'garden_content'
        });
      }

      res.json(interaction);
    } catch (error) {
      console.error("Error liking content:", error);
      res.status(500).json({ message: "Failed to like content" });
    }
  });

  app.get('/api/garden/content/:contentId', async (req, res) => {
    try {
      const { contentId } = req.params;
      const userId = (req.session as any)?.userId;

      const content = await storage.getGardenContentById(contentId);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }

      // Check access permissions for premium content (temporarily disabled)
      if (false && userId) { // Disable premium check for now
        const { AccessControlService } = await import('./accessControl');
        const accessInfo = await AccessControlService.getUserAccessInfo(userId);

        if (!accessInfo.permissions.accessGarden) {
          return res.status(403).json({
            message: "Premium content requires upgraded access",
            requiredLevel: "basic"
          });
        }
      }

      // Increment view count
      await storage.incrementGardenContentViews(contentId);

      res.json(content);
    } catch (error) {
      console.error("Error fetching garden content:", error);
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  // AI Guardian (mAIa) API endpoints
  app.post('/api/ai-guardian/chat', async (req, res) => {
    try {
      const { message, context } = req.body;
      const userId = (req.session as any)?.userId;

      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      // Enhanced AI response generation with context awareness
      const response = await generateAIResponse(message, {
        userId,
        userContext: context,
        isAuthenticated: !!userId
      });

      // Log interaction for learning (anonymized)
      console.log('AI Guardian interaction:', {
        timestamp: new Date().toISOString(),
        userQuery: message.substring(0, 100), // First 100 chars only
        responseType: response.type
      });

      res.json({
        response: response.content,
        type: response.type,
        suggestions: response.suggestions || [],
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error in AI Guardian chat:", error);
      res.status(500).json({
        response: "I'm experiencing some technical difficulties right now. Please try again in a moment!",
        type: "error"
      });
    }
  });

  app.get('/api/ai-guardian/context', async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      let userContext = {};

      if (userId) {
        // Get user's platform context for personalized responses
        const user = await storage.getUserById(userId);
        const userRoles = await storage.getUserRoles(userId);
        const practitionerProfile = await storage.getPractitionerByUserId(userId);
        const clientProfile = await storage.getClientByUserId(userId);

        userContext = {
          isAuthenticated: true,
          roles: userRoles.map(r => r.role),
          hasProfile: !!(practitionerProfile || clientProfile),
          archetype: practitionerProfile?.archetype || clientProfile?.preferredArchetypes?.[0],
          experienceLevel: practitionerProfile?.experienceLevel,
          joinedDate: user?.createdAt,
          totalSessions: 0 // Would get from actual session data
        };
      }

      res.json({
        context: userContext,
        platformInfo: {
          totalPractitioners: 150, // Would get from actual data
          activeUsers: 1200,
          archetypes: ['bee', 'hummingbird', 'butterfly', 'beetle'],
          features: ['practitioners', 'hive', 'garden', 'seeds']
        }
      });
    } catch (error) {
      console.error("Error getting AI Guardian context:", error);
      res.status(500).json({ message: "Failed to get context" });
    }
  });

  app.get('/api/seeds/transactions/:userId', requireAuth, async (req: any, res) => {
    try {
      const { userId } = req.params;
      const authenticatedUserId = req.user.id;
      const limit = parseInt(req.query.limit as string) || 50;

      if (userId !== authenticatedUserId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const transactions = await storage.getSeedsTransactions(userId, limit);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching seeds transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.get('/api/seeds/tiers', async (req, res) => {
    res.json(pollinatorTierDefinitions);
  });

  // Admin logout endpoint
  app.post('/api/admin/logout', (req, res) => {
    (req.session as any).isAdmin = false;
    res.json({ success: true, message: "Admin session cleared" });
  });

  // Access control and subscription routes
  app.post('/api/access/start-trial', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { AccessControlService } = await import('./accessControl');

      const trialStarted = await AccessControlService.startFreeTrial(userId, 7);

      if (trialStarted) {
        res.json({
          success: true,
          message: "7-day free trial started!",
          trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Unable to start trial. You may have already used your trial period."
        });
      }
    } catch (error) {
      console.error("Error starting trial:", error);
      res.status(500).json({
        success: false,
        message: "Failed to start trial"
      });
    }
  });

  app.get('/api/access/info', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const userAccess = (req as any).userAccess;

      res.json({
        accessLevel: userAccess.accessLevel,
        subscriptionStatus: userAccess.subscriptionStatus,
        permissions: userAccess.permissions,
        canStartTrial: !await storage.hasUsedTrial(userId)
      });
    } catch (error) {
      console.error("Error fetching access info:", error);
      res.status(500).json({ message: "Failed to fetch access info" });
    }
  });

  // Comprehensive Admin Routes for Development
  app.get('/api/admin/overview', requireDevAdmin, async (req, res) => {
    try {
      const overview = {
        totalUsers: await storage.getTotalUsers(),
        totalPractitioners: await storage.getTotalPractitioners(),
        totalClients: await storage.getTotalClients(),
        totalSessions: await storage.getTotalSessions(),
        totalReviews: await storage.getTotalReviews(),
        totalSurveyResponses: await storage.getTotalSurveyResponses(),
        totalGardenContent: await storage.getTotalGardenContent(),
        totalSeedsTransactions: await storage.getTotalSeedsTransactions()
      };
      res.json(overview);
    } catch (error) {
      console.error("Error fetching admin overview:", error);
      res.status(500).json({ message: "Failed to fetch overview data" });
    }
  });

  app.get('/api/admin/users', requireDevAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsersWithProfiles();
      res.json(users);
    } catch (error) {
      console.error("Error fetching all users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get('/api/admin/practitioners', requireDevAdmin, async (req, res) => {
    try {
      const practitioners = await storage.getAllPractitionersWithDetails();
      res.json(practitioners);
    } catch (error) {
      console.error("Error fetching all practitioners:", error);
      res.status(500).json({ message: "Failed to fetch practitioners" });
    }
  });

  app.get('/api/admin/sessions', requireDevAdmin, async (req, res) => {
    try {
      const sessions = await storage.getAllSessionsWithDetails();
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching all sessions:", error);
      res.status(500).json({ message: "Failed to fetch sessions" });
    }
  });

  app.get('/api/admin/garden-content', requireDevAdmin, async (req, res) => {
    try {
      const content = await storage.getAllGardenContentWithDetails();
      res.json(content);
    } catch (error) {
      console.error("Error fetching garden content:", error);
      res.status(500).json({ message: "Failed to fetch garden content" });
    }
  });

  app.get('/api/admin/seeds-overview', requireDevAdmin, async (req, res) => {
    try {
      const seedsData = await storage.getAllSeedsData();
      res.json(seedsData);
    } catch (error) {
      console.error("Error fetching seeds data:", error);
      res.status(500).json({ message: "Failed to fetch seeds data" });
    }
  });

  // Community Garden API endpoints
  app.post('/api/garden/content', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const contentData = {
        authorId: userId,
        ...req.body
      };

      const content = await storage.createGardenContent(contentData);
      res.status(201).json(content);
    } catch (error) {
      console.error("Error creating garden content:", error);
      res.status(500).json({ message: "Failed to create content" });
    }
  });

  app.get('/api/garden/content', async (req, res) => {
    try {
      const options = {
        authorId: req.query.authorId as string,
        contentType: req.query.contentType as string,
        status: req.query.status as string || "approved", // Default to approved content
        isPublic: req.query.isPublic !== undefined ? req.query.isPublic === 'true' : true,
        limit: parseInt(req.query.limit as string) || 20,
        offset: parseInt(req.query.offset as string) || 0,
      };

      const content = await storage.getGardenContent(options);
      res.json(content);
    } catch (error) {
      console.error("Error fetching garden content:", error);
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  app.get('/api/garden/content/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const content = await storage.getGardenContentById(id);

      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }

      res.json(content);
    } catch (error) {
      console.error("Error fetching garden content:", error);
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  app.post('/api/garden/interaction', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { contentId, interactionType, aiResponse } = req.body;

      const interaction = await storage.recordGardenInteraction(
        userId,
        contentId,
        interactionType,
        aiResponse
      );

      res.status(201).json(interaction);
    } catch (error) {
      console.error("Error recording garden interaction:", error);
      res.status(500).json({ message: "Failed to record interaction" });
    }
  });

  // Email testing and administration routes
  app.post('/api/admin/send-test-email', requireDevAdmin, async (req, res) => {
    try {
      const { email, type, data } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email address required" });
      }

      let success = false;
      switch (type) {
        case 'welcome':
          success = await emailService.sendWelcomeEmail(email, data?.name || 'Test User');
          break;
        case 'survey-thank-you':
          success = await emailService.sendSurveyThankYou(email, data?.code);
          break;
        case 'alpha-invitation':
          success = await emailService.sendAlphaInvitation(email, data?.inviteCode);
          break;
        case 'session-confirmation':
          success = await emailService.sendSessionConfirmation(email, {
            date: data?.date || 'Tomorrow',
            time: data?.time || '2:00 PM',
            practitionerName: data?.practitionerName || 'Test Practitioner',
            clientName: data?.clientName || 'Test Client',
            isVirtual: data?.isVirtual !== false,
            meetingLink: data?.meetingLink || 'https://meet.example.com/test'
          });
          break;
        case 'session-reminder':
          success = await emailService.sendSessionReminder(email, {
            date: data?.date || 'Tomorrow',
            time: data?.time || '2:00 PM',
            practitionerName: data?.practitionerName || 'Test Practitioner',
            clientName: data?.clientName || 'Test Client',
            isVirtual: data?.isVirtual !== false,
            meetingLink: data?.meetingLink || 'https://meet.example.com/test'
          });
          break;
        default:
          return res.status(400).json({ message: "Invalid email type" });
      }

      res.json({
        success,
        message: success ? "Email sent successfully" : "Failed to send email"
      });
    } catch (error) {
      console.error("Error sending test email:", error);
      res.status(500).json({ message: "Failed to send test email" });
    }
  });

  app.post('/api/email/alpha-invite', async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email address required" });
      }

      // Generate unique invite code
      const inviteCode = `ALPHA-${Date.now().toString(36).toUpperCase()}`;

      const success = await emailService.sendAlphaInvitation(email, inviteCode);

      res.json({
        success,
        message: success ? "Alpha invitation sent successfully" : "Failed to send invitation",
        inviteCode: success ? inviteCode : undefined
      });
    } catch (error) {
      console.error("Error sending alpha invitation:", error);
      res.status(500).json({ message: "Failed to send alpha invitation" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
