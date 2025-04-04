import { createTRPCRouter, protectedProcedure } from "../lib/trpc";
import { z } from "zod";
import {
  recordPayment,
  createPaymentIntent,
} from "../actions/confirm-payment-actions";

export const paymentRouter = createTRPCRouter({
  createPaymentIntent: protectedProcedure
    .input(
      z.object({
        amount: z.number().int().positive(),
        currency: z.string().default("usd"),
        paymentMethodId: z.string(),
        customerId: z.string().optional(),
        jobPostUuid: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return createPaymentIntent(
        input.amount,
        input.currency,
        input.paymentMethodId,
        input.customerId,
        {
          userId: ctx.user.id,
          jobPostUuid: input.jobPostUuid,
        }
      );
    }),
  recordPayment: protectedProcedure
    .input(
      z.object({
        paymentIntentId: z.string(),
        amount: z.number().positive(),
        jobPostUuid: z.string(),
        paymentMethodId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return recordPayment({
        paymentIntentId: input.paymentIntentId,
        amount: input.amount,
        jobPostUuid: input.jobPostUuid,
        userId: ctx.user.id,
        paymentMethodId: input.paymentMethodId,
      });
    }),
});
