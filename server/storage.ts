import {
  users,
  practitioners,
  clients,
  userRoles,
  sessions_table,
  reviews,
  surveyResponses,
  seedsWallets,
  seedsTransactions,
  pollinatorTiers,
  gardenContent,
  gardenInteractions,
  favoritePractitioners,
  conversations,
  messages,
  facilitatorApplications,
  stripeConnectAccounts,
  payouts,
  type User,
  type UpsertUser,
  type Practitioner,
  type Client,
  type UserRole,
  type Session,
  type Review,
  type SurveyResponse,
  type SeedsWallet,
  type SeedsTransaction,
  type PollinatorTier,
  type GardenContent,
  type GardenInteraction,
  type Conversation,
  type Message,
  type FacilitatorApplication,
  type StripeConnectAccount,
  type Payout,
  type InsertPractitioner,
  type InsertClient,
  type InsertSurveyResponse,
  type InsertSeedsWallet,
  type InsertSeedsTransaction,
  type InsertGardenContent,
  type InsertGardenInteraction,
  type InsertConversation,
  type InsertMessage,
  type InsertFacilitatorApplication,
  type InsertStripeConnectAccount,
  type InsertPayout,
  pollinatorTierDefinitions,
  seedsEarningRates,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, desc, asc, sql, gte, lt, count, inArray } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: Partial<User>): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  linkGoogleAccount(userId: string, googleId: string): Promise<void>;
  getUserWithProfiles(userId: string): Promise<any>;
  
  // User role operations
  createUserRole(userId: string, role: "client" | "practitioner" | "admin"): Promise<UserRole>;
  getUserRoles(userId: string): Promise<UserRole[]>;
  isUserAdmin(userId: string): Promise<boolean>;
  
  // Practitioner operations
  createPractitioner(practitioner: InsertPractitioner): Promise<Practitioner>;
  getPractitioner(id: string): Promise<Practitioner | undefined>;
  getPractitionerByUserId(userId: string): Promise<Practitioner | undefined>;
  getAllPractitioners(): Promise<Practitioner[]>;
  getFeaturedPractitioners(limit?: number): Promise<Practitioner[]>;
  
  // Client operations
  createClient(client: InsertClient): Promise<Client>;
  getClient(id: string): Promise<Client | undefined>;
  getClientByUserId(userId: string): Promise<Client | undefined>;
  
  // Dashboard data operations
  getClientDashboardData(userId: string): Promise<any>;
  getPractitionerDashboardData(userId: string): Promise<any>;
  getUserSessions(userId: string, role: "client" | "practitioner"): Promise<Session[]>;
  getUserStats(userId: string, role: "client" | "practitioner"): Promise<any>;
  
  // Survey operations
  createSurveyResponse(surveyData: InsertSurveyResponse): Promise<SurveyResponse>;
  getSurveyResponseById(id: string): Promise<SurveyResponse | undefined>;
  getAllSurveyResponses(): Promise<SurveyResponse[]>;
  getSurveyResponsesByUserId(userId: string): Promise<SurveyResponse[]>;

  // Admin overview operations
  getTotalUsers(): Promise<number>;
  getTotalPractitioners(): Promise<number>;
  getTotalClients(): Promise<number>;
  getTotalSessions(): Promise<number>;
  getTotalReviews(): Promise<number>;
  getTotalSurveyResponses(): Promise<number>;
  getTotalGardenContent(): Promise<number>;
  getTotalSeedsTransactions(): Promise<number>;
  getAllUsersWithProfiles(): Promise<any[]>;
  getAllPractitionersWithDetails(): Promise<any[]>;
  getAllSessionsWithDetails(): Promise<any[]>;
  getAllGardenContentWithDetails(): Promise<any[]>;
  getAllSeedsData(): Promise<any>;

  // Access control operations
  getUserAccessLevel(userId: string): Promise<string | null>;
  updateUserAccess(userId: string, accessLevel: string, subscriptionStatus: string, options?: any): Promise<void>;
  getUserSessionsThisMonth(userId: string): Promise<number>;
  hasUsedTrial(userId: string): Promise<boolean>;

  // Seeds system methods
  addSeedsTransaction(transactionData: any): Promise<void>;

  // Garden interaction methods
  createGardenInteraction(interactionData: any): Promise<any>;
  incrementGardenContentViews(contentId: string): Promise<void>;

  // Messaging methods
  getOrCreateConversation(userId1: string, userId2: string): Promise<Conversation>;
  getUserConversations(userId: string): Promise<any[]>;
  getConversationById(id: string, userId: string): Promise<Conversation | null>;
  createMessage(data: InsertMessage): Promise<Message>;
  getConversationMessages(conversationId: string, limit?: number, offset?: number): Promise<Message[]>;
  markMessageAsRead(messageId: string, userId: string): Promise<void>;
  markConversationAsRead(conversationId: string, userId: string): Promise<void>;
  getUnreadCount(userId: string): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user;
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData as any)
      .returning();
    return user;
  }

  async linkGoogleAccount(userId: string, googleId: string): Promise<void> {
    await db
      .update(users)
      .set({ googleId })
      .where(eq(users.id, userId));
  }

  async getUserWithProfiles(userId: string): Promise<any> {
    const user = await this.getUserById(userId);
    if (!user) return null;

    const roles = await this.getUserRoles(userId);
    const roleNames = roles.map(r => r.role);

    let practitionerProfile = null;
    let clientProfile = null;

    if (roleNames.includes('practitioner')) {
      practitionerProfile = await this.getPractitionerByUserId(userId);
    }

    if (roleNames.includes('client')) {
      clientProfile = await this.getClientByUserId(userId);
    }

    return {
      ...user,
      roles: roleNames,
      practitionerProfile,
      clientProfile,
    };
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.email,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // User role operations
  async createUserRole(userId: string, role: "client" | "practitioner" | "admin"): Promise<UserRole> {
    const [userRole] = await db
      .insert(userRoles)
      .values({ userId, role })
      .returning();
    return userRole;
  }

  async getUserRoles(userId: string): Promise<UserRole[]> {
    return await db.select().from(userRoles).where(eq(userRoles.userId, userId));
  }

  async isUserAdmin(userId: string): Promise<boolean> {
    const roles = await this.getUserRoles(userId);
    return roles.some(role => role.role === 'admin');
  }

  // Practitioner operations
  async createPractitioner(practitioner: InsertPractitioner): Promise<Practitioner> {
    const [newPractitioner] = await db
      .insert(practitioners)
      .values(practitioner)
      .returning();
    return newPractitioner;
  }

  async getPractitioner(id: string): Promise<Practitioner | undefined> {
    const [practitioner] = await db
      .select()
      .from(practitioners)
      .where(eq(practitioners.id, id));
    return practitioner;
  }

  async getPractitionerByUserId(userId: string): Promise<Practitioner | undefined> {
    const [practitioner] = await db
      .select()
      .from(practitioners)
      .where(eq(practitioners.userId, userId));
    return practitioner;
  }

  async getAllPractitioners(): Promise<Practitioner[]> {
    return await db
      .select()
      .from(practitioners)
      .where(eq(practitioners.isVerified, true))
      .orderBy(desc(practitioners.averageRating));
  }

  async getFeaturedPractitioners(limit: number = 6): Promise<Practitioner[]> {
    return await db
      .select()
      .from(practitioners)
      .where(
        and(
          eq(practitioners.isVerified, true),
          sql`${practitioners.averageRating} >= 4.5`
        )
      )
      .orderBy(desc(practitioners.averageRating))
      .limit(limit);
  }

  // Client operations
  async createClient(client: InsertClient): Promise<Client> {
    const [newClient] = await db
      .insert(clients)
      .values(client)
      .returning();
    return newClient;
  }

  async getClient(id: string): Promise<Client | undefined> {
    const [client] = await db
      .select()
      .from(clients)
      .where(eq(clients.id, id));
    return client;
  }

  async getClientByUserId(userId: string): Promise<Client | undefined> {
    const [client] = await db
      .select()
      .from(clients)
      .where(eq(clients.userId, userId));
    return client;
  }

  // Dashboard data operations
  async getClientDashboardData(userId: string): Promise<any> {
    const client = await this.getClientByUserId(userId);
    if (!client) return null;

    // Get upcoming sessions
    const upcomingSessions = await db
      .select({
        id: sessions_table.id,
        practitionerName: sql<string>`${practitioners.userId}`,
        scheduledDatetime: sessions_table.scheduledDatetime,
        duration: sessions_table.duration,
        status: sessions_table.status,
        isVirtual: sessions_table.isVirtual,
        meetingLink: sessions_table.meetingLink,
        notes: sessions_table.notes,
      })
      .from(sessions_table)
      .innerJoin(practitioners, eq(sessions_table.practitionerId, practitioners.id))
      .where(and(
        eq(sessions_table.clientId, client.id),
        sql`${sessions_table.scheduledDatetime} >= NOW()`
      ))
      .orderBy(sessions_table.scheduledDatetime)
      .limit(5);

    // Get session stats
    const [sessionStats] = await db
      .select({
        totalSessions: sql<number>`COUNT(*)`,
        completedSessions: sql<number>`COUNT(CASE WHEN ${sessions_table.status} = 'completed' THEN 1 END)`,
      })
      .from(sessions_table)
      .where(eq(sessions_table.clientId, client.id));

    return {
      upcomingSessions,
      stats: {
        totalSessions: sessionStats.totalSessions || 0,
        completedSessions: sessionStats.completedSessions || 0,
        upcomingSessions: upcomingSessions.length,
      }
    };
  }

  async getPractitionerDashboardData(userId: string): Promise<any> {
    const practitioner = await this.getPractitionerByUserId(userId);
    if (!practitioner) return null;

    // Get upcoming sessions
    const upcomingSessions = await db
      .select({
        id: sessions_table.id,
        clientName: sql<string>`${clients.userId}`,
        scheduledDatetime: sessions_table.scheduledDatetime,
        duration: sessions_table.duration,
        status: sessions_table.status,
        isVirtual: sessions_table.isVirtual,
        meetingLink: sessions_table.meetingLink,
        notes: sessions_table.notes,
      })
      .from(sessions_table)
      .innerJoin(clients, eq(sessions_table.clientId, clients.id))
      .where(and(
        eq(sessions_table.practitionerId, practitioner.id),
        sql`${sessions_table.scheduledDatetime} >= NOW()`
      ))
      .orderBy(sessions_table.scheduledDatetime)
      .limit(5);

    // Get earnings and session stats
    const [sessionStats] = await db
      .select({
        totalSessions: sql<number>`COUNT(*)`,
        completedSessions: sql<number>`COUNT(CASE WHEN ${sessions_table.status} = 'completed' THEN 1 END)`,
        totalEarnings: sql<number>`SUM(CASE WHEN ${sessions_table.status} = 'completed' THEN ${sessions_table.totalAmount} ELSE 0 END)`,
      })
      .from(sessions_table)
      .where(eq(sessions_table.practitionerId, practitioner.id));

    // Get client count
    const [clientCount] = await db
      .select({
        uniqueClients: sql<number>`COUNT(DISTINCT ${sessions_table.clientId})`,
      })
      .from(sessions_table)
      .where(eq(sessions_table.practitionerId, practitioner.id));

    return {
      upcomingSessions,
      stats: {
        totalSessions: sessionStats.totalSessions || 0,
        completedSessions: sessionStats.completedSessions || 0,
        upcomingSessions: upcomingSessions.length,
        totalEarnings: sessionStats.totalEarnings || 0,
        uniqueClients: clientCount.uniqueClients || 0,
        averageRating: practitioner.averageRating || 0,
      }
    };
  }

  async getUserSessions(userId: string, role: "client" | "practitioner"): Promise<Session[]> {
    if (role === "client") {
      const client = await this.getClientByUserId(userId);
      if (!client) return [];
      
      return await db.select().from(sessions_table)
        .where(eq(sessions_table.clientId, client.id))
        .orderBy(desc(sessions_table.scheduledDatetime));
    } else {
      const practitioner = await this.getPractitionerByUserId(userId);
      if (!practitioner) return [];
      
      return await db.select().from(sessions_table)
        .where(eq(sessions_table.practitionerId, practitioner.id))
        .orderBy(desc(sessions_table.scheduledDatetime));
    }
  }

  async getUserStats(userId: string, role: "client" | "practitioner"): Promise<any> {
    if (role === "client") {
      return this.getClientDashboardData(userId);
    } else {
      return this.getPractitionerDashboardData(userId);
    }
  }

  // Survey operations
  async createSurveyResponse(surveyData: InsertSurveyResponse): Promise<SurveyResponse> {
    const [surveyResponse] = await db
      .insert(surveyResponses)
      .values(surveyData)
      .returning();
    return surveyResponse;
  }

  async getSurveyResponseById(id: string): Promise<SurveyResponse | undefined> {
    const [surveyResponse] = await db
      .select()
      .from(surveyResponses)
      .where(eq(surveyResponses.id, id));
    return surveyResponse;
  }

  async getAllSurveyResponses(): Promise<SurveyResponse[]> {
    return await db
      .select()
      .from(surveyResponses)
      .orderBy(desc(surveyResponses.createdAt));
  }

  async getSurveyResponsesByUserId(userId: string): Promise<SurveyResponse[]> {
    return await db
      .select()
      .from(surveyResponses)
      .where(eq(surveyResponses.userId, userId))
      .orderBy(desc(surveyResponses.createdAt));
  }

  // Reviews operations
  async createReview(reviewData: {
    sessionId: string;
    clientId: string;
    practitionerId: string;
    rating: number;
    comment?: string;
  }): Promise<Review> {
    const [review] = await db
      .insert(reviews)
      .values(reviewData)
      .returning();

    // Update practitioner's average rating
    await this.updatePractitionerRating(reviewData.practitionerId);

    // Award Seeds for review submission
    const client = await this.getClient(reviewData.clientId);
    if (client) {
      await this.awardSeedsForAction(
        client.userId,
        "review_submission",
        review.id,
        "review"
      );
    }

    return review;
  }

  async getReviewsByPractitionerId(practitionerId: string): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.practitionerId, practitionerId))
      .orderBy(desc(reviews.createdAt));
  }

  async getReviewsByClientId(clientId: string): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.clientId, clientId))
      .orderBy(desc(reviews.createdAt));
  }

  async getReviewBySessionId(sessionId: string): Promise<Review | undefined> {
    const [review] = await db
      .select()
      .from(reviews)
      .where(eq(reviews.sessionId, sessionId));
    return review;
  }

  async updatePractitionerRating(practitionerId: string): Promise<void> {
    // Calculate average rating and total sessions
    const reviewStats = await db
      .select({
        avgRating: sql<number>`AVG(${reviews.rating})::numeric(3,2)`,
        totalReviews: sql<number>`COUNT(*)::integer`
      })
      .from(reviews)
      .where(eq(reviews.practitionerId, practitionerId));

    const stats = reviewStats[0];
    if (stats && stats.totalReviews > 0) {
      await db
        .update(practitioners)
        .set({
          averageRating: stats.avgRating.toString(),
          totalSessions: stats.totalReviews
        })
        .where(eq(practitioners.id, practitionerId));
    }
  }

  async getPractitionerReviewsWithClient(practitionerId: string): Promise<any[]> {
    return await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        clientName: sql<string>`CONCAT(${users.firstName}, ' ', ${users.lastName})`,
        clientInitials: sql<string>`CONCAT(LEFT(${users.firstName}, 1), LEFT(${users.lastName}, 1))`
      })
      .from(reviews)
      .innerJoin(clients, eq(reviews.clientId, clients.id))
      .innerJoin(users, eq(clients.userId, users.id))
      .where(eq(reviews.practitionerId, practitionerId))
      .orderBy(desc(reviews.createdAt));
  }

  // Seeds Currency Operations
  async createSeedsWallet(userId: string): Promise<SeedsWallet> {
    const [wallet] = await db
      .insert(seedsWallets)
      .values({ userId })
      .returning();
    return wallet;
  }

  async getSeedsWallet(userId: string): Promise<SeedsWallet | undefined> {
    const [wallet] = await db
      .select()
      .from(seedsWallets)
      .where(eq(seedsWallets.userId, userId));
    return wallet;
  }

  async getOrCreateSeedsWallet(userId: string): Promise<SeedsWallet> {
    let wallet = await this.getSeedsWallet(userId);
    if (!wallet) {
      wallet = await this.createSeedsWallet(userId);
    }
    return wallet;
  }

  async addSeeds(
    userId: string,
    amount: number,
    reason: string,
    description?: string,
    referenceId?: string,
    referenceType?: string,
    metadata?: any
  ): Promise<SeedsTransaction> {
    const wallet = await this.getOrCreateSeedsWallet(userId);
    const newBalance = wallet.seedsBalance + amount;
    const newTotalEarned = wallet.totalEarned + amount;

    // Update wallet
    await db
      .update(seedsWallets)
      .set({
        seedsBalance: newBalance,
        totalEarned: newTotalEarned,
        lastActiveDate: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(seedsWallets.userId, userId));

    // Check and update tier
    await this.updatePollinatorTier(userId, newTotalEarned);

    // Create transaction record
    const [transaction] = await db
      .insert(seedsTransactions)
      .values({
        userId,
        amount,
        type: "earned",
        reason: reason as any,
        description,
        referenceId,
        referenceType,
        balanceAfter: newBalance,
        metadata,
      })
      .returning();

    return transaction;
  }

  async spendSeeds(
    userId: string,
    amount: number,
    description: string,
    referenceId?: string,
    referenceType?: string,
    metadata?: any
  ): Promise<SeedsTransaction | null> {
    const wallet = await this.getSeedsWallet(userId);
    if (!wallet || wallet.seedsBalance < amount) {
      return null; // Insufficient funds
    }

    const newBalance = wallet.seedsBalance - amount;
    const newTotalSpent = wallet.totalSpent + amount;

    // Update wallet
    await db
      .update(seedsWallets)
      .set({
        seedsBalance: newBalance,
        totalSpent: newTotalSpent,
        lastActiveDate: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(seedsWallets.userId, userId));

    // Create transaction record
    const [transaction] = await db
      .insert(seedsTransactions)
      .values({
        userId,
        amount: -amount, // Negative for spending
        type: "spent",
        description,
        referenceId,
        referenceType,
        balanceAfter: newBalance,
        metadata,
      })
      .returning();

    return transaction;
  }

  async updatePollinatorTier(userId: string, totalEarned: number): Promise<void> {
    const currentTier = this.calculatePollinatorTier(totalEarned);
    const nextThreshold = this.getNextTierThreshold(currentTier);

    await db
      .update(seedsWallets)
      .set({
        currentTier: currentTier as any,
        nextTierThreshold: nextThreshold || 0,
      })
      .where(eq(seedsWallets.userId, userId));
  }

  calculatePollinatorTier(totalEarned: number): string {
    if (totalEarned >= pollinatorTierDefinitions.wise_garden.requiredSeeds) return "wise_garden";
    if (totalEarned >= pollinatorTierDefinitions.blooming.requiredSeeds) return "blooming";
    if (totalEarned >= pollinatorTierDefinitions.sprout.requiredSeeds) return "sprout";
    return "seedling";
  }

  getNextTierThreshold(currentTier: string): number | null {
    const tierDef = pollinatorTierDefinitions[currentTier as keyof typeof pollinatorTierDefinitions];
    return tierDef?.nextThreshold || null;
  }

  async getSeedsTransactions(userId: string, limit: number = 50): Promise<SeedsTransaction[]> {
    return await db
      .select()
      .from(seedsTransactions)
      .where(eq(seedsTransactions.userId, userId))
      .orderBy(desc(seedsTransactions.createdAt))
      .limit(limit);
  }

  async getUserSeedsStats(userId: string): Promise<{
    wallet: SeedsWallet;
    tier: any;
    recentTransactions: SeedsTransaction[];
  }> {
    const wallet = await this.getOrCreateSeedsWallet(userId);
    const tier = pollinatorTierDefinitions[wallet.currentTier as keyof typeof pollinatorTierDefinitions];
    const recentTransactions = await this.getSeedsTransactions(userId, 10);

    return {
      wallet,
      tier,
      recentTransactions,
    };
  }

  // Seeds earning helper methods
  async awardSeedsForAction(
    userId: string,
    action: keyof typeof seedsEarningRates,
    referenceId?: string,
    referenceType?: string,
    metadata?: any
  ): Promise<SeedsTransaction | null> {
    const amount = seedsEarningRates[action];
    const description = this.getActionDescription(action);

    return await this.addSeeds(
      userId,
      amount,
      action,
      description,
      referenceId,
      referenceType,
      metadata
    );
  }

  private getActionDescription(action: keyof typeof seedsEarningRates): string {
    const descriptions = {
      profile_completion: "Completed profile setup",
      session_attendance: "Attended a wellness session",
      review_submission: "Submitted a helpful review",
      garden_upload: "Contributed content to Community Garden",
      referral: "Successfully referred a new member",
      daily_login: "Daily platform engagement",
      survey_completion: "Completed feedback survey",
      milestone_achievement: "Reached a platform milestone",
    };
    return descriptions[action];
  }

  // Community Garden Operations
  async createGardenContent(contentData: InsertGardenContent): Promise<GardenContent> {
    const [content] = await db
      .insert(gardenContent)
      .values(contentData)
      .returning();

    // Award Seeds for garden upload
    if (content.authorId) {
      await this.awardSeedsForAction(
        content.authorId,
        "garden_upload",
        content.id,
        "garden_content"
      );
    }

    return content;
  }

  async getGardenContent(options?: {
    authorId?: string;
    contentType?: string;
    status?: string;
    isPublic?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<GardenContent[]> {
    const conditions = [];

    if (options?.authorId) {
      conditions.push(eq(gardenContent.authorId, options.authorId));
    }
    if (options?.contentType) {
      conditions.push(eq(gardenContent.contentType, options.contentType));
    }
    if (options?.status) {
      conditions.push(eq(gardenContent.status, options.status));
    }
    if (options?.isPublic !== undefined) {
      conditions.push(eq(gardenContent.isPublic, options.isPublic));
    }

    let baseQuery = db.select().from(gardenContent);

    if (conditions.length > 0) {
      baseQuery = baseQuery.where(and(...conditions)) as any;
    }

    let finalQuery = baseQuery.orderBy(desc(gardenContent.createdAt)) as any;

    if (options?.limit) {
      finalQuery = finalQuery.limit(options.limit);
    }
    if (options?.offset) {
      finalQuery = finalQuery.offset(options.offset);
    }

    return await finalQuery;
  }

  async getGardenContentById(id: string): Promise<GardenContent | undefined> {
    const [content] = await db
      .select()
      .from(gardenContent)
      .where(eq(gardenContent.id, id));
    return content;
  }

  async recordGardenInteraction(
    userId: string,
    contentId: string,
    interactionType: string,
    aiResponse?: string
  ): Promise<GardenInteraction> {
    // Check if it's a new view to increment view count
    if (interactionType === "view") {
      await db
        .update(gardenContent)
        .set({
          viewCount: sql`${gardenContent.viewCount} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(gardenContent.id, contentId));
    }

    // Record the interaction
    const [interaction] = await db
      .insert(gardenInteractions)
      .values({
        userId,
        contentId,
        interactionType,
        aiResponse,
      })
      .returning();

    return interaction;
  }

  // Admin overview methods
  async getTotalUsers(): Promise<number> {
    const result = await db.select({ count: sql<number>`COUNT(*)` }).from(users);
    return result[0]?.count || 0;
  }

  async getTotalPractitioners(): Promise<number> {
    const result = await db.select({ count: sql<number>`COUNT(*)` }).from(practitioners);
    return result[0]?.count || 0;
  }

  async getTotalClients(): Promise<number> {
    const result = await db.select({ count: sql<number>`COUNT(*)` }).from(clients);
    return result[0]?.count || 0;
  }

  async getTotalSessions(): Promise<number> {
    const result = await db.select({ count: sql<number>`COUNT(*)` }).from(sessions_table);
    return result[0]?.count || 0;
  }

  async getTotalReviews(): Promise<number> {
    const result = await db.select({ count: sql<number>`COUNT(*)` }).from(reviews);
    return result[0]?.count || 0;
  }

  async getTotalSurveyResponses(): Promise<number> {
    const result = await db.select({ count: sql<number>`COUNT(*)` }).from(surveyResponses);
    return result[0]?.count || 0;
  }

  async getTotalGardenContent(): Promise<number> {
    const result = await db.select({ count: sql<number>`COUNT(*)` }).from(gardenContent);
    return result[0]?.count || 0;
  }

  async getTotalSeedsTransactions(): Promise<number> {
    const result = await db.select({ count: sql<number>`COUNT(*)` }).from(seedsTransactions);
    return result[0]?.count || 0;
  }

  async getAllUsersWithProfiles(): Promise<any[]> {
    return await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        createdAt: users.createdAt,
        isEmailVerified: users.isEmailVerified,
        googleId: users.googleId,
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(100);
  }

  async getAllPractitionersWithDetails(): Promise<any[]> {
    return await db
      .select({
        id: practitioners.id,
        archetype: practitioners.archetype,
        experienceLevel: practitioners.experienceLevel,
        bio: practitioners.bio,
        specializations: practitioners.specializations,
        hourlyRate: practitioners.hourlyRate,
        isVerified: practitioners.isVerified,
        totalSessions: practitioners.totalSessions,
        averageRating: practitioners.averageRating,
        createdAt: practitioners.createdAt,
        userEmail: users.email,
        userName: sql<string>`CONCAT(${users.firstName}, ' ', ${users.lastName})`,
      })
      .from(practitioners)
      .innerJoin(users, eq(practitioners.userId, users.id))
      .orderBy(desc(practitioners.createdAt))
      .limit(100);
  }

  async getAllSessionsWithDetails(): Promise<any[]> {
    return await db
      .select({
        id: sessions_table.id,
        scheduledDatetime: sessions_table.scheduledDatetime,
        duration: sessions_table.duration,
        status: sessions_table.status,
        totalAmount: sessions_table.totalAmount,
        isVirtual: sessions_table.isVirtual,
        createdAt: sessions_table.createdAt,
        clientEmail: sql<string>`client_user.email`,
        practitionerEmail: sql<string>`practitioner_user.email`,
      })
      .from(sessions_table)
      .innerJoin(clients, eq(sessions_table.clientId, clients.id))
      .innerJoin(practitioners, eq(sessions_table.practitionerId, practitioners.id))
      .innerJoin(users, eq(clients.userId, users.id))
      .innerJoin(users, eq(practitioners.userId, users.id))
      .orderBy(desc(sessions_table.createdAt))
      .limit(100);
  }

  async getAllGardenContentWithDetails(): Promise<any[]> {
    return await db
      .select({
        id: gardenContent.id,
        title: gardenContent.title,
        description: gardenContent.description,
        contentType: gardenContent.contentType,
        status: gardenContent.status,
        isPublic: gardenContent.isPublic,
        isFeatured: gardenContent.isFeatured,
        viewCount: gardenContent.viewCount,
        likeCount: gardenContent.likeCount,
        seedsReward: gardenContent.seedsReward,
        createdAt: gardenContent.createdAt,
        authorEmail: users.email,
        authorName: sql<string>`CONCAT(${users.firstName}, ' ', ${users.lastName})`,
      })
      .from(gardenContent)
      .innerJoin(users, eq(gardenContent.authorId, users.id))
      .orderBy(desc(gardenContent.createdAt))
      .limit(100);
  }

  async getAllSeedsData(): Promise<any> {
    const walletsData = await db
      .select({
        userId: seedsWallets.userId,
        seedsBalance: seedsWallets.seedsBalance,
        totalEarned: seedsWallets.totalEarned,
        totalSpent: seedsWallets.totalSpent,
        currentTier: seedsWallets.currentTier,
        userEmail: users.email,
        userName: sql<string>`CONCAT(${users.firstName}, ' ', ${users.lastName})`,
      })
      .from(seedsWallets)
      .innerJoin(users, eq(seedsWallets.userId, users.id))
      .orderBy(desc(seedsWallets.totalEarned))
      .limit(50);

    const recentTransactions = await db
      .select({
        id: seedsTransactions.id,
        amount: seedsTransactions.amount,
        type: seedsTransactions.type,
        reason: seedsTransactions.reason,
        description: seedsTransactions.description,
        balanceAfter: seedsTransactions.balanceAfter,
        createdAt: seedsTransactions.createdAt,
        userEmail: users.email,
      })
      .from(seedsTransactions)
      .innerJoin(users, eq(seedsTransactions.userId, users.id))
      .orderBy(desc(seedsTransactions.createdAt))
      .limit(100);

    const totalSeeds = await db
      .select({
        totalBalance: sql<number>`SUM(${seedsWallets.seedsBalance})`,
        totalEarned: sql<number>`SUM(${seedsWallets.totalEarned})`,
        totalSpent: sql<number>`SUM(${seedsWallets.totalSpent})`
      })
      .from(seedsWallets);

    return {
      wallets: walletsData,
      recentTransactions,
      totals: totalSeeds[0] || { totalBalance: 0, totalEarned: 0, totalSpent: 0 }
    };
  }

  // Access control methods
  async getUserAccessLevel(userId: string): Promise<string | null> {
    const user = await db.select({ accessLevel: users.accessLevel })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return user[0]?.accessLevel || null;
  }

  async updateUserAccess(userId: string, accessLevel: string, subscriptionStatus: string, options?: any): Promise<void> {
    const updateData: any = {
      accessLevel,
      subscriptionStatus,
      updatedAt: new Date(),
    };

    if (options?.trialEndDate) {
      updateData.trialEndDate = options.trialEndDate;
    }

    if (options?.subscriptionStartDate) {
      updateData.subscriptionStartDate = options.subscriptionStartDate;
    }

    if (options?.subscriptionEndDate) {
      updateData.subscriptionEndDate = options.subscriptionEndDate;
    }

    await db.update(users)
      .set(updateData)
      .where(eq(users.id, userId));
  }

  async getUserSessionsThisMonth(userId: string): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    // Count sessions where user is the client
    const clientSessions = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(sessions_table)
      .innerJoin(clients, eq(sessions_table.clientId, clients.id))
      .where(
        and(
          eq(clients.userId, userId),
          gte(sessions_table.createdAt, startOfMonth),
          lt(sessions_table.createdAt, endOfMonth)
        )
      );

    return clientSessions[0]?.count || 0;
  }

  async hasUsedTrial(userId: string): Promise<boolean> {
    const user = await db.select({ trialEndDate: users.trialEndDate })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return !!user[0]?.trialEndDate;
  }

  // Seeds system methods
  async addSeedsTransaction(transactionData: any): Promise<void> {
    await db.insert(seedsTransactions).values(transactionData);
  }

  // Garden interaction methods
  async createGardenInteraction(interactionData: any): Promise<any> {
    const [interaction] = await db
      .insert(gardenInteractions)
      .values(interactionData)
      .returning();
    return interaction;
  }

  async incrementGardenContentViews(contentId: string): Promise<void> {
    await db
      .update(gardenContent)
      .set({
        viewCount: sql`${gardenContent.viewCount} + 1`
      })
      .where(eq(gardenContent.id, contentId));
  }

  // Favorites methods
  async getFavoritePractitioners(userId: string): Promise<any[]> {
    return await db.select()
      .from(favoritePractitioners)
      .where(eq(favoritePractitioners.userId, userId));
  }

  async addFavoritePractitioner(userId: string, practitionerId: string): Promise<void> {
    await db.insert(favoritePractitioners).values({
      userId,
      practitionerId
    });
  }

  async removeFavoritePractitioner(userId: string, practitionerId: string): Promise<void> {
    await db.delete(favoritePractitioners)
      .where(
        and(
          eq(favoritePractitioners.userId, userId),
          eq(favoritePractitioners.practitionerId, practitionerId)
        )
      );
  }

  // Booking methods
  async getPractitionerBookingsByDate(practitionerId: string, date: Date): Promise<any[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await db.select()
      .from(sessions_table)
      .where(
        and(
          eq(sessions_table.practitionerId, practitionerId),
          gte(sessions_table.scheduledDatetime, startOfDay),
          lt(sessions_table.scheduledDatetime, endOfDay),
          eq(sessions_table.status, 'scheduled')
        )
      );
  }

  async checkBookingConflicts(
    practitionerId: string,
    scheduledDatetime: Date,
    duration: number
  ): Promise<any[]> {
    const endTime = new Date(scheduledDatetime.getTime() + duration * 60000);

    return await db.select()
      .from(sessions_table)
      .where(
        and(
          eq(sessions_table.practitionerId, practitionerId),
          eq(sessions_table.status, 'scheduled'),
          // Check if new booking overlaps with existing bookings
          sql`${sessions_table.scheduledDatetime} < ${endTime} AND
              ${sessions_table.scheduledDatetime} + (${sessions_table.duration} * interval '1 minute') > ${scheduledDatetime}`
        )
      );
  }

  async createBooking(bookingData: any): Promise<any> {
    const result = await db.insert(sessions_table).values(bookingData).returning();
    return result[0];
  }

  async getUserBookings(userId: string): Promise<any[]> {
    // Get user's client and practitioner profiles
    const clientProfile = await this.getClientByUserId(userId);
    const practitionerProfile = await this.getPractitionerByUserId(userId);

    const bookings = [];

    // Get bookings where user is the client
    if (clientProfile) {
      const clientBookings = await db.select()
        .from(sessions_table)
        .where(eq(sessions_table.clientId, clientProfile.id))
        .orderBy(desc(sessions_table.scheduledDatetime));
      bookings.push(...clientBookings);
    }

    // Get bookings where user is the practitioner
    if (practitionerProfile) {
      const practitionerBookings = await db.select()
        .from(sessions_table)
        .where(eq(sessions_table.practitionerId, practitionerProfile.id))
        .orderBy(desc(sessions_table.scheduledDatetime));
      bookings.push(...practitionerBookings);
    }

    return bookings;
  }

  async getBookingById(id: string): Promise<any> {
    const result = await db.select()
      .from(sessions_table)
      .where(eq(sessions_table.id, id))
      .limit(1);
    return result[0];
  }

  async updateBookingStatus(id: string, status: string): Promise<void> {
    await db.update(sessions_table)
      .set({ status: status as any })
      .where(eq(sessions_table.id, id));
  }

  // ============================================
  // MESSAGING METHODS
  // ============================================

  async getOrCreateConversation(userId1: string, userId2: string): Promise<Conversation> {
    // Check if conversation already exists (in either direction)
    const existingConversation = await db.select()
      .from(conversations)
      .where(
        or(
          and(
            eq(conversations.participant1Id, userId1),
            eq(conversations.participant2Id, userId2)
          ),
          and(
            eq(conversations.participant1Id, userId2),
            eq(conversations.participant2Id, userId1)
          )
        )
      )
      .limit(1);

    if (existingConversation.length > 0) {
      return existingConversation[0];
    }

    // Create new conversation
    const [newConversation] = await db.insert(conversations)
      .values({
        participant1Id: userId1,
        participant2Id: userId2,
      })
      .returning();

    return newConversation;
  }

  async getUserConversations(userId: string): Promise<any[]> {
    // Get all conversations where user is a participant
    const userConversations = await db.select()
      .from(conversations)
      .where(
        or(
          eq(conversations.participant1Id, userId),
          eq(conversations.participant2Id, userId)
        )
      )
      .orderBy(desc(conversations.lastMessageAt));

    // Enrich with participant info and unread count
    const enrichedConversations = await Promise.all(
      userConversations.map(async (conv) => {
        const otherUserId = conv.participant1Id === userId
          ? conv.participant2Id
          : conv.participant1Id;

        const [otherUser] = await db.select({
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
          profileImageUrl: users.profileImageUrl,
        })
          .from(users)
          .where(eq(users.id, otherUserId));

        // Get unread count for this conversation
        const [unreadResult] = await db.select({ count: count() })
          .from(messages)
          .where(
            and(
              eq(messages.conversationId, conv.id),
              eq(messages.isRead, false),
              sql`${messages.senderId} != ${userId}`
            )
          );

        return {
          ...conv,
          otherParticipant: otherUser,
          unreadCount: unreadResult?.count || 0,
        };
      })
    );

    return enrichedConversations;
  }

  async getConversationById(id: string, userId: string): Promise<Conversation | null> {
    const [conversation] = await db.select()
      .from(conversations)
      .where(
        and(
          eq(conversations.id, id),
          or(
            eq(conversations.participant1Id, userId),
            eq(conversations.participant2Id, userId)
          )
        )
      );

    return conversation || null;
  }

  async createMessage(data: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages)
      .values(data)
      .returning();

    // Update conversation's lastMessageAt and preview
    const preview = data.content.length > 100
      ? data.content.substring(0, 100) + '...'
      : data.content;

    await db.update(conversations)
      .set({
        lastMessageAt: new Date(),
        lastMessagePreview: preview,
        updatedAt: new Date(),
      })
      .where(eq(conversations.id, data.conversationId));

    return message;
  }

  async getConversationMessages(
    conversationId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<Message[]> {
    const messageList = await db.select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(asc(messages.createdAt))
      .limit(limit)
      .offset(offset);

    return messageList;
  }

  async markMessageAsRead(messageId: string, userId: string): Promise<void> {
    // Only mark as read if the user is not the sender
    await db.update(messages)
      .set({
        isRead: true,
        readAt: new Date(),
      })
      .where(
        and(
          eq(messages.id, messageId),
          sql`${messages.senderId} != ${userId}`
        )
      );
  }

  async markConversationAsRead(conversationId: string, userId: string): Promise<void> {
    // Mark all messages in the conversation as read (except ones sent by the user)
    await db.update(messages)
      .set({
        isRead: true,
        readAt: new Date(),
      })
      .where(
        and(
          eq(messages.conversationId, conversationId),
          eq(messages.isRead, false),
          sql`${messages.senderId} != ${userId}`
        )
      );
  }

  async getUnreadCount(userId: string): Promise<number> {
    // Get all conversations where user is a participant
    const userConversations = await db.select({ id: conversations.id })
      .from(conversations)
      .where(
        or(
          eq(conversations.participant1Id, userId),
          eq(conversations.participant2Id, userId)
        )
      );

    if (userConversations.length === 0) {
      return 0;
    }

    const conversationIds = userConversations.map(c => c.id);

    // Count unread messages in those conversations (not sent by user)
    const [result] = await db.select({ count: count() })
      .from(messages)
      .where(
        and(
          inArray(messages.conversationId, conversationIds),
          eq(messages.isRead, false),
          sql`${messages.senderId} != ${userId}`
        )
      );

    return result?.count || 0;
  }

  // ==========================================
  // Facilitator Application Methods
  // ==========================================

  async createFacilitatorApplication(data: InsertFacilitatorApplication): Promise<FacilitatorApplication> {
    const [application] = await db.insert(facilitatorApplications)
      .values(data)
      .returning();
    return application;
  }

  async getFacilitatorApplication(id: string): Promise<FacilitatorApplication | null> {
    const [application] = await db.select()
      .from(facilitatorApplications)
      .where(eq(facilitatorApplications.id, id));
    return application || null;
  }

  async getFacilitatorApplicationByUserId(userId: string): Promise<FacilitatorApplication | null> {
    const [application] = await db.select()
      .from(facilitatorApplications)
      .where(eq(facilitatorApplications.userId, userId))
      .orderBy(desc(facilitatorApplications.createdAt));
    return application || null;
  }

  async getFacilitatorApplicationByEmail(email: string): Promise<FacilitatorApplication | null> {
    const [application] = await db.select()
      .from(facilitatorApplications)
      .where(
        and(
          eq(facilitatorApplications.email, email),
          eq(facilitatorApplications.status, "in_progress")
        )
      )
      .orderBy(desc(facilitatorApplications.createdAt));
    return application || null;
  }

  async updateFacilitatorApplication(
    id: string,
    data: Partial<InsertFacilitatorApplication>
  ): Promise<FacilitatorApplication | null> {
    const [application] = await db.update(facilitatorApplications)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(facilitatorApplications.id, id))
      .returning();
    return application || null;
  }

  async updateFacilitatorApplicationConversation(
    id: string,
    conversationHistory: any[]
  ): Promise<void> {
    await db.update(facilitatorApplications)
      .set({
        conversationHistory,
        updatedAt: new Date()
      })
      .where(eq(facilitatorApplications.id, id));
  }

  async submitFacilitatorApplication(id: string): Promise<FacilitatorApplication | null> {
    const [application] = await db.update(facilitatorApplications)
      .set({
        status: "submitted",
        updatedAt: new Date()
      })
      .where(eq(facilitatorApplications.id, id))
      .returning();
    return application || null;
  }

  async getAllFacilitatorApplications(status?: string): Promise<FacilitatorApplication[]> {
    if (status) {
      return db.select()
        .from(facilitatorApplications)
        .where(eq(facilitatorApplications.status, status as any))
        .orderBy(desc(facilitatorApplications.createdAt));
    }
    return db.select()
      .from(facilitatorApplications)
      .orderBy(desc(facilitatorApplications.createdAt));
  }

  async approveFacilitatorApplication(
    id: string,
    reviewedBy: string,
    notes?: string
  ): Promise<FacilitatorApplication | null> {
    const [application] = await db.update(facilitatorApplications)
      .set({
        status: "approved",
        reviewedBy,
        reviewedAt: new Date(),
        reviewNotes: notes,
        updatedAt: new Date()
      })
      .where(eq(facilitatorApplications.id, id))
      .returning();
    return application || null;
  }

  async rejectFacilitatorApplication(
    id: string,
    reviewedBy: string,
    notes?: string
  ): Promise<FacilitatorApplication | null> {
    const [application] = await db.update(facilitatorApplications)
      .set({
        status: "rejected",
        reviewedBy,
        reviewedAt: new Date(),
        reviewNotes: notes,
        updatedAt: new Date()
      })
      .where(eq(facilitatorApplications.id, id))
      .returning();
    return application || null;
  }

  // ==========================================
  // Stripe Connect Account Methods
  // ==========================================

  async createStripeConnectAccount(data: InsertStripeConnectAccount): Promise<StripeConnectAccount> {
    const [account] = await db.insert(stripeConnectAccounts)
      .values(data)
      .returning();
    return account;
  }

  async getStripeConnectAccountByPractitionerId(practitionerId: string): Promise<StripeConnectAccount | null> {
    const [account] = await db.select()
      .from(stripeConnectAccounts)
      .where(eq(stripeConnectAccounts.practitionerId, practitionerId));
    return account || null;
  }

  async updateStripeConnectAccount(
    practitionerId: string,
    data: Partial<InsertStripeConnectAccount>
  ): Promise<StripeConnectAccount | null> {
    const [account] = await db.update(stripeConnectAccounts)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(stripeConnectAccounts.practitionerId, practitionerId))
      .returning();
    return account || null;
  }

  // ==========================================
  // Payout Methods
  // ==========================================

  async createPayout(data: InsertPayout): Promise<Payout> {
    const [payout] = await db.insert(payouts)
      .values(data)
      .returning();
    return payout;
  }

  async getPayout(id: string): Promise<Payout | null> {
    const [payout] = await db.select()
      .from(payouts)
      .where(eq(payouts.id, id));
    return payout || null;
  }

  async getPayoutsByPractitionerId(practitionerId: string): Promise<Payout[]> {
    return db.select()
      .from(payouts)
      .where(eq(payouts.practitionerId, practitionerId))
      .orderBy(desc(payouts.createdAt));
  }

  async getAllPayouts(status?: string): Promise<Payout[]> {
    if (status) {
      return db.select()
        .from(payouts)
        .where(eq(payouts.status, status as any))
        .orderBy(desc(payouts.createdAt));
    }
    return db.select()
      .from(payouts)
      .orderBy(desc(payouts.createdAt));
  }

  async updatePayout(id: string, data: Partial<InsertPayout>): Promise<Payout | null> {
    const [payout] = await db.update(payouts)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(payouts.id, id))
      .returning();
    return payout || null;
  }

  async processPayout(
    id: string,
    processedBy: string,
    stripeTransferId: string
  ): Promise<Payout | null> {
    const [payout] = await db.update(payouts)
      .set({
        status: "completed",
        processedBy,
        processedAt: new Date(),
        stripeTransferId,
        updatedAt: new Date()
      })
      .where(eq(payouts.id, id))
      .returning();
    return payout || null;
  }

  async getPractitionerEarnings(practitionerId: string): Promise<{
    totalEarned: number;
    pendingPayout: number;
    completedPayouts: number;
  }> {
    // Get completed sessions for this practitioner
    const completedSessions = await db.select()
      .from(sessions_table)
      .where(
        and(
          eq(sessions_table.practitionerId, practitionerId),
          eq(sessions_table.status, "completed"),
          eq(sessions_table.paymentStatus, "succeeded")
        )
      );

    const totalEarned = completedSessions.reduce(
      (sum, s) => sum + (parseFloat(s.totalAmount as string) || 0) * 0.85,
      0
    );

    // Get payout totals
    const allPayouts = await this.getPayoutsByPractitionerId(practitionerId);
    const completedPayouts = allPayouts
      .filter(p => p.status === "completed")
      .reduce((sum, p) => sum + (parseFloat(p.amount as string) || 0), 0);

    const pendingPayout = totalEarned - completedPayouts;

    return {
      totalEarned,
      pendingPayout: Math.max(0, pendingPayout),
      completedPayouts
    };
  }
}

export const storage = new DatabaseStorage();
