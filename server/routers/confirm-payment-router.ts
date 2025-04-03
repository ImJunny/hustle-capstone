import { createTRPCRouter, protectedProcedure } from "../lib/trpc";
import { z } from "zod";
import { recordPayment } from "../actions/confirm-payment-actions";

export const paymentRouter = createTRPCRouter({
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
