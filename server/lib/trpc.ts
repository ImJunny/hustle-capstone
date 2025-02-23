import { createClient } from "@supabase/supabase-js";
import { initTRPC, TRPCError } from "@trpc/server";
import { Request } from "express";

// Create tRPC context
export const createTRPCContext = async ({ req }: { req: Request }) => {
  // Initialize the Supabase client
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  // Extract access token from Authorization header
  const accessToken = req.headers["authorization"]?.replace("Bearer ", "");
  console.log("request received");
  const {
    data: { user },
  } = await supabase.auth.getUser(accessToken);

  return { session: user };
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create();

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async function isAuthed({
  ctx,
  next,
}) {
  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      user: ctx.session,
    },
  });
});
