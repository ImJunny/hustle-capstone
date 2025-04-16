import { createTRPCRouter, protectedProcedure } from "../lib/trpc";
import { z } from "zod";
import {
  getDisabledNotifications,
  getNotifications,
  removeNotification,
  toggleNotification,
} from "../actions/notification-actions";

export const notificationRouter = createTRPCRouter({
  get_notifications: protectedProcedure
    .input(
      z.object({
        user_uuid: z.string(),
      })
    )
    .query(async ({ input }) => {
      const result = await getNotifications(input.user_uuid);
      return result;
    }),
  remove_notification: protectedProcedure
    .input(z.object({ uuid: z.string() }))
    .mutation(async ({ input }) => {
      await removeNotification(input.uuid);
    }),
  toggle_notification: protectedProcedure
    .input(
      z.object({
        user_uuid: z.string(),
        notification_type: z.string(),
        disable: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      await toggleNotification(
        input.user_uuid,
        input.notification_type,
        input.disable
      );
    }),
  get_disabled_notifications: protectedProcedure
    .input(z.object({ user_uuid: z.string() }))
    .query(async ({ input }) => {
      return await getDisabledNotifications(input.user_uuid);
    }),
});
