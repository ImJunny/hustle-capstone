import { uuid } from "drizzle-orm/pg-core";
import {
  getReportedPosts,
  isReportedPost,
  reportPost,
  undoReportPost,
} from "../actions/report-actions";
import { createTRPCRouter, protectedProcedure } from "../lib/trpc";
import { z } from "zod";

export const reportRouter = createTRPCRouter({
  report_post: protectedProcedure
    .input(
      z.object({
        uuid: z.string(),
        user_uuid: z.string(),
        reason: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await reportPost(input.uuid, input.user_uuid, input.reason);
    }),
  is_reported_post: protectedProcedure
    .input(
      z.object({
        uuid: z.string(),
        user_uuid: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await isReportedPost(input.uuid, input.user_uuid);
    }),
  undo_report_post: protectedProcedure
    .input(
      z.object({
        uuid: z.string(),
        user_uuid: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await undoReportPost(input.uuid, input.user_uuid);
    }),
  get_reported_posts: protectedProcedure
    .input(
      z.object({
        user_uuid: z.string(),
        geocode: z.tuple([z.number(), z.number()]).optional(),
      })
    )
    .query(async ({ input }) => {
      return await getReportedPosts(input.user_uuid, input.geocode);
    }),
});
