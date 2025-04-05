import { createTRPCRouter, protectedProcedure } from "../lib/trpc";
import { z } from "zod";
import {
  createPaymentMethod,
  deletePaymentMethod,
  getCustomerId,
  getUserPaymentMethods,
  processPayment,
} from "../actions/payment-actions";

export const paymentRouter = createTRPCRouter({
  process_payment: protectedProcedure
    .input(
      z.object({
        user_uuid: z.string(),
        amount: z.number().min(0),
      })
    )
    .query(async ({ input }) => {
      const result = await processPayment(input.user_uuid, input.amount);
      return result;
    }),
  create_customer: protectedProcedure
    .input(
      z.object({
        user_uuid: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await getCustomerId(input.user_uuid);
      return result;
    }),
  create_payment_method: protectedProcedure
    .input(
      z.object({
        user_uuid: z.string(),
        stripe_payment_method_id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await createPaymentMethod(
          input.user_uuid,
          input.stripe_payment_method_id
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
        method_id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await deletePaymentMethod(input.method_id);
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
});
