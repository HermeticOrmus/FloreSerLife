# FloreSer Phase 1 (Seed) Sprint Plan

> **Vision**: Launch a usable, emotionally safe platform with human oversight.
> **mAIa Posture**: Orientation, discovery, gentle reflection. No session memory.
> **Timeline**: 4-6 weeks to soft launch readiness

---

## Sprint Structure

| Sprint | Focus | Duration |
|--------|-------|----------|
| **Sprint 0** | Critical fixes & foundations | 3 days |
| **Sprint 1** | Client journey completion | 1 week |
| **Sprint 2** | Facilitator journey completion | 1 week |
| **Sprint 3** | mAIa integration & polish | 1 week |
| **Sprint 4** | Admin workflows & soft launch prep | 1 week |

---

## Sprint 0: Critical Fixes (3 days)

### Day 1: Bug Fixes
- [x] Fix SelectItem value="" bug in practitioners.tsx
- [ ] Add error boundaries to all page components
- [ ] Test all primary routes load without crash

### Day 2: Environment Setup
- [ ] ~~Configure Stripe keys~~ (deferred)
- [ ] Configure Anthropic API key for mAIa
- [ ] Configure SMTP for email notifications
- [ ] Verify database connection and seed data

### Day 3: Route Cleanup
- [ ] Add route aliases:
  - `/the-hive` → `/practitioners`
  - `/my-garden` → `/client-dashboard`
  - `/my-hive` → `/practitioner-dashboard`
- [ ] Verify all navigation links work

**Exit Criteria**: All pages load, environment configured, routes aligned with vision naming

---

## Sprint 1: Client Journey (1 week)

### Goal: Complete the seeker's path from discovery to booked session

### 1.1 Landing Page Enhancement
**Files**: `client/src/pages/landing.tsx`, `client/src/components/landing/`

- [ ] Add "Begin with mAIa" prominent CTA button
- [ ] Add "Meet mAIa" introduction section
- [ ] Ensure "Explore the Hive" CTA is prominent
- [ ] Add teaser for Community Garden (Phase 2)

### 1.2 mAIa Guided Discovery
**Files**: `client/src/pages/quiz.tsx`, `server/routes.ts`

- [ ] Connect quiz completion → practitioner recommendations
- [ ] Store archetype match results to user profile
- [ ] Add "mAIa suggests these practitioners for you" UI
- [ ] Create warm handoff from mAIa to practitioner browsing

### 1.3 Practitioner Discovery (The Hive)
**Files**: `client/src/pages/practitioners.tsx`

- [x] Fix filter crash bug
- [ ] Add mAIa-powered suggestions section at top
- [ ] Improve filter UX (show active filters as chips)
- [ ] Add "Message Facilitator" CTA to cards

### 1.4 Booking Flow
**Files**: `client/src/pages/book-session.tsx`, `server/routes.ts`

- [ ] Complete booking form UI
- [ ] Wire booking API to create session record
- [ ] Add booking confirmation page
- [ ] Send confirmation email (template needed)

### 1.5 Client Dashboard (My Garden)
**Files**: `client/src/pages/client-dashboard.tsx`

- [ ] Show upcoming sessions prominently
- [ ] Add messages inbox preview
- [ ] Add "Continue with mAIa" section
- [ ] Show booking history

**Exit Criteria**: Client can discover practitioners via mAIa or browsing, book a session, and see it in dashboard

---

## Sprint 2: Facilitator Journey (1 week)

### Goal: Complete the facilitator's path from application to active practice

### 2.1 Join the Hive Enhancement
**Files**: `client/src/pages/JoinTheHive.tsx`

- [ ] Clearer value proposition
- [ ] Show what facilitators get (Seeds bonus, visibility, etc.)
- [ ] Direct CTA to application

### 2.2 Application Flow (via mAIa)
**Files**: `client/src/pages/facilitator-apply.tsx`, `server/routes.ts`

- [ ] Verify mAIa conversational intake works end-to-end
- [ ] Add application status tracking for applicant
- [ ] Add "Application submitted" confirmation
- [ ] Ensure all required data collected

### 2.3 Admin Review Workflow
**Files**: `client/src/pages/admin-dashboard.tsx`, `server/routes.ts`

- [ ] Add pending applications list
- [ ] Add approve/reject actions with notes
- [ ] Send approval/rejection email
- [ ] Auto-create practitioner profile on approval

### 2.4 Facilitator Onboarding
**Files**: `client/src/pages/practitioner-onboarding.tsx`

- [ ] Create guided profile setup flow
- [ ] Set availability schedule
- [ ] Set session types and pricing
- [ ] Add profile preview

### 2.5 Facilitator Dashboard (My Hive)
**Files**: `client/src/pages/practitioner-dashboard.tsx`

- [ ] Show upcoming sessions
- [ ] Show messages inbox
- [ ] Show earnings overview (placeholder for now)
- [ ] Add availability management

**Exit Criteria**: Facilitator can apply, get approved, complete profile, and see their dashboard

---

## Sprint 3: mAIa Integration (1 week)

### Goal: Unified mAIa experience across all touchpoints

### 3.1 mAIa Personality Document
**Files**: Create `docs/maia-personality.md`

- [ ] Define mAIa's voice and tone
- [ ] Define Phase 1 boundaries (no memory, no diagnosis)
- [ ] Create response templates for common scenarios
- [ ] Define handoff language to human facilitators

### 3.2 AI Guardian Enhancement
**Files**: `client/src/components/ai-guardian.tsx`, `server/routes.ts`

- [ ] Update AI Guardian to use Anthropic API
- [ ] Implement mAIa personality guidelines
- [ ] Add contextual awareness (which page user is on)
- [ ] Add "I don't know, let me connect you with a human" fallback

### 3.3 mAIa Entry Points
**Files**: Various pages

- [ ] Landing page: "Begin with mAIa" launches guided discovery
- [ ] Practitioners page: mAIa suggestions at top
- [ ] Dashboard: "Continue your journey with mAIa"
- [ ] Floating "Chat with mAIa" on all pages

### 3.4 Modality Explanations
**Files**: Create educational content, `client/src/pages/resources.tsx`

- [ ] Write plain-language modality descriptions
- [ ] Create archetype explanation pages
- [ ] Add "Learn more" links throughout UI
- [ ] mAIa can explain modalities when asked

**Exit Criteria**: mAIa feels like a consistent, helpful guide across the platform

---

## Sprint 4: Admin & Launch Prep (1 week)

### 4.1 Admin Safety Oversight
**Files**: `client/src/pages/admin-dashboard.tsx`, `server/routes.ts`

- [ ] Add message monitoring capability
- [ ] Add user report/flag system
- [ ] Add facilitator suspension capability
- [ ] Create safety review queue

### 4.2 Email Notifications
**Files**: `server/email.ts`, create templates

- [ ] Booking confirmation (client)
- [ ] New booking notification (facilitator)
- [ ] Application status update
- [ ] Session reminder (24h before)

### 4.3 Error Handling
**Files**: Various

- [ ] Add error boundaries to all routes
- [ ] Create friendly error page
- [ ] Add loading states to all async operations
- [ ] Handle edge cases (no practitioners, empty states)

### 4.4 Polish & Testing
- [ ] Cross-browser testing
- [ ] Mobile responsiveness check
- [ ] Accessibility audit (keyboard nav, screen readers)
- [ ] Performance audit (Core Web Vitals)

### 4.5 Deployment Prep
- [ ] Production environment variables
- [ ] SSL/domain configuration
- [ ] Database backup strategy
- [ ] Monitoring/alerting setup

**Exit Criteria**: Platform ready for soft launch with small group of users

---

## Phase 1 Feature Checklist (Cynthia's Vision)

### Home / Landing Page - "The Garden Gate"
- [x] Hero & value proposition
- [ ] CTA: Explore the Hive
- [ ] CTA: Begin with mAIa
- [ ] CTA: Join the Hive (facilitators)
- [ ] Meet mAIa introduction
- [ ] Overview teasers for Hive / My Garden / Community Garden

### About Page
- [x] Brand narrative & values
- [ ] Conceptual positioning of mAIa
- [ ] CTAs to Explore / Begin with mAIa / Join the Hive

### Explore the Hive - Directory
- [x] Browse & search Pollinators
- [x] Filters: archetype, experience
- [ ] Filters: language, session type, timezone
- [x] Facilitator cards
- [ ] Message facilitator
- [ ] mAIa-assisted suggestions

### Facilitator Profile - "Soul Profile"
- [x] Public profile & offerings
- [ ] Scope & consent language
- [ ] In-app messaging from profile

### Client Dashboard - "My Garden"
- [ ] Welcome & orientation
- [ ] Upcoming sessions
- [ ] Booking history
- [ ] Messages inbox
- [ ] Basic post-session reflection

### Facilitator Dashboard - "My Hive"
- [ ] Profile & availability
- [ ] Session list
- [ ] Messages inbox
- [ ] Earnings overview

### Join the Hive - Facilitator Application
- [x] Application form (mAIa conversational)
- [ ] Admin review workflow
- [ ] Status tracking for applicant

### Community Garden
- [x] Public teaser (Phase 1)
- [ ] "Coming soon" messaging

### FAQ / Terms / Policies
- [x] Static policy pages
- [ ] Messaging boundaries documentation

### Payments / Transactions
- [x] Database schema ready
- [ ] ~~Checkout flow~~ (deferred - Stripe)
- [ ] Manual payout tracking for admin

### Admin / Back-End
- [x] Core admin tools
- [ ] Safety audit access
- [ ] Facilitator approval workflow

---

## Dependencies & Blockers

| Item | Dependency | Status |
|------|------------|--------|
| Anthropic API | API key from client | Needed |
| ~~Stripe~~ | ~~API keys from client~~ | Deferred |
| SMTP | Email provider credentials | Needed |
| Domain | DNS configuration | Needed for production |
| Seed data | Test facilitators in database | Done |

---

## Success Metrics for Soft Launch

| Metric | Target |
|--------|--------|
| Pages without errors | 100% |
| Core flows completable | Client + Facilitator journeys |
| mAIa response time | < 3 seconds |
| Mobile usability | All core flows work |
| Admin can review applications | Yes |

---

## Notes

- **Stripe deferred**: Payment processing moved to Phase 1.5 or Phase 2
- **Focus on flows**: Features exist - priority is connecting them into journeys
- **mAIa boundaries**: Phase 1 = no memory beyond profile, no diagnosis, always offer human connection
- **Safety first**: Admin oversight mandatory before public launch

---

*Created: 2026-01-08*
*Based on: Meta-Gods Analysis + Cynthia's Phase 1-4 Vision Document*
