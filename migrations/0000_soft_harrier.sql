CREATE TYPE "public"."access_level" AS ENUM('preview', 'basic', 'premium', 'unlimited');--> statement-breakpoint
CREATE TYPE "public"."application_status" AS ENUM('in_progress', 'submitted', 'reviewed', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."archetype" AS ENUM('bee', 'hummingbird', 'butterfly', 'beetle');--> statement-breakpoint
CREATE TYPE "public"."earning_reason" AS ENUM('profile_completion', 'session_attendance', 'review_submission', 'garden_upload', 'referral', 'daily_login', 'survey_completion', 'milestone_achievement');--> statement-breakpoint
CREATE TYPE "public"."experience_level" AS ENUM('rising', 'evolving', 'wise');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'processing', 'succeeded', 'failed', 'refunded', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."payout_status" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."pollinator_tier" AS ENUM('seedling', 'sprout', 'blooming', 'wise_garden');--> statement-breakpoint
CREATE TYPE "public"."professional_category" AS ENUM('massage_therapy', 'bodywork', 'somatic_experiencing', 'craniosacral_therapy', 'rolfing', 'myofascial_release', 'reiki', 'energy_healing', 'pranic_healing', 'quantum_healing', 'biofield_tuning', 'acupuncture', 'acupressure', 'shiatsu', 'traditional_chinese_medicine', 'ayurveda', 'psychology', 'psychotherapy', 'counseling', 'life_coaching', 'trauma_therapy', 'emdr', 'past_life_regression', 'shamanic_healing', 'sound_healing', 'crystal_healing', 'spiritual_counseling', 'meditation_instruction', 'yoga_instruction', 'dance_therapy', 'movement_therapy', 'tai_chi', 'qigong', 'breathwork', 'holotropic_breathwork', 'voice_healing', 'toning', 'nutrition_counseling', 'herbalism', 'naturopathy', 'functional_medicine', 'art_therapy', 'music_therapy', 'expressive_arts', 'hypnotherapy', 'nlp', 'eft_tapping', 'kinesiology', 'reflexology', 'aromatherapy');--> statement-breakpoint
CREATE TYPE "public"."session_status" AS ENUM('scheduled', 'completed', 'cancelled', 'no-show');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('free', 'trial', 'premium', 'cancelled', 'expired');--> statement-breakpoint
CREATE TYPE "public"."survey_frequency" AS ENUM('weekly', '2-3_monthly', 'monthly', 'occasionally', 'rarely');--> statement-breakpoint
CREATE TYPE "public"."survey_identity" AS ENUM('facilitator', 'client', 'both', 'neither', 'exploring');--> statement-breakpoint
CREATE TYPE "public"."survey_interest" AS ENUM('very_interested', 'maybe', 'not_for_me');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('earned', 'spent', 'gifted', 'reward', 'refund');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('client', 'practitioner', 'admin');--> statement-breakpoint
CREATE TABLE "clients" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"preferred_archetype" "archetype"[],
	"budget_min" numeric(10, 2),
	"budget_max" numeric(10, 2),
	"location" varchar,
	"preference_virtual" boolean DEFAULT true,
	"preference_in_person" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"participant1_id" varchar NOT NULL,
	"participant2_id" varchar NOT NULL,
	"last_message_at" timestamp DEFAULT now(),
	"last_message_preview" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "facilitator_applications" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"email" varchar NOT NULL,
	"first_name" varchar,
	"last_name" varchar,
	"years_experience" integer,
	"modalities" text[],
	"suggested_archetype" "archetype",
	"is_virtual" boolean,
	"is_in_person" boolean,
	"location" varchar,
	"hourly_rate_min" numeric(10, 2),
	"hourly_rate_max" numeric(10, 2),
	"motivation" text,
	"conversation_history" jsonb DEFAULT '[]'::jsonb,
	"status" "application_status" DEFAULT 'in_progress',
	"reviewed_by" varchar,
	"reviewed_at" timestamp,
	"review_notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "favorite_practitioners" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"practitioner_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "garden_content" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_id" varchar NOT NULL,
	"title" varchar NOT NULL,
	"description" text,
	"content_type" varchar NOT NULL,
	"content" text,
	"file_url" varchar,
	"file_name" varchar,
	"file_size" integer,
	"thumbnail_url" varchar,
	"tags" text[],
	"is_public" boolean DEFAULT true,
	"is_featured" boolean DEFAULT false,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"view_count" integer DEFAULT 0,
	"like_count" integer DEFAULT 0,
	"download_count" integer DEFAULT 0,
	"seeds_reward" integer DEFAULT 10,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "garden_interactions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"content_id" varchar NOT NULL,
	"interaction_type" varchar NOT NULL,
	"ai_response" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" varchar NOT NULL,
	"sender_id" varchar NOT NULL,
	"content" text NOT NULL,
	"is_read" boolean DEFAULT false,
	"read_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payouts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practitioner_id" varchar NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'usd',
	"status" "payout_status" DEFAULT 'pending',
	"session_ids" text[],
	"stripe_transfer_id" varchar,
	"stripe_connect_account_id" varchar,
	"processed_by" varchar,
	"processed_at" timestamp,
	"notes" text,
	"period_start" timestamp,
	"period_end" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pollinator_tiers" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tier" "pollinator_tier" NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"required_seeds" integer NOT NULL,
	"benefits" text[],
	"badge_color" varchar NOT NULL,
	"badge_icon" varchar,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "pollinator_tiers_tier_unique" UNIQUE("tier")
);
--> statement-breakpoint
CREATE TABLE "practitioners" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"archetype" "archetype" NOT NULL,
	"experience_level" "experience_level" NOT NULL,
	"bio" text,
	"specializations" text[],
	"professional_category" "professional_category"[],
	"hourly_rate" numeric(10, 2),
	"location" varchar,
	"is_virtual" boolean DEFAULT true,
	"is_in_person" boolean DEFAULT false,
	"is_verified" boolean DEFAULT false,
	"is_featured" boolean DEFAULT false,
	"total_sessions" integer DEFAULT 0,
	"average_rating" numeric(3, 2),
	"response_time_hours" integer,
	"years_active" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" varchar NOT NULL,
	"client_id" varchar NOT NULL,
	"practitioner_id" varchar NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "seeds_transactions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"amount" integer NOT NULL,
	"type" "transaction_type" NOT NULL,
	"reason" "earning_reason",
	"description" text,
	"reference_id" varchar,
	"reference_type" varchar,
	"balance_after" integer NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "seeds_wallets" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"seeds_balance" integer DEFAULT 0 NOT NULL,
	"total_earned" integer DEFAULT 0 NOT NULL,
	"total_spent" integer DEFAULT 0 NOT NULL,
	"current_tier" "pollinator_tier" DEFAULT 'seedling' NOT NULL,
	"next_tier_threshold" integer DEFAULT 100 NOT NULL,
	"last_active_date" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "seeds_wallets_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions_booking" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" varchar NOT NULL,
	"practitioner_id" varchar NOT NULL,
	"scheduled_datetime" timestamp NOT NULL,
	"duration" integer DEFAULT 60 NOT NULL,
	"status" "session_status" DEFAULT 'scheduled' NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"is_virtual" boolean NOT NULL,
	"meeting_link" varchar,
	"notes" text,
	"stripe_payment_intent_id" varchar,
	"payment_status" "payment_status" DEFAULT 'pending',
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "stripe_connect_accounts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"practitioner_id" varchar NOT NULL,
	"stripe_account_id" varchar NOT NULL,
	"onboarding_complete" boolean DEFAULT false,
	"charges_enabled" boolean DEFAULT false,
	"payouts_enabled" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "survey_responses" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"identity_type" "survey_identity" NOT NULL,
	"age_range" varchar,
	"country_of_residence" varchar,
	"currency" varchar,
	"facilitator_session_price" varchar,
	"open_to_free_session" varchar,
	"contribution_interests" text[],
	"reciprocity_preferences" text[],
	"reciprocity_other" text,
	"client_comfortable_price" varchar,
	"client_max_price" varchar,
	"client_trial_price" varchar,
	"session_frequency" "survey_frequency",
	"booking_encouragements" text[],
	"trust_factors" text[],
	"trust_factors_other" text,
	"garden_interest_level" "survey_interest",
	"garden_content_ideas" text,
	"garden_monthly_price" varchar,
	"final_thoughts" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"role" "user_role" NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar NOT NULL,
	"password_hash" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"is_email_verified" boolean DEFAULT false,
	"email_verification_token" varchar,
	"reset_password_token" varchar,
	"reset_password_expires" timestamp,
	"google_id" varchar,
	"subscription_status" "subscription_status" DEFAULT 'free',
	"access_level" "access_level" DEFAULT 'preview',
	"subscription_start_date" timestamp,
	"subscription_end_date" timestamp,
	"trial_end_date" timestamp,
	"stripe_customer_id" varchar,
	"stripe_subscription_id" varchar,
	"checkout_customer_id" varchar,
	"checkout_subscription_id" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_participant1_id_users_id_fk" FOREIGN KEY ("participant1_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_participant2_id_users_id_fk" FOREIGN KEY ("participant2_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "facilitator_applications" ADD CONSTRAINT "facilitator_applications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "facilitator_applications" ADD CONSTRAINT "facilitator_applications_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorite_practitioners" ADD CONSTRAINT "favorite_practitioners_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorite_practitioners" ADD CONSTRAINT "favorite_practitioners_practitioner_id_practitioners_id_fk" FOREIGN KEY ("practitioner_id") REFERENCES "public"."practitioners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "garden_content" ADD CONSTRAINT "garden_content_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "garden_interactions" ADD CONSTRAINT "garden_interactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "garden_interactions" ADD CONSTRAINT "garden_interactions_content_id_garden_content_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."garden_content"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_practitioner_id_practitioners_id_fk" FOREIGN KEY ("practitioner_id") REFERENCES "public"."practitioners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_processed_by_users_id_fk" FOREIGN KEY ("processed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practitioners" ADD CONSTRAINT "practitioners_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_session_id_sessions_booking_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions_booking"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_practitioner_id_practitioners_id_fk" FOREIGN KEY ("practitioner_id") REFERENCES "public"."practitioners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seeds_transactions" ADD CONSTRAINT "seeds_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seeds_wallets" ADD CONSTRAINT "seeds_wallets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions_booking" ADD CONSTRAINT "sessions_booking_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions_booking" ADD CONSTRAINT "sessions_booking_practitioner_id_practitioners_id_fk" FOREIGN KEY ("practitioner_id") REFERENCES "public"."practitioners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stripe_connect_accounts" ADD CONSTRAINT "stripe_connect_accounts_practitioner_id_practitioners_id_fk" FOREIGN KEY ("practitioner_id") REFERENCES "public"."practitioners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "survey_responses" ADD CONSTRAINT "survey_responses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_conversations_participant1" ON "conversations" USING btree ("participant1_id");--> statement-breakpoint
CREATE INDEX "idx_conversations_participant2" ON "conversations" USING btree ("participant2_id");--> statement-breakpoint
CREATE INDEX "idx_facilitator_applications_user" ON "facilitator_applications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_facilitator_applications_email" ON "facilitator_applications" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_facilitator_applications_status" ON "facilitator_applications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_messages_conversation" ON "messages" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "idx_messages_sender" ON "messages" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX "idx_messages_created" ON "messages" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_payouts_practitioner" ON "payouts" USING btree ("practitioner_id");--> statement-breakpoint
CREATE INDEX "idx_payouts_status" ON "payouts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");--> statement-breakpoint
CREATE INDEX "idx_stripe_connect_practitioner" ON "stripe_connect_accounts" USING btree ("practitioner_id");