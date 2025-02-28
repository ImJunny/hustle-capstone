import { onboardingRouter } from "../routers/onboarding-router";
import { userRouter } from "../routers/user-router";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  user: userRouter,
  onboarding: onboardingRouter,
});
export type AppRouter = typeof appRouter;
