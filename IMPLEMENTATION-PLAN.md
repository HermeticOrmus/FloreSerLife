# FloreSer Design System Implementation Plan

**Date**: 2025-11-09
**Purpose**: Site-wide UI/UX updates + button functionality + Stripe Sandbox integration
**Priority**: User's request - "Make all buttons functional, add Stripe Sandbox"

---

## 🎯 Implementation Priorities

### Phase 1: Button Functionality (IMMEDIATE)
**Status**: Next task
**Goal**: Make all buttons across the platform functional and properly linked

### Phase 2: Stripe Sandbox (IMMEDIATE)
**Status**: User-requested
**Goal**: Set up Stripe test environment for payment feature testing

### Phase 3: Design System Application (FOLLOW-UP)
**Status**: After Phase 1 & 2
**Goal**: Apply Garden/Hive design patterns to remaining pages

---

## 🔘 Phase 1: Button Functionality Audit

### Critical Pages to Audit

#### 1. Landing/Home Page (`home.tsx` / `landing.tsx`)
- [ ] "Get Started" / CTA buttons → Should route to sign-up
- [ ] "Learn More" buttons → Should route to about/alpha
- [ ] "Browse Practitioners" → Should route to /practitioners
- [ ] Navigation links → Verify all functional

#### 2. Practitioner Pages
- [ ] **practitioners.tsx**: "View Profile" / "Book Session" buttons
- [ ] **practitioner-profile.tsx**: "Book Session" button → Implement booking flow
- [ ] **book-session.tsx**: Session booking form submission

#### 3. Dashboard Pages
- [ ] **client-dashboard.tsx**: Quick action buttons (View Sessions, Book, Garden, etc.)
- [ ] **practitioner-dashboard.tsx**: Manage sessions, analytics buttons

#### 4. Garden Page (`garden.tsx`) ✅
- [x] "Share Content" button → Opens upload modal (FUNCTIONAL)
- [x] "Browse Pollinators" → Should route to /hive
- [x] "View Timeline" button → Self-referential (needs review)
- [x] "Enter Session" → Should route to session details
- [ ] **ACTION NEEDED**: Fix "Browse Pollinators" routing
- [ ] **ACTION NEEDED**: Implement "Enter Session" routing

#### 5. Hive Page (`hive.tsx`) ✅
- [x] Navigation sidebar buttons → Route correctly (FUNCTIONAL)
- [x] "View Details" button → Dashboard routing
- [x] "View Full Analytics" → Analytics page
- [x] "View" button (practitioner cards) → Profile routing (FUNCTIONAL)
- [x] "Book" button (practitioner cards) → Booking flow (FUNCTIONAL)
- [ ] **ACTION NEEDED**: Connect "Manage Sessions" button in calendar card
- [ ] **ACTION NEEDED**: Connect "View Details" in earnings card

#### 6. Authentication Pages
- [ ] **SignIn.tsx**: Google OAuth button → Verify functionality
- [ ] **SignUp.tsx**: Registration form → Verify validation + submission

#### 7. Admin Pages
- [ ] **admin-dashboard.tsx**: Admin action buttons
- [ ] **admin-survey.tsx**: Survey management buttons
- [ ] **simple-admin-panel.tsx**: Simple admin actions

---

## 💳 Phase 2: Stripe Sandbox Setup

### Stripe Dependencies
**Already Installed**:
```json
"@stripe/stripe-js": "^4.10.0",
"stripe": "^16.12.0"
```

### Implementation Steps

#### 1. Get Stripe Test Credentials
- [ ] Create Stripe account (or use existing)
- [ ] Navigate to Developers → API Keys
- [ ] Copy **Publishable key** (starts with `pk_test_`)
- [ ] Copy **Secret key** (starts with `sk_test_`)

#### 2. Environment Variables
Add to `.env`:
```env
# Stripe Configuration (Test Mode)
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...  # For webhook events
```

#### 3. Backend Stripe Integration
Create `server/stripe.ts`:
```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export { stripe };
```

#### 4. Payment Endpoints to Implement
```typescript
// server/routes.ts additions

// Create Checkout Session for subscription
app.post('/api/payment/create-checkout-session', requireAuth, async (req, res) => {
  // Create Stripe Checkout session
  // Return session URL for redirect
});

// Create Payment Intent for one-time payments
app.post('/api/payment/create-payment-intent', requireAuth, async (req, res) => {
  // Create PaymentIntent for session booking
});

// Handle Stripe Webhooks
app.post('/api/webhooks/stripe', async (req, res) => {
  // Verify webhook signature
  // Handle events: checkout.session.completed, payment_intent.succeeded, etc.
});

// Get user's payment methods
app.get('/api/payment/methods', requireAuth, async (req, res) => {
  // Return user's saved payment methods
});

// Cancel subscription
app.post('/api/payment/cancel-subscription', requireAuth, async (req, res) => {
  // Cancel user's subscription
});
```

#### 5. Frontend Stripe Components
Create `client/src/components/stripe/`:
- `CheckoutButton.tsx` - Subscription upgrade button
- `PaymentForm.tsx` - Session booking payment form
- `PaymentMethodManager.tsx` - Saved payment methods UI
- `SubscriptionManager.tsx` - Current subscription status + cancel

#### 6. Stripe Products & Prices Setup
In Stripe Dashboard → Products:
- [ ] Create "Basic" plan ($X/month)
- [ ] Create "Premium" plan ($Y/month)
- [ ] Create "Unlimited" plan ($Z/month)
- [ ] Create "Session Booking" one-time product (variable pricing)

#### 7. Testing Flow
- [ ] Test subscription upgrade (preview → basic)
- [ ] Test subscription upgrade (basic → premium)
- [ ] Test session booking payment
- [ ] Test webhook handling
- [ ] Test subscription cancellation
- [ ] Use Stripe test cards: `4242 4242 4242 4242`

---

## 🎨 Phase 3: Design System Application

### Priority Pages (Post-Button/Stripe Work)

#### High Priority
1. **landing.tsx** - First impression, needs cohesive design
2. **home.tsx** - Main entry point for authenticated users
3. **practitioners.tsx** - Browse experience
4. **practitioner-profile.tsx** - Detailed view
5. **client-dashboard.tsx** - User dashboard
6. **practitioner-dashboard.tsx** - Practitioner dashboard

#### Medium Priority
7. **book-session.tsx** - Booking flow
8. **SignIn.tsx / SignUp.tsx** - Auth pages
9. **about.tsx** - Information page
10. **alpha.tsx** - Alpha program page
11. **survey.tsx** - Feedback collection

#### Low Priority (Functional, not customer-facing)
12. **admin-dashboard.tsx** - Internal admin
13. **admin-survey.tsx** - Internal admin
14. **simple-admin-panel.tsx** - Internal admin
15. **contact.tsx / resources.tsx / quiz.tsx** - Secondary pages
16. **privacy.tsx / terms.tsx** - Legal pages

### Design System Application Checklist (Per Page)

```markdown
## [Page Name] Design Update

### Color Theme
- [ ] Choose Garden or Hive theme (or neutral earth tones)
- [ ] Apply background colors (`bg-garden-bg` or `bg-hive-bg`)
- [ ] Update card backgrounds (`bg-garden-card`, `bg-hive-card-light`)
- [ ] Apply accent colors to buttons (`bg-garden-accent`, `bg-hive-accent`)

### Typography
- [ ] Page heading: `text-page-heading font-heading`
- [ ] Section headings: `text-section-heading font-heading`
- [ ] Card titles: `text-card-heading font-heading`
- [ ] Body text: `text-body` (or `text-body-sm` for metadata)
- [ ] Labels: `text-label`
- [ ] Stats/numbers: `text-stat-lg` or `text-stat-xl`

### Components
- [ ] Cards: Update to `rounded-card`, `shadow-card`
- [ ] Buttons: Update to `rounded-button`, correct theme colors
- [ ] Inputs: Update to `rounded-input`, theme borders
- [ ] Badges: Update to `rounded-badge`, theme colors

### Layout
- [ ] Sidebar (if applicable): 64 width, theme background
- [ ] Main content: `p-12` padding, `max-w-6xl mx-auto`
- [ ] Grid layouts: Use consistent gaps (gap-6, gap-8)
- [ ] Card spacing: `space-y-4` within, `gap-6` between

### Animations
- [ ] Add framer-motion entrance animations
- [ ] Stagger card animations with delay
- [ ] Add hover states (`hover:shadow-card-hover`)

### Icons
- [ ] Consistent sizes (w-5 h-5 for nav, w-6 h-6 for headers)
- [ ] Theme-appropriate colors

### Responsive
- [ ] Test mobile/tablet layouts
- [ ] Ensure grid collapses appropriately
```

---

## 📊 Progress Tracking

### Phase 1: Button Functionality
- **Start Date**: 2025-11-09
- **Target Completion**: 1 day
- **Estimated Work**: 4-6 hours

**Sub-tasks**:
1. Audit all pages for button functionality (2 hours)
2. Fix non-functional buttons (2 hours)
3. Implement missing routing (1 hour)
4. Test all flows (1 hour)

### Phase 2: Stripe Sandbox
- **Start Date**: After Phase 1
- **Target Completion**: 1-2 days
- **Estimated Work**: 6-8 hours

**Sub-tasks**:
1. Set up Stripe account + credentials (30 min)
2. Backend integration (3 hours)
3. Frontend components (2 hours)
4. Webhook handling (1 hour)
5. Testing (2 hours)

### Phase 3: Design System Application
- **Start Date**: After Phase 1 & 2
- **Target Completion**: 3-4 days
- **Estimated Work**: 12-16 hours (depending on page count)

**Sub-tasks**:
1. Landing page (2 hours)
2. Auth pages (2 hours)
3. Dashboard pages (3 hours)
4. Practitioner pages (2 hours)
5. Secondary pages (3 hours)
6. Testing + refinement (2 hours)

---

## 🚀 Immediate Next Actions

### NOW (Phase 1 Start)
1. ✅ Create design system documentation (COMPLETED)
2. ✅ Create implementation plan (COMPLETED)
3. ⬜ Audit Garden page buttons (identify issues)
4. ⬜ Audit Hive page buttons (identify issues)
5. ⬜ Audit all other pages systematically

### AFTER Button Audit
1. ⬜ Fix critical navigation buttons
2. ⬜ Implement missing routing
3. ⬜ Connect session booking flow
4. ⬜ Test end-to-end user flows

### THEN (Phase 2 Start)
1. ⬜ Set up Stripe test credentials
2. ⬜ Implement backend Stripe integration
3. ⬜ Create frontend payment components
4. ⬜ Test payment flows

### FINALLY (Phase 3)
1. ⬜ Apply design system to landing page
2. ⬜ Continue with priority pages
3. ⬜ Final QA pass

---

## 📝 Notes

### Button Functionality Principles
- Every button should have a clear purpose
- Non-functional buttons should either:
  - Be implemented properly
  - Be hidden/disabled with tooltip explaining why
  - Navigate to a "coming soon" page if feature is planned

### Stripe Integration Principles
- Always use test mode during development
- Never commit Stripe secret keys to git
- Validate all payment amounts server-side
- Log all webhook events for debugging
- Handle failed payments gracefully

### Design System Application Principles
- Consistency over novelty
- Maintain existing functionality while updating UI
- Test each page after update
- Get user/client feedback on high-priority pages first

---

**Last Updated**: 2025-11-09
**Owner**: Ormus Services
**Client**: Cynthia (FloreSer)
