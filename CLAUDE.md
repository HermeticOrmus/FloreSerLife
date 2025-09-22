# FloreSer - Wellness Practitioners Marketplace

**Project Type**: Full-stack web application  
**Domain**: Wellness & Health  
**Platform**: Modern web marketplace

## 🌸 Project Overview

FloreSer is a wellness practitioners marketplace that connects clients with verified wellness practitioners through a unique **pollinator archetype system**. The platform uses nature-inspired metaphors (bee, hummingbird, butterfly, beetle) to help match clients with practitioners based on their healing approach and expertise.

### Core Concept
- **Archetypes**: Four pollinator types representing different healing approaches
- **Experience Levels**: Rising (0-2 years), Evolving (3-7 years), Wise (8+ years)
- **Matching System**: Clients find practitioners that resonate with their journey

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL (Neon) + Drizzle ORM
- **Auth**: Replit Auth (OpenID Connect)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Deployment**: Replit hosting

### Project Structure
```
/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── assets/         # Brand assets (logos, icons, characters)
│   │   ├── components/     # React components
│   │   │   ├── ui/         # shadcn/ui components
│   │   │   ├── layout/     # Header, Footer
│   │   │   └── icons/      # Custom icon components
│   │   ├── pages/          # Route components
│   │   ├── hooks/          # Custom hooks (useAuth)
│   │   └── lib/            # Utilities and config
├── server/                 # Backend Express application
│   ├── index.ts           # Main server entry
│   ├── routes.ts          # API route definitions
│   ├── db.ts              # Database connection
│   ├── storage.ts         # Database operations
│   └── replitAuth.ts      # Authentication setup
├── shared/                 # Shared TypeScript schemas
│   └── schema.ts          # Database schema + types
└── attached_assets/        # Original brand assets
```

## 🗄️ Database Schema

### Core Tables
- **users**: User accounts (Replit Auth integration)
- **user_roles**: Role assignments (client/practitioner)
- **practitioners**: Practitioner profiles with archetype/experience
- **clients**: Client profiles with preferences
- **sessions_booking**: Booking system
- **reviews**: Rating and feedback system

### Archetype System
```typescript
archetypes = {
  bee: "Grounding and foundational support",
  hummingbird: "Precise insight and spiritual guidance", 
  butterfly: "Life transitions and transformation",
  beetle: "Deep integration and shadow work"
}

experience_levels = {
  rising: "0-2 years experience",
  evolving: "3-7 years experience", 
  wise: "8+ years experience"
}
```

## 🎨 Brand & Design

### Visual Identity
- **Primary Colors**: Forest green, cream, gold
- **Typography**: Lora (headings), Poppins (body)
- **Characters**: Angelica (colibri/hummingbird), Maia (bee)
- **Logo Variants**: Main colored, gold, green versions

### Component Library
- Built on **shadcn/ui** for consistent design
- Custom archetype icon components
- Responsive design patterns
- Floating animations for character illustrations

## 🔐 Authentication & Authorization

### Replit Auth Integration
- OpenID Connect with session management
- JWT token refresh handling
- PostgreSQL session store
- Role-based access (client/practitioner)

### User Flow
1. Login via Replit Auth
2. Create role-specific profile (client or practitioner)
3. Access role-appropriate features
4. Session persistence with auto-refresh

## 📱 Key Features

### For Clients
- **Landing Page**: Hero section with character showcase
- **Practitioner Search**: Filter by archetype, experience, specialization
- **Profile System**: Preferences and archetype matching
- **Dashboard**: Session tracking and quick actions

### For Practitioners  
- **Profile Creation**: Archetype selection, bio, specializations
- **Verification System**: Badge system for verified practitioners
- **Session Management**: Booking and client interaction

### Shared Features
- **Responsive Design**: Mobile-first approach
- **Real-time Search**: Instant filtering and results
- **Asset Management**: Centralized brand asset system

## 🚀 Development Workflows

### Getting Started
```bash
# Install dependencies
npm install

# Development server (runs both frontend and backend)
npm run dev

# Build for production
npm run build

# Database operations
npm run db:push    # Push schema changes
```

### Key Scripts
- `npm run dev`: Development with hot reload
- `npm run build`: Production build (Vite + esbuild)
- `npm run start`: Production server
- `npm run check`: TypeScript checking

### Environment Variables
```env
DATABASE_URL=postgresql://...
SESSION_SECRET=your-session-secret
REPLIT_DOMAINS=your-domain.replit.dev
ISSUER_URL=https://replit.com/oidc
REPL_ID=your-repl-id
```

## 🔄 API Endpoints

### Public Endpoints
- `GET /api/practitioners` - Featured practitioners
- `GET /api/practitioners/all` - All verified practitioners  
- `GET /api/archetypes` - Archetype definitions
- `GET /api/experience-levels` - Experience level definitions

### Protected Endpoints
- `GET /api/auth/user` - Current user profile
- `POST /api/practitioners` - Create practitioner profile
- `POST /api/clients` - Create client profile

### Auth Endpoints
- `GET /api/login` - Initiate Replit Auth
- `GET /api/callback` - Auth callback handler
- `GET /api/logout` - Logout and cleanup

## 🎯 Current State & Next Steps

### Implemented Features ✅
- Complete authentication system
- User role management
- Practitioner profile creation
- Client browsing interface
- Responsive design
- Brand asset integration

### Planned Features 🚧
- Session booking system
- Payment integration (Stripe)
- Review and rating system
- Real-time messaging
- Advanced matching algorithm
- Practitioner onboarding flow

### Technical Debt & Improvements
- Add comprehensive testing
- Implement error boundaries
- Add loading states
- Optimize database queries
- Add image upload system
- Implement caching strategy

## 🛠️ Development Guidelines

### Code Style
- TypeScript strict mode enabled
- Consistent component patterns
- Centralized asset management
- shadcn/ui component usage

### Database
- Drizzle ORM for type safety
- Migration-based schema management
- Relational data modeling
- Connection pooling (Neon)

### Security
- Authenticated routes protection
- Session management
- CORS configuration
- Input validation with Zod

---

**Last Updated**: Current analysis  
**Project Status**: Active development  
**Primary Developer Context**: Full-stack wellness marketplace with unique archetype-based matching system
- save this to memory,