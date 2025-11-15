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

// Subscription and access control enums (needed before users table)
export const subscriptionStatusEnum = pgEnum("subscription_status", ["free", "trial", "premium", "cancelled", "expired"]);
export const accessLevelEnum = pgEnum("access_level", ["preview", "basic", "premium", "unlimited"]);

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

  // Subscription and access control
  subscriptionStatus: subscriptionStatusEnum("subscription_status").default("free"),
  accessLevel: accessLevelEnum("access_level").default("preview"),
  subscriptionStartDate: timestamp("subscription_start_date"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  trialEndDate: timestamp("trial_end_date"),
  checkoutCustomerId: varchar("checkout_customer_id"),
  checkoutSubscriptionId: varchar("checkout_subscription_id"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Enums for archetype system
export const archetypeEnum = pgEnum("archetype", ["bee", "hummingbird", "butterfly", "beetle"]);
export const experienceLevelEnum = pgEnum("experience_level", ["rising", "evolving", "wise"]);
export const userRoleEnum = pgEnum("user_role", ["client", "practitioner", "admin"]);
export const sessionStatusEnum = pgEnum("session_status", ["scheduled", "completed", "cancelled", "no-show"]);

// Professional category enum - comprehensive healing modalities
export const professionalCategoryEnum = pgEnum("professional_category", [
  // Bodywork & Somatic
  "massage_therapy",
  "bodywork",
  "somatic_experiencing",
  "craniosacral_therapy",
  "rolfing",
  "myofascial_release",

  // Energy Healing
  "reiki",
  "energy_healing",
  "pranic_healing",
  "quantum_healing",
  "biofield_tuning",

  // Eastern Medicine
  "acupuncture",
  "acupressure",
  "shiatsu",
  "traditional_chinese_medicine",
  "ayurveda",

  // Psychology & Counseling
  "psychology",
  "psychotherapy",
  "counseling",
  "life_coaching",
  "trauma_therapy",
  "emdr",

  // Spiritual & Consciousness
  "past_life_regression",
  "shamanic_healing",
  "sound_healing",
  "crystal_healing",
  "spiritual_counseling",
  "meditation_instruction",

  // Movement & Dance
  "yoga_instruction",
  "dance_therapy",
  "movement_therapy",
  "tai_chi",
  "qigong",

  // Breathwork & Voice
  "breathwork",
  "holotropic_breathwork",
  "voice_healing",
  "toning",

  // Nutrition & Herbalism
  "nutrition_counseling",
  "herbalism",
  "naturopathy",
  "functional_medicine",

  // Creative Arts
  "art_therapy",
  "music_therapy",
  "expressive_arts",

  // Other Modalities
  "hypnotherapy",
  "nlp",
  "eft_tapping",
  "kinesiology",
  "reflexology",
  "aromatherapy"
]);
export const surveyIdentityEnum = pgEnum("survey_identity", ["facilitator", "client", "both", "neither", "exploring"]);
export const surveyFrequencyEnum = pgEnum("survey_frequency", ["weekly", "2-3_monthly", "monthly", "occasionally", "rarely"]);
export const surveyInterestEnum = pgEnum("survey_interest", ["very_interested", "maybe", "not_for_me"]);

// Subscription and access control enums (moved to top of file)

// Seeds Currency System Enums
export const pollinatorTierEnum = pgEnum("pollinator_tier", ["seedling", "sprout", "blooming", "wise_garden"]);
export const transactionTypeEnum = pgEnum("transaction_type", ["earned", "spent", "gifted", "reward", "refund"]);
export const earningReasonEnum = pgEnum("earning_reason", [
  "profile_completion",
  "session_attendance",
  "review_submission",
  "garden_upload",
  "referral",
  "daily_login",
  "survey_completion",
  "milestone_achievement"
]);

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
  professionalCategories: professionalCategoryEnum("professional_category").array(),
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
  location: varchar("location"),
  isVirtual: boolean("is_virtual").default(true),
  isInPerson: boolean("is_in_person").default(false),
  isVerified: boolean("is_verified").default(false),
  isFeatured: boolean("is_featured").default(false),
  totalSessions: integer("total_sessions").default(0),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }),
  responseTimeHours: integer("response_time_hours"), // Average response time
  yearsActive: integer("years_active"), // Years in practice
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

// Seeds Currency System Tables
export const seedsWallets = pgTable("seeds_wallets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id).unique(),
  seedsBalance: integer("seeds_balance").notNull().default(0),
  totalEarned: integer("total_earned").notNull().default(0),
  totalSpent: integer("total_spent").notNull().default(0),
  currentTier: pollinatorTierEnum("current_tier").notNull().default("seedling"),
  nextTierThreshold: integer("next_tier_threshold").notNull().default(100),
  lastActiveDate: timestamp("last_active_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const seedsTransactions = pgTable("seeds_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  amount: integer("amount").notNull(),
  type: transactionTypeEnum("type").notNull(),
  reason: earningReasonEnum("reason"),
  description: text("description"),
  referenceId: varchar("reference_id"), // session_id, review_id, garden_content_id, etc.
  referenceType: varchar("reference_type"), // "session", "review", "garden_content", etc.
  balanceAfter: integer("balance_after").notNull(),
  metadata: jsonb("metadata"), // Additional data for specific transaction types
  createdAt: timestamp("created_at").defaultNow(),
});

export const pollinatorTiers = pgTable("pollinator_tiers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tier: pollinatorTierEnum("tier").notNull().unique(),
  name: varchar("name").notNull(),
  description: text("description"),
  requiredSeeds: integer("required_seeds").notNull(),
  benefits: text("benefits").array(),
  badgeColor: varchar("badge_color").notNull(),
  badgeIcon: varchar("badge_icon"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Community Garden Tables
export const gardenContent = pgTable("garden_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  authorId: varchar("author_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  description: text("description"),
  contentType: varchar("content_type").notNull(), // "article", "video", "audio", "exercise", "meditation"
  content: text("content"), // For text content
  fileUrl: varchar("file_url"), // For uploaded files
  fileName: varchar("file_name"),
  fileSize: integer("file_size"),
  thumbnailUrl: varchar("thumbnail_url"),
  tags: text("tags").array(),
  isPublic: boolean("is_public").default(true),
  isFeatured: boolean("is_featured").default(false),
  status: varchar("status").notNull().default("pending"), // "pending", "approved", "rejected"
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  downloadCount: integer("download_count").default(0),
  seedsReward: integer("seeds_reward").default(10), // Seeds earned by author for this content
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const gardenInteractions = pgTable("garden_interactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  contentId: varchar("content_id").notNull().references(() => gardenContent.id),
  interactionType: varchar("interaction_type").notNull(), // "view", "like", "download", "share"
  aiResponse: text("ai_response"), // For AI Guardian interactions
  createdAt: timestamp("created_at").defaultNow(),
});

// User favorites table
export const favoritePractitioners = pgTable("favorite_practitioners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  practitionerId: varchar("practitioner_id").notNull().references(() => practitioners.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  userRoles: many(userRoles),
  practitionerProfile: many(practitioners),
  clientProfile: many(clients),
  surveyResponses: many(surveyResponses),
  seedsWallet: one(seedsWallets),
  seedsTransactions: many(seedsTransactions),
  gardenContent: many(gardenContent),
  gardenInteractions: many(gardenInteractions),
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

// Seeds Currency Relations
export const seedsWalletsRelations = relations(seedsWallets, ({ one, many }) => ({
  user: one(users, {
    fields: [seedsWallets.userId],
    references: [users.id],
  }),
  transactions: many(seedsTransactions),
}));

export const seedsTransactionsRelations = relations(seedsTransactions, ({ one }) => ({
  user: one(users, {
    fields: [seedsTransactions.userId],
    references: [users.id],
  }),
  wallet: one(seedsWallets, {
    fields: [seedsTransactions.userId],
    references: [seedsWallets.userId],
  }),
}));

// Community Garden Relations
export const gardenContentRelations = relations(gardenContent, ({ one, many }) => ({
  author: one(users, {
    fields: [gardenContent.authorId],
    references: [users.id],
  }),
  interactions: many(gardenInteractions),
}));

export const gardenInteractionsRelations = relations(gardenInteractions, ({ one }) => ({
  user: one(users, {
    fields: [gardenInteractions.userId],
    references: [users.id],
  }),
  content: one(gardenContent, {
    fields: [gardenInteractions.contentId],
    references: [gardenContent.id],
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

// Seeds Currency Schemas
export const insertSeedsWalletSchema = createInsertSchema(seedsWallets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSeedsTransactionSchema = createInsertSchema(seedsTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertPollinatorTierSchema = createInsertSchema(pollinatorTiers).omit({
  id: true,
  createdAt: true,
});

// Community Garden Schemas
export const insertGardenContentSchema = createInsertSchema(gardenContent).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
  likeCount: true,
  downloadCount: true,
});

export const insertGardenInteractionSchema = createInsertSchema(gardenInteractions).omit({
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

// Seeds Currency Types
export type SeedsWallet = typeof seedsWallets.$inferSelect;
export type SeedsTransaction = typeof seedsTransactions.$inferSelect;
export type PollinatorTier = typeof pollinatorTiers.$inferSelect;
export type InsertSeedsWallet = z.infer<typeof insertSeedsWalletSchema>;
export type InsertSeedsTransaction = z.infer<typeof insertSeedsTransactionSchema>;
export type InsertPollinatorTier = z.infer<typeof insertPollinatorTierSchema>;

// Community Garden Types
export type GardenContent = typeof gardenContent.$inferSelect;
export type GardenInteraction = typeof gardenInteractions.$inferSelect;
export type InsertGardenContent = z.infer<typeof insertGardenContentSchema>;
export type InsertGardenInteraction = z.infer<typeof insertGardenInteractionSchema>;

// Pollinator Archetype System - Innovative Wellness Practitioner Categorization
// An alpha concept for practitioner classification inspired by nature's pollinator patterns
export const archetypeDefinitions = {
  bee: {
    name: 'Bee',
    scientificName: 'Apis Therapeuticus',
    description: 'Foundation builders who create safe, supportive spaces for healing and growth. The natural starting point for facilitators at any experience level, from newcomers developing their practice to seasoned practitioners with decades of grounding wisdom.',
    fullDescription: 'The Bee archetype represents the foundational practice where facilitators build core skills in creating safe, structured healing environments. Whether you\'re just beginning your journey or a seasoned practitioner with years of experience, the Bee approach emphasizes community, practical skill development, and steady growth.',
    methodology: 'Practical, grounding approaches that focus on creating safety, building community connections, and developing sustainable wellness practices through hands-on learning',
    approach: 'Welcoming to all levels, community-centered, and growth-oriented with emphasis on practical skills and steady development',
    specialties: [
      'creating safe healing spaces and therapeutic relationships',
      'basic nervous system awareness and grounding techniques',
      'community building and group support facilitation',
      'practical daily wellness and self-care practices',
      'foundational listening and holding space skills',
      'mentorship and peer learning in wellness settings'
    ],
    color: '#D4AF37',
    traits: ['Foundation Building', 'Growth Mindset', 'Community Support', 'Practical Wisdom'],
    clientBenefits: ['Safe, welcoming environment', 'Steady, sustainable progress', 'Community connection', 'Practical tools and skills'],
    facilitatorBenefits: ['Perfect entry point for new facilitators', 'Continuous skill development opportunities', 'Mentorship and peer learning', 'Builds confidence through practice'],
    researchInsights: 'Bee practitioners create the foundational skills that support all wellness work. This archetype welcomes facilitators at every stage - from those just discovering their calling to experienced practitioners who specialize in grounding, community-building approaches.'
  },
  hummingbird: {
    name: 'Hummingbird',
    scientificName: 'Trochilus Intuitus',
    description: 'Precision healers who deliver rapid, targeted interventions through heightened intuitive abilities and energetic sensitivity',
    fullDescription: 'The Hummingbird archetype represents practitioners who focus on precise, targeted healing interventions with intuitive and energetic approaches.',
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
    researchInsights: 'Hummingbird practitioners tend to specialize in rapid, intuitive healing approaches and energetic work'
  },
  butterfly: {
    name: 'Butterfly',
    scientificName: 'Papilio Transformus',
    description: 'Transformation specialists who guide profound life transitions and identity evolution through holistic metamorphosis approaches',
    fullDescription: 'The Butterfly archetype represents practitioners who specialize in facilitating major life transitions and identity transformations through holistic approaches.',
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
    researchInsights: 'Butterfly practitioners tend to focus on transformation, creative expression, and life transition support'
  },
  beetle: {
    name: 'Beetle',
    scientificName: 'Scarabaeus Integrator',
    description: 'Deep healing specialists who excel in profound shadow integration, ancestral healing, and foundational restructuring work',
    fullDescription: 'The Beetle archetype encompasses practitioners who focus on deep, foundational healing work including trauma, shadow work, and ancestral healing.',
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
    researchInsights: 'Beetle practitioners tend to specialize in deep healing modalities, shadow work, and complex trauma approaches'
  }
} as const;

export const experienceLevelDefinitions = {
  rising: {
    name: 'Rising Pollinator',
    description: '0-2 years developing core skills and finding their approach',
    growthFocus: 'Building foundation, discovering strengths, learning from mentors',
    color: '#FFF5B7',
    requirements: 'Open heart, willingness to learn, basic wellness awareness',
    beeContext: 'Perfect place to start! Bee community welcomes new facilitators with open arms'
  },
  evolving: {
    name: 'Evolving Pollinator',
    description: '3-7 years deepening expertise and developing signature approach',
    growthFocus: 'Refining skills, building confidence, developing unique style',
    color: '#FF8B6A',
    requirements: 'Demonstrated growth, emerging expertise, peer recognition',
    beeContext: 'May choose to stay in Bee community or explore other archetypes based on calling'
  },
  wise: {
    name: 'Wise Pollinator',
    description: '8+ years of embodied wisdom and masterful practice',
    growthFocus: 'Mentoring others, innovating approaches, sharing deep wisdom',
    color: '#4B3F72',
    requirements: 'Established practice, mentorship capacity, recognized expertise',
    beeContext: 'Wise Bee practitioners often become mentors and community anchors'
  }
} as const;

// Professional Category Definitions
export const professionalCategoryDefinitions = {
  // Bodywork & Somatic
  massage_therapy: { name: 'Massage Therapy', icon: '💆', group: 'bodywork' },
  bodywork: { name: 'Bodywork', icon: '🙌', group: 'bodywork' },
  somatic_experiencing: { name: 'Somatic Experiencing', icon: '🌊', group: 'bodywork' },
  craniosacral_therapy: { name: 'Craniosacral Therapy', icon: '🧠', group: 'bodywork' },
  rolfing: { name: 'Rolfing', icon: '⚖️', group: 'bodywork' },
  myofascial_release: { name: 'Myofascial Release', icon: '🌀', group: 'bodywork' },

  // Energy Healing
  reiki: { name: 'Reiki', icon: '✨', group: 'energy' },
  energy_healing: { name: 'Energy Healing', icon: '⚡', group: 'energy' },
  pranic_healing: { name: 'Pranic Healing', icon: '🌟', group: 'energy' },
  quantum_healing: { name: 'Quantum Healing', icon: '🔮', group: 'energy' },
  biofield_tuning: { name: 'Biofield Tuning', icon: '📻', group: 'energy' },

  // Eastern Medicine
  acupuncture: { name: 'Acupuncture', icon: '📌', group: 'eastern' },
  acupressure: { name: 'Acupressure', icon: '👆', group: 'eastern' },
  shiatsu: { name: 'Shiatsu', icon: '🤲', group: 'eastern' },
  traditional_chinese_medicine: { name: 'Traditional Chinese Medicine', icon: '🏮', group: 'eastern' },
  ayurveda: { name: 'Ayurveda', icon: '🕉️', group: 'eastern' },

  // Psychology & Counseling
  psychology: { name: 'Psychology', icon: '🧠', group: 'psychology' },
  psychotherapy: { name: 'Psychotherapy', icon: '💭', group: 'psychology' },
  counseling: { name: 'Counseling', icon: '💬', group: 'psychology' },
  life_coaching: { name: 'Life Coaching', icon: '🎯', group: 'psychology' },
  trauma_therapy: { name: 'Trauma Therapy', icon: '🛡️', group: 'psychology' },
  emdr: { name: 'EMDR', icon: '👁️', group: 'psychology' },

  // Spiritual & Consciousness
  past_life_regression: { name: 'Past Life Regression', icon: '🔄', group: 'spiritual' },
  shamanic_healing: { name: 'Shamanic Healing', icon: '🪶', group: 'spiritual' },
  sound_healing: { name: 'Sound Healing', icon: '🔊', group: 'spiritual' },
  crystal_healing: { name: 'Crystal Healing', icon: '💎', group: 'spiritual' },
  spiritual_counseling: { name: 'Spiritual Counseling', icon: '🙏', group: 'spiritual' },
  meditation_instruction: { name: 'Meditation Instruction', icon: '🧘', group: 'spiritual' },

  // Movement & Dance
  yoga_instruction: { name: 'Yoga Instruction', icon: '🧘‍♀️', group: 'movement' },
  dance_therapy: { name: 'Dance Therapy', icon: '💃', group: 'movement' },
  movement_therapy: { name: 'Movement Therapy', icon: '🏃', group: 'movement' },
  tai_chi: { name: 'Tai Chi', icon: '☯️', group: 'movement' },
  qigong: { name: 'Qigong', icon: '🌬️', group: 'movement' },

  // Breathwork & Voice
  breathwork: { name: 'Breathwork', icon: '💨', group: 'breath' },
  holotropic_breathwork: { name: 'Holotropic Breathwork', icon: '🌀', group: 'breath' },
  voice_healing: { name: 'Voice Healing', icon: '🎤', group: 'breath' },
  toning: { name: 'Toning', icon: '🎵', group: 'breath' },

  // Nutrition & Herbalism
  nutrition_counseling: { name: 'Nutrition Counseling', icon: '🥗', group: 'nutrition' },
  herbalism: { name: 'Herbalism', icon: '🌿', group: 'nutrition' },
  naturopathy: { name: 'Naturopathy', icon: '🌱', group: 'nutrition' },
  functional_medicine: { name: 'Functional Medicine', icon: '⚕️', group: 'nutrition' },

  // Creative Arts
  art_therapy: { name: 'Art Therapy', icon: '🎨', group: 'creative' },
  music_therapy: { name: 'Music Therapy', icon: '🎶', group: 'creative' },
  expressive_arts: { name: 'Expressive Arts', icon: '🎭', group: 'creative' },

  // Other Modalities
  hypnotherapy: { name: 'Hypnotherapy', icon: '😴', group: 'other' },
  nlp: { name: 'NLP (Neuro-Linguistic Programming)', icon: '🧩', group: 'other' },
  eft_tapping: { name: 'EFT Tapping', icon: '👋', group: 'other' },
  kinesiology: { name: 'Kinesiology', icon: '🏋️', group: 'other' },
  reflexology: { name: 'Reflexology', icon: '🦶', group: 'other' },
  aromatherapy: { name: 'Aromatherapy', icon: '🌸', group: 'other' }
} as const;

export const categoryGroups = {
  bodywork: { name: 'Bodywork & Somatic', color: '#8B7355', description: 'Hands-on healing through touch and body awareness' },
  energy: { name: 'Energy Healing', color: '#9370DB', description: 'Working with subtle energy fields and chakras' },
  eastern: { name: 'Eastern Medicine', color: '#DC143C', description: 'Traditional healing practices from Asia' },
  psychology: { name: 'Psychology & Counseling', color: '#4682B4', description: 'Mental health and emotional support' },
  spiritual: { name: 'Spiritual & Consciousness', color: '#DAA520', description: 'Soul work and consciousness expansion' },
  movement: { name: 'Movement & Dance', color: '#32CD32', description: 'Healing through movement and embodiment' },
  breath: { name: 'Breathwork & Voice', color: '#87CEEB', description: 'Breath and vocal expression for healing' },
  nutrition: { name: 'Nutrition & Herbalism', color: '#228B22', description: 'Food as medicine and plant healing' },
  creative: { name: 'Creative Arts', color: '#FF69B4', description: 'Healing through artistic expression' },
  other: { name: 'Other Modalities', color: '#708090', description: 'Additional healing approaches' }
} as const;

// Seeds Currency Pollinator Tier System
export const pollinatorTierDefinitions = {
  seedling: {
    name: '🌱 Seedling Pollinator',
    description: 'Just beginning your wellness journey',
    requiredSeeds: 0,
    color: '#7FB069', // Light green
    benefits: [
      'Access to basic Community Garden content',
      'Earn Seeds for profile completion',
      'Join FloreSer community discussions',
      'Basic practitioner discovery'
    ],
    nextTier: 'sprout',
    nextThreshold: 100
  },
  sprout: {
    name: '🌿 Sprout Pollinator',
    description: 'Growing your wellness practice and engagement',
    requiredSeeds: 100,
    color: '#52A675', // Medium green
    benefits: [
      'All Seedling benefits',
      '10% discount on first session',
      'Access to premium Garden content',
      'Upload content to Community Garden',
      'Enhanced profile visibility'
    ],
    nextTier: 'blooming',
    nextThreshold: 500
  },
  blooming: {
    name: '🌸 Blooming Pollinator',
    description: 'Flourishing in the wellness ecosystem',
    requiredSeeds: 500,
    color: '#D4AF37', // FloreSer gold
    benefits: [
      'All Sprout benefits',
      '20% discount on all sessions',
      'Priority booking access',
      'Featured Garden content placement',
      'AI Guardian premium features',
      'Monthly Seeds bonus'
    ],
    nextTier: 'wise_garden',
    nextThreshold: 2000
  },
  wise_garden: {
    name: '🌳 Wise Garden Pollinator',
    description: 'Master cultivator of wellness wisdom',
    requiredSeeds: 2000,
    color: '#4B3F72', // Deep purple
    benefits: [
      'All Blooming benefits',
      '30% discount on all sessions',
      'Exclusive practitioner access',
      'Garden content moderation privileges',
      'Beta feature early access',
      'Community leadership opportunities',
      'Custom pollinator badge'
    ],
    nextTier: null,
    nextThreshold: null
  }
} as const;

// Seeds Earning Rates
export const seedsEarningRates = {
  profile_completion: 50,
  session_attendance: 20,
  review_submission: 15,
  garden_upload: 25, // Base rate, varies by content quality
  referral: 100,
  daily_login: 5,
  survey_completion: 30,
  milestone_achievement: 75
} as const;
