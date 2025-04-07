import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../lib/trpc";
import { createReview, isAlreadyReviewed } from "../actions/review-actions";

export const reviewRouter = createTRPCRouter({
  create_review: protectedProcedure
    .input(
      z.object({
        user_uuid: z.string(),
        initiated_uuid: z.string(),
        rating: z.number(),
        review: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await createReview(
        input.user_uuid,
        input.initiated_uuid,
        input.rating,
        input.review
      );
    }),

  is_already_reviewed: protectedProcedure
    .input(
      z.object({
        user_uuid: z.string(),
        initiated_uuid: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await isAlreadyReviewed(input.user_uuid, input.initiated_uuid);
    }),
});
