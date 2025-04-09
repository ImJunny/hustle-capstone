import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../lib/trpc";
import {
  createReview,
  getReview,
  getReviews,
  getServiceReviews,
  isAlreadyReviewed,
} from "../actions/review-actions";

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
  get_review: protectedProcedure
    .input(
      z.object({
        user_uuid: z.string(),
        initiated_uuid: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await getReview(input.user_uuid, input.initiated_uuid);
    }),
  get_reviews: protectedProcedure
    .input(
      z.object({
        user_uuid: z.string(),
        reviewer_type: z.enum(["worker", "employer"]),
      })
    )
    .query(async ({ input }) => {
      return await getReviews(input.user_uuid, input.reviewer_type);
    }),
  get_services_reviews: protectedProcedure
    .input(
      z.object({
        post_uuid: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await getServiceReviews(input.post_uuid);
    }),
});
