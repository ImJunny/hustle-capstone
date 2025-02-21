import { CreateUserSchema, UserSchema } from "@/zod/user-schemas";
import { createUser, getUserData } from "../actions/user-actions";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../lib/trpc";

export const userRouter = createTRPCRouter({
  // Create user if they do not exist
  createUser: publicProcedure
    .input(CreateUserSchema)
    .mutation(async ({ input }) => {
      await createUser(
        input.uuid,
        input.email,
        input.username,
        input.first_name,
        input.last_name
      );
    }),
  // Get user data
  getUserData: protectedProcedure.input(UserSchema).query(async ({ input }) => {
    let result = await getUserData(input.uuid);
    return result;
  }),
});
