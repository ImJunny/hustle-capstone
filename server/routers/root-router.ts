import { createTRPCRouter } from "../lib/trpc";
import { userRouter } from "./user-router";

export const appRouter = createTRPCRouter({
  user: userRouter,
});

export type AppRouter = typeof appRouter;
