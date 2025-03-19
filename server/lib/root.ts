import { addressRouter } from "../routers/address-router";
import { onboardingRouter } from "../routers/onboarding-router";
import { postRouter } from "../routers/post-router";
import { userRouter } from "../routers/user-router";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  user: userRouter,
  onboarding: onboardingRouter,
  post: postRouter,
  address: addressRouter,
});
export type AppRouter = typeof appRouter;
