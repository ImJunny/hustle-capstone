import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../lib/trpc";
import {
  acceptJob,
  getJobTrackingDetails,
  getTrackJobPosts,
  getTransactionEstimate,
  unacceptJob,
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
      return await getTransactionEstimate(input.job_post_uuid, input.user_uuid);
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
      return await acceptJob(
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
      return await getTrackJobPosts(input.user_uuid);
    }),
  get_job_tracking_details: protectedProcedure
    .input(
      z.object({
        user_uuid: z.string(),
        job_post_uuid: z.string(),
      })
    )
    .query(async ({ input }) => {
      const result = await getJobTrackingDetails(
        input.user_uuid,
        input.job_post_uuid
      );
      return result;
    }),
  unaccept_job: protectedProcedure
    .input(
      z.object({
        initiated_job_post_uuid: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await unacceptJob(input.initiated_job_post_uuid);
    }),
});
