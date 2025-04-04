import { db } from "@/drizzle/db";
import { initiated_jobs, payments } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

const stripe = new Stripe(process.env.EXPO_PUBLIC_STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

type RecordPaymentParams = {
  paymentIntentId: string;
  amount: number;
  jobPostUuid: string;
  userId: string;
  paymentMethodId: string;
};

export async function createPaymentIntent(
  amount: number,
  currency: string,
  paymentMethodId: string,
  customerId?: string,
  metadata?: Record<string, string>
) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      customer: customerId,
      payment_method: paymentMethodId,
      confirm: false,
      metadata,
    });
    return { clientSecret: paymentIntent.client_secret };
  } catch (error) {
    console.error("Stripe error:", error);
    throw new Error("Payment Intent creation failed");
  }
}

export async function recordPayment({
  paymentIntentId,
  amount,
  jobPostUuid,
  userId,
  paymentMethodId,
}: RecordPaymentParams) {
  try {
    // Record payment in database
    await db.insert(payments).values({
      user_uuid: userId,
      job_uuid: jobPostUuid,
      amount,
      stripe_payment_intent_id: paymentIntentId,
      status: "succeeded",
      payment_method_uuid: paymentMethodId,
    });

    // Update job status
    await db
      .update(initiated_jobs)
      .set({
        progress_type: "approved",
      })
      .where(eq(initiated_jobs.uuid, jobPostUuid));

    return { success: true };
  } catch (error) {
    console.error("Payment recording error:", error);
    throw new Error("Failed to record payment");
  }
}
