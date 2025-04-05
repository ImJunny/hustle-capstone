import { db } from "@/drizzle/db";
import { payment_methods, users } from "@/drizzle/schema";
import { stripe } from "@/stripe-server";
import { and, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// Process payment; gets info to be passed in StripeProvider
export async function processPayment(amount: number) {
  try {
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2025-02-24.acacia" }
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.floor(amount * 100),
      currency: "usd",
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
      payment_method_types: ["card"],
      // capture_method: "manual",
    });

    return {
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    };
  } catch (error) {
    console.error("Error processing payment:", error);
    throw new Error("Failed to process payment.");
  }
}
// Gets customer ID; creates one if it doesn't exist
export async function getCustomerId(user_uuid: string) {
  try {
    const customerId = await db
      .select({ customer_id: users.stripe_customer_id })
      .from(users)
      .where(eq(users.uuid, user_uuid))
      .then(([result]) => result?.customer_id);

    if (customerId) return customerId;

    const userData = await db
      .select({
        email: users.email,
      })
      .from(users)
      .where(eq(users.uuid, user_uuid))
      .then(([result]) => result);

    const customer = await stripe.customers.create({
      metadata: {
        user_uuid: user_uuid,
        created_at: new Date().toISOString(),
      },
      email: userData?.email,
    });

    await db
      .update(users)
      .set({ stripe_customer_id: customer.id })
      .where(eq(users.uuid, user_uuid));
    return customer.id;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw new Error("Failed to create customer.");
  }
}

// Creates payment method; attaches it to customer in Stripe
export async function createPaymentMethod(
  user_uuid: string,
  cardholder_name: string,
  stripe_payment_method_id: string,
  card_last4: string,
  card_brand: string
) {
  try {
    await db.insert(payment_methods).values({
      uuid: uuidv4(),
      user_uuid,
      cardholder_name,
      stripe_payment_method_id,
      card_last4,
      visible: true,
      card_brand,
    });

    const customerId = await getCustomerId(user_uuid);
    await stripe.paymentMethods.attach(stripe_payment_method_id, {
      customer: customerId,
    });
  } catch (error) {
    console.error("Error creating payment method:", error);
    throw new Error("Failed to create payment method.");
  }
}

export async function deletePaymentMethod(uuid: string) {
  try {
    await db
      .update(payment_methods)
      .set({ visible: false }) // Soft delete: set visible flag to false
      .where(eq(payment_methods.uuid, uuid));
  } catch (error) {
    console.error("Error deleting payment method:", error);
    throw new Error("Failed to delete payment method.");
  }
}

export async function getUserPaymentMethods(user_uuid: string) {
  try {
    const result = await db
      .select()
      .from(payment_methods)
      .where(
        and(
          eq(payment_methods.user_uuid, user_uuid),
          eq(payment_methods.visible, true)
        )
      );
    return result;
  } catch (error) {
    console.error("Error fetching user payment methods:", error);
    throw new Error("Failed to fetch user payment methods.");
  }
}

export type PaymentMethod = Awaited<
  ReturnType<typeof getUserPaymentMethods>
>[number];

export async function getPaymentMethodInfo(uuid: string) {
  try {
    const result = await db
      .select()
      .from(payment_methods)
      .where(eq(payment_methods.uuid, uuid))
      .limit(1);
    if (result.length > 0) return result[0];
    return null;
  } catch (error) {
    console.error("Error fetching payment method info:", error);
    throw new Error("Failed to fetch payment method info.");
  }
}

export async function updatePaymentMethod(uuid: string, is_default?: boolean) {
  try {
    if (is_default !== undefined) {
      await db
        .update(payment_methods)
        .set({ is_default })
        .where(eq(payment_methods.uuid, uuid));
    }
  } catch (error) {
    console.error("Error updating payment method:", error);
    throw new Error("Failed to update payment method.");
  }
}
