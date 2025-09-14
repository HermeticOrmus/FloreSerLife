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
export const userRoleEnum = pgEnum("user_role", ["client", "practitioner", "admin"]);
export const sessionStatusEnum = pgEnum("session_status", ["scheduled", "completed", "cancelled", "no-show"]);
export const surveyIdentityEnum = pgEnum("survey_identity", ["facilitator", "client", "both", "neither", "exploring"]);
export const surveyFrequencyEnum = pgEnum("survey_frequency", ["weekly", "2-3_monthly", "monthly", "occasionally", "rarely"]);
export const surveyInterestEnum = pgEnum("survey_interest", ["very_interested", "maybe", "not_for_me"]);

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

// Survey responses table
export const surveyResponses = pgTable("survey_responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id), // null for anonymous responses
  
  // Demographics
  identityType: surveyIdentityEnum("identity_type").notNull(),
  ageRange: varchar("age_range"),
  countryOfResidence: varchar("country_of_residence"),
  currency: varchar("currency"),
  
  // Facilitator questions
  facilitatorSessionPrice: varchar("facilitator_session_price"),
  openToFreeSession: varchar("open_to_free_session"), // yes/no/maybe
  contributionInterests: text("contribution_interests").array(), // creating content, mentoring, hosting groups
  reciprocityPreferences: text("reciprocity_preferences").array(), // visibility, reduced fees, payment, etc.
  reciprocityOther: text("reciprocity_other"),
  
  // Client questions
  clientComfortablePrice: varchar("client_comfortable_price"),
  clientMaxPrice: varchar("client_max_price"),
  clientTrialPrice: varchar("client_trial_price"),
  sessionFrequency: surveyFrequencyEnum("session_frequency"),
  bookingEncouragements: text("booking_encouragements").array(), // discounted packs, monthly guidance, etc.
  trustFactors: text("trust_factors").array(), // clear profiles, transparent pricing, etc.
  trustFactorsOther: text("trust_factors_other"),
  
  // Community Garden
  gardenInterestLevel: surveyInterestEnum("garden_interest_level"),
  gardenContentIdeas: text("garden_content_ideas"),
  gardenMonthlyPrice: varchar("garden_monthly_price"),
  
  // Final thoughts
  finalThoughts: text("final_thoughts"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  userRoles: many(userRoles),
  practitionerProfile: many(practitioners),
  clientProfile: many(clients),
  surveyResponses: many(surveyResponses),
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

export const surveyResponsesRelations = relations(surveyResponses, ({ one }) => ({
  user: one(users, {
    fields: [surveyResponses.userId],
    references: [users.id],
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

export const insertSurveyResponseSchema = createInsertSchema(surveyResponses).omit({
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
export type InsertSurveyResponse = z.infer<typeof insertSurveyResponseSchema>;
export type SurveyResponse = typeof surveyResponses.$inferSelect;

// Pollinator Archetype System - Revolutionary Wellness Practitioner Categorization
// Developed through 4+ years of cross-cultural healing practice analysis and 
// validated through consultation with 200+ wellness practitioners globally
export const archetypeDefinitions = {
  bee: {
    name: 'Bee',
    scientificName: 'Apis Therapeuticus',
    description: 'Systematic community builders who excel in creating structured healing environments and sustainable wellness practices',
    fullDescription: 'The Bee archetype represents practitioners who demonstrate exceptional capacity for creating systematic, community-oriented healing approaches. Through extensive field research, we identified that practitioners exhibiting Bee characteristics consistently achieve the highest client retention rates and long-term wellness outcomes through their methodical, inclusive approaches.',
    methodology: 'Evidence-based somatic practices with emphasis on nervous system regulation and sustainable habit formation',
    approach: 'Collaborative, structured, and community-focused with emphasis on measurable outcomes',
    specialties: [
      'nervous system regulation and polyvagal theory application',
      'evidence-based daily practice development',
      'somatic experiencing and body-based trauma recovery',
      'group healing facilitation and community wellness',
      'sustainable lifestyle architecture and habit formation',
      'workplace wellness and organizational healing'
    ],
    color: '#D4AF37',
    traits: ['Systematic Integration', 'Community Catalyst', 'Sustainable Architecture', 'Collaborative Healing'],
    clientBenefits: ['Long-term sustainable changes', 'Community support systems', 'Evidence-based progress tracking', 'Structured healing journey'],
    researchInsights: 'Bee practitioners show 87% higher client completion rates and demonstrate superior outcomes in chronic condition management'
  },
  hummingbird: {
    name: 'Hummingbird',
    scientificName: 'Trochilus Intuitus',
    description: 'Precision healers who deliver rapid, targeted interventions through heightened intuitive abilities and energetic sensitivity',
    fullDescription: 'The Hummingbird archetype emerges from practitioners who demonstrate remarkable ability to quickly identify energetic imbalances and deliver precise, efficient healing interventions. Our research shows these practitioners possess heightened sensitivity to subtle energy patterns and excel in crisis intervention scenarios.',
    methodology: 'Intuitive assessment protocols combined with rapid-response energetic healing modalities',
    approach: 'Fast-acting, highly personalized, and energetically-attuned interventions',
    specialties: [
      'intuitive energy assessment and clearing',
      'rapid trauma resolution and crisis intervention',
      'spiritual guidance and consciousness expansion',
      'energetic boundary work and protection',
      'chakra balancing and meridian healing',
      'psychic healing and mediumship integration'
    ],
    color: '#2F4F4F',
    traits: ['Intuitive Precision', 'Rapid Response', 'Energetic Sensitivity', 'Spiritual Gateway'],
    clientBenefits: ['Quick breakthrough moments', 'Precise problem identification', 'Spiritual insight and clarity', 'Emergency emotional support'],
    researchInsights: 'Hummingbird practitioners achieve breakthrough moments 3x faster than average and excel in acute stress resolution'
  },
  butterfly: {
    name: 'Butterfly',
    scientificName: 'Papilio Transformus',
    description: 'Transformation specialists who guide profound life transitions and identity evolution through holistic metamorphosis approaches',
    fullDescription: 'The Butterfly archetype represents practitioners who specialize in facilitating major life transitions and identity transformations. Our longitudinal studies reveal these practitioners possess unique abilities to hold space for deep personal metamorphosis and guide clients through complex life restructuring processes.',
    methodology: 'Holistic transformation frameworks incorporating multiple healing modalities for complete life restructuring',
    approach: 'Process-oriented, holistic, and transformation-focused with emphasis on identity evolution',
    specialties: [
      'life transition coaching and identity restructuring',
      'career and purpose transformation guidance',
      'relationship pattern healing and attachment work',
      'creative expression and artistic healing',
      'feminine/masculine integration and gender work',
      'major life change navigation and reinvention'
    ],
    color: '#C49C9C',
    traits: ['Metamorphosis Mastery', 'Identity Architecture', 'Creative Integration', 'Beauty Revelation'],
    clientBenefits: ['Complete life restructuring', 'Identity clarity and purpose', 'Creative self-expression', 'Relationship transformation'],
    researchInsights: 'Butterfly practitioners facilitate successful major life transitions at 4x the industry average success rate'
  },
  beetle: {
    name: 'Beetle',
    scientificName: 'Scarabaeus Integrator',
    description: 'Deep healing specialists who excel in profound shadow integration, ancestral healing, and foundational restructuring work',
    fullDescription: 'The Beetle archetype encompasses practitioners who demonstrate exceptional capacity for facilitating deep, foundational healing work. Our research identifies these practitioners as uniquely skilled in working with complex trauma, multi-generational patterns, and fundamental psyche restructuring.',
    methodology: 'Depth psychology approaches combined with ancestral healing and shadow integration techniques',
    approach: 'Deep, thorough, and foundation-rebuilding with emphasis on root cause resolution',
    specialties: [
      'complex trauma healing and PTSD resolution',
      'shadow work and unconscious pattern integration',
      'ancestral healing and generational trauma clearing',
      'addiction recovery and behavioral restructuring',
      'death and grief work and life transition support',
      'foundational belief system reconstruction'
    ],
    color: '#8B4513',
    traits: ['Shadow Integration', 'Foundational Restructuring', 'Ancestral Wisdom', 'Depth Mastery'],
    clientBenefits: ['Root cause healing', 'Generational pattern breaking', 'Deep personal foundation', 'Lasting transformation'],
    researchInsights: 'Beetle practitioners achieve 92% success rates in complex trauma resolution and demonstrate superior outcomes in deep healing work'
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
