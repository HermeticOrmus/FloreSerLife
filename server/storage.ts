import {
  users,
  practitioners,
  clients,
  userRoles,
  sessions_table,
  reviews,
  type User,
  type UpsertUser,
  type Practitioner,
  type Client,
  type UserRole,
  type Session,
  type Review,
  type InsertPractitioner,
  type InsertClient,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // User role operations
  createUserRole(userId: string, role: "client" | "practitioner"): Promise<UserRole>;
  getUserRoles(userId: string): Promise<UserRole[]>;
  
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
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // User role operations
  async createUserRole(userId: string, role: "client" | "practitioner"): Promise<UserRole> {
    const [userRole] = await db
      .insert(userRoles)
      .values({ userId, role })
      .returning();
    return userRole;
  }

  async getUserRoles(userId: string): Promise<UserRole[]> {
    return await db.select().from(userRoles).where(eq(userRoles.userId, userId));
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
}

export const storage = new DatabaseStorage();
