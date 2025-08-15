import { sql, relations } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  decimal,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  passwordHash: varchar("password_hash"), // for email/password auth
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  isEmailVerified: boolean("is_email_verified").default(false),
  emailVerificationToken: varchar("email_verification_token"),
  resetPasswordToken: varchar("reset_password_token"),
  resetPasswordExpires: timestamp("reset_password_expires"),
  googleId: varchar("google_id"), // for Google OAuth
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Enums for archetype system
export const archetypeEnum = pgEnum("archetype", ["bee", "hummingbird", "butterfly", "beetle"]);
export const experienceLevelEnum = pgEnum("experience_level", ["rising", "evolving", "wise"]);
export const userRoleEnum = pgEnum("user_role", ["client", "practitioner"]);
export const sessionStatusEnum = pgEnum("session_status", ["scheduled", "completed", "cancelled", "no-show"]);

// User roles table
export const userRoles = pgTable("user_roles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  role: userRoleEnum("role").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Practitioners table
export const practitioners = pgTable("practitioners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  archetype: archetypeEnum("archetype").notNull(),
  experienceLevel: experienceLevelEnum("experience_level").notNull(),
  bio: text("bio"),
  specializations: text("specializations").array(),
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
  location: varchar("location"),
  isVirtual: boolean("is_virtual").default(true),
  isInPerson: boolean("is_in_person").default(false),
  isVerified: boolean("is_verified").default(false),
  totalSessions: integer("total_sessions").default(0),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Clients table
export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  preferredArchetypes: archetypeEnum("preferred_archetype").array(),
  budgetMin: decimal("budget_min", { precision: 10, scale: 2 }),
  budgetMax: decimal("budget_max", { precision: 10, scale: 2 }),
  location: varchar("location"),
  preferenceVirtual: boolean("preference_virtual").default(true),
  preferenceInPerson: boolean("preference_in_person").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sessions table
export const sessions_table = pgTable("sessions_booking", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull().references(() => clients.id),
  practitionerId: varchar("practitioner_id").notNull().references(() => practitioners.id),
  scheduledDatetime: timestamp("scheduled_datetime").notNull(),
  duration: integer("duration").notNull().default(60), // in minutes
  status: sessionStatusEnum("status").notNull().default("scheduled"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  isVirtual: boolean("is_virtual").notNull(),
  meetingLink: varchar("meeting_link"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Reviews table
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull().references(() => sessions_table.id),
  clientId: varchar("client_id").notNull().references(() => clients.id),
  practitionerId: varchar("practitioner_id").notNull().references(() => practitioners.id),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  userRoles: many(userRoles),
  practitionerProfile: many(practitioners),
  clientProfile: many(clients),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
}));

export const practitionersRelations = relations(practitioners, ({ one, many }) => ({
  user: one(users, {
    fields: [practitioners.userId],
    references: [users.id],
  }),
  sessions: many(sessions_table),
  reviews: many(reviews),
}));

export const clientsRelations = relations(clients, ({ one, many }) => ({
  user: one(users, {
    fields: [clients.userId],
    references: [users.id],
  }),
  sessions: many(sessions_table),
  reviews: many(reviews),
}));

export const sessionsRelations = relations(sessions_table, ({ one, many }) => ({
  client: one(clients, {
    fields: [sessions_table.clientId],
    references: [clients.id],
  }),
  practitioner: one(practitioners, {
    fields: [sessions_table.practitionerId],
    references: [practitioners.id],
  }),
  review: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  session: one(sessions_table, {
    fields: [reviews.sessionId],
    references: [sessions_table.id],
  }),
  client: one(clients, {
    fields: [reviews.clientId],
    references: [clients.id],
  }),
  practitioner: one(practitioners, {
    fields: [reviews.practitionerId],
    references: [practitioners.id],
  }),
}));

// Zod schemas
export const upsertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPractitionerSchema = createInsertSchema(practitioners).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  totalSessions: true,
  averageRating: true,
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSessionSchema = createInsertSchema(sessions_table).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type UserRole = typeof userRoles.$inferSelect;
export type Practitioner = typeof practitioners.$inferSelect;
export type Client = typeof clients.$inferSelect;
export type Session = typeof sessions_table.$inferSelect;
export type Review = typeof reviews.$inferSelect;

export type InsertPractitioner = z.infer<typeof insertPractitionerSchema>;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;

// Archetype definitions
export const archetypeDefinitions = {
  bee: {
    name: 'Bee',
    description: 'Grounding and foundational support',
    specialties: ['nervous system regulation', 'daily practices', 'somatic work'],
    color: '#D4AF37',
    traits: ['Community', 'Structure', 'Productivity']
  },
  hummingbird: {
    name: 'Hummingbird',
    description: 'Precise insight and spiritual guidance',
    specialties: ['intuitive readings', 'energy work', 'spiritual coaching'],
    color: '#2F4F4F',
    traits: ['Joy', 'Speed', 'Intuition']
  },
  butterfly: {
    name: 'Butterfly',
    description: 'Life transitions and transformation',
    specialties: ['life coaching', 'identity work', 'major life changes'],
    color: '#C49C9C',
    traits: ['Transformation', 'Beauty', 'Growth']
  },
  beetle: {
    name: 'Beetle',
    description: 'Deep integration and shadow work',
    specialties: ['trauma healing', 'shadow integration', 'ancestral work'],
    color: '#8B4513',
    traits: ['Strength', 'Persistence', 'Foundation']
  }
} as const;

export const experienceLevelDefinitions = {
  rising: {
    name: 'Rising Pollinator',
    description: '0-2 years experience, fresh energy and passion',
    color: '#FFF5B7',
    requirements: 'Basic certification, mentorship support'
  },
  evolving: {
    name: 'Evolving Pollinator',
    description: '3-7 years experience, established practice',
    color: '#FF8B6A',
    requirements: 'Proven track record, client testimonials'
  },
  wise: {
    name: 'Wise Pollinator',
    description: '8+ years experience, deep embodied wisdom',
    color: '#4B3F72',
    requirements: 'Extensive experience, mentorship of other practitioners'
  }
} as const;
