import { createTRPCRouter, protectedProcedure } from "../lib/trpc";
import { z } from "zod";
import {
  createPaymentMethod,
  deletePaymentMethod,
  getUserPaymentMethods,
  getPaymentMethodInfo,
  updatePaymentMethod,
} from "../actions/payment-method-actions";

export const paymentMethodsRouter = createTRPCRouter({
  create_payment_method: protectedProcedure
    .input(
      z.object({
        user_uuid: z.string(),
        stripe_payment_method_id: z
          .string()
          .min(1, "Stripe Payment Method ID is required"),
        stripe_customer_id: z.string().min(1, "Stripe Customer ID is required"),
        card_last4: z
          .string()
          .length(4, "Card number must be 4 digits")
          .regex(/^\d{4}$/, "Card number must be only digits"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await createPaymentMethod(
          input.user_uuid,
          input.stripe_payment_method_id,
          input.stripe_customer_id,
          input.card_last4
        );
        return { success: true };
      } catch (error) {
        console.error("Payment method creation failed:", error);
        throw new Error(
          error instanceof Error ? error.message : "Payment processing failed"
        );
      }
    }),

  delete_payment_method: protectedProcedure
    .input(
      z.object({
        uuid: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await deletePaymentMethod(input.uuid);
    }),

  get_user_payment_methods: protectedProcedure
    .input(
      z.object({
        user_uuid: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await getUserPaymentMethods(input.user_uuid);
    }),

  get_payment_method_info: protectedProcedure
    .input(
      z.object({
        uuid: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await getPaymentMethodInfo(input.uuid);
    }),

  update_payment_method: protectedProcedure
    .input(
      z.object({
        uuid: z.string(),
        is_default: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await updatePaymentMethod(input.uuid, input.is_default);
    }),
});
