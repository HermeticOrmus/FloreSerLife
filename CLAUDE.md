# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# FloreSer - Wellness Practitioners Marketplace

**Project Type**: Full-stack web application
**Domain**: Wellness & Health
**Platform**: Modern web marketplace connecting wellness practitioners with clients

## 🌸 Project Overview

FloreSer is a wellness practitioners marketplace that connects clients with verified wellness practitioners through a unique **pollinator archetype system**. The platform uses nature-inspired metaphors (bee, hummingbird, butterfly, beetle) to help match clients with practitioners based on their healing approach and expertise.

### Core Concept
- **Archetypes**: Four pollinator types representing different healing approaches (defined in shared/schema.ts)
- **Experience Levels**: Rising (0-2 years), Evolving (3-7 years), Wise (8+ years)
- **Seeds Currency**: Gamified engagement system with pollinator tiers
- **Community Garden**: Content sharing platform with AI Guardian (mAIa) assistant
- **Access Control**: Tiered subscription system (preview/basic/premium/unlimited)

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL (Neon) + Drizzle ORM
- **Auth**: Passport.js (Local + Google OAuth)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack Query (React Query)
- **Deployment**: Replit hosting

### Project Structure
```
/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── assets/         # Brand assets (logos, icons, characters)
│   │   ├── components/     # React components
│   │   │   ├── ui/         # shadcn/ui components (45+ components)
│   │   │   ├── layout/     # Header, Footer
│   │   │   ├── icons/      # Custom icon components
│   │   │   └── ai-guardian.tsx  # AI Guardian chat component
│   │   ├── pages/          # Route components
│   │   ├── hooks/          # Custom hooks (useAuth, useToast, useMobile)
│   │   └── lib/            # Utilities and config
├── server/                 # Backend Express application
│   ├── index.ts           # Main server entry
│   ├── routes.ts          # API route definitions (1000+ lines)
│   ├── auth.ts            # Passport.js authentication setup
│   ├── accessControl.ts   # Subscription and permission system
│   ├── storage.ts         # Database operations layer
│   ├── email.ts           # Email service integration
│   └── db.ts              # Database connection
├── shared/                 # Shared TypeScript schemas
│   └── schema.ts          # Database schema + Zod validation (650+ lines)
└── attached_assets/        # Original brand assets
```

## 🗄️ Database Schema

### Core Tables (shared/schema.ts)
- **users**: User accounts with subscription status and access levels
- **sessions**: PostgreSQL session storage (required for Passport.js)
- **user_roles**: Role assignments (client/practitioner/admin)
- **practitioners**: Practitioner profiles with archetype/experience
- **clients**: Client profiles with preferences
- **sessions_booking**: Session booking and scheduling
- **reviews**: Rating and feedback system
- **survey_responses**: Alpha testing survey data
- **seeds_wallets**: User currency balances and tier tracking
- **seeds_transactions**: Transaction history with earning reasons
- **pollinator_tiers**: Tier definitions and benefits
- **garden_content**: Community Garden content (articles, videos, etc.)
- **garden_interactions**: User engagement tracking (views, likes, downloads)

### Key Enums
- archetypes: bee | hummingbird | butterfly | beetle
- experience_level: rising | evolving | wise
- user_role: client | practitioner | admin
- session_status: scheduled | completed | cancelled | no-show
- subscription_status: free | trial | premium | cancelled | expired
- access_level: preview | basic | premium | unlimited
- pollinator_tier: seedling | sprout | blooming | wise_garden

## 🔐 Authentication & Authorization

### Authentication System (server/auth.ts)
- **Passport.js** with Local Strategy (email/password) and Google OAuth
- **PostgreSQL session store** using connect-pg-simple
- **bcryptjs** for password hashing (12 salt rounds)
- **JWT tokens** for API authentication (7-day expiry)
- Session TTL: 7 days

### Middleware Layers
- `requireAuth`: Ensures user is authenticated
- `requireAdmin`: Checks for admin role or session-based admin access
- `requireDevAdmin`: Development admin access via session or header
- `requirePermission(permission)`: Checks specific subscription permissions
- `addAccessInfo`: Adds user access metadata to all authenticated requests

### User Flow
1. Sign up via email/password or Google OAuth
2. Create role-specific profile (client or practitioner)
3. Access level starts at "preview" (limited access)
4. Upgrade to trial/subscription for full features
5. Earn Seeds through platform engagement

## 🎯 Access Control System (server/accessControl.ts)

### Access Levels
- **preview**: Limited exploration (3 practitioners, no sessions)
- **basic**: Essential features (10 practitioners, 1 session/month, Garden access)
- **premium**: Full platform (unlimited practitioners/sessions, content creation)
- **unlimited**: Premium + exclusive benefits (early access, priority support)

### Permission System
- `viewPractitioners`: Number-based limits or "unlimited"
- `bookSessions`: Monthly limits or "unlimited"
- `accessGarden`: Read access to Community Garden
- `createContent`: Garden content creation ability
- `viewFullProfiles`: Complete practitioner profile access

### Facilitator Benefits
Practitioners (facilitators) receive:
- 2x Seeds multiplier on all earnings
- Featured content placement
- Premium content creation access
- Monthly 50 Seeds bonus
- Priority support

## 🌱 Seeds Currency System

### Earning Rates (shared/schema.ts)
- Profile completion: 50 Seeds
- Session attendance: 20 Seeds
- Review submission: 15 Seeds
- Garden content upload: 25+ Seeds (varies by quality, 2x for facilitators)
- Referral: 100 Seeds
- Daily login: 5 Seeds
- Survey completion: 30 Seeds
- Milestone achievement: 75 Seeds

### Pollinator Tiers
- **Seedling** (0-100): Basic access
- **Sprout** (100-500): 10% discount, premium Garden access
- **Blooming** (500-2000): 20% discount, priority booking, AI Guardian premium
- **Wise Garden** (2000+): 30% discount, moderation privileges, beta access

## 🌳 Community Garden

### Content Types
- Articles, videos, audio, exercises, meditations
- Status workflow: pending → approved → published
- Premium content gating (disabled temporarily)
- View/like/download tracking

### AI Guardian (mAIa)
- Rule-based response system (server/routes.ts lines 14-78)
- Context-aware suggestions
- Archetype education
- Practitioner finding assistance
- Garden content guidance
- Seeds system explanations

## 📱 Key Features & Pages

### Public Pages
- `/` - Landing page (unauthenticated) or role-based dashboard (authenticated)
- `/alpha` - Alpha testing program information
- `/survey` - Alpha feedback survey
- `/practitioners` - Browse all practitioners with filtering
- `/practitioners/:id` - Detailed practitioner profile
- `/hive` - Content hub (future: practitioner-created content)
- `/garden` - Community Garden with AI Guardian
- `/auth/signin` - Email/password and Google OAuth sign-in
- `/auth/signup` - New account registration

### Protected Pages
- `/dashboard/client` - Client dashboard with sessions and quick actions
- `/dashboard/practitioner` - Practitioner dashboard with stats
- `/admin/survey` - Survey response analytics (admin only)
- `/admin/dashboard` - Full platform analytics (dev admin only)
- `/simple-admin/panel` - Simple admin panel for survey access

### Admin Access
- Session-based admin login via `/api/admin/login` with `ADMIN_ACCESS_CODE`
- Dev admin endpoints require `x-admin-access` header or session
- Simple admin requires `SIMPLE_ADMIN_PASSWORD`

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Email/password login
- `GET /api/auth/google` - Google OAuth initiation
- `GET /api/auth/google/callback` - Google OAuth callback
- `POST /api/auth/logout` - Logout and destroy session
- `GET /api/auth/user` - Get current user with profiles

### Public Endpoints
- `GET /api/practitioners` - Featured practitioners (limit 6)
- `GET /api/practitioners/all` - All practitioners with access control
- `GET /api/archetypes` - Archetype definitions
- `GET /api/experience-levels` - Experience level definitions
- `GET /api/seeds/tiers` - Pollinator tier definitions

### Protected Endpoints (require authentication)
- `POST /api/practitioners` - Create practitioner profile
- `POST /api/clients` - Create client profile
- `GET /api/dashboard/client/:userId` - Client dashboard data
- `GET /api/dashboard/practitioner/:userId` - Practitioner dashboard data
- `GET /api/sessions/:userId/:role` - User's sessions
- `POST /api/reviews` - Submit session review
- `GET /api/reviews/practitioner/:practitionerId` - Practitioner reviews

### Seeds Endpoints
- `GET /api/seeds/wallet/:userId` - User's Seeds wallet
- `GET /api/seeds/stats/:userId` - User's Seeds statistics
- `GET /api/seeds/transactions/:userId` - Transaction history

### Garden Endpoints
- `GET /api/garden/content` - Browse Garden content (with access control)
- `POST /api/garden/content` - Create content (requires permission)
- `GET /api/garden/content/:id` - View specific content
- `POST /api/garden/content/:contentId/like` - Like content

### AI Guardian Endpoints
- `POST /api/ai-guardian/chat` - Send message to AI Guardian
- `GET /api/ai-guardian/context` - Get user context for personalization

### Survey Endpoints
- `POST /api/survey` - Submit survey response (authenticated or anonymous)
- `GET /api/survey/responses` - Get all responses (admin only)

### Access Control Endpoints
- `POST /api/access/start-trial` - Start 7-day free trial
- `GET /api/access/info` - Get user's access level and permissions

### Admin Endpoints (dev admin only)
- `GET /api/admin/overview` - Platform statistics
- `GET /api/admin/users` - All users with profiles
- `GET /api/admin/practitioners` - All practitioners with details
- `GET /api/admin/sessions` - All sessions with details
- `GET /api/admin/garden-content` - All Garden content
- `GET /api/admin/seeds-overview` - Seeds system overview

## 🚀 Development Commands

### Essential Commands
```bash
# Development server (runs both frontend and backend)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# TypeScript type checking
npm run check

# Database schema changes
npm run db:push
```

### Environment Variables Required
```env
# Database
DATABASE_URL=postgresql://...

# Authentication
SESSION_SECRET=your-session-secret
JWT_SECRET=your-jwt-secret  # Optional, defaults to SESSION_SECRET

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# Admin Access
ADMIN_ACCESS_CODE=your-admin-code
SIMPLE_ADMIN_PASSWORD=your-simple-password

# Environment
NODE_ENV=development|production
PORT=5000  # Default port
```

## 🤖 Custom Agents

### Pollinator Archetype Agents
The project includes custom Claude Code agents in `.claude/agents/`, each embodying one of the FloreSer pollinator archetypes:

- **maia-bee**: Maia (Bee) - Grounding wellness guide for foundational marketplace features and community support
- **bodhi-beetle**: Bodhi (Beetle) - Deep integration specialist for PostgreSQL/Drizzle shadow work and complex data healing
- **angelica-hummingbird**: Angelica (Hummingbird) - Precise insight specialist for API design with spiritual awareness
- **luna-butterfly**: Luna (Butterfly) - Transformation specialist for React 18/TypeScript interface metamorphosis

### Importing External Agents
1. **File-Based Import**: Copy agent `.md` files to `.claude/agents/` directory
2. **Git Integration**: Clone repositories containing agent definitions
3. **Format**: Agents use Markdown with YAML frontmatter:
```yaml
---
name: agent-name
description: When to use this agent
tools: Read, Edit, Write, Bash
model: sonnet
---
Agent system prompt and instructions...
```

### Management
- Use `/agents` command in Claude Code for interactive management
- Project-level agents take precedence over user-level agents
- Agents are version-controlled with the codebase

## 🛠️ Development Guidelines

### Database Operations (server/storage.ts)
- All database operations are centralized in the `storage` object
- Uses Drizzle ORM with type-safe queries
- Implements the `IStorage` interface for consistency
- Common patterns:
  - `await storage.getUserById(id)`
  - `await storage.createPractitioner(data)`
  - `await storage.getPractitionerByUserId(userId)`

### Authentication Patterns
```typescript
// Protect a route
app.get('/api/protected', requireAuth, async (req, res) => {
  const userId = (req.user as any).id;
  // ...
});

// Check admin access
app.get('/api/admin/data', requireAdmin, async (req, res) => {
  // ...
});

// Check specific permission
app.post('/api/action', requirePermission('createContent'), async (req, res) => {
  const permissionInfo = (req as any).permissionInfo;
  // ...
});
```

### Access Control Patterns
```typescript
// Get user's access info
const accessInfo = await AccessControlService.getUserAccessInfo(userId);

// Check specific permission
const result = await AccessControlService.hasPermission(userId, 'bookSessions');

// Update access level
await AccessControlService.updateUserAccessLevel(userId);

// Start free trial
const success = await AccessControlService.startFreeTrial(userId, 7);
```

### Seeds Currency Patterns
```typescript
// Award Seeds with facilitator bonus
const baseSeeds = 25;
const finalAmount = accessInfo.facilitatorBenefits?.seedsMultiplier
  ? Math.floor(baseSeeds * accessInfo.facilitatorBenefits.seedsMultiplier)
  : baseSeeds;

await storage.addSeedsTransaction({
  userId,
  amount: finalAmount,
  type: 'garden_upload',
  description: 'Content shared to Garden',
  referenceId: contentId,
  referenceType: 'garden_content'
});
```

### Frontend Patterns
- **Routing**: Wouter's `<Route>` and `useLocation()` hook
- **Auth**: `useAuth()` hook provides `{ user, isAuthenticated, isLoading }`
- **API Calls**: TanStack Query with `useQuery()` and `useMutation()`
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Import from `@/components/ui/*`
- **Path Aliases**:
  - `@/` → `client/src/`
  - `@shared/` → `shared/`
  - `@assets/` → `attached_assets/`

### Code Style
- TypeScript strict mode enabled
- Consistent use of async/await
- Functional components with hooks
- shadcn/ui component patterns
- Tailwind CSS utility classes

## 🎨 Brand Assets

Located in `attached_assets/` and referenced via `@assets/` alias:
- Logo variants: colored, gold, green
- Character illustrations: Angelica (hummingbird), Maia (bee)
- Archetype icons and graphics
- See BRAND_ASSETS.md for detailed inventory

## 📊 Data Flow Architecture

### User Creation Flow
1. Sign up via `/api/auth/signup` → creates `users` record
2. Create profile via `/api/practitioners` or `/api/clients`
3. `storage.createUserRole()` assigns role
4. Seeds wallet auto-created on first access
5. Access level defaults to "preview"

### Session Booking Flow
1. Client browses practitioners (access-controlled)
2. Selects practitioner and books session
3. `sessions_booking` record created
4. Email notifications sent (if configured)
5. After completion, Seeds awarded to both parties
6. Client can submit review

### Seeds Transaction Flow
1. User performs action (upload content, complete session, etc.)
2. Check if user is facilitator for bonus multiplier
3. Calculate final Seeds amount
4. `storage.addSeedsTransaction()` creates transaction record
5. Updates `seeds_wallets.seedsBalance` and tier if needed

## 🔍 Key Files to Understand

### Backend Core
- **server/routes.ts** (1055 lines): All API route definitions and AI Guardian logic
- **server/auth.ts** (313 lines): Passport.js setup and auth middleware
- **server/accessControl.ts** (325 lines): Subscription and permission system
- **server/storage.ts**: Database operations abstraction layer

### Frontend Core
- **client/src/App.tsx**: Main router and authenticated route logic
- **client/src/hooks/useAuth.ts**: Authentication state management
- **client/src/pages/**: All page components

### Shared Schema
- **shared/schema.ts** (656 lines): Database schema, enums, Zod validation, archetype definitions

## 🎯 Current Implementation Status

### Implemented Features ✅
- Complete authentication system (email/password + Google OAuth)
- User role management (client/practitioner/admin)
- Practitioner profile creation and browsing
- Client dashboard and session tracking
- Access control and subscription system
- Seeds currency with pollinator tiers
- Community Garden with content management
- AI Guardian (mAIa) chat assistant
- Alpha survey and feedback collection
- Admin panel for survey analytics
- Email service integration
- Review and rating system
- Responsive design across all pages

### Active Development 🚧
- Payment integration (Stripe dependencies installed)
- Session booking completion
- Real-time messaging between users
- Advanced practitioner matching algorithm
- Image upload for profiles and content
- Email notification system (service exists, needs configuration)

## 💡 Important Implementation Notes

### Authentication
- The system migrated from Replit Auth to Passport.js (email/password + Google OAuth)
- Session management uses PostgreSQL, not in-memory
- Sessions expire after 7 days
- JWT tokens also used for API authentication

### Access Control
- Access levels are distinct from subscription status
- Trial users get "basic" access level
- Facilitators (practitioners) get automatic bonuses on Seeds earnings
- Access levels are checked and updated on each authenticated request

### Seeds System
- All Seeds transactions must have a balanceAfter field
- Facilitator multiplier (2x) applied automatically when detected
- Tiers unlock automatically based on total earned Seeds
- No Seeds are deducted yet (spending system not implemented)

### Community Garden
- Content approval workflow exists but auto-approves for now
- Premium content gating temporarily disabled
- AI Guardian uses rule-based responses (no external AI API)
- View/like/download tracking implemented

### Database
- Use `npm run db:push` to sync schema changes (no migrations yet)
- All IDs are UUIDs (varchar with gen_random_uuid())
- Timestamps use PostgreSQL's defaultNow()
- Arrays stored as PostgreSQL array types

### API Response Patterns
- Success: `res.json({ data, message })`
- Error: `res.status(code).json({ message })`
- Access denied: Include `accessLevel`, `upgradeRequired`, `upgradeLevel`

---

**Last Updated**: Comprehensive codebase analysis 2025-10-02
**Project Status**: Active alpha development
**Primary Architecture**: Monolithic full-stack with PostgreSQL, transitioning to production-ready marketplace
