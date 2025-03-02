import { createTRPCRouter, protectedProcedure } from "../lib/trpc";
import { z } from "zod";
import {
  createJobPost,
  createServicePost,
  getPostDetailsInfo,
  getPostInfo,
  getPostsByKeyword,
  getUserPostUUIDs,
} from "../actions/post-actions";

export const postRouter = createTRPCRouter({
  create_job_post: protectedProcedure
    .input(
      z.object({
        uuid: z.string(),
        title: z.string(),
        description: z.string(),
        min_rate: z.number(),
        max_rate: z.number().optional(),
        location_type: z.enum(["local", "remote"]),
        location_address: z.string().optional(),
        due_date: z.coerce.date(),
        image_buffers: z.array(z.any()),
      })
    )
    .mutation(async ({ input }) => {
      await createJobPost(
        input.uuid,
        input.title,
        input.description,
        input.min_rate,
        input.max_rate,
        input.location_type,
        input.location_address,
        input.due_date,
        input.image_buffers
      );
    }),
  create_service_post: protectedProcedure
    .input(
      z.object({
        uuid: z.string(),
        title: z.string(),
        description: z.string(),
        min_rate: z.number(),
        max_rate: z.number().optional(),
        location_type: z.enum(["local", "remote"]),
        location_address: z.string().optional(),
        image_buffers: z.array(z.any()),
      })
    )
    .mutation(async ({ input }) => {
      await createServicePost(
        input.uuid,
        input.title,
        input.description,
        input.min_rate,
        input.max_rate,
        input.location_type,
        input.location_address,
        input.image_buffers
      );
    }),
  get_user_post_uuids: protectedProcedure
    .input(
      z.object({
        uuid: z.string(),
        type: z.enum(["work", "hire"]),
      })
    )
    .query(async ({ input }) => {
      return await getUserPostUUIDs(input.uuid, input.type);
    }),
  get_post_info: protectedProcedure
    .input(
      z.object({
        uuid: z.string(),
        type: z.enum(["work", "hire"]),
      })
    )
    .query(async ({ input }) => {
      return await getPostInfo(input.uuid, input.type);
    }),
  get_post_details_info: protectedProcedure
    .input(
      z.object({
        uuid: z.string(),
        type: z.enum(["work", "hire"]),
      })
    )
    .query(async ({ input }) => {
      return await getPostDetailsInfo(input.uuid, input.type);
    }),
  get_posts_by_keyword: protectedProcedure
    .input(
      z.object({
        keyword: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await getPostsByKeyword(input.keyword);
    }),
});
