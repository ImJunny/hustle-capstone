import { addressRouter } from "../routers/address-router";
import { onboardingRouter } from "../routers/onboarding-router";
import { postRouter } from "../routers/post-router";
import { userRouter } from "../routers/user-router";
import { jobRouter } from "../routers/job-router";
import { messageRouter } from "../routers/message-router";
import { paymentMethodsRouter } from "../routers/payment-method-router";
import { paymentRouter } from "../routers/confirm-payment-router";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  user: userRouter,
  onboarding: onboardingRouter,
  post: postRouter,
  job: jobRouter,
  address: addressRouter,
  messages: messageRouter,
  payment_methods: paymentMethodsRouter,
  confirm_payment: paymentRouter,
});
export type AppRouter = typeof appRouter;
