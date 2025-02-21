import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "./context";
import { userRouter } from "../routers/user-router";

const t = initTRPC.context<Context>().create();

export const appRouter = t.router({
  userRouter: userRouter,
});
export type AppRouter = typeof appRouter;
export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(function isAuthed(opts) {
  if (!opts.ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }
  return opts.next({
    ctx: {
      session: opts.ctx.session,
    },
  });
});
