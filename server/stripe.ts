/**
 * Stripe Integration Module
 * Handles all Stripe payment operations for FloreSer
 *
 * IMPORTANT: This module uses TEST MODE keys only
 * Environment: STRIPE_SECRET_KEY must start with sk_test_
 */

import Stripe from 'stripe';
import type { Express } from 'express';

// Initialize Stripe with API version
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable is required');
}

if (!process.env.STRIPE_SECRET_KEY.startsWith('sk_test_')) {
  console.warn('⚠️  WARNING: Not using Stripe test mode! Use sk_test_ keys for development');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

// Stripe Price IDs for subscription tiers
export const STRIPE_PRICES = {
  basic: process.env.STRIPE_PRICE_BASIC || '',
  premium: process.env.STRIPE_PRICE_PREMIUM || '',
  unlimited: process.env.STRIPE_PRICE_UNLIMITED || '',
} as const;

/**
 * Get or create a Stripe customer for a user
 */
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  storage: any
): Promise<string> {
  // Check if customer already exists in our database
  const existingCustomer = await storage.getStripeCustomerByUserId(userId);

  if (existingCustomer?.stripeCustomerId) {
    return existingCustomer.stripeCustomerId;
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email,
    metadata: {
      userId,
    },
  });

  // Save to our database
  await storage.createStripeCustomer(userId, customer.id);

  return customer.id;
}

/**
 * Create a Checkout Session for subscription upgrades
 */
export async function createSubscriptionCheckout(params: {
  userId: string;
  email: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  storage: any;
}): Promise<Stripe.Checkout.Session> {
  const { userId, email, priceId, successUrl, cancelUrl, storage } = params;

  const customerId = await getOrCreateStripeCustomer(userId, email, storage);

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
    },
  });

  return session;
}

/**
 * Create a Payment Intent for one-time session bookings
 */
export async function createPaymentIntent(params: {
  userId: string;
  email: string;
  amount: number;
  currency: string;
  metadata: Record<string, string>;
  storage: any;
}): Promise<Stripe.PaymentIntent> {
  const { userId, email, amount, currency, metadata, storage } = params;

  const customerId = await getOrCreateStripeCustomer(userId, email, storage);

  const paymentIntent = await stripe.paymentIntents.create({
    customer: customerId,
    amount: Math.round(amount * 100), // Convert to cents
    currency: currency || 'usd',
    metadata: {
      userId,
      ...metadata,
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return paymentIntent;
}

/**
 * Cancel a subscription at period end
 */
export async function cancelSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });

  return subscription;
}

/**
 * Immediately cancel a subscription (for testing/admin use)
 */
export async function cancelSubscriptionImmediately(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  const subscription = await stripe.subscriptions.cancel(subscriptionId);

  return subscription;
}

/**
 * Get subscription by ID
 */
export async function getSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return await stripe.subscriptions.retrieve(subscriptionId);
}

/**
 * Construct webhook event from request (with signature verification)
 * CRITICAL: This must be used for all webhook endpoints
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('STRIPE_WEBHOOK_SECRET environment variable is required');
  }

  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );
}
