import Stripe from "stripe";
import { db } from "./db";
import { users, sessions_table } from "@shared/schema";
import { eq } from "drizzle-orm";

// Platform commission rate (15%)
export const PLATFORM_COMMISSION = 0.15;

// Initialize Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  console.warn("STRIPE_SECRET_KEY not set - Stripe features will be disabled");
}

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: "2025-02-24.acacia" })
  : null;

export class StripeService {
  /**
   * Get or create a Stripe customer for a user
   */
  async getOrCreateCustomer(userId: string): Promise<string | null> {
    if (!stripe) return null;

    // Get user
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) {
      throw new Error("User not found");
    }

    // Return existing customer ID if present
    if (user.stripeCustomerId) {
      return user.stripeCustomerId;
    }

    // Create new Stripe customer
    const customer = await stripe.customers.create({
      email: user.email,
      name: [user.firstName, user.lastName].filter(Boolean).join(" ") || undefined,
      metadata: {
        userId: user.id,
      },
    });

    // Save customer ID to user
    await db
      .update(users)
      .set({ stripeCustomerId: customer.id })
      .where(eq(users.id, userId));

    return customer.id;
  }

  /**
   * Create a PaymentIntent for a session booking
   */
  async createPaymentIntent(
    amount: number,
    currency: string = "usd",
    customerId?: string | null,
    metadata?: Record<string, string>
  ): Promise<Stripe.PaymentIntent | null> {
    if (!stripe) return null;

    // Convert to cents
    const amountInCents = Math.round(amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency,
      customer: customerId || undefined,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        ...metadata,
        platform: "floreser",
      },
    });

    return paymentIntent;
  }

  /**
   * Retrieve a PaymentIntent by ID
   */
  async getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent | null> {
    if (!stripe) return null;
    return stripe.paymentIntents.retrieve(paymentIntentId);
  }

  /**
   * Update session with payment status after webhook
   */
  async updateSessionPayment(
    paymentIntentId: string,
    status: "pending" | "processing" | "succeeded" | "failed" | "refunded" | "cancelled"
  ): Promise<void> {
    const updateData: any = { paymentStatus: status };

    if (status === "succeeded") {
      updateData.paidAt = new Date();
    }

    await db
      .update(sessions_table)
      .set(updateData)
      .where(eq(sessions_table.stripePaymentIntentId, paymentIntentId));
  }

  /**
   * Calculate payout amount (session amount minus platform commission)
   */
  calculatePayoutAmount(sessionAmount: number): number {
    return sessionAmount * (1 - PLATFORM_COMMISSION);
  }

  /**
   * Handle Stripe webhook events
   */
  async handleWebhook(
    payload: Buffer | string,
    signature: string
  ): Promise<{ received: boolean; event?: Stripe.Event }> {
    if (!stripe) {
      return { received: false };
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET not set");
      return { received: false };
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret
      );
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }

    // Handle specific events
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await this.updateSessionPayment(paymentIntent.id, "succeeded");
        console.log(`Payment succeeded: ${paymentIntent.id}`);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await this.updateSessionPayment(paymentIntent.id, "failed");
        console.log(`Payment failed: ${paymentIntent.id}`);
        break;
      }

      case "payment_intent.processing": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await this.updateSessionPayment(paymentIntent.id, "processing");
        break;
      }

      case "payment_intent.canceled": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await this.updateSessionPayment(paymentIntent.id, "cancelled");
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        if (charge.payment_intent) {
          await this.updateSessionPayment(
            charge.payment_intent as string,
            "refunded"
          );
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true, event };
  }
}

export const stripeService = new StripeService();
