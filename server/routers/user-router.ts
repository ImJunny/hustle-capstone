import { createTRPCRouter, protectedProcedure } from "../lib/trpc";
import {
  createUser,
  followUser,
  getFollowing,
  getPersonalInfo,
  getShareUsers,
  getUserData,
  unfollowUser,
  updateUserProfile,
} from "../actions/user-actions";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  create_user: protectedProcedure
    .input(
      z.object({
        uuid: z.string(),
        email: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await createUser(input.uuid, input.email);
      return result;
    }),

  get_user_data: protectedProcedure
    .input(z.object({ uuid: z.string(), their_uuid: z.string().optional() }))
    .query(async ({ input }) => {
      const result = await getUserData(input.uuid, input.their_uuid);
      return result;
    }),

  update_user_profile: protectedProcedure
    .input(
      z.object({
        uuid: z.string(),
        username: z.string(),
        display_name: z.string(),
        bio: z.string(),
        image_buffer: z.any(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await updateUserProfile(
        input.uuid,
        input.username,
        input.display_name,
        input.bio,
        input.image_buffer
      );
      return result;
    }),
  get_personal_info: protectedProcedure
    .input(z.object({ uuid: z.string() }))
    .query(async ({ input }) => {
      const result = await getPersonalInfo(input.uuid);
      return result;
    }),
  follow_user: protectedProcedure
    .input(z.object({ follower_uuid: z.string(), following_uuid: z.string() }))
    .mutation(async ({ input }) => {
      await followUser(input.follower_uuid, input.following_uuid);
    }),
  unfollow_user: protectedProcedure
    .input(z.object({ follower_uuid: z.string(), following_uuid: z.string() }))
    .mutation(async ({ input }) => {
      await unfollowUser(input.follower_uuid, input.following_uuid);
    }),
  get_following: protectedProcedure
    .input(z.object({ user_uuid: z.string() }))
    .query(async ({ input }) => {
      const result = await getFollowing(input.user_uuid);
      return result;
    }),
  get_share_users: protectedProcedure
    .input(z.object({ user_uuid: z.string() }))
    .query(async ({ input }) => {
      const result = await getShareUsers(input.user_uuid);
      return result;
    }),
});
