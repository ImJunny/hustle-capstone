import { createTRPCRouter, protectedProcedure } from "../lib/trpc";
import { z } from "zod";
import {
  createPost,
  deletePost,
  getActivePostCounts,
  getHomePosts,
  getPostDetailsInfo,
  getPostInfo,
  getPostsByFilters,
  getUserPosts,
  updatePost,
  savePost,
  unsavePost,
  getSavedPosts,
  getPostDetailsFooterInfo,
} from "../actions/post-actions";
import Input from "@/components/ui/Input";

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
        address_uuid: z.string().nullable(),
        due_date: z.coerce.date().nullable(),
        image_buffers: z.array(z.any()),
        tags: z.array(z.string()),
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
        input.address_uuid,
        input.due_date,
        input.image_buffers,
        input.tags
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
        address_uuid: z.string().nullable(),
        due_date: z.coerce.date().nullable(),
        image_buffers: z.array(z.any()).nullable(),
        tags: z.array(z.string()),
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
        input.address_uuid,
        input.due_date,
        input.image_buffers,
        input.tags
      );
    }),
  get_user_posts: protectedProcedure
    .input(
      z.object({
        uuid: z.string(),
        type: z.enum(["work", "hire"]).optional(),
      })
    )
    .query(async ({ input }) => {
      return await getUserPosts(input.uuid, input.type);
    }),
  get_post_details_info: protectedProcedure
    .input(
      z.object({
        uuid: z.string(),
        geocode: z.tuple([z.number(), z.number()]).optional(),
      })
    )
    .query(async ({ input }) => {
      return await getPostDetailsInfo(input.uuid, input.geocode);
    }),
  get_post_info: protectedProcedure
    .input(
      z.object({
        uuid: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await getPostInfo(input.uuid);
    }),
  get_posts_by_filters: protectedProcedure
    .input(
      z.object({
        keyword: z.string(),
        min_rate: z.number().optional(),
        max_rate: z.number().optional(),
        min_distance: z.number(),
        max_distance: z.number(),
        location_type: z
          .enum(["remote", "local", "all"])
          .optional()
          .default("all"),
        type: z.enum(["work", "hire", "all"]).optional().default("all"),
        sort: z
          .enum(["asc-rate", "desc-rate", "asc-dist", "desc-dist"])
          .optional(),
        geocode: z.tuple([z.number(), z.number()]).optional(),
        tags: z.array(z.string()),
      })
    )
    .query(async ({ input }) => {
      return await getPostsByFilters(
        input.keyword,
        input.min_rate,
        input.max_rate,
        input.min_distance,
        input.max_distance,
        input.location_type,
        input.type,
        input.sort,
        input.geocode,
        input.tags
      );
    }),
  delete_post: protectedProcedure
    .input(
      z.object({
        uuid: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await deletePost(input.uuid);
    }),
  get_home_posts: protectedProcedure
    .input(
      z.object({
        type: z.enum(["work", "hire"]),
      })
    )
    .query(async ({ input }) => {
      return await getHomePosts(input.type);
    }),
  get_active_post_counts: protectedProcedure
    .input(
      z.object({
        user_uuid: z.string(),
      })
    )
    .query(async ({ input }) => {
      return getActivePostCounts(input.user_uuid);
    }),
  get_post_details_footer_info: protectedProcedure
    .input(
      z.object({
        user_uuid: z.string(),
        job_post_uuid: z.string(),
      })
    )
    .query(async ({ input }) => {
      return getPostDetailsFooterInfo(input.user_uuid, input.job_post_uuid);
    }),

  save_post: protectedProcedure
    .input(
      z.object({
        post_uuid: z.string().uuid("Invalid post UUID"),
        user_uuid: z.string().uuid("Invalid user UUID"),
      })
    )
    .mutation(async ({ input }) => {
      await savePost(input.post_uuid, input.user_uuid);
    }),

  unsave_post: protectedProcedure
    .input(
      z.object({
        post_uuid: z.string().uuid("Invalid post UUID"),
        user_uuid: z.string().uuid("Invalid user UUID"),
      })
    )
    .mutation(async ({ input }) => {
      await unsavePost(input.post_uuid, input.user_uuid);
    }),

  get_saved_posts: protectedProcedure
    .input(
      z.object({
        user_uuid: z.string().uuid("Invalid user UUID"),
        type: z.enum(["work", "hire"]),
      })
    )
    .query(async ({ input }) => {
      return await getSavedPosts(input.user_uuid, input.type);
    }),
});
