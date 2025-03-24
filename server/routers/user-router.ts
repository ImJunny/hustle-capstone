import { createTRPCRouter, protectedProcedure } from "../lib/trpc";
import {
  createUser,
  getPersonalInfo,
  getUserData,
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
    .input(z.object({ uuid: z.string() }))
    .query(async ({ input }) => {
      const result = await getUserData(input.uuid);
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
});
