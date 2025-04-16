import { db } from "@/drizzle/db";
import { notifications, users } from "@/drizzle/schema";
import { desc, eq } from "drizzle-orm";
import { sendEmail } from "./email-actions";

export async function sendNotification(
  user_uuid: string,
  type: string,
  extra_user_uuid?: string
) {
  try {
    const username_type =
      type == "approved" || type == "paid" ? "worker" : "hirer";
    let username;
    if (username_type == "worker") {
      username = await db
        .select({ username: users.username })
        .from(users)
        .where(eq(users.uuid, user_uuid))
        .limit(1)
        .then((result) => result[0].username);
    } else {
    }

    await db.insert(notifications).values({
      user_uuid,
      text,
    });

    if (false) {
      await sendEmail(user_uuid, title, text);
    }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send notification.");
  }
}

export async function getNotifications() {
  try {
    const result = await db
      .select()
      .from(notifications)
      .orderBy(desc(notifications.created_at));
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get notifications.");
  }
}
