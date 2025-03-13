import { createTRPCRouter, protectedProcedure } from "../lib/trpc";
import { z } from "zod";
import {
  createPost,
  getPostDetailsInfo,
  getPostsByKeyword,
  getUserPosts,
  updatePost,
} from "../actions/post-actions";

export const postRouter = createTRPCRouter({
  create_post: protectedProcedure
    .input(
      z.object({
        uuid: z.string(),
        type: z.enum(["work", "hire"]),
        title: z.string(),
        description: z.string(),
        min_rate: z.number(),
        max_rate: z.number().optional(),
        location_type: z.enum(["local", "remote"]),
        location_address: z.string().optional(),
        due_date: z.coerce.date().nullable(),
        image_buffers: z.array(z.any()),
      })
    )
    .mutation(async ({ input }) => {
      await createPost(
        input.uuid,
        input.type,
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
  update_post: protectedProcedure
    .input(
      z.object({
        uuid: z.string(),
        title: z.string(),
        description: z.string(),
        min_rate: z.number(),
        max_rate: z.number().optional(),
        location_type: z.enum(["local", "remote"]),
        location_address: z.string().optional(),
        due_date: z.coerce.date().nullable(),
        image_buffers: z.array(z.any()).nullable(),
      })
    )
    .mutation(async ({ input }) => {
      await updatePost(
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
  get_user_posts: protectedProcedure
    .input(
      z.object({
        uuid: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await getUserPosts(input.uuid);
    }),
  get_post_details_info: protectedProcedure
    .input(
      z.object({
        uuid: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await getPostDetailsInfo(input.uuid);
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
