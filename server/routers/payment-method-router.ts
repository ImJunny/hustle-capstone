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
        stripe_payment_method_id: z.string(),
        stripe_customer_id: z.string(),
        card_last4: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await createPaymentMethod(
        input.user_uuid,
        input.stripe_payment_method_id,
        input.stripe_customer_id,
        input.card_last4
      );
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
      const result = await getUserPaymentMethods(input.user_uuid);
      return result;
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
