/**
 * Seed Script: Create Mock Practitioners
 *
 * Run with: npx tsx server/seed-practitioners.ts
 */

import { db } from "./db";
import { users, practitioners, userRoles } from "@shared/schema";
import bcrypt from "bcryptjs";

// Mock practitioner data - diverse archetypes and specializations
const mockPractitioners = [
  // BEE ARCHETYPE - Grounded, community-focused
  {
    firstName: "Maya",
    lastName: "Chen",
    email: "maya.chen@example.com",
    archetype: "bee" as const,
    experienceLevel: "wise" as const,
    bio: "With 12 years of experience in energy healing and community wellness, I create sacred spaces where transformation happens naturally. My approach blends traditional Reiki with modern somatic practices, always honoring the wisdom your body already holds.",
    specializations: ["Energy Healing", "Community Wellness", "Group Facilitation", "Reiki"],
    professionalCategories: ["reiki", "energy_healing", "sound_healing"],
    hourlyRate: "95",
    location: "Portland, OR",
    isVirtual: true,
    isInPerson: true,
    isVerified: true,
    isFeatured: true,
    totalSessions: 847,
    averageRating: "4.92",
    responseTimeHours: 2,
    yearsActive: 12,
  },
  {
    firstName: "David",
    lastName: "Okonkwo",
    email: "david.okonkwo@example.com",
    archetype: "bee" as const,
    experienceLevel: "evolving" as const,
    bio: "I believe healing happens in relationship. As a trauma-informed counselor, I help individuals and groups navigate life's transitions with compassion and practical tools rooted in somatic experiencing.",
    specializations: ["Trauma Recovery", "Group Therapy", "Somatic Work", "Life Transitions"],
    professionalCategories: ["counseling", "somatic_experiencing", "trauma_therapy"],
    hourlyRate: "120",
    location: "Austin, TX",
    isVirtual: true,
    isInPerson: true,
    isVerified: true,
    isFeatured: false,
    totalSessions: 412,
    averageRating: "4.88",
    responseTimeHours: 4,
    yearsActive: 6,
  },
  {
    firstName: "Rosa",
    lastName: "Martinez",
    email: "rosa.martinez@example.com",
    archetype: "bee" as const,
    experienceLevel: "rising" as const,
    bio: "As a newly certified breathwork facilitator, I bring fresh energy and deep presence to every session. My practice focuses on accessible breathwork techniques that anyone can learn and integrate into daily life.",
    specializations: ["Breathwork", "Stress Relief", "Beginners Welcome", "Virtual Sessions"],
    professionalCategories: ["breathwork", "meditation_instruction"],
    hourlyRate: "65",
    location: "Miami, FL",
    isVirtual: true,
    isInPerson: false,
    isVerified: true,
    isFeatured: false,
    totalSessions: 89,
    averageRating: "4.95",
    responseTimeHours: 1,
    yearsActive: 2,
  },

  // BUTTERFLY ARCHETYPE - Transformational, holistic
  {
    firstName: "Luna",
    lastName: "Silverstone",
    email: "luna.silverstone@example.com",
    archetype: "butterfly" as const,
    experienceLevel: "wise" as const,
    bio: "Transformation is not something we do—it's something we allow. For 15 years, I've guided seekers through profound metamorphosis using a unique blend of shamanic journeying, plant medicine integration, and somatic release work.",
    specializations: ["Shamanic Healing", "Plant Medicine Integration", "Deep Transformation", "Soul Retrieval"],
    professionalCategories: ["shamanic_healing", "spiritual_counseling", "somatic_experiencing"],
    hourlyRate: "175",
    location: "Sedona, AZ",
    isVirtual: true,
    isInPerson: true,
    isVerified: true,
    isFeatured: true,
    totalSessions: 1243,
    averageRating: "4.97",
    responseTimeHours: 12,
    yearsActive: 15,
  },
  {
    firstName: "Kai",
    lastName: "Nakamura",
    email: "kai.nakamura@example.com",
    archetype: "butterfly" as const,
    experienceLevel: "evolving" as const,
    bio: "Through art therapy and expressive movement, I help you reconnect with the creative force within. Every session is a co-creation, a dance between who you are and who you're becoming.",
    specializations: ["Art Therapy", "Creative Expression", "Movement", "Identity Exploration"],
    professionalCategories: ["art_therapy", "dance_therapy", "expressive_arts"],
    hourlyRate: "110",
    location: "San Francisco, CA",
    isVirtual: true,
    isInPerson: true,
    isVerified: true,
    isFeatured: true,
    totalSessions: 567,
    averageRating: "4.91",
    responseTimeHours: 6,
    yearsActive: 7,
  },
  {
    firstName: "Amara",
    lastName: "Williams",
    email: "amara.williams@example.com",
    archetype: "butterfly" as const,
    experienceLevel: "rising" as const,
    bio: "My journey from corporate burnout to holistic practitioner fuels my passion for helping others through their own transformations. I specialize in supporting career changers and those seeking deeper meaning.",
    specializations: ["Life Transitions", "Career Change", "Purpose Discovery", "Burnout Recovery"],
    professionalCategories: ["life_coaching", "counseling", "meditation_instruction"],
    hourlyRate: "85",
    location: "Denver, CO",
    isVirtual: true,
    isInPerson: false,
    isVerified: true,
    isFeatured: false,
    totalSessions: 156,
    averageRating: "4.89",
    responseTimeHours: 3,
    yearsActive: 3,
  },

  // BEETLE ARCHETYPE - Deep integration, foundational work
  {
    firstName: "Samuel",
    lastName: "Thornwood",
    email: "samuel.thornwood@example.com",
    archetype: "beetle" as const,
    experienceLevel: "wise" as const,
    bio: "Deep roots create strong growth. With 20 years in Traditional Chinese Medicine and bodywork, I help clients build lasting foundations for health. My practice emphasizes the slow, steady work of true healing.",
    specializations: ["Traditional Chinese Medicine", "Acupuncture", "Deep Tissue", "Chronic Pain"],
    professionalCategories: ["traditional_chinese_medicine", "acupuncture", "bodywork"],
    hourlyRate: "150",
    location: "Seattle, WA",
    isVirtual: false,
    isInPerson: true,
    isVerified: true,
    isFeatured: true,
    totalSessions: 2156,
    averageRating: "4.94",
    responseTimeHours: 24,
    yearsActive: 20,
  },
  {
    firstName: "Elena",
    lastName: "Petrov",
    email: "elena.petrov@example.com",
    archetype: "beetle" as const,
    experienceLevel: "evolving" as const,
    bio: "Shadow work is not about fighting the darkness—it's about bringing light to what's been hidden. I guide clients through deep psychological exploration with warmth, safety, and unwavering presence.",
    specializations: ["Shadow Work", "Jungian Psychology", "Dream Analysis", "Deep Healing"],
    professionalCategories: ["psychotherapy", "counseling", "hypnotherapy"],
    hourlyRate: "135",
    location: "Chicago, IL",
    isVirtual: true,
    isInPerson: true,
    isVerified: true,
    isFeatured: false,
    totalSessions: 723,
    averageRating: "4.96",
    responseTimeHours: 8,
    yearsActive: 8,
  },
  {
    firstName: "Marcus",
    lastName: "Rivera",
    email: "marcus.rivera@example.com",
    archetype: "beetle" as const,
    experienceLevel: "rising" as const,
    bio: "Grounding practices saved my life. Now I share the power of earthing, forest bathing, and nature-based healing with others seeking to reconnect with their bodies and the earth.",
    specializations: ["Nature Therapy", "Grounding Practices", "Forest Bathing", "Earth Connection"],
    professionalCategories: ["meditation_instruction", "movement_therapy", "spiritual_counseling"],
    hourlyRate: "70",
    location: "Asheville, NC",
    isVirtual: false,
    isInPerson: true,
    isVerified: true,
    isFeatured: false,
    totalSessions: 98,
    averageRating: "4.87",
    responseTimeHours: 6,
    yearsActive: 2,
  },

  // HUMMINGBIRD ARCHETYPE - Dynamic, adaptable, energetic
  {
    firstName: "Zara",
    lastName: "Obi",
    email: "zara.obi@example.com",
    archetype: "hummingbird" as const,
    experienceLevel: "wise" as const,
    bio: "Energy moves. Life dances. In my practice, we don't just talk—we move, breathe, shake, and release. 10 years of training in holotropic breathwork and ecstatic dance inform my dynamic approach to healing.",
    specializations: ["Holotropic Breathwork", "Ecstatic Dance", "Energy Release", "Dynamic Meditation"],
    professionalCategories: ["holotropic_breathwork", "dance_therapy", "breathwork"],
    hourlyRate: "130",
    location: "Los Angeles, CA",
    isVirtual: true,
    isInPerson: true,
    isVerified: true,
    isFeatured: true,
    totalSessions: 934,
    averageRating: "4.93",
    responseTimeHours: 2,
    yearsActive: 10,
  },
  {
    firstName: "Jordan",
    lastName: "Reyes",
    email: "jordan.reyes@example.com",
    archetype: "hummingbird" as const,
    experienceLevel: "evolving" as const,
    bio: "Quick shifts create lasting change. Using EFT tapping, NLP, and energy psychology, I help clients break through blocks and step into their power—often in just one session.",
    specializations: ["EFT Tapping", "NLP", "Rapid Transformation", "Anxiety Relief"],
    professionalCategories: ["eft_tapping", "nlp", "energy_healing"],
    hourlyRate: "100",
    location: "New York, NY",
    isVirtual: true,
    isInPerson: true,
    isVerified: true,
    isFeatured: false,
    totalSessions: 489,
    averageRating: "4.90",
    responseTimeHours: 1,
    yearsActive: 5,
  },
  {
    firstName: "Priya",
    lastName: "Sharma",
    email: "priya.sharma@example.com",
    archetype: "hummingbird" as const,
    experienceLevel: "rising" as const,
    bio: "Fresh from my yoga teacher training in India, I bring authentic pranayama and kundalini practices to Western seekers. My sessions are energizing, accessible, and designed to fit into your busy life.",
    specializations: ["Kundalini Yoga", "Pranayama", "Quick Sessions", "Morning Practice"],
    professionalCategories: ["yoga_instruction", "breathwork", "meditation_instruction"],
    hourlyRate: "55",
    location: "Boston, MA",
    isVirtual: true,
    isInPerson: false,
    isVerified: true,
    isFeatured: false,
    totalSessions: 234,
    averageRating: "4.85",
    responseTimeHours: 1,
    yearsActive: 1,
  },
];

async function seedPractitioners() {
  console.log("Starting practitioner seed...\n");

  const hashedPassword = await bcrypt.hash("TestPassword123!", 12);

  for (const practitioner of mockPractitioners) {
    try {
      // Check if user already exists
      const existingUser = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, practitioner.email),
      });

      if (existingUser) {
        console.log(`Skipping ${practitioner.email} - already exists`);
        continue;
      }

      // Create user
      const [newUser] = await db.insert(users).values({
        email: practitioner.email,
        firstName: practitioner.firstName,
        lastName: practitioner.lastName,
        password: hashedPassword,
        emailVerified: true,
        subscriptionStatus: "premium",
        accessLevel: "unlimited",
      }).returning();

      console.log(`Created user: ${newUser.email} (${newUser.id})`);

      // Create user role
      await db.insert(userRoles).values({
        userId: newUser.id,
        role: "practitioner",
      });

      // Create practitioner profile
      const [newPractitioner] = await db.insert(practitioners).values({
        userId: newUser.id,
        archetype: practitioner.archetype,
        experienceLevel: practitioner.experienceLevel,
        bio: practitioner.bio,
        specializations: practitioner.specializations,
        professionalCategories: practitioner.professionalCategories,
        hourlyRate: practitioner.hourlyRate,
        location: practitioner.location,
        isVirtual: practitioner.isVirtual,
        isInPerson: practitioner.isInPerson,
        isVerified: practitioner.isVerified,
        isFeatured: practitioner.isFeatured,
        totalSessions: practitioner.totalSessions,
        averageRating: practitioner.averageRating,
        responseTimeHours: practitioner.responseTimeHours,
        yearsActive: practitioner.yearsActive,
      }).returning();

      console.log(`  Created practitioner: ${practitioner.firstName} ${practitioner.lastName}`);
      console.log(`    Archetype: ${practitioner.archetype} | Level: ${practitioner.experienceLevel}`);
      console.log(`    Featured: ${practitioner.isFeatured} | Rating: ${practitioner.averageRating}\n`);

    } catch (error) {
      console.error(`Error creating ${practitioner.email}:`, error);
    }
  }

  console.log("\nSeed complete!");
  process.exit(0);
}

seedPractitioners().catch(console.error);
