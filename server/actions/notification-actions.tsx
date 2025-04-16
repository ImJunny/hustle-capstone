import { db } from "@/drizzle/db";
import {
  disabled_notifications,
  notifications,
  post_images,
  posts,
  users,
} from "@/drizzle/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { sendEmail } from "./email-actions";

const notification_titles = {
  accepted: (username: string) => ({
    title: `Job accepted by @${username}!`,
    description: "Open Hustle to view more.",
  }), // for hirer
  approved: (username: string) => ({
    title: `Job approved by @${username}!`,
    description: "Open Hustle to view more.",
  }), // for worker
  in_progress: (username: string) => ({
    title: `Job by @${username} in progress!`,
    description: "Open Hustle to view more.",
  }), // for hirer
  complete: (username: string) => ({
    title: `Job by @${username} completed!`,
    description: "Open Hustle to view more.",
  }), // for hirer
  paid: (username: string) => ({
    title: `@${username} paid you!`,
    description: "Open Hustle to view more.",
  }), // for worker
  cancelled: (username: string) => ({
    title: `Job cancelled.`,
    description: "Open Hustle to view more.",
  }), // for hirer or worker
};

export async function sendNotification(
  user_uuid: string, // recipient
  type: keyof typeof notification_titles,
  extra_user_uuid: string,
  post_uuid?: string
) {
  try {
    const username = await db
      .select({ username: users.username })
      .from(users)
      .where(eq(users.uuid, extra_user_uuid))
      .then(([result]) => result.username);

    const title = notification_titles[type](username!).title;
    const description = notification_titles[type](username!).description;

    await sendEmail(user_uuid, title, description);

    await db.insert(notifications).values({
      user_uuid,
      text: title,
      post_uuid,
    });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send notification.");
  }
}

export async function getNotifications(user_uuid: string) {
  try {
    const result = await db
      .select({
        notification: notifications,
        image_url: post_images.image_url,
      })
      .from(notifications)
      .leftJoin(post_images, eq(post_images.post_uuid, notifications.post_uuid))
      .where(eq(notifications.user_uuid, user_uuid))
      .orderBy(desc(notifications.created_at));

    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get notifications.");
  }
}
export type NotificationData = Awaited<
  ReturnType<typeof getNotifications>
>[number];

export async function removeNotification(uuid: string) {
  try {
    await db.delete(notifications).where(eq(notifications.uuid, uuid));
  } catch (error) {
    console.log(error);
    throw new Error("Failed to remove notification.");
  }
}

export async function toggleNotification(
  user_uuid: string,
  notification_type: string,
  disable: boolean
) {
  try {
    if (disable)
      await db
        .insert(disabled_notifications)
        .values({
          user_uuid,
          notification_type,
        })
        .onConflictDoNothing();
    else
      await db
        .delete(disabled_notifications)
        .where(
          and(
            eq(disabled_notifications.user_uuid, user_uuid),
            eq(disabled_notifications.notification_type, notification_type)
          )
        );
  } catch (error) {
    console.log(error);
    throw new Error("Failed to disable notification.");
  }
}

export async function getDisabledNotifications(user_uuid: string) {
  try {
    const result = await db
      .select({ notification_type: disabled_notifications.notification_type })
      .from(disabled_notifications)
      .where(eq(disabled_notifications.user_uuid, user_uuid))
      .then((result) => result.map((item) => item.notification_type));
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get disabled notifications.");
  }
}
