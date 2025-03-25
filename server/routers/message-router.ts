import { createTRPCRouter, protectedProcedure } from "../lib/trpc";
import { z } from "zod";
import {
  getChatInfo,
  getMessagePreviews,
  sendTextMessage,
} from "../actions/message-actions";

export const messageRouter = createTRPCRouter({
  get_chat_info: protectedProcedure
    .input(
      z.object({
        sender_uuid: z.string(),
        receiver_uuid: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await getChatInfo(input.sender_uuid, input.receiver_uuid);
    }),

  get_message_previews: protectedProcedure
    .input(
      z.object({
        user_uuid: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await getMessagePreviews(input.user_uuid);
    }),

  send_text_message: protectedProcedure
    .input(
      z.object({
        sender_uuid: z.string(),
        receiver_uuid: z.string(),
        message: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await sendTextMessage(
        input.sender_uuid,
        input.receiver_uuid,
        input.message
      );
    }),
});
