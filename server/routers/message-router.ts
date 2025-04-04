import { createTRPCRouter, protectedProcedure } from "../lib/trpc";
import { z } from "zod";
import {
  getChatInfo,
  getMessagePreviews,
  getPostMessageInfo,
  markAsRead,
  sendPostMessage,
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
  mark_as_read: protectedProcedure
    .input(
      z.object({
        receiver_uuid: z.string(),
        sender_uuid: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await markAsRead(input.sender_uuid, input.receiver_uuid);
    }),
  send_post_message: protectedProcedure
    .input(
      z.object({
        sender_uuid: z.string(),
        receiver_uuids: z.array(z.string()),
        post_uuid: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await sendPostMessage(
        input.sender_uuid,
        input.receiver_uuids,
        input.post_uuid
      );
    }),
  get_post_message_info: protectedProcedure
    .input(
      z.object({
        post_uuid: z.string(),
      })
    )
    .query(async ({ input }) => {
      const result = await getPostMessageInfo(input.post_uuid);
      return result;
    }),
});
