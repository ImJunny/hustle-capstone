import { db } from "@/drizzle/db";
import { payments, users } from "@/drizzle/schema";
import { and, desc, eq, ne, or } from "drizzle-orm";
import { stripe } from "../lib/stripe-server";

// Process payment; gets info to be passed in StripeProvider
export async function getPaymentIntent(user_uuid: string, amount: number) {
  try {
    const customerId = await getCustomerId(user_uuid);

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customerId },
      { apiVersion: "2025-02-24.acacia" }
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.floor(amount * 100),
      currency: "usd",
      customer: customerId,
      automatic_payment_methods: {
        enabled: true,
      },

      // capture_method: "manual",
    });

    return {
      paymentIntentId: paymentIntent.id,
      paymentIntentSecret: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customerId,
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
  stripe_payment_method_id: string
) {
  try {
    const customerId = await getCustomerId(user_uuid);
    await stripe.paymentMethods.attach(stripe_payment_method_id, {
      customer: customerId,
    });
  } catch (error) {
    console.error("Error creating payment method:", error);
    throw new Error("Failed to create payment method.");
  }
}

export async function deletePaymentMethod(id: string) {
  try {
    await stripe.paymentMethods.detach(id);
  } catch (error) {
    console.error("Error deleting payment method:", error);
    throw new Error("Failed to delete payment method.");
  }
}

export async function getUserPaymentMethods(user_uuid: string) {
  try {
    const customerId = await getCustomerId(user_uuid);
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
    });

    return paymentMethods.data.map((method) => ({
      id: method.id,
      name: method.billing_details.name,
      brand: method!.card!.brand,
      last4: method!.card!.last4,
      exp_month: method!.card!.exp_month,
      exp_year: method!.card!.exp_year,
    }));
  } catch (error) {
    console.error("Error fetching user payment methods:", error);
    throw new Error("Failed to fetch user payment methods.");
  }
}
export type PaymentMethod = Awaited<
  ReturnType<typeof getUserPaymentMethods>
>[number];

// get TRANSACTION BALANCE AND HISTORY
export async function getTransactionsData(user_uuid: string) {
  try {
    const transactions = await db
      .select({
        amount: payments.amount,
        created_at: payments.created_at,
        status: payments.status,
        title: payments.title,
        type: payments.type,
      })
      .from(payments)
      .where(
        and(
          or(eq(payments.user_uuid, user_uuid)),
          ne(payments.status, "refunded")
        )
      )
      .orderBy(desc(payments.created_at))
      .then((result) =>
        result.map((transaction) => ({
          ...transaction,
          created_at: transaction.created_at.toISOString(),
        }))
      );

    let balance = 0;
    transactions.forEach((transaction) => {
      if (transaction.status === "succeeded" && transaction.type === "income") {
        balance += Number(transaction.amount);
      }
    });

    return {
      balance,
      transactions,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Error getting transaction data");
  }
}
export type TransactionType = Awaited<
  ReturnType<typeof getTransactionsData>
>["transactions"][number];
