import { createTRPCRouter, protectedProcedure } from "../lib/trpc";
import { z } from "zod";
import {
  applyForJob,
  doesJobApplicationExist,
  getUserJobApplications,
} from "../actions/jobs-actions";

export const jobRouter = createTRPCRouter({
  apply_for_job: protectedProcedure
    .input(
      z.object({
        user_uuid: z.string(),
        job_uuid: z.string(),
        created_at: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const applicationExists = await doesJobApplicationExist(
        input.user_uuid,
        input.job_uuid
      );

      if (applicationExists) {
        throw new Error("You have already applied for this job.");
      }

      return await applyForJob(
        input.user_uuid,
        input.job_uuid,
        input.created_at || new Date().toISOString()
      );
    }),

  is_accepted: protectedProcedure
    .input(
      z.object({
        job_uuid: z.string(),
        user_uuid: z.string(),
      })
    )
    .query(async ({ input }) => {
      const exists = await doesJobApplicationExist(
        input.user_uuid,
        input.job_uuid
      );
      return exists;
    }),

  get_user_job_applications: protectedProcedure
    .input(
      z.object({
        user_uuid: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await getUserJobApplications(input.user_uuid);
    }),
});
