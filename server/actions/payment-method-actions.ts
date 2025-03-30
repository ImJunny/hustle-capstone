import { db } from "@/drizzle/db";
import { payment_methods } from "@/drizzle/schema";
import axios from "axios";
import { eq, and, ne, ilike, sql } from "drizzle-orm";
import { string } from "zod";
import { v4 as uuidv4 } from "uuid";

// export async function createPaymentMethod(
//   uuid: string,
//   user_uuid: string,
//   stripe_payment_method_id: string,
//   stripe_customer_id: string,
//   card_last4: string,
//   is_default: boolean,
// ) {
//   try {
//     await db.insert(payment_methods).values({
//       uuid: uuidv4(),
//       user_uuid,
//       stripe_payment_method_id,
//       stripe_customer_id,
//       card_last4,
//       is_default,
//     });
//   } catch (error) {
//     console.error("Error creating payment method:", error);
//     throw new Error("Failed to create payment method.");
//   }
// }

export async function createPaymentMethod(
  user_uuid: string,
  payment_method_id: string, // From client-side Stripe
  customer_id: string, // From client-side Stripe
  card_last4: string // From client-side Stripe
) {
  try {
    // Just insert into Supabase - Stripe operations happen client-side
    await db.insert(payment_methods).values({
      uuid: uuidv4(),
      user_uuid,
      stripe_payment_method_id: payment_method_id,
      stripe_customer_id: customer_id,
      card_last4,
      is_default: false, // Start as non-default, can be updated later
    });

    // Optional: Set as default if needed
    // await setDefaultPaymentMethod(user_uuid, payment_method_id);
  } catch (error) {
    console.error("Error saving payment method:", error);
    throw error;
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
