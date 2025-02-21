import { db } from "@/drizzle/db";
import { createTRPCRouter, publicProcedure } from "../lib/trpc";
import { users } from "@/drizzle/schema";
import {
  createUser,
  getUserData,
  updateUserProfile,
} from "../actions/user-actions";
import { z } from "zod";
import { UpdateUserProfileSchema } from "@/zod/user-schemas";

export const userRouter = createTRPCRouter({
  create_user: publicProcedure
    .input(
      z.object({
        uuid: z.string(),
        email: z.string(),
        first_name: z.string(),
        last_name: z.string(),
        username: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await createUser(
        input.uuid,
        input.email,
        input.username,
        input.first_name,
        input.last_name
      );
      return result;
    }),

  get_user_data: publicProcedure
    .input(z.object({ uuid: z.string() }))
    .query(async ({ input }) => {
      const result = await getUserData(input.uuid);
      return result;
    }),

  update_user_profile: publicProcedure
    .input(
      z.object({
        uuid: z.string(),
        username: z.string(),
        first_name: z.string(),
        last_name: z.string(),
        bio: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      console.log("updating");
      const result = await updateUserProfile(
        input.uuid,
        input.username,
        input.first_name,
        input.last_name,
        input.bio
      );
      return result;
    }),
});
