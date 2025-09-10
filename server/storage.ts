import {
  users,
  practitioners,
  clients,
  userRoles,
  sessions_table,
  reviews,
  surveyResponses,
  type User,
  type UpsertUser,
  type Practitioner,
  type Client,
  type UserRole,
  type Session,
  type Review,
  type SurveyResponse,
  type InsertPractitioner,
  type InsertClient,
  type InsertSurveyResponse,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

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
}

export const storage = new DatabaseStorage();
