import { addressRouter } from "../routers/address-router";
import { onboardingRouter } from "../routers/onboarding-router";
import { postRouter } from "../routers/post-router";
import { userRouter } from "../routers/user-router";
import { jobRouter } from "../routers/job-router";
import { messageRouter } from "../routers/message-router";
import { createTRPCRouter } from "./trpc";
import { commentRouter } from "../routers/comment-router";
import { paymentRouter } from "../routers/payment-router";

export const appRouter = createTRPCRouter({
  user: userRouter,
  onboarding: onboardingRouter,
  post: postRouter,
  job: jobRouter,
  address: addressRouter,
  messages: messageRouter,
  confirm_payment: paymentRouter,
  comment: commentRouter,
  payment: paymentRouter,
});
export type AppRouter = typeof appRouter;
