# Overview

FloreSer is a wellness marketplace platform that connects clients with wellness practitioners using a unique pollinator archetype system. The platform categorizes practitioners into four nature-based archetypes (Bee, Hummingbird, Butterfly, Beetle) to help clients find practitioners whose approach resonates with their healing journey. The application provides session booking, practitioner discovery, user authentication, and profile management features.

# User Preferences

Preferred communication style: Simple, everyday language.
Character asset preference: Background-free versions of ANGELICA and MAIA characters for cleaner website integration.
Branding preference: ANGELICA character as hero image instead of generic imagery, golden logo for favicon.

# Recent Changes

## Brand Asset Organization & Character Integration (Aug 9, 2025)
- Reorganized all brand assets from attached_assets into clean directory structure
- Created centralized asset management system in `client/src/assets/index.ts`
- Updated all logo references to use organized assets instead of placeholder icons
- Implemented real archetype icons (bee, butterfly, beetle, hummingbird) throughout the application
- Added character illustrations: MAIA the Bee and ANGELICA the Colibri as brand ambassadors
- Created dedicated character showcase section on landing page featuring both characters
- Fixed TypeScript errors in authentication system for proper user type handling
- Created comprehensive brand asset documentation in `BRAND_ASSETS.md`

## Character Asset Updates & Hero Section (Aug 10, 2025)
- Replaced hero section mountain image with ANGELICA the Colibri character for branded welcome experience
- Updated character assets with preferred background-free versions for cleaner integration
- Set golden FloreSer logo as website favicon for professional browser tab branding
- Enhanced landing page with character-driven storytelling approach

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Styling**: Tailwind CSS with custom design system based on nature-inspired color palette (forest, cream, gold, sage)
- **UI Components**: Shadcn/ui component library with Radix UI primitives for accessibility
- **Routing**: Wouter for client-side routing with conditional rendering based on authentication state
- **State Management**: TanStack Query for server state management and data fetching
- **Typography**: Custom font stack using Lora (serif) for headings and Poppins (sans-serif) for body text

## Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with structured route organization
- **Authentication**: Replit OIDC integration with Passport.js strategy
- **Session Management**: Express sessions with PostgreSQL session store
- **File Structure**: Monorepo structure with shared schema between client and server

## Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon serverless PostgreSQL
- **Schema Organization**: Shared schema definitions using Drizzle with TypeScript
- **Key Entities**:
  - Users with profile information
  - Practitioners with archetype classification and specializations
  - Clients with preferences and booking history
  - Sessions with status tracking
  - User roles for multi-role support
  - Reviews and ratings system

## Authentication & Authorization
- **Provider**: Replit OIDC for seamless integration
- **Session Storage**: PostgreSQL-backed sessions with configurable TTL
- **User Management**: Support for multiple user roles (client, practitioner)
- **Security**: HTTP-only cookies, secure session handling, and CSRF protection

## Design System
- **Color Palette**: Nature-inspired colors (forest green, cream, gold, sage)
- **Component Library**: Custom implementations built on Radix UI primitives
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: Full keyboard navigation and screen reader support through Radix UI

# External Dependencies

## Core Technologies
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Replit Authentication**: OIDC-based authentication system
- **Google Cloud Storage**: File storage for practitioner profiles and assets
- **Stripe**: Payment processing for session bookings (integrated but not fully implemented)

## Development Tools
- **Vite**: Build tool with hot module replacement and optimized production builds
- **TypeScript**: Type safety across the entire stack
- **Drizzle Kit**: Database migrations and schema management
- **ESBuild**: Production bundling for server-side code

## UI/UX Libraries
- **Shadcn/ui**: Pre-built accessible component library
- **Radix UI**: Headless UI primitives for complex components
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography

## File Upload System
- **Uppy**: Modern file uploader with drag-and-drop support
- **AWS S3 Integration**: Direct upload capabilities for practitioner assets
- **Google Cloud Storage**: Alternative storage backend for file management