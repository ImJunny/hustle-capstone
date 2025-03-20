import { createTRPCRouter, protectedProcedure } from "../lib/trpc";
import { z } from "zod";
import {
  applyForJob,
  doesJobApplicationExist,
  getJobApplicationDetails,
  getUserJobApplications,
} from "../actions/jobs-actions";

export const jobRouter = createTRPCRouter({
  apply_for_job: protectedProcedure
    .input(
      z.object({
        user_uuid: z.string(),
        job_uuid: z.string(),
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

      return await applyForJob(input.user_uuid, input.job_uuid);
    }),

  get_job_application_details: protectedProcedure
    .input(
      z.object({
        user_uuid: z.string(),
        job_uuid: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await getJobApplicationDetails(input.user_uuid, input.job_uuid);
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
