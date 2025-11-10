# Archived Replit Files

This directory contains files that were specific to Replit deployment and have been archived during migration to platform-agnostic hosting.

## Files Archived

- **`.replit`** - Replit deployment configuration file
- **`replitAuth.ts`** - Replit OpenID Connect authentication implementation
- **`replit.md`** - Replit-specific documentation

## Migration Date

November 10, 2025

## Current Auth System

The project now uses platform-agnostic authentication via Passport.js:
- Email/password authentication (Passport Local Strategy)
- Google OAuth integration
- PostgreSQL session storage (via connect-pg-simple)
- JWT token support

See `server/auth.ts` for current implementation.

## Deployment

The application is now ready for deployment on:
- Vercel (recommended for full-stack React + Express)
- Railway (includes PostgreSQL)
- Netlify (frontend-focused)
- Docker (custom infrastructure)

## Why This Was Archived

These files were Replit-specific and prevented platform portability. The core application functionality (authentication, database, API) was already platform-agnostic, making migration straightforward.

The Replit authentication was secondary to the Passport.js implementation and is no longer needed.
