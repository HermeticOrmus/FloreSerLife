# FloreSer Context Compact

> Quick reference for continuing work after context reset

## Current State (2026-01-08)

**Commit**: `c02b022` - Sprint 0-1 swarm execution complete
**Score**: ~50/70 (DEVELOPING) - Major progress toward soft launch

## What's Done

### Sprint 0 (Critical) - COMPLETE
- [x] Practitioners page crash fixed (SelectItem bug)
- [x] Error boundaries added to App.tsx
- [x] Route aliases: /the-hive, /my-garden, /my-hive
- [ ] Configure Anthropic API key (needs client input)
- [ ] Configure SMTP (needs client input)

### Sprint 1 (Client Journey) - MOSTLY COMPLETE
- [x] "Begin with mAIa" CTA on landing page
- [x] Quiz → practitioner matching flow
- [x] Client dashboard enhancement ("My Garden" theming)
- [ ] Complete booking flow (without payment)

### Sprint 2 (Facilitator Journey) - MOSTLY COMPLETE
- [x] Application status tracking (pending/approved/rejected UI)
- [x] Admin approval workflow (Applications tab)
- [ ] Facilitator dashboard enhancement
- [ ] Facilitator onboarding improvements

### Infrastructure
- [x] Phase 1 backend merged (schema, routes, storage)
- [x] Messaging system complete
- [x] Facilitator application with mAIa chat
- [x] Sprint plan: `PHASE1-SPRINT-PLAN.md`

## What's Next

### Immediate
1. Facilitator dashboard enhancement (like client dashboard)
2. Booking flow completion (session creation without Stripe)
3. API keys from client (Anthropic, SMTP)

### Sprint 3 (mAIa Integration)
- mAIa personality document
- AI Guardian Anthropic API integration
- mAIa entry points across pages

### Sprint 4 (Admin & Launch Prep)
- Message monitoring
- Email notifications
- Polish & testing

## Key Files

| Purpose | Location |
|---------|----------|
| Sprint plan | `PHASE1-SPRINT-PLAN.md` |
| Database schema | `shared/schema.ts` |
| API routes | `server/routes.ts` |
| Landing page | `client/src/pages/landing.tsx` |
| Practitioners | `client/src/pages/practitioners.tsx` |
| Quiz | `client/src/pages/quiz.tsx` |
| Client dashboard | `client/src/pages/client-dashboard.tsx` |
| Admin dashboard | `client/src/pages/admin-dashboard.tsx` |
| Facilitator apply | `client/src/pages/facilitator-apply.tsx` |
| Error boundary | `client/src/components/error-boundary.tsx` |

## Critical Decisions

1. **Stripe deferred** - Focus on flows first, payments later
2. **mAIa boundaries** - No memory beyond profile in Phase 1
3. **Connect, don't add** - Features exist, need journey integration

## Server

```bash
cd ~/projects/01-ACTIVE/apps/FloreSer/website
set -a && source .env && set +a && npm run dev
```

## Vision Alignment (Cynthia's Document)

| Vision Name | Route | Status |
|-------------|-------|--------|
| Begin with mAIa | `/quiz` | Working |
| Explore the Hive | `/practitioners` or `/the-hive` | Working |
| My Garden | `/client-dashboard` or `/my-garden` | Enhanced |
| My Hive | `/practitioner-dashboard` or `/my-hive` | Needs work |

Transform from "marketplace with AI" → "guided garden experience"
