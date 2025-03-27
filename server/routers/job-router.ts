import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../lib/trpc";
import {
  acceptJob,
  getTrackJobPosts,
  getTransactionEstimate,
} from "../actions/jobs-actions";

export const jobRouter = createTRPCRouter({
  get_transaction_estimate: protectedProcedure
    .input(
      z.object({
        job_post_uuid: z.string(),
        user_uuid: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      return getTransactionEstimate(input.job_post_uuid, input.user_uuid);
    }),
  accept_job: protectedProcedure
    .input(
      z.object({
        user_uuid: z.string(),
        job_post_uuid: z.string(),
        linked_service_post_uuid: z.string().nullable(),
      })
    )
    .mutation(async ({ input }) => {
      return acceptJob(
        input.user_uuid,
        input.job_post_uuid,
        input.linked_service_post_uuid
      );
    }),
  get_track_job_posts: protectedProcedure
    .input(
      z.object({
        user_uuid: z.string(),
      })
    )
    .query(async ({ input }) => {
      return getTrackJobPosts(input.user_uuid);
    }),
});
