# Stripe Integration Plan - FloreSer

**Created**: 2025-11-10
**Status**: Ready for Implementation
**Purpose**: Complete Stripe Sandbox integration for subscription & payment testing

---

## 🎯 Overview

Implement Stripe payment processing for:
1. **Subscription Management** - Access tier upgrades (preview → basic → premium → unlimited)
2. **Session Booking Payments** - One-time payments for practitioner sessions
3. **Payment Method Management** - Save/manage payment methods
4. **Webhook Handling** - Real-time payment event processing

---

## 📦 Dependencies Status

**Already Installed** ✅:
```json
"@stripe/react-stripe-js": "^3.9.0",
"@stripe/stripe-js": "^7.8.0",
"stripe": "^18.4.0"
```

**No additional packages needed**

---

## 🔐 Environment Configuration

### Required Environment Variables

Add to `.env`:
```env
# Stripe Test Mode Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_...  # From Stripe Dashboard → Developers → API Keys
STRIPE_SECRET_KEY=sk_test_...       # Keep secret, never commit
STRIPE_WEBHOOK_SECRET=whsec_...     # From Stripe Dashboard → Webhooks

# Stripe Product/Price IDs (create in Stripe Dashboard first)
STRIPE_PRICE_BASIC=price_...        # Basic tier monthly price
STRIPE_PRICE_PREMIUM=price_...      # Premium tier monthly price
STRIPE_PRICE_UNLIMITED=price_...    # Unlimited tier monthly price
```

### Stripe Dashboard Setup Steps

1. **Create Stripe Account** (or login to existing)
   - Navigate to https://dashboard.stripe.com/test/apikeys
   - Copy **Publishable key** (pk_test_...)
   - Copy **Secret key** (sk_test_...)

2. **Create Products** (Dashboard → Products → Add Product)
   - **Basic Plan**: $X/month (you decide pricing)
   - **Premium Plan**: $Y/month
   - **Unlimited Plan**: $Z/month
   - Save the Price IDs (price_...) for each

3. **Set Up Webhook** (Dashboard → Developers → Webhooks)
   - Add endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Select events: `checkout.session.completed`, `payment_intent.succeeded`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy **Signing secret** (whsec_...)

---

## 🏗️ Implementation Architecture

### Phase 1: Backend Stripe Module

**File**: `server/stripe.ts`

```typescript
import Stripe from 'stripe';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia', // Latest stable version
});

export { stripe };

// Stripe Configuration
export const STRIPE_CONFIG = {
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY!,
  prices: {
    basic: process.env.STRIPE_PRICE_BASIC!,
    premium: process.env.STRIPE_PRICE_PREMIUM!,
    unlimited: process.env.STRIPE_PRICE_UNLIMITED!,
  },
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
};

// Helper: Create or retrieve Stripe customer
export async function getOrCreateStripeCustomer(userId: string, email: string) {
  // Check if customer already exists in DB
  // If not, create Stripe customer and store ID
  // Return Stripe customer ID
}

// Helper: Create Checkout Session for subscription
export async function createSubscriptionCheckout(
  userId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  const customerId = await getOrCreateStripeCustomer(userId, email);

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{
      price: priceId,
      quantity: 1,
    }],
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return session;
}

// Helper: Create Payment Intent for one-time payment
export async function createPaymentIntent(
  amount: number,
  currency: string,
  metadata: Record<string, string>
) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount, // in cents
    currency,
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return paymentIntent;
}

// Helper: Cancel subscription
export async function cancelSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.cancel(subscriptionId);
  return subscription;
}
```

---

### Phase 2: Database Schema Updates

**File**: `shared/schema.ts` (additions)

```typescript
// Add to existing schema

// Stripe Customer Mapping
export const stripeCustomers = pgTable('stripe_customers', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  stripeCustomerId: varchar('stripe_customer_id').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Subscription Records
export const subscriptions = pgTable('subscriptions', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  stripeSubscriptionId: varchar('stripe_subscription_id').notNull().unique(),
  stripePriceId: varchar('stripe_price_id').notNull(),
  status: varchar('status').notNull(), // active, canceled, past_due, etc.
  currentPeriodStart: timestamp('current_period_start').notNull(),
  currentPeriodEnd: timestamp('current_period_end').notNull(),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Payment Records
export const payments = pgTable('payments', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  stripePaymentIntentId: varchar('stripe_payment_intent_id').notNull().unique(),
  amount: integer('amount').notNull(), // in cents
  currency: varchar('currency').notNull().default('usd'),
  status: varchar('status').notNull(), // succeeded, pending, failed
  description: text('description'),
  metadata: text('metadata'), // JSON string for additional data
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Zod schemas for validation
export const insertStripeCustomerSchema = createInsertSchema(stripeCustomers);
export const insertSubscriptionSchema = createInsertSchema(subscriptions);
export const insertPaymentSchema = createInsertSchema(payments);
```

**Migration Command**:
```bash
npm run db:push
```

---

### Phase 3: API Endpoints

**File**: `server/routes.ts` (additions)

#### Subscription Management

```typescript
// Create Checkout Session for subscription upgrade
app.post('/api/stripe/create-checkout-session', requireAuth, async (req, res) => {
  try {
    const userId = (req.user as any).id;
    const { tier } = req.body; // 'basic', 'premium', or 'unlimited'

    // Validate tier
    if (!['basic', 'premium', 'unlimited'].includes(tier)) {
      return res.status(400).json({ message: 'Invalid tier' });
    }

    const user = await storage.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get price ID for tier
    const priceId = STRIPE_CONFIG.prices[tier];

    // Create checkout session
    const session = await createSubscriptionCheckout(
      userId,
      priceId,
      `${process.env.CLIENT_URL}/dashboard?upgrade=success`,
      `${process.env.CLIENT_URL}/dashboard?upgrade=cancelled`
    );

    res.json({ sessionUrl: session.url });
  } catch (error) {
    console.error('Checkout session creation failed:', error);
    res.status(500).json({ message: 'Failed to create checkout session' });
  }
});

// Get user's active subscription
app.get('/api/stripe/subscription', requireAuth, async (req, res) => {
  try {
    const userId = (req.user as any).id;

    const subscription = await storage.getActiveSubscription(userId);

    if (!subscription) {
      return res.json({ subscription: null });
    }

    res.json({ subscription });
  } catch (error) {
    console.error('Failed to fetch subscription:', error);
    res.status(500).json({ message: 'Failed to fetch subscription' });
  }
});

// Cancel subscription
app.post('/api/stripe/cancel-subscription', requireAuth, async (req, res) => {
  try {
    const userId = (req.user as any).id;

    const subscription = await storage.getActiveSubscription(userId);

    if (!subscription) {
      return res.status(404).json({ message: 'No active subscription' });
    }

    // Cancel at end of billing period
    await cancelSubscription(subscription.stripeSubscriptionId);

    // Update database
    await storage.updateSubscription(subscription.id, {
      cancelAtPeriodEnd: true,
      updatedAt: new Date(),
    });

    res.json({ message: 'Subscription will cancel at end of billing period' });
  } catch (error) {
    console.error('Subscription cancellation failed:', error);
    res.status(500).json({ message: 'Failed to cancel subscription' });
  }
});
```

#### Session Booking Payments

```typescript
// Create Payment Intent for session booking
app.post('/api/stripe/create-payment-intent', requireAuth, async (req, res) => {
  try {
    const userId = (req.user as any).id;
    const { sessionBookingId, amount } = req.body;

    // Validate session booking exists and belongs to user
    const booking = await storage.getSessionBookingById(sessionBookingId);

    if (!booking || booking.clientId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Create payment intent
    const paymentIntent = await createPaymentIntent(
      amount * 100, // convert to cents
      'usd',
      {
        userId,
        sessionBookingId,
        type: 'session_booking',
      }
    );

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Payment intent creation failed:', error);
    res.status(500).json({ message: 'Failed to create payment intent' });
  }
});
```

#### Webhook Handler

```typescript
// Stripe Webhook Handler
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig!,
      STRIPE_CONFIG.webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Update user's subscription status
      await handleCheckoutComplete(session);
      break;

    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Record successful payment
      await handlePaymentSuccess(paymentIntent);
      break;

    case 'customer.subscription.updated':
      const subscription = event.data.object;
      // Update subscription status
      await handleSubscriptionUpdate(subscription);
      break;

    case 'customer.subscription.deleted':
      const deletedSub = event.data.object;
      // Handle subscription cancellation
      await handleSubscriptionDeleted(deletedSub);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

// Webhook Handlers
async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;

  if (session.mode === 'subscription') {
    // Create subscription record
    await storage.createSubscription({
      userId,
      stripeSubscriptionId: session.subscription as string,
      stripePriceId: session.line_items?.data[0].price.id,
      status: 'active',
      currentPeriodStart: new Date(session.subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(session.subscription.current_period_end * 1000),
    });

    // Update user's access level
    await AccessControlService.updateUserAccessLevel(userId);
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  // Create payment record
  await storage.createPayment({
    userId: paymentIntent.metadata.userId,
    stripePaymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    status: 'succeeded',
    description: paymentIntent.description || 'Session booking',
    metadata: JSON.stringify(paymentIntent.metadata),
  });

  // If session booking payment, update booking status
  if (paymentIntent.metadata.type === 'session_booking') {
    await storage.updateSessionBooking(paymentIntent.metadata.sessionBookingId, {
      paymentStatus: 'paid',
    });
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  await storage.updateSubscriptionByStripeId(subscription.id, {
    status: subscription.status,
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    updatedAt: new Date(),
  });

  // Update user's access level
  const sub = await storage.getSubscriptionByStripeId(subscription.id);
  if (sub) {
    await AccessControlService.updateUserAccessLevel(sub.userId);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await storage.updateSubscriptionByStripeId(subscription.id, {
    status: 'canceled',
    updatedAt: new Date(),
  });

  // Downgrade user's access level
  const sub = await storage.getSubscriptionByStripeId(subscription.id);
  if (sub) {
    await AccessControlService.updateUserAccessLevel(sub.userId);
  }
}
```

---

### Phase 4: Storage Layer Updates

**File**: `server/storage.ts` (additions)

```typescript
// Add to IStorage interface and implementation

interface IStorage {
  // ... existing methods ...

  // Stripe Customer Methods
  createStripeCustomer(data: InsertStripeCustomer): Promise<StripeCustomer>;
  getStripeCustomerByUserId(userId: string): Promise<StripeCustomer | undefined>;

  // Subscription Methods
  createSubscription(data: InsertSubscription): Promise<Subscription>;
  getActiveSubscription(userId: string): Promise<Subscription | undefined>;
  getSubscriptionByStripeId(stripeSubscriptionId: string): Promise<Subscription | undefined>;
  updateSubscription(id: string, data: Partial<Subscription>): Promise<void>;
  updateSubscriptionByStripeId(stripeSubscriptionId: string, data: Partial<Subscription>): Promise<void>;

  // Payment Methods
  createPayment(data: InsertPayment): Promise<Payment>;
  getPaymentsByUserId(userId: string): Promise<Payment[]>;
}

// Implementation
const storage: IStorage = {
  // ... existing methods ...

  createStripeCustomer: async (data) => {
    const [customer] = await db.insert(stripeCustomers).values(data).returning();
    return customer;
  },

  getStripeCustomerByUserId: async (userId) => {
    const [customer] = await db.select()
      .from(stripeCustomers)
      .where(eq(stripeCustomers.userId, userId))
      .limit(1);
    return customer;
  },

  createSubscription: async (data) => {
    const [subscription] = await db.insert(subscriptions).values(data).returning();
    return subscription;
  },

  getActiveSubscription: async (userId) => {
    const [subscription] = await db.select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, userId),
          eq(subscriptions.status, 'active')
        )
      )
      .limit(1);
    return subscription;
  },

  getSubscriptionByStripeId: async (stripeSubscriptionId) => {
    const [subscription] = await db.select()
      .from(subscriptions)
      .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId))
      .limit(1);
    return subscription;
  },

  updateSubscription: async (id, data) => {
    await db.update(subscriptions)
      .set(data)
      .where(eq(subscriptions.id, id));
  },

  updateSubscriptionByStripeId: async (stripeSubscriptionId, data) => {
    await db.update(subscriptions)
      .set(data)
      .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId));
  },

  createPayment: async (data) => {
    const [payment] = await db.insert(payments).values(data).returning();
    return payment;
  },

  getPaymentsByUserId: async (userId) => {
    const payments = await db.select()
      .from(payments)
      .where(eq(payments.userId, userId))
      .orderBy(desc(payments.createdAt));
    return payments;
  },
};
```

---

### Phase 5: Frontend Components

#### Stripe Provider Setup

**File**: `client/src/App.tsx` (additions)

```typescript
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function App() {
  return (
    <Elements stripe={stripePromise}>
      {/* existing app content */}
    </Elements>
  );
}
```

**Environment Variable**: Add to `.env`:
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

#### Subscription Upgrade Component

**File**: `client/src/components/stripe/UpgradeButton.tsx`

```typescript
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface UpgradeButtonProps {
  tier: 'basic' | 'premium' | 'unlimited';
  label: string;
}

export function UpgradeButton({ tier, label }: UpgradeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleUpgrade = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });

      const { sessionUrl } = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = sessionUrl;
    } catch (error) {
      console.error('Upgrade failed:', error);
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleUpgrade} disabled={isLoading}>
      {isLoading ? 'Loading...' : label}
    </Button>
  );
}
```

#### Payment Form Component

**File**: `client/src/components/stripe/PaymentForm.tsx`

```typescript
import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';

interface PaymentFormProps {
  sessionBookingId: string;
  amount: number;
  onSuccess: () => void;
}

export function PaymentForm({ sessionBookingId, amount, onSuccess }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);
    setError(null);

    try {
      // Create Payment Intent
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionBookingId, amount }),
      });

      const { clientSecret } = await response.json();

      // Confirm payment
      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard?payment=success`,
        },
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
      } else {
        onSuccess();
      }
    } catch (err) {
      setError('Payment processing failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <Button type="submit" disabled={!stripe || isLoading} className="mt-4">
        {isLoading ? 'Processing...' : `Pay $${amount}`}
      </Button>
    </form>
  );
}
```

#### Subscription Manager Component

**File**: `client/src/components/stripe/SubscriptionManager.tsx`

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function SubscriptionManager() {
  const { data: subscription, refetch } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const res = await fetch('/api/stripe/subscription');
      return res.json();
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
      });
      return res.json();
    },
    onSuccess: () => {
      refetch();
    },
  });

  if (!subscription?.subscription) {
    return <p>No active subscription</p>;
  }

  const sub = subscription.subscription;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Subscription</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Status: {sub.status}</p>
        <p>Current period ends: {new Date(sub.currentPeriodEnd).toLocaleDateString()}</p>

        {sub.cancelAtPeriodEnd ? (
          <p className="text-yellow-600">Will cancel at end of period</p>
        ) : (
          <Button
            onClick={() => cancelMutation.mutate()}
            variant="destructive"
            disabled={cancelMutation.isPending}
          >
            Cancel Subscription
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
```

---

## 🧪 Testing Plan

### Test Cards (Stripe Test Mode)

```
Successful payment: 4242 4242 4242 4242
Declined payment: 4000 0000 0000 0002
Requires authentication: 4000 0025 0000 3155
```

### Test Scenarios

1. **Subscription Upgrade Flow**
   - [ ] User clicks "Upgrade to Basic"
   - [ ] Redirects to Stripe Checkout
   - [ ] Completes payment with test card
   - [ ] Webhook receives `checkout.session.completed`
   - [ ] User's access level updated in database
   - [ ] User redirected back with success message

2. **Session Booking Payment**
   - [ ] User books session
   - [ ] Payment form displays with correct amount
   - [ ] Submits payment with test card
   - [ ] Payment intent succeeds
   - [ ] Webhook receives `payment_intent.succeeded`
   - [ ] Booking marked as paid

3. **Subscription Cancellation**
   - [ ] User clicks "Cancel Subscription"
   - [ ] Subscription marked for cancellation at period end
   - [ ] Webhook receives `customer.subscription.deleted` at end of period
   - [ ] User's access level downgraded

4. **Payment Failure Handling**
   - [ ] Use declined test card
   - [ ] Error message displays
   - [ ] No database changes
   - [ ] User can retry

5. **Webhook Verification**
   - [ ] Send test webhook from Stripe Dashboard
   - [ ] Signature verification succeeds
   - [ ] Event handled correctly
   - [ ] Database updated as expected

---

## 📊 Database Migration Checklist

- [ ] Add `stripe_customers` table
- [ ] Add `subscriptions` table
- [ ] Add `payments` table
- [ ] Run `npm run db:push` to sync schema
- [ ] Verify tables created in Neon dashboard

---

## 🚀 Deployment Checklist

### Backend
- [ ] Create `server/stripe.ts` module
- [ ] Add Stripe endpoints to `server/routes.ts`
- [ ] Add webhook handler with signature verification
- [ ] Update `server/storage.ts` with Stripe methods
- [ ] Update `shared/schema.ts` with new tables

### Frontend
- [ ] Add Stripe Elements provider to `App.tsx`
- [ ] Create `UpgradeButton.tsx` component
- [ ] Create `PaymentForm.tsx` component
- [ ] Create `SubscriptionManager.tsx` component
- [ ] Add components to relevant pages (Garden, Hive, booking flow)

### Configuration
- [ ] Add Stripe keys to `.env`
- [ ] Create Stripe products/prices in dashboard
- [ ] Set up webhook endpoint in Stripe dashboard
- [ ] Test with Stripe test mode

### Testing
- [ ] Test subscription upgrade flow
- [ ] Test session booking payment
- [ ] Test subscription cancellation
- [ ] Test webhook handling
- [ ] Test error scenarios

---

## 📝 Implementation Timeline

### Day 1: Backend Setup (4-5 hours)
- Create `stripe.ts` module
- Add database tables
- Implement API endpoints
- Add storage layer methods

### Day 2: Webhook & Frontend (3-4 hours)
- Implement webhook handler
- Create React components
- Integrate into existing pages
- Connect frontend to backend

### Day 3: Testing & Polish (2-3 hours)
- Test all flows with test cards
- Handle edge cases
- Add error messages
- Polish UX

**Total Estimated Time**: 9-12 hours

---

## 🎯 Success Criteria

- [ ] Users can upgrade subscription tiers via Stripe Checkout
- [ ] Users can pay for session bookings
- [ ] Webhooks correctly update database
- [ ] Subscription status syncs with access levels
- [ ] Payment history visible to users
- [ ] All test scenarios pass
- [ ] No hardcoded secrets in code
- [ ] Error handling comprehensive
- [ ] User experience smooth and clear

---

## 🛡️ Security Considerations

1. **API Keys**: Never commit secret keys to git
2. **Webhook Verification**: Always verify webhook signatures
3. **Amount Validation**: Validate payment amounts server-side
4. **User Authorization**: Verify user owns subscription/payment before operations
5. **HTTPS Required**: Stripe requires HTTPS for webhooks (production)
6. **Rate Limiting**: Consider rate limiting payment endpoints
7. **Logging**: Log all payment events for debugging (not card details!)

---

## 📚 References

- [Stripe API Documentation](https://stripe.com/docs/api)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe React](https://stripe.com/docs/stripe-js/react)
- [Testing Stripe](https://stripe.com/docs/testing)

---

**Last Updated**: 2025-11-10
**Status**: Ready for implementation
**Assigned Agent**: Backend Architect
