import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../lib/trpc";
import { getComments } from "../actions/comment-actions";

export const commentRouter = createTRPCRouter({
  get_comments: protectedProcedure
    .input(
      z.object({
        post_uuid: z.string(),
        user_uuid: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await getComments(input.post_uuid, input.user_uuid);
    }),
});
