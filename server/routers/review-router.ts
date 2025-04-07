import { createTRPCRouter, protectedProcedure } from "../lib/trpc";
import { z } from "zod";
import {
  createReview,
  getUserReviews,
  getJobReviews,
  getServiceReviews,
} from "../actions/review-actions";

export const reviewRouter = createTRPCRouter({
  create_review: protectedProcedure
    .input(
      z.object({
        reviewer_uuid: z.string(),
        reviewee_uuid: z.string(),
        job_uuid: z.string(),
        review: z.string(),
        rating: z.number().min(1).max(5),
        reviewer_type: z.enum(["employer", "employee"]),
      })
    )
    .mutation(async ({ input }) => {
      await createReview(
        input.reviewer_uuid,
        input.reviewee_uuid,
        input.job_uuid,
        input.review,
        input.rating,
        input.reviewer_type
      );
    }),

  get_user_reviews: protectedProcedure
    .input(
      z.object({
        reviewee_uuid: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await getUserReviews(input.reviewee_uuid);
    }),

  get_job_reviews: protectedProcedure
    .input(
      z.object({
        job_uuid: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await getJobReviews(input.job_uuid);
    }),

  get_service_reviews: protectedProcedure
    .input(
      z.object({
        service_post_uuid: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await getServiceReviews(input.service_post_uuid);
    }),
});
