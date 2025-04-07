import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../lib/trpc";
import {
  acceptJob,
  approveJob,
  cancelJob,
  finalizeJob,
  getAcceptedUsers,
  getTrackHiringDetails,
  getTrackHiringPosts,
  getTrackWorkingDetails,
  getTrackWorkingPosts,
  getTransactionEstimate,
  unacceptJob,
  updateJobProgress,
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
  get_track_working_posts: protectedProcedure
    .input(
      z.object({
        user_uuid: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await getTrackWorkingPosts(input.user_uuid);
    }),
  get_track_hiring_posts: protectedProcedure
    .input(
      z.object({
        user_uuid: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await getTrackHiringPosts(input.user_uuid);
    }),
  get_track_working_details: protectedProcedure
    .input(
      z.object({
        user_uuid: z.string(),
        job_post_uuid: z.string(),
      })
    )
    .query(async ({ input }) => {
      const result = await getTrackWorkingDetails(
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
  get_track_hiring_details: protectedProcedure
    .input(
      z.object({
        user_uuid: z.string(),
        job_post_uuid: z.string(),
      })
    )
    .query(async ({ input }) => {
      const result = await getTrackHiringDetails(
        input.user_uuid,
        input.job_post_uuid
      );
      return result;
    }),
  get_accepted_users: protectedProcedure
    .input(
      z.object({
        job_post_uuid: z.string(),
      })
    )
    .query(async ({ input }) => {
      const result = await getAcceptedUsers(input.job_post_uuid);
      return result;
    }),
  update_job_progress: protectedProcedure
    .input(
      z.object({
        uuid: z.string(),
        progress: z.enum([
          "accepted",
          "approved",
          "in progress",
          "complete",
          "paid",
        ]),
      })
    )
    .mutation(async ({ input }) => {
      await updateJobProgress(input.uuid, input.progress);
    }),

  cancel_job: protectedProcedure
    .input(
      z.object({
        job_uuid: z.string(),
        user_uuid: z.string(),
        cancellation_reason: z.string(),
        details: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await cancelJob(
        input.job_uuid,
        input.user_uuid,
        input.cancellation_reason,
        input.details
      );
    }),
  approve_job: protectedProcedure
    .input(
      z.object({
        initiated_uuid: z.string(),
        progress: z.enum([
          "accepted",
          "approved",
          "in progress",
          "complete",
          "paid",
        ]),
        user_uuid: z.string(),
        payment_intent_id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await approveJob(
        input.initiated_uuid,
        input.progress,
        input.user_uuid,
        input.payment_intent_id
      );
    }),
  finalize_job: protectedProcedure
    .input(
      z.object({
        initiated_uuid: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await finalizeJob(input.initiated_uuid);
    }),
});
